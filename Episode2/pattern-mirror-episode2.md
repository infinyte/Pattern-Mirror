# The Pattern Mirror, Episode 2: The Workflows

**The Middlemen route traffic. The Workflows manage consequences.**

---

In [Episode 1](link-to-episode-1), we looked at three Middleman patterns — intermediaries that sit between producers and consumers, decoupling one side from the other. Those patterns solve communication problems. They answer the question: *how does A talk to B without knowing about B?*

This episode is different. The Workflow patterns solve **process problems**. They answer harder questions: *What happens when step 3 of 7 fails? How do you undo something that's already been committed across three different systems? How do you refuel a plane while it's still in flight?*

That last one isn't hypothetical. The Air Force does it every day — a KC-135 Stratotanker connects a fuel boom to a receiving aircraft at 500 mph without either plane stopping. The old fuel runs low, the new fuel flows in, and the connection is severed only when the transfer is complete. That's the Strangler Fig pattern, and we'll get to it.

These are the patterns that keep you up at night. They're also the patterns that separate senior engineers from architects — because the failure modes are where the real design decisions live.

Let's get into it.

---

## Pattern 4: Orchestrator ↔ Coordinator / Pipeline

### The Platform Pattern

If you've built workflows in Azure Logic Apps, AWS Step Functions, Azure Durable Functions, or similar platforms, you've built an orchestrator. The concept: a central controller that manages a multi-step process, maintains state between steps, handles retries and timeouts, and makes decisions about which step executes next based on the outcome of the previous one.

A real-world scenario: a new customer onboarding flow. Step 1: validate the customer's identity against a third-party API. Step 2: provision their account in the primary database. Step 3: configure their role-based permissions. Step 4: send a welcome notification. Step 5: trigger a billing setup event.

Each step depends on the previous one. If identity validation fails, you don't provision the account. If account provisioning fails, you don't configure permissions. The orchestrator tracks where you are in this sequence, what's succeeded, what's failed, and what needs to be retried. It's a state machine with a job to do.

```
[Start] → Validate Identity → Provision Account → Configure RBAC → Send Welcome → Trigger Billing → [Complete]
              ↓ fail                ↓ fail                ↓ fail
           [Retry x3]          [Compensate]          [Log + Alert]
```

The key distinction is that the orchestrator is **centrally controlled**. It knows the entire workflow. It decides what happens next. The individual services being called don't know they're part of a larger process — they just receive a request and return a response. The intelligence lives in the orchestrator, not in the participants.

### The Application Pattern

Inside your codebase, this is the **Coordinator** or **Pipeline pattern**. A central class manages the execution of a sequence of operations, tracking state and handling failures at each step.

```csharp
// A simple pipeline coordinator
public class OnboardingPipeline
{
    private readonly IIdentityService _identity;
    private readonly IAccountService _accounts;
    private readonly IPermissionService _permissions;
    private readonly INotificationService _notifications;

    public async Task<OnboardingResult> Execute(OnboardingRequest request)
    {
        var state = new PipelineState { CurrentStep = "identity" };

        try
        {
            var identity = await _identity.Validate(request.Customer);
            state.CurrentStep = "provision";

            var account = await _accounts.Provision(identity);
            state.CurrentStep = "permissions";

            await _permissions.ConfigureRoles(account, request.RoleTemplate);
            state.CurrentStep = "notification";

            await _notifications.SendWelcome(account);
            state.CurrentStep = "complete";

            return OnboardingResult.Success(account);
        }
        catch (Exception ex)
        {
            state.FailedAt = state.CurrentStep;
            state.Error = ex.Message;
            return OnboardingResult.Failed(state);
        }
    }
}
```

The infrastructure orchestrator manages steps across distributed services. The application coordinator manages steps within a single process. Both maintain state, both control sequencing, and both centralize the "what happens next" decision. The participants don't know they're part of a pipeline — they just do their one job when asked.

### When the Logic Outgrows the Code: Rules Engines

There's a variant of the orchestrator worth calling out: the **declarative orchestrator**, where workflow logic is externalized into rules rather than hardcoded in a pipeline class.

Rules engines like Drools (Java), NRules (.NET), or the rules capabilities within Azure Logic Apps and AWS Step Functions let you define "if this condition, then this action" as data rather than code. The coordinator still manages execution — it still decides what step runs next — but the *decision logic* that determines the next step lives in a rules file, a database, or a configuration store rather than in compiled code.

