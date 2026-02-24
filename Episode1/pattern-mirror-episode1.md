# The Pattern Mirror, Episode 1: The Middlemen

**Every enterprise infrastructure pattern has an application-level twin. Once you see it, you can't unsee it.**

---

If you've spent any time in enterprise software, you've probably noticed something odd: the same architectural problems keep showing up at every level of the stack. The infrastructure team builds a reverse proxy to manage traffic. The application team builds a mediator to manage component communication. Both teams think they're solving different problems. They're not.

This is the first installment of a four-part series called **The Pattern Mirror**, where we'll map infrastructure patterns to their application-level equivalents — and trace both back to the pure mathematics that makes them work. This isn't academic trivia. Understanding these connections is the difference between someone who *implements* patterns and someone who *understands architecture*.

In this episode, we're looking at the patterns I call **The Middlemen** — three infrastructure/application pairs where a single intermediary sits between producers and consumers, decoupling one side from the other.

Let's get into it.

---

## Pattern 1: Reverse Proxy ↔ Mediator

### The Platform Pattern

If you've worked with Azure Application Gateway, HAProxy, Nginx, AWS CloudFront, or Azure Front Door, you've worked with a reverse proxy. The concept is simple: instead of clients talking directly to your backend services, every request flows through a single gateway that handles SSL termination, load balancing, request routing, and — critically — hides your internal service topology from the outside world.

The client sends a request to `api.yourcompany.com`. The reverse proxy receives it, decides which internal service should handle it, forwards the request, and returns the response. The client never knows whether there's one service or fifty behind that single endpoint. That's the point.

From an infrastructure standpoint, the reverse proxy solves several problems at once. It centralizes cross-cutting concerns like authentication, rate limiting, and TLS. It lets you change your internal architecture — add services, move services, scale services — without breaking any client contracts. And it provides a single point of observability for all inbound traffic.

### The Application Pattern

Now zoom in to the application layer. Inside a .NET codebase using MediatR (or any mediator implementation), you see the exact same shape. Instead of components calling each other directly — `OrderService` calling `InventoryService` calling `NotificationService` — every interaction flows through a central mediator. A component sends a request to the mediator. The mediator resolves the correct handler. The handler processes the request and returns a response. The calling component never knows which handler executed its request or how many other components were involved.

```csharp
// Without mediator: tight coupling
public class OrderController
{
    private readonly InventoryService _inventory;
    private readonly PaymentService _payment;
    private readonly NotificationService _notifications;

    public async Task<IActionResult> PlaceOrder(OrderRequest request)
    {
        await _inventory.Reserve(request.Items);
        await _payment.Charge(request.PaymentInfo);
        await _notifications.SendConfirmation(request.Email);
        return Ok();
    }
}

// With mediator: the controller doesn't know who handles it
public class OrderController
{
    private readonly IMediator _mediator;

    public async Task<IActionResult> PlaceOrder(OrderRequest request)
    {
        var result = await _mediator.Send(new PlaceOrderCommand(request));
        return Ok(result);
    }
}
```

The mediator decouples components inside the application the same way the reverse proxy decouples services outside of it. Both centralize routing logic. Both hide internal topology. Both let you restructure what's behind them without breaking the callers in front of them.

### The Neuroscience Detour

If you've read Robert Sapolsky's *Behave*, you might recognize a parallel here. For decades, neuroscientists were drawn to the idea of the **grandmother neuron** — the elegant hypothesis that a single neuron could hold the key to a single cognitive concept. One neuron fires when you see your grandmother's face. Clean, simple, intuitive. It *felt* like how the brain should work.

It was largely disproven. The brain doesn't work that way. Representations are distributed across neural populations, not pinned to a single cell.

The mediator pattern *looks* like a grandmother neuron — a single node at the center of everything. But just like the hypothesis failed because the central node doesn't actually *hold* knowledge, the mediator doesn't either. It routes it. A more accurate neuroscience analogy is the **thalamus** — the brain's relay station. Almost all sensory input passes through the thalamus on its way to the correct region of the cortex. It doesn't understand the signal. It doesn't process the content. It just knows where it needs to go. That's your reverse proxy. That's your mediator.

### The Mathematical Foundation

Both patterns converge on a concept from graph theory: **betweenness centrality**. In a network graph, the node with the highest betweenness centrality is the one that sits on the most shortest paths between all other nodes. That's exactly what the proxy and mediator are — a single node positioned to minimize the total path length between all communicating parties.

Without the intermediary, you have an O(n²) communication problem: every node potentially talks to every other node. With it, you reduce to O(n): every node talks only to the central intermediary. This is the same mathematical insight whether the "nodes" are cloud services or in-process components.

---

## Pattern 2: API Gateway / Load Balancer ↔ Broker Pattern

### The Infrastructure Pattern

An API Gateway does more than just forward requests. Azure API Management, AWS Application Load Balancer, Kong, and similar tools *inspect* the content of incoming requests and route them to different backend services based on rules — URL path, HTTP headers, query parameters, even request body content.

