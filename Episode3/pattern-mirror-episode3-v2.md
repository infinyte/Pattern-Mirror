# The Pattern Mirror • Episode 3 of 4

# Resilience & Performance

*The Middlemen route traffic. The Workflows manage consequences. Resilience patterns keep everything alive when things go wrong — and things always go wrong.*

---

In [Episode 1](#), we mapped three Middleman patterns that decouple producers from consumers. In [Episode 2](#), we mapped three Workflow patterns that manage multi-step processes, failure recovery, and system migration. Those patterns assume a relatively cooperative world — services respond, steps execute, migrations proceed.

This episode drops that assumption.

The Resilience & Performance patterns exist because the real world is hostile. Networks partition. Services crash. Databases slow to a crawl under load. Two processes try to write the same record at the same time. And somewhere in your infrastructure, a certificate is about to expire that nobody remembers exists.

These are the patterns that keep systems fast, alive, and coordinated under pressure. They're also the patterns you don't fully appreciate until 3 AM on a Saturday when your phone buzzes and the dashboard is red.

Let's get into it.

---

## 07 — Circuit Breaker ↔ Try-Catch / Retry with Backoff

### The Infrastructure Pattern

If you've configured health probes on Azure Application Gateway, AWS Elastic Load Balancer, or any modern load balancer, you've used a circuit breaker — you just might not have called it that.

The concept comes from electrical engineering. A circuit breaker in your house monitors current flow. If the current exceeds a safe threshold — a short circuit, a surge — the breaker trips and cuts the circuit. Power stops flowing. This prevents the wiring from melting and your house from catching fire. Once the condition is resolved, you reset the breaker and power flows again.

In distributed systems, the pattern works the same way. A service (let's call it the Order Service) depends on a downstream service (the Inventory Service). Under normal conditions, requests flow freely. But if the Inventory Service starts failing — returning 500 errors, timing out, responding in 30 seconds instead of 300 milliseconds — the circuit breaker detects the pattern of failure and trips open.

While the circuit is open, the Order Service doesn't even attempt to call the Inventory Service. Every request immediately returns a fallback response (cached data, a default value, a graceful error) without making the network call. This does two critical things: it prevents the Order Service from hanging while waiting for a dead dependency, and it gives the Inventory Service breathing room to recover instead of being hammered with requests it can't handle.

After a configurable timeout, the circuit moves to **half-open** state — it allows one test request through. If that request succeeds, the circuit closes and normal traffic resumes. If it fails, the circuit opens again for another timeout period.

```
CLOSED (normal) → failures exceed threshold → OPEN (fast-fail)
                                                    ↓ timeout
                                               HALF-OPEN (test one request)
                                                  ↙         ↘
                                         success → CLOSED    failure → OPEN
```

At the infrastructure level, this is implemented through tools like Envoy proxy's outlier detection, Istio's circuit breaking policies, Azure Front Door's health probes, or cloud load balancers that automatically stop routing to unhealthy instances. The infrastructure detects failure, removes the bad endpoint from rotation, periodically checks if it's recovered, and adds it back when it's healthy.

### The Application Pattern

Inside your codebase, this is the **try-catch with retry and exponential backoff** pattern — and in the .NET world, it's the **Polly** library. In Java, it's **Resilience4j**. The application detects a failure, decides how to handle it (retry? wait? fall back?), and protects itself from cascading failure.

```csharp
// Polly: Circuit breaker with retry and fallback
var circuitBreakerPolicy = Policy
    .Handle<HttpRequestException>()
    .OrResult<HttpResponseMessage>(r => !r.IsSuccessStatusCode)
    .CircuitBreakerAsync(
        failureThreshold: 0.5,       // 50% failure rate
        samplingDuration: TimeSpan.FromSeconds(10),
        minimumThroughput: 8,         // Need 8+ calls before evaluating
        durationOfBreak: TimeSpan.FromSeconds(30),
        onBreak: (result, duration) =>
            _logger.LogWarning("Circuit OPEN for {Duration}s", duration.TotalSeconds),
        onReset: () =>
            _logger.LogInformation("Circuit CLOSED - recovered"),
        onHalfOpen: () =>
            _logger.LogInformation("Circuit HALF-OPEN - testing")
    );

var retryPolicy = Policy
    .Handle<HttpRequestException>()
    .WaitAndRetryAsync(
        retryCount: 3,
        sleepDurationProvider: attempt =>
            TimeSpan.FromSeconds(Math.Pow(2, attempt))  // 2s, 4s, 8s
    );

// Wrap: retry first, then circuit breaker
var resilientPolicy = Policy.WrapAsync(retryPolicy, circuitBreakerPolicy);

var response = await resilientPolicy.ExecuteAsync(
    () => _httpClient.GetAsync("/api/inventory/check")
);
```

The infrastructure circuit breaker removes unhealthy endpoints from a load balancer. The application circuit breaker prevents your code from calling a failing dependency. Both detect failure patterns, both fast-fail to protect the caller, and both include a recovery probe mechanism. The state machine is identical: closed → open → half-open → closed.

### ⚠ Why "Just Retry" Is Dangerous

Here's where junior engineers get burned. The instinct when a request fails is to retry immediately. And that's exactly the wrong thing to do if the downstream service is overloaded.

Imagine the Inventory Service is struggling under heavy load — response times are climbing, CPU is maxed. Now every caller starts retrying failed requests. Each retry adds more load. The service that was struggling is now drowning. The retries that were supposed to help have created a **retry storm** that guarantees the failure becomes total.

This is why exponential backoff exists: wait 2 seconds, then 4, then 8, then 16. Each retry gives the downstream service more breathing room. And this is why the circuit breaker exists on top of the retry: once failures cross a threshold, stop retrying entirely and fast-fail for a while. The retry handles **transient** failures (a single dropped packet, a momentary blip). The circuit breaker handles **sustained** failures (the service is down and needs time to recover). You need both, layered correctly.

The same principle applies in application code. An aggressive retry loop on a database call during a connection pool exhaustion event will make the exhaustion worse. Exponential backoff and circuit breaking are defensive — they sacrifice individual request latency to protect system-wide availability.

### 💡 Circuit Breakers as Economic Defense

Here's something the textbooks usually skip: circuit breakers aren't just about uptime — they're about protecting your P&L.

If you operate public-facing APIs with metered pricing — think real-time data feeds, flight status APIs, pricing engines, anything where cost scales with call volume — excessive requests don't just threaten system stability. They threaten your budget. And bad actors know this.

In competitive industries, it's not unheard of for rivals or malicious parties to deliberately flood a metered API, knowing that the target company's costs increase exponentially with call volume. This isn't a traditional DDoS attack aimed at taking your servers offline. It's an **economic denial-of-service** — the goal is to bleed your infrastructure budget dry while your services stay technically "healthy."

A circuit breaker combined with rate limiting and anomaly detection becomes your financial firewall. When request volume spikes beyond normal patterns, the breaker trips — not because the service is failing, but because the *cost of serving those requests* has crossed a threshold. You fast-fail the abusive traffic, serve cached responses where possible, and alert your operations team. The circuit breaker pattern works the same way whether the trigger is a 500 error rate or a dollar amount. Same state machine, different threshold function.

### 📐 The Mathematical Foundation

The circuit breaker implements a **three-state finite automaton** with probabilistic transitions. The transition from CLOSED to OPEN is triggered by a threshold function over a sliding window: if `failures / total_requests > threshold` within the sampling duration, transition to OPEN. This is a **ratio test** — the same statistical concept used in sequential analysis and quality control.

Exponential backoff follows a **geometric progression**: the delay after attempt *n* is *bⁿ* (typically 2ⁿ), optionally with jitter (random noise) to prevent synchronized retries across multiple callers — a phenomenon called the **thundering herd problem**, which is itself a concept from queuing theory.

---

## 08 — CDN / Cache Layer ↔ Cache-Aside / Memoization

### The Infrastructure Pattern

CloudFront, Azure CDN, Cloudflare, Akamai, Redis Cache, Azure Cache for Redis, Memcached — caching infrastructure sits between your users and your data, storing copies of frequently accessed content so that subsequent requests don't hit the origin server.

The pattern is straightforward: a user requests a resource. The cache checks if it has a fresh copy. If yes (**cache hit**), it returns the cached copy immediately — no network round trip to the origin, no database query, no computation. If no (**cache miss**), the request passes through to the origin, the response is returned to the user AND stored in the cache for future requests.

A CDN takes this to the global infrastructure level — edge servers distributed across dozens of geographic locations, each caching static assets (images, CSS, JavaScript) and sometimes dynamic content. A user in Tokyo hits the Tokyo edge server. A user in São Paulo hits the São Paulo edge server. Neither request touches your origin server in Virginia.

```
Request → Cache → HIT?  → Return cached response (fast, <10ms)
                   MISS? → Forward to origin → Return response → Store in cache
```

But the real engineering challenge isn't the happy path — it's **cache invalidation**. When the underlying data changes, every cached copy becomes stale. Do you invalidate immediately (complexity)? Set a time-to-live and accept temporary staleness (simplicity)? Use event-driven invalidation where the data source publishes change events (elegance, but requires pub-sub infrastructure from [Episode 1](#))?

Phil Karlton's famous line — *"There are only two hard things in Computer Science: cache invalidation and naming things"* — has survived decades because it's true. The caching pattern is simple. Keeping the cache consistent with the source of truth is where careers go to die.

### The Application Pattern

Inside your codebase, this is **cache-aside** (also called lazy loading) and **memoization**. Cache-aside is the application reading from and writing to an external cache (Redis, in-memory dictionary) explicitly. Memoization is the function-level version — a function caches its own results based on input parameters so repeated calls with the same arguments return instantly.

```csharp
// Cache-aside pattern: explicit read-through with manual invalidation
public class ReservationRepository
{
    private readonly IDistributedCache _cache;
    private readonly IDatabase _database;

    public async Task<Reservation> GetById(string id)
    {
        // Check cache first
        var cached = await _cache.GetStringAsync($"reservation:{id}");
        if (cached != null)
            return JsonSerializer.Deserialize<Reservation>(cached);

        // Cache miss: hit database
        var reservation = await _database.Reservations.FindAsync(id);

        // Store in cache with TTL
        await _cache.SetStringAsync(
            $"reservation:{id}",
            JsonSerializer.Serialize(reservation),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(15)
            }
        );

        return reservation;
    }

    // Invalidation: when data changes, remove from cache
    public async Task Update(Reservation reservation)
    {
        await _database.Reservations.UpdateAsync(reservation);
        await _cache.RemoveAsync($"reservation:{reservation.Id}");
    }
}
```

```csharp
// Memoization: function-level caching by input
public class FlightCalculator
{
    private readonly ConcurrentDictionary<string, decimal> _memo = new();

    public decimal CalculateFuelBurn(string aircraftType, int distance, int altitude)
    {
        var key = $"{aircraftType}:{distance}:{altitude}";

        return _memo.GetOrAdd(key, _ =>
        {
            // Expensive computation only runs once per unique input
            return PerformComplexCalculation(aircraftType, distance, altitude);
        });
    }
}
```

The CDN caches HTTP responses at the network edge. Cache-aside caches data objects in Redis or memory. Memoization caches function results by input parameters. All three follow the same algorithm: check cache → hit? return → miss? compute, store, return. And all three face the same fundamental challenge: invalidation.

### The Cache Hierarchy: Why This Matters at Scale

In practice, caching is never a single layer. It's a hierarchy, and understanding the hierarchy is what separates "I added Redis" from "I designed a caching strategy."

A typical enterprise request passes through multiple cache layers: browser cache (local storage, service workers) → CDN edge cache (Cloudflare, CloudFront) → API gateway cache (Azure APIM response caching) → application-level cache (Redis, in-memory) → database query cache (SQL Server plan cache, query result cache) → disk cache (OS page cache, SSD buffer).

Each layer has different characteristics: different TTLs, different invalidation strategies, different consistency guarantees, and different failure modes. The browser cache is the fastest but the hardest to invalidate (you can't force a user's browser to clear its cache). The database query cache is the most consistent but the least performant. A well-designed caching strategy uses multiple layers with awareness of the tradeoffs at each level.

### 🔗 Connection to Episode 2: Step Memoization Revisited

Remember the step memoization we discussed in Episode 2's Orchestrator pattern? That's caching applied to workflow state. When Azure Durable Functions replays an orchestrator, completed steps return cached results instead of re-executing. That's the same cache-aside pattern — check if the result exists, return it if so, compute it if not — applied to saga steps instead of data objects.

This is the Pattern Mirror at work: the same caching principle operates at the CDN level (infrastructure), the Redis level (application data), the function level (memoization), and the workflow level (step replay). Four layers, one mathematical structure.

### ⚠ A Note on Caches as Attack Surfaces

We've been talking about caches as a performance and consistency challenge. But caches are also a **security surface** — and one that's frequently underestimated. Cache poisoning (injecting malicious content into a shared cache so subsequent users receive it), cache timing attacks (probing response times to infer whether content exists), and web cache deception (tricking a CDN into caching a user's private data at a public URL) are all real-world attack vectors that exploit the very mechanisms we've been discussing.

We'll revisit this in **Episode 4** when we cover TLS and key exchange — where the security implications of every pattern in this series come into sharp focus. For now, file this away: every cache layer in your hierarchy is a layer an adversary can target.

### 📐 The Mathematical Foundation

Caching implements a **space-time tradeoff** — using additional memory (space) to avoid repeated computation (time). The efficiency of a cache is measured by its **hit ratio**: `hits / (hits + misses)`. The optimal caching strategy depends on the access pattern of the data, which connects to several well-studied problems in computer science.

The LRU (Least Recently Used) eviction policy assumes **temporal locality** — recently accessed items are likely to be accessed again. LFU (Least Frequently Used) assumes **frequency locality** — popular items should be retained. Both are approximations of the theoretically optimal **Bélády's algorithm**, which evicts the item that won't be used for the longest time in the future — a policy that requires knowledge of the future and therefore can't actually be implemented, but serves as the theoretical ceiling against which all practical algorithms are measured.

---

## 09 — Leader Election ↔ Mutex / Monitor / Lock

### The Infrastructure Pattern

In a distributed system with multiple instances of the same service, certain tasks should only be performed by one instance at a time. Processing a scheduled job, running a database migration, renewing an SSL certificate, rebalancing partitions — these are operations where concurrent execution would cause corruption, duplication, or conflict.

**Leader election** solves this. The instances negotiate among themselves (or through a shared coordination service) to elect one leader. The leader performs the exclusive task. The followers stand by. If the leader fails — crashes, disconnects, stops sending heartbeats — a new election happens and a new leader takes over.

At the infrastructure level, this is implemented through:

- **Apache ZooKeeper:** Distributed coordination service using ephemeral znodes and sequential ordering for election.
- **etcd:** The coordination backbone of Kubernetes — every K8s cluster uses etcd-backed leader election for controller manager and scheduler.
- **Consul:** HashiCorp's service mesh uses session-based leader election with health-check-linked locks.
- **Azure Blob Lease:** A simpler approach — acquire a lease on a blob, and the instance holding the lease is the leader. If it crashes, the lease expires, and another instance acquires it.
- **Redis RedLock:** Distributed locking across multiple Redis instances for fault-tolerant mutual exclusion.

The pattern also underpins **service discovery** — the registry problem we teased at the end of [Episode 2](#). Consul, Eureka, and Kubernetes service discovery all maintain a registry of which service instances are alive and healthy. The registry itself requires coordination (who's the authoritative source of truth?), which is a leader election problem. And the health checking that keeps the registry current — heartbeats, TTLs, gossip protocols — is the same mechanism that detects leader failure and triggers re-election.

```
Instance A ──┐
Instance B ──┤── Election ──→ Instance A becomes LEADER
Instance C ──┘                B, C become FOLLOWERS

                              A crashes → heartbeat timeout

Instance B ──┐
Instance C ──┤── Re-election → Instance C becomes LEADER
             └                 B becomes FOLLOWER
```

### The Application Pattern

Inside your codebase, this is the **mutex** (mutual exclusion), the **monitor**, the **lock**, and the **semaphore**. When multiple threads or processes need access to a shared resource — a file, a database row, a critical section of code — a lock ensures only one accessor at a time.

The **monitor** is the more formal construct taught in operating systems courses, and it's the one you'll find embedded directly in programming languages. A monitor bundles mutual exclusion *with* condition variables — it gives you both the lock and the ability to wait-and-signal on specific conditions. In C#, the `lock` keyword compiles directly to `Monitor.Enter` and `Monitor.Exit` calls, with `Monitor.Wait` and `Monitor.Pulse` available for condition signaling. Java's `synchronized` keyword is the same concept. If you studied Dijkstra or Hoare in university, this is the primitive they were building from.

```csharp
// Application-level mutual exclusion
public class ScheduledJobProcessor
{
    private static readonly SemaphoreSlim _lock = new(1, 1);

    public async Task ProcessDailyReport()
    {
        // Only one thread can execute this at a time
        if (await _lock.WaitAsync(TimeSpan.FromSeconds(5)))
        {
            try
            {
                // Critical section: generate and send report
                var report = await _reportGenerator.Generate();
                await _emailService.Send(report);
            }
            finally
            {
                _lock.Release();
            }
        }
        else
        {
            _logger.LogWarning("Another instance is already processing the daily report");
        }
    }
}
```

```csharp
// Distributed lock using Redis (for multi-instance scenarios)
public class DistributedJobProcessor
{
    private readonly IDistributedLockFactory _lockFactory;

    public async Task ProcessPartitionRebalance()
    {
        await using var distributedLock = await _lockFactory
            .CreateLockAsync(
                resource: "partition-rebalance",
                expiryTime: TimeSpan.FromMinutes(5)
            );

        if (distributedLock.IsAcquired)
        {
            await RebalancePartitions();
        }
        else
        {
            _logger.LogInformation("Another instance holds the rebalance lock");
        }
    }
}
```

The infrastructure leader election ensures one service instance performs a task. The application mutex ensures one thread enters a critical section. Both guarantee mutual exclusion — only one actor at a time. And both face the same failure mode: what happens when the lock holder dies without releasing the lock?

### The Deadlock and Livelock Problem: Distributed and Local

At the application level, the classic problem is **deadlock** — Thread A holds Lock 1 and waits for Lock 2, while Thread B holds Lock 2 and waits for Lock 1. Neither can proceed. The standard prevention strategies are well-known: acquire locks in a consistent global order, use timeouts, or use lock-free data structures.

Deadlock's less famous cousin is **livelock** — and it's arguably more insidious because the system *appears* to be working. In a livelock, threads are actively executing, consuming CPU, changing state — but making no forward progress. Imagine two people meeting in a narrow hallway: you step left, I step left. You step right, I step right. We're both moving, both being polite, and neither of us is getting anywhere.

In code, this happens when threads respond to each other's actions in a way that creates an infinite loop of mutual accommodation. Two threads detect a conflict and both back off, then both retry at the same instant, detect the conflict again, both back off again — forever. The system is burning resources and reporting healthy, but nothing is actually getting done. This is why backoff strategies add **jitter** — randomized delay — so that competing threads don't remain perfectly synchronized in their retry behavior.

The key distinction: **deadlock** is no activity, no progress. **Livelock** is full activity, no progress. Both are fatal to throughput, but livelock is harder to diagnose because your monitoring dashboards show CPU utilization, request counts, and thread activity all looking normal. The threads aren't blocked. They're just *useless*.

At the infrastructure level, the equivalent problem is **split-brain** — two instances both believe they're the leader. This is a distinct failure mode from either deadlock or livelock. Split-brain happens when a network partition separates the leader from the rest of the cluster. The leader is still alive and operating on one side of the partition. The followers on the other side detect the leader's absence (missed heartbeats) and elect a new leader. Now you have two leaders making conflicting decisions.

> ### ⚠ The Contention Family: Three Distinct Failures
>
> **Deadlock** — threads blocked, zero activity, zero progress. Both actors are waiting; neither can act. Classic cause: circular lock dependencies.
>
> **Livelock** — threads running, full activity, zero progress. Both actors are acting; neither advances. Classic cause: symmetric retry logic without jitter.
>
> **Split-brain** — independent actors, full activity, *conflicting* progress. Both actors believe they're authoritative and are actively doing work — different, contradictory work. Classic cause: network partition during leader election.
>
> All three are resource contention problems. The difference is how the failure manifests: blocked waiting, futile cycling, or divergent authority.

Split-brain is arguably the hardest problem in distributed systems, and every leader election implementation has a strategy for it — ZooKeeper uses quorum-based consensus (you need a majority to elect), etcd uses the Raft consensus algorithm, and lease-based systems use TTLs (the old leader's lease expires, and if it can't renew due to the partition, it must stop acting as leader).

The mathematical connection across all three failure modes is direct: they are all resource contention problems where the fundamental challenge is ensuring mutual exclusion in the presence of failure. The difference is the failure mode — threads deadlocking in-process, threads livelocking in-process, or nodes failing across a network — but the formal properties (safety, liveness, fairness) are identical.

### 📐 The Mathematical Foundation

Leader election and mutual exclusion both implement **total ordering on concurrent access** — the mathematical guarantee that even though multiple actors attempt an operation simultaneously, they are serialized into a sequential order.

Formally, this is the **linearizability** property from distributed systems theory (Herlihy & Wing, 1990): every operation appears to take effect at a single instant between its invocation and response, and the order is consistent with real time. A mutex provides linearizability for a critical section. A monitor provides linearizability with condition synchronization. Leader election provides linearizability for a distributed operation.

The **CAP theorem** (Brewer, 2000) is the mathematical ceiling here: in the presence of a network partition (P), you must choose between consistency (C — all nodes agree on the leader) and availability (A — all nodes can make progress). ZooKeeper and etcd choose CP — they sacrifice availability during partitions to guarantee a single leader. Some systems choose AP and accept temporary split-brain with eventual convergence. This is a fundamental mathematical constraint, not an engineering limitation.

---

## The Bigger Picture

### From Process to Survival

Episode 1 was about **communication** — how things talk. Episode 2 was about **process** — how things progress. This episode is about **survival** — how things stay alive, fast, and correct when the environment turns hostile.

This progression mirrors the maturity of engineering teams. Junior teams focus on making things work (communication). Mid-level teams focus on making things robust (process). Senior teams focus on making things resilient (survival). Staff and principal engineers focus on all three simultaneously, understanding how a caching decision affects workflow rollback, how a leader election failure cascades into circuit breaker trips, and how all of it traces back to the same mathematical structures.

### The Failure Response Spectrum

Each Resilience pattern responds to failure differently:

| Pattern | Failure Response | Philosophy |
|---------|-----------------|------------|
| **Circuit Breaker / Try-Catch** | Stop calling the failing dependency. Fast-fail and protect the caller. | *"If it hurts, stop doing it."* |
| **Cache / Memoization** | Serve stale data instead of no data. Trade freshness for availability. | *"An old answer is better than no answer."* |
| **Leader Election / Mutex** | Prevent concurrent access entirely. Serialize operations. | *"Only one at a time, no exceptions."* |

These philosophies conflict in interesting ways. The circuit breaker says "don't call the database." The cache says "fine, use the cached copy." The leader election says "wait your turn." In a production system, all three are operating simultaneously, and the interactions between them define your system's actual resilience characteristics — not any single pattern in isolation.

### Why This Matters for Your Career

Here's a truth about senior engineering: nobody asks you about caching or circuit breakers in a design interview because they want to hear the textbook answer. They ask because they want to see if you've *been in the fight*. Have you debugged a retry storm that took down a production cluster? Have you dealt with a cache stampede when a popular key expired and 10,000 requests hit the database simultaneously? Have you diagnosed a split-brain scenario where two leader instances were processing duplicate payments?

If you understand the *why* behind these patterns — not just the how — you can reason about failures you've never seen before. That's the definition of architectural thinking. The pattern is the answer. The understanding is the career.

---

**Coming up next: Episode 4 — "The Deep End."** We'll look at patterns where infrastructure engineering meets pure computer science: Consistent Hashing ↔ HashMap/Dictionary, Mesh/Gossip ↔ Graph Traversal/BFS, and TLS/Diffie-Hellman ↔ Key Exchange Strategy. This is where the math gets real.

---

*The Pattern Mirror is a four-part series mapping enterprise infrastructure patterns to their application-level equivalents. Follow along for the complete series, or share this with someone who's making the jump from application development to systems architecture.*

**Kurt Mitchell** — Enterprise Architect & Senior Software Engineer | Designing distributed systems across DoD, aviation, and cloud platforms for 20 years.