This matters when the workflow logic changes frequently (business rules that shift quarterly), when non-developers need to modify behavior (business analysts maintaining scoring rules), or when the decision tree is too complex for readable imperative code (hundreds of conditional branches). The coordination infrastructure stays the same. Only the rules change.

### Step Memoization: Where Workflows Meet Caching

Production-grade orchestrators don't re-execute steps that have already succeeded. If step 3 of 5 fails and the orchestrator retries, it doesn't re-run steps 1 and 2 — it uses their cached results and picks up from step 3.

Azure Durable Functions does this natively through its replay mechanism: the orchestrator function re-executes from the top, but every completed step returns its cached output instead of actually calling the service again. This is **step memoization** — the same concept as application-level caching (which we'll explore in depth in Episode 3), applied to workflow state. It's what makes orchestrators idempotent and safe to retry.

### Why Centralized Control Is a Double-Edged Sword

The orchestrator pattern is powerful, but it introduces a fundamental tension. The central controller becomes a **single point of coupling** — it knows about every service, every step, and every failure mode. If the workflow changes, the orchestrator changes. If a new step is added, the orchestrator is updated. This is fine for workflows that are inherently sequential and well-defined (customer onboarding, order fulfillment, deployment pipelines). It becomes a liability when the workflow is constantly evolving or when different teams own different steps.

This is the exact same tension you feel in application code when a coordinator class grows to 500 lines and knows about every dependency in the system. The pattern is correct — the question is whether your specific process is a good fit for centralized control or whether it should be decomposed into choreography (where each participant knows its own next step).

### The Middle Ground: Coordination by Convention

There's a third approach that sits between explicit orchestration and fully decentralized choreography: **convention-based coordination**. Instead of a central controller explicitly calling each step, the participants follow shared naming conventions, annotation contracts, or structural patterns that implicitly define the workflow.

This idea has deep roots in enterprise software. Spring Framework — which has been doing this since 2003 — is arguably the most successful example. Spring Boot's auto-configuration wires up an entire application context based on what's on the classpath. `@RestController` and `@GetMapping` annotations route HTTP requests to handler methods without an explicit routing table. `@Autowired` resolves dependencies by type without manual registration. Hibernate takes it further: your entity class name maps to a table name, your field names map to column names, and the framework generates the SQL and manages the lifecycle — all by convention.

```java
// Spring Boot: convention routes traffic, no explicit orchestrator
@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService service;

    @GetMapping("/{id}")
    public Reservation getById(@PathVariable String id) {
        return service.findById(id);
    }

    @PostMapping
    public Reservation create(@RequestBody ReservationRequest request) {
        return service.create(request);
    }
}
// No routing table. No dispatcher configuration.
// Convention resolves: /api/reservations/{id} → getById()
```

In the .NET world, MediatR's convention-based handler resolution does the same thing — you don't register handlers manually; the naming convention and generic type matching wire them automatically. ASP.NET Core's convention-based routing, model binding, and dependency injection container follow the same principle.

The important point is that this isn't a new idea and it isn't platform-specific. Spring and Rails (which popularized the phrase "convention over configuration" in 2004) have been proving this approach for over twenty years across Java and Ruby. .NET adopted it fully with ASP.NET Core. Python's Django follows it. The pattern transcends languages and frameworks because the underlying insight is mathematical: if you can define a deterministic mapping function between names and behaviors, you don't need explicit wiring.

That's an architectural judgment call, not a pattern choice: explicit orchestration when you need control, convention when you need velocity, choreography when you need independence.

### The Mathematical Foundation

Both the orchestrator and coordinator implement **finite state machines** (FSMs) and can be modeled as **directed acyclic graphs** (DAGs). Each step is a state. Each transition has a condition (success, failure, timeout). The orchestrator traverses the graph from start to end, following edges based on the outcome of each node.

The reason this matters practically: if you can draw your workflow as a DAG, an orchestrator is a good fit. If your workflow has cycles (step A can trigger step B which can trigger step A again), you need a different pattern — or at minimum, you need cycle detection and termination conditions, which is where FSM theory becomes directly applicable.

Convention-based coordination adds an interesting mathematical wrinkle: the routing function is a **bijective mapping** from naming conventions to behaviors — *f(name) → handler* — where the function is deterministic and the convention defines the entire mapping without explicit enumeration.

---

## Pattern 5: Infrastructure as Code ↔ Saga Pattern

### The Infrastructure Pattern

Terraform, ARM templates, Bicep, Pulumi, CloudFormation — Infrastructure as Code (IaC) tools let you declare the desired state of your infrastructure and then apply it. But the part that makes IaC a *pattern* rather than just a tool is what happens when things go wrong.

Consider a deployment that provisions five resources in sequence: a resource group, a virtual network, a subnet, an application gateway, and a web app. Resources 1 through 3 deploy successfully. Resource 4 — the application gateway — fails due to a quota limit. Now what?

You have three live resources that were created as part of an incomplete deployment. They're consuming cost, they're partially configured, and they're not serving any purpose because the deployment didn't finish. The IaC tool needs to **roll back** — destroy resources 3, 2, and 1 in reverse order to return the environment to its pre-deployment state.

This is forward provisioning with compensating teardown:

```
Deploy:   Resource Group → VNet → Subnet → App Gateway (FAIL!)
                                                ↓
Rollback: Delete Subnet → Delete VNet → Delete Resource Group
```

Every `terraform apply` that fails partway through has an implicit `terraform destroy` for the resources it already created. Every ARM template deployment that fails triggers a rollback that undoes completed steps. The IaC tool doesn't just create — it knows how to *un-create* in reverse order.

### The Application Pattern

Inside your codebase, this is the **Saga pattern** — one of the most important (and most misunderstood) patterns in distributed systems. A saga breaks a business transaction that spans multiple services into a sequence of local transactions. Each local transaction has a **compensating action** — the inverse operation that undoes its effect if a later step fails.

```csharp
// Saga: each step has a compensating action
public class OrderSaga
{
    public async Task<SagaResult> Execute(OrderRequest order)
    {
        var compensations = new Stack<Func<Task>>();

        try
        {
            // Step 1: Reserve inventory
            var reservation = await _inventory.Reserve(order.Items);
            compensations.Push(() => _inventory.Release(reservation.Id));

            // Step 2: Charge payment
            var payment = await _billing.Charge(order.Payment);
            compensations.Push(() => _billing.Refund(payment.TransactionId));

            // Step 3: Schedule shipment
            var shipment = await _shipping.Schedule(order.Address, reservation);
            compensations.Push(() => _shipping.Cancel(shipment.TrackingId));

            return SagaResult.Success(payment, shipment);
        }
        catch (Exception ex)
        {
            // Compensate in reverse order
            while (compensations.Count > 0)
            {
                var compensate = compensations.Pop();
                await compensate();
            }
            return SagaResult.Failed(ex);
        }
    }
}
```

Reserve inventory, then charge payment, then schedule shipment. If shipment fails: refund the payment, then release the inventory. Each step's compensating action is the **inverse** of the original operation, executed in reverse order.

The IaC rollback and the Saga compensation are the same pattern. Both execute a sequence of operations, track what's been completed, and apply inverse operations in reverse order when a step fails.

### The Imperfect Inverse

Here's where both patterns get tricky in practice — and where experienced engineers earn their gray hairs. A compensating action is not always a perfect undo.

When Terraform destroys a database it provisioned during a failed deployment, the data written to that database between creation and destruction might be gone. When a saga refunds a credit card charge, the customer still sees the charge and refund as separate line items on their statement — and the refund might take 3-5 business days. When you "cancel" a shipment that's already been picked from the warehouse, you've still consumed warehouse labor.

Mathematically, we want *f(x)* then *f⁻¹(x)* = *x*. In practice, *f⁻¹(f(x))* ≈ *x*. The compensating action gets you *close* to the original state, but side effects leak. This is why saga design requires careful thinking about what "undo" actually means for each step — and why some steps are designed to be **idempotent** (safe to retry) rather than reversible.

### The Mathematical Foundation

Both patterns implement **inverse functions** — the mathematical concept that for a function *f*, there exists a function *f⁻¹* such that *f⁻¹(f(x)) = x*. The forward step is *f* (create resource, charge payment). The compensating step is *f⁻¹* (destroy resource, refund payment).

The stack-based execution order (LIFO — last created, first destroyed) is also mathematically significant. It's the same reason you close database connections in reverse order of opening them, the same reason you pop stack frames in reverse order during exception unwinding. It preserves dependency ordering: if resource B depends on resource A, you must destroy B before A, which means you destroy in the reverse of creation order.

---

## Pattern 6: Strangler Fig ↔ Adapter / Facade

### The Infrastructure Pattern

The Strangler Fig pattern — named by Martin Fowler after the strangler fig tree that grows around a host tree and eventually replaces it — is the strategy behind every successful legacy migration.

Think of it like aerial refueling. A KC-135 Stratotanker pulls alongside a receiving aircraft at cruising altitude. The boom operator extends the fuel line and connects it to the receiver. Fuel flows from the new source while the original tanks are still powering the engines. At no point does the plane stop flying. At no point does it switch fuel sources in one sudden cutover. The new fuel flows in alongside the old, and the connection is severed only when the transfer is complete.

That's exactly how the Strangler Fig works.

You have a monolithic application that's been running in production for years. It handles reservations, billing, reporting, and notifications all in one deployable unit. You need to modernize it, but you can't shut it down for six months while you rewrite everything. The business runs on it. Revenue flows through it. Customers use it every day.

The Strangler Fig approach: stand up a new system alongside the old one. Route a small slice of traffic — say, just the read path for one feature — to the new service. The old monolith still handles everything else. Once the new service is stable, route the write path too. Then move the next feature. And the next. One capability at a time, the new system grows around the old one until the old system handles nothing and can be safely decommissioned.

```
Phase 1:  Client → [Router] → 95% Monolith / 5% New Service
Phase 2:  Client → [Router] → 70% Monolith / 30% New System
Phase 3:  Client → [Router] → 20% Monolith / 80% New System
Phase 4:  Client → [Router] → New System (monolith decommissioned)
```

At the infrastructure level, this is implemented through traffic routing — blue-green deployments, canary releases, feature flags at the load balancer, or path-based routing on an API gateway. The router decides which system handles each request, and the split shifts gradually toward the new system.

### The Application Pattern

Inside your codebase, this is the **Adapter** and **Facade** pattern working together. You wrap the legacy code in a new interface — an adapter that translates between the old system's contracts and the new system's contracts. Behind the adapter, you incrementally replace the legacy implementation with new code. The callers never know the implementation changed because the interface stays the same.

```csharp
// The facade: callers use this interface and never change
public interface IReservationService
{
    Task<Reservation> Create(ReservationRequest request);
    Task<Reservation> GetById(string id);
}

// Phase 1: Adapter wraps legacy, delegates everything
public class ReservationServiceAdapter : IReservationService
{
    private readonly LegacyReservationModule _legacy;

    public async Task<Reservation> Create(ReservationRequest request)
    {
        var legacyResult = await _legacy.MakeReservation(
            request.ToLegacyFormat()
        );
        return legacyResult.ToModernFormat();
    }

    public async Task<Reservation> GetById(string id)
    {
        return (await _legacy.LookupReservation(id)).ToModernFormat();
    }
}

// Phase 2: Reads go to new system, writes still go to legacy
public class ReservationServiceAdapter : IReservationService
{
    private readonly LegacyReservationModule _legacy;
    private readonly NewReservationRepository _newRepo;

    public async Task<Reservation> Create(ReservationRequest request)
    {
        // Still using legacy for writes (riskier operation)
        var legacyResult = await _legacy.MakeReservation(
            request.ToLegacyFormat()
        );
        return legacyResult.ToModernFormat();
    }

    public async Task<Reservation> GetById(string id)
    {
        // Reads now hit the new system
        return await _newRepo.FindById(id);
    }
}

// Phase 3: Everything goes to new system, legacy removed
public class ReservationService : IReservationService
{
    private readonly IReservationRepository _repo;

    public async Task<Reservation> Create(ReservationRequest request)
    {
        return await _repo.Create(request);
    }

    public async Task<Reservation> GetById(string id)
    {
        return await _repo.FindById(id);
    }
}
```

At the infrastructure level, the router gradually shifts traffic from old system to new. At the application level, the adapter gradually shifts implementation from legacy code to modern code. Same strategy, same incremental approach, same goal: replace a running system without stopping it.

### Why This Is the Hardest Pattern to Execute

The Strangler Fig is conceptually simple and operationally brutal. The reason: **data synchronization**. During the migration, both systems are live. If the legacy system handles a write that the new system doesn't know about, you have data divergence. If the new system handles a read but the data hasn't been migrated yet, you return stale or missing results.

Every real-world strangler migration requires a data synchronization strategy — change data capture, dual writes, event sourcing, or periodic batch sync. This is where migrations fail in practice: not because the new code is wrong, but because the data boundary between old and new wasn't managed carefully enough.

At the application level, the same problem shows up when an adapter wraps legacy code that has side effects — writing to a shared database, updating a cache, firing events that other components depend on. You can't just swap the implementation; you have to ensure that every side effect the legacy code produced is still produced (or explicitly handled) by the new code.

### The Mathematical Foundation

The Strangler Fig implements **piecewise function replacement** — also known as monotonic substitution. If the original system is modeled as a function *F(x)* that handles all inputs, the migration progressively replaces it:

*Phase 1: G(x) = F(x)* — the new system delegates everything to the old
*Phase 2: G(x) = { f_new(x) if x ∈ S₁, F(x) otherwise }* — some inputs handled by new code
*Phase 3: G(x) = { f_new(x) if x ∈ S₁ ∪ S₂, F(x) otherwise }* — more inputs shifted
*Phase N: G(x) = f_new(x)* — complete replacement

The critical property is **monotonicity**: the set of inputs handled by the new system only grows, never shrinks. You never move functionality *back* to the legacy system (unless something goes wrong and you need to roll back — which, circling back to Pattern 5, is your Saga compensating action).

---

## The Bigger Picture

### From Communication to Consequence

Episode 1's Middlemen patterns were about **routing** — getting the right message to the right place. This episode's Workflow patterns are about **consequence** — what happens over time, what happens when things fail, and what happens when you need to change something that's already running.

This is a meaningful shift in architectural thinking. Routing is stateless. Consequence is stateful. And the moment you introduce state — "where am I in this process?", "what have I already committed?", "how much has been migrated?" — the complexity surface area explodes. That's why these patterns feel harder to implement than the Middlemen: they are.

### The Rollback Spectrum

All three Workflow patterns deal with reversibility, but they sit at different points on what I call the **rollback spectrum**:

| Pattern | Rollback Approach | Reversibility |
|---|---|---|
| **Orchestrator / Coordinator** | Retry or restart from the failed step. State is preserved; you pick up where you left off. | High — you can resume. |
| **IaC / Saga** | Execute compensating actions in reverse order. Each step has an explicit undo. | Medium — you get *close* to original state, but side effects may leak. |
| **Strangler Fig / Adapter** | Route traffic back to the legacy system. The old code is still running. | Full — as long as you haven't decommissioned the old system. |

This spectrum maps directly to risk. The Orchestrator is the safest — you can retry from a known state. The Saga is riskier — compensating actions may not perfectly undo every side effect. The Strangler Fig has a unique safety property: because the old system is still alive during migration, you can always route traffic back. The danger comes only when you decommission the old system. That's why experienced teams keep the legacy system running longer than they think they need to.

### Looking Ahead: The Registry Problem

One pattern we didn't cover here but that underpins all three Workflows is the **service registry** — the system that tracks which services are alive, which endpoints are current, and which instance should handle the next request. At the infrastructure level, that's Consul, Eureka, Azure Service Fabric naming service, or Kubernetes service discovery. At the application level, it's your DI container or service locator — a registry of available implementations resolved at runtime.

We'll pick this up in Episode 3, where it connects naturally to Leader Election and coordination under dynamic conditions. Stay tuned.

### Why This Matters for Your Career

If you've ever been in a meeting where someone says, "Let's just rewrite it," and the room goes quiet — that's because the experienced people in that room have lived through a failed rewrite. They know that the Strangler Fig isn't just a pattern; it's a survival strategy. They know that saga compensation isn't just "undo" — it's "undo with caveats." They know that a 7-step orchestrator with no retry logic is a production incident waiting to happen.

Understanding these patterns — really understanding them, including their failure modes and tradeoffs — is the line between senior and staff. It's the difference between someone who can build a system and someone who can build a system that survives contact with reality.

**Coming up next: Episode 3 — "Resilience & Performance."** We'll look at patterns that keep systems fast, alive, and coordinated under pressure: Circuit Breaker ↔ Try-Catch/Retry, CDN/Cache ↔ Cache-Aside/Memoization, and Leader Election ↔ Mutex/Lock. These are the patterns you don't appreciate until 3 AM on a Saturday.

---

*The Pattern Mirror is a four-part series mapping enterprise infrastructure patterns to their application-level equivalents. Follow along for the complete series, or share this with someone who's making the jump from application development to systems architecture.*

**Kurt Mitchell** — Enterprise Architect & Senior Software Engineer | Designing distributed systems across DoD, aviation, and cloud platforms for 20 years.