A request to `/api/reservations` goes to the reservations microservice. A request to `/api/fuel` goes to the fuel service. A request to `/api/inventory` goes to the inventory service. The gateway examines the request, applies routing rules, and dispatches to the correct destination.

This is fundamentally different from the reverse proxy. The reverse proxy is a **pass-through** — it forwards everything to one destination (or round-robins across replicas of the same service). The API gateway is a **dispatcher** — it makes a routing *decision* based on the content of each request.

### The Application Pattern

Inside your codebase, this is the **Broker pattern** — sometimes called a message router, and closely related to the Strategy pattern. A broker receives a message, inspects its properties, and dispatches it to the correct handler based on configured rules.

```csharp
// Content-based routing at the application level
public class MessageBroker
{
    private readonly Dictionary<string, IMessageHandler> _routes;

    public async Task<Result> Route(Message message)
    {
        // Inspect message properties → resolve handler
        if (_routes.TryGetValue(message.Type, out var handler))
        {
            return await handler.Handle(message);
        }
        throw new UnroutableMessageException(message.Type);
    }
}
```

The API Gateway inspects HTTP requests and routes to services. The Broker inspects application messages and routes to handlers. Both make a dispatching decision based on content inspection. The core behavior — examine input, apply rules, dispatch to correct destination — is identical.

### Why This Isn't the Same as Pattern 1

Here's where engineers often blur the line. The reverse proxy and the API gateway look similar at the infrastructure level, and the mediator and broker look similar at the application level. The distinction matters:

The **Reverse Proxy / Mediator** is topology-hiding. Its primary job is to decouple the caller from the callee. Routing, if any, is secondary. The **API Gateway / Broker** is content-routing. Its primary job is to make a dispatching decision based on the properties of the request. Decoupling is a side effect, not the goal.

Here's an analogy that makes the difference concrete: **the Reverse Proxy is Mom, and the API Gateway is Dad.**

The kids want a sandwich. They ask Mom. Mom goes to the fridge, makes the sandwich, and brings it back. The kids never see the fridge, never know what's in it, and never have to think about where the sandwich came from. Mom is the reverse proxy — she hides the internal topology and handles the entire round trip. The kids only ever interact with her.

Same house, different parent. The kids ask Dad for a sandwich. Dad says, "Go to the fridge and grab one." He told them *where* to go based on what they asked for — that's a routing decision. But the kids go to the fridge themselves and come back with the sandwich. Dad is the API gateway — he inspects the request and dispatches to the right destination, but he's not hiding anything. He's directing traffic.

One hides the source. The other points you to it.

### The Mathematical Foundation

The API Gateway and Broker both implement **weighted distribution functions**. At the simplest level, round-robin load balancing is modular arithmetic: request *i* goes to server *i* mod *n*. At the more complex level, content-based routing is a mapping function *f(request)* → *destination*, where the function evaluates properties of the input to determine the output.

Weighted load balancing adds distribution probability: server A gets 70% of traffic, server B gets 20%, server C gets 10%. This is a discrete probability distribution function applied to the request stream. The same mathematics applies whether you're splitting traffic across data centers or dispatching messages across handler classes.

---

## Pattern 3: Service Bus / Event Grid ↔ Observer / Pub-Sub

### The Infrastructure Pattern

Apache Kafka, RabbitMQ, Azure Service Bus, Azure Event Grid, AWS SNS/SQS — these are the backbones of event-driven architecture at the infrastructure level. The pattern is straightforward: a publisher emits an event to a topic or queue. Zero or more subscribers have registered interest in that topic. The messaging infrastructure delivers the event to all registered subscribers. The publisher doesn't know who (or how many) subscribers exist. The subscribers don't know (or care) who published the event.

This decoupling is what makes event-driven systems scale. The order service publishes an `OrderPlaced` event. The inventory service, the notification service, the analytics service, and the billing service all subscribe independently. If you add a new compliance service next quarter, you just add another subscriber. The order service doesn't change. No coordination needed.

### The Application Pattern

Inside a single application, this is the **Observer pattern** (GoF) or the **Pub-Sub pattern** — `EventHandler<T>` in C#, `IObservable<T>` / `IObserver<T>` in Reactive Extensions, or even the basic `event` keyword in C#.

```csharp
// C# events: the simplest pub-sub
public class OrderService
{
    public event EventHandler<OrderPlacedEvent> OrderPlaced;

    public void PlaceOrder(Order order)
    {
        // ... process order ...
        OrderPlaced?.Invoke(this, new OrderPlacedEvent(order));
        // OrderService has no idea who's subscribed
    }
}

// Subscribers register independently
orderService.OrderPlaced += inventoryHandler.OnOrderPlaced;
orderService.OrderPlaced += analyticsHandler.OnOrderPlaced;
orderService.OrderPlaced += notificationHandler.OnOrderPlaced;
```

The shape is identical: a publisher emits, a bus distributes, subscribers consume. At the infrastructure level, the bus is Kafka or Service Bus and the subscribers are separate microservices. At the application level, the bus is the event invocation list and the subscribers are handler methods. The decoupling principle is the same.

### The Bartender, the Barback, and the Customer

Here's an analogy that captures how pub-sub actually works in practice — and more importantly, what it *doesn't* give you.

You're sitting at a bar. You don't talk to the bartender directly. The barback (or waitress) comes to you and asks what you'd like. You say, "Long Island iced tea." She walks to the bar, tells the bartender, and he makes the drink. She brings it back to you.

The bartender is the **publisher**. He produces the drinks. He doesn't know who ordered them, where they're going, or how many people at how many tables are waiting. He just makes what's requested and puts it on the bar. The barback is the **message bus** — the intermediary who knows both the source (bartender) and the destination (you). She's the subscription and delivery mechanism.

Here's the critical insight: **pub-sub is not reflexive.** You can walk up to the bartender and ask, "How many Long Island iced teas did you make tonight?" He can tell you. But if you ask, "Who drank them?" — he has no idea. Only the barback knows the full delivery mapping. The publisher knows what was produced but not who consumed it.

This is a real architectural property, and it distinguishes pub-sub from the other two Middleman patterns. With a reverse proxy, you can trace the full request-response chain in both directions — who asked and who answered. With an API gateway, same thing — full bidirectional traceability. With pub-sub, traceability is **unidirectional**. The publisher knows what it published. The subscriber knows what it received. But neither side can see the other without asking the bus.

### The Critical Difference: Durability

There's one more important distinction worth calling out. Infrastructure-level messaging systems (Kafka, Service Bus, RabbitMQ) provide **durability** — messages are persisted, retried on failure, and can survive subscriber downtime. Application-level events are typically **fire-and-forget** — if the subscriber throws an exception or the process crashes, the event is lost.

This is why many teams start with in-process events and eventually migrate to an infrastructure message bus as reliability requirements grow. The pattern is the same; the guarantees change.

### The Mathematical Foundation

Both patterns implement **set-theoretic relations**. A publisher defines a topic (a set of events). Subscribers register interest in that topic (forming a subset). The publishing operation maps one element (the event) to all elements in the subscriber set. Formally, this is a one-to-many relation: for a published event *e* and subscriber set *S*, the delivery function *D(e)* = {*s₁*, *s₂*, ..., *sₙ*} where each *sᵢ* ∈ *S*.

This is also why "fan-out" is the common term in messaging systems — one input fans out to *n* outputs, and *n* is determined by the cardinality of the subscriber set, not by the publisher.

---

## The Bigger Picture

Here's what I want you to take away from these three patterns:

**Architecture is fractal.** The same structural solutions appear at every level of the stack because the same structural *problems* appear at every level of the stack. Decoupling producers from consumers is a universal problem. Routing messages to the right destination is a universal problem. Broadcasting events to interested parties is a universal problem. The solutions share the same mathematical bones whether they're implemented in cloud infrastructure or application code.

### Traceability: The Hidden Differentiator

All three Middleman patterns put an intermediary between producers and consumers. But they differ in a way that has real operational consequences: **traceability direction**.

| Pattern | Who Knows What |
|---|---|
| **Reverse Proxy / Mediator** | Full bidirectional traceability. The intermediary (and the caller) can trace who asked and who answered. |
| **API Gateway / Broker** | Full bidirectional traceability. The routing decision is logged and the full chain is visible. |
| **Pub-Sub / Observer** | Unidirectional only. The publisher knows what it published. The subscriber knows what it received. Neither can see the other without querying the bus. |

This isn't just a theoretical distinction. It determines how you debug production issues, how you build audit trails, and how you reason about data flow in compliance-heavy environments. If you need to answer the question "who consumed this event?" — and you're using pub-sub — you'd better have centralized logging on your message bus, because the publisher can't tell you.

### Why This Matters for Your Career

If you understand the Mediator pattern deeply — not just how to use MediatR, but *why* a central intermediary reduces coupling — then when someone puts you in front of an Azure Application Gateway for the first time, you already understand it. The API is new. The concept isn't. This is the compound interest of architectural thinking.

**Coming up next: Episode 2 — "The Workflows."** We'll look at what happens when patterns need to manage multi-step processes, handle failure, and transform systems over time: Orchestrator ↔ Coordinator, Infrastructure as Code ↔ Saga, and the Strangler Fig ↔ Adapter/Facade. These are the patterns that separate senior engineers from staff engineers.

---

*The Pattern Mirror is a four-part series mapping enterprise infrastructure patterns to their application-level equivalents. Follow along for the complete series, or share this with someone who's making the jump from application development to systems architecture.*

**Kurt Mitchell** — Enterprise Architect & Senior Software Engineer | Designing distributed systems across DoD, aviation, and cloud platforms for 20 years.
