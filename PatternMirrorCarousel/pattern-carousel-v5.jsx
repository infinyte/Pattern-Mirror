import { useState, useEffect } from "react";

// =============================================================================
// SLIDE DATA
// 12 patterns across 4 episodes, ordered to match the published series exactly:
//   Episode 1 — The Middlemen      : Patterns 01–03
//   Episode 2 — The Workflows      : Patterns 04–06
//   Episode 3 — Resilience & Perf  : Patterns 07–09
//   Episode 4 — The Deep End       : Patterns 10–12
// =============================================================================

const slides = [
  // ── Title ──────────────────────────────────────────────────────────────────
  {
    type: "title",
    title: "The Pattern Mirror",
    subtitle: "Every Enterprise Pattern Has a Code-Level Twin",
    tagline: "Platform → Application → Pure Mathematics",
    author: "Kurt Mitchell",
    credentials: "Senior Software Engineer / Architect • 20 Years Enterprise Experience",
  },

  // ── Episode 1: The Middlemen ───────────────────────────────────────────────
  {
    type: "pattern", number: "01",
    infraTitle: "Reverse Proxy",
    infraExamples: "App Gateway, Nginx, Azure Front Door",
    infraIcon: "🛡️",
    appTitle: "Mediator Pattern",
    appExamples: "MediatR, Internal Event Bus",
    appIcon: "🔀",
    mathFoundation: "Betweenness Centrality — one node on the most shortest paths between all others",
    coreInsight: "Both place a single intermediary between many-to-many connections",
    infraColor: "#1e6b8a", appColor: "#2e7d5b",
  },
  {
    type: "pattern", number: "02",
    infraTitle: "API Gateway / Load Balancer",
    infraExamples: "Azure APIM, AWS ALB, Kong",
    infraIcon: "🔄",
    appTitle: "Broker Pattern",
    appExamples: "Message Router, Strategy Dispatch",
    appIcon: "📨",
    mathFoundation: "Weighted Distribution Functions — f(request) → destination, discrete probability over the stream",
    coreInsight: "Both inspect input properties and route each message to the correct destination",
    infraColor: "#6b3fa0", appColor: "#8b5bc4",
  },
  {
    type: "pattern", number: "03",
    infraTitle: "Service Bus / Event Grid",
    infraExamples: "Kafka, RabbitMQ, Azure Service Bus",
    infraIcon: "📡",
    appTitle: "Observer / Pub-Sub",
    appExamples: "EventHandler<T>, Rx, IObservable<T>",
    appIcon: "👁️",
    mathFoundation: "Set-Theoretic Relations — one event fans out to N subscriber subsets (unidirectional traceability)",
    coreInsight: "Both decouple event producers from consumers via subscription — publisher never knows who receives",
    infraColor: "#1a8a6a", appColor: "#24a67a",
  },

  // ── Episode 2: The Workflows ───────────────────────────────────────────────
  {
    type: "pattern", number: "04",
    infraTitle: "Orchestrator",
    infraExamples: "Logic Apps, Step Functions, Durable Fn",
    infraIcon: "🎭",
    appTitle: "Coordinator / Pipeline",
    appExamples: "Workflow Engines, Stateful Handlers",
    appIcon: "⚙️",
    mathFoundation: "Finite State Machines / Directed Acyclic Graphs — centrally controlled state transitions",
    coreInsight: "Both manage stateful, multi-step processes with defined transitions and centralized control",
    infraColor: "#0077a8", appColor: "#0095b6",
  },
  {
    type: "pattern", number: "05",
    infraTitle: "Infrastructure as Code",
    infraExamples: "Terraform, ARM, Bicep, Pulumi",
    infraIcon: "🏗️",
    appTitle: "Saga Pattern",
    appExamples: "Compensating Transactions",
    appIcon: "🔁",
    mathFoundation: "Inverse Functions — f(x) applied forward, f⁻¹(x) reverses each step on failure",
    coreInsight: "Both solve: what happens when step N fails after steps 1..N-1 have already committed?",
    infraColor: "#b83340", appColor: "#d04e5a",
  },
  {
    type: "pattern", number: "06",
    infraTitle: "Strangler Fig",
    infraExamples: "Blue/Green Deploy, Canary, Traffic Shifting",
    infraIcon: "🌿",
    appTitle: "Adapter / Facade",
    appExamples: "Legacy Wrappers, Interface Bridges",
    appIcon: "🔧",
    mathFoundation: "Piecewise Monotonic Substitution — the set handled by new code only grows, never shrinks",
    coreInsight: "Both replace a running system incrementally — without ever stopping it to rewrite it",
    infraColor: "#2d7d4f", appColor: "#3a9e65",
  },

  // ── Episode 3: Resilience & Performance ───────────────────────────────────
  {
    type: "pattern", number: "07",
    infraTitle: "Circuit Breaker",
    infraExamples: "Envoy, Istio, Health Probes",
    infraIcon: "⚡",
    appTitle: "Try-Catch / Retry + Backoff",
    appExamples: "Polly, Resilience4j, Retry Pipelines",
    appIcon: "🛡️",
    mathFoundation: "Finite Automaton / Geometric Progression — Closed → Open → Half-Open, exponential backoff",
    coreInsight: "Both protect systems from cascading failure through controlled fast-fail and recovery probes",
    infraColor: "#c27013", appColor: "#d98c2a",
  },
  {
    type: "pattern", number: "08",
    infraTitle: "CDN / Cache Layer",
    infraExamples: "Redis, Azure Cache, CloudFront",
    infraIcon: "💾",
    appTitle: "Cache-Aside / Memoization",
    appExamples: "IMemoryCache, Dictionary Lookup",
    appIcon: "🗂️",
    mathFoundation: "Space-Time Tradeoff / Bélády's Optimal Algorithm — trade memory for latency, everywhere",
    coreInsight: "Both answer: have I already computed this? If so, return it — don't do the work again.",
    infraColor: "#3a7d44", appColor: "#4a9e56",
  },
  {
    type: "pattern", number: "09",
    infraTitle: "Leader Election",
    infraExamples: "Raft, Paxos, ZooKeeper, etcd",
    infraIcon: "👑",
    appTitle: "Mutex / Monitor / Lock",
    appExamples: "lock{}, SemaphoreSlim, thread-sync primitives",
    appIcon: "🔒",
    mathFoundation: "Linearizability / CAP Theorem — mutual exclusion under partition, quorum or lease-based",
    coreInsight: "Who's in charge of this cluster? = Who owns this critical section? Same question, different scale.",
    infraColor: "#6b4fa0", appColor: "#8468b8",
  },

  // ── Episode 4: The Deep End ────────────────────────────────────────────────
  {
    type: "pattern", number: "10",
    infraTitle: "Consistent Hashing",
    infraExamples: "Cassandra, DynamoDB, Redis Cluster",
    infraIcon: "🔗",
    appTitle: "HashMap / Dictionary",
    appExamples: "GetHashCode(), bucket allocation",
    appIcon: "📦",
    mathFoundation: "Modular Arithmetic / Ring Topology — h(key) mod n with minimal remapping on node change",
    coreInsight: "Both map a key to a location via h(k) mod n — one across machines, one across memory buckets",
    infraColor: "#a63d6a", appColor: "#c45580",
  },
  {
    type: "pattern", number: "11",
    infraTitle: "Service Mesh / Gossip",
    infraExamples: "Cassandra Gossip, Consul, Epidemic Protocols",
    infraIcon: "📶",
    appTitle: "Graph Traversal / BFS",
    appExamples: "BFS/DFS, Expander Graph Algorithms",
    appIcon: "🌐",
    mathFoundation: "Expander Graphs / Epidemic Spreading Models — O(log N) hops to reach all nodes",
    coreInsight: "Both propagate information through nodes without central coordination",
    infraColor: "#2b6cb0", appColor: "#3b82c4",
  },
  {
    type: "pattern", number: "12",
    infraTitle: "TLS / Diffie-Hellman",
    infraExamples: "mTLS, SSH, Zero Trust, VPN",
    infraIcon: "🔐",
    appTitle: "Key Exchange Strategy",
    appExamples: "ECDHE, DI of Cryptographic Providers",
    appIcon: "🤝",
    mathFoundation: "Modular Exponentiation / Discrete Logarithm Problem — (gᵃ)ᵇ = (gᵇ)ᵃ = gᵃᵇ mod p",
    coreInsight: "From algebraic one-way functions → every secure connection on earth. Same math, different layer.",
    infraColor: "#8b6914", appColor: "#a67e1e",
  },

  // ── Call to Action ─────────────────────────────────────────────────────────
  {
    type: "cta",
    title: "Same Problem.\nDifferent Layer.",
    subtitle: "Understanding this connection is the difference between implementing patterns and truly understanding architecture.",
    ctaText: "Follow for the deep-dive article →",
    author: "Kurt Mitchell",
  },
];

// =============================================================================
// SHARED SVG PRIMITIVES
// =============================================================================

/** Rounded rect with centered label text. */
function Box({ x, y, w, h, text, color, fontSize, r }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r || 8}
        fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={fontSize || 13}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="600">
        {text}
      </text>
    </g>
  );
}

/**
 * Animated dot that travels along a named SVG path.
 * Multiple AnimDot elements may reference the same path id.
 */
function AnimDot({ id, color, dur, begin }) {
  return (
    <circle r="5" fill={color} opacity="0.9">
      <animateMotion dur={dur || "2s"} repeatCount="indefinite" begin={begin || "0s"}>
        <mpath href={`#${id}`} />
      </animateMotion>
    </circle>
  );
}

// =============================================================================
// ANIMATED DIAGRAMS (one per pattern, 01–12)
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 01 — Reverse Proxy ↔ Mediator
// FIX: path endpoints now land exactly on box edges, not inside boxes.
//      Timing: client dots complete their journey before service dots depart,
//      creating a visible relay effect through the proxy.
// ─────────────────────────────────────────────────────────────────────────────
function Diagram01() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        {/* Client → Proxy: end at left edge of proxy rect (x=175) */}
        <path id="p01a" d="M60,45  L175,110" />
        <path id="p01b" d="M60,110 L175,110" />
        <path id="p01c" d="M60,175 L175,110" />
        {/* Proxy → Service: start at right edge of proxy rect (x=305) */}
        <path id="p01d" d="M305,110 L395,45"  />
        <path id="p01e" d="M305,110 L395,110" />
        <path id="p01f" d="M305,110 L395,175" />
      </defs>

      {/* Clients */}
      <Box x={5}   y={25}  w={55} h={40} text="Client A" color="#60a5fa" fontSize={11} />
      <Box x={5}   y={90}  w={55} h={40} text="Client B" color="#60a5fa" fontSize={11} />
      <Box x={5}   y={155} w={55} h={40} text="Client C" color="#60a5fa" fontSize={11} />

      {/* Proxy / Mediator */}
      <rect x={175} y={80} width={130} height={60} rx={10}
        fill="#1e6b8a" opacity="0.25" stroke="#1e6b8a" strokeWidth="2" />
      <text x={240} y={105} textAnchor="middle" fill="#5bb8d4" fontSize={13}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Proxy / Mediator</text>
      <text x={240} y={122} textAnchor="middle" fill="#5bb8d480" fontSize={10}
        fontFamily="'Source Code Pro', monospace">single intermediary</text>

      {/* Services */}
      <Box x={395} y={25}  w={78} h={40} text="Service X" color="#34d399" fontSize={11} />
      <Box x={395} y={90}  w={78} h={40} text="Service Y" color="#34d399" fontSize={11} />
      <Box x={395} y={155} w={78} h={40} text="Service Z" color="#34d399" fontSize={11} />

      {/* Static guide lines */}
      <line x1="60"  y1="45"  x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.2" />
      <line x1="60"  y1="110" x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.2" />
      <line x1="60"  y1="175" x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.2" />
      <line x1="305" y1="110" x2="395" y2="45"  stroke="#34d399" strokeWidth="1" opacity="0.2" />
      <line x1="305" y1="110" x2="395" y2="110" stroke="#34d399" strokeWidth="1" opacity="0.2" />
      <line x1="305" y1="110" x2="395" y2="175" stroke="#34d399" strokeWidth="1" opacity="0.2" />

      {/*
        Relay timing: client dots dur=1.8s staggered by 0.6s.
        Service dots begin 0.9s after their corresponding client starts —
        about when the first client dot reaches the proxy — so the handoff
        is visually apparent without an awkward gap.
      */}
      <AnimDot id="p01a" color="#60a5fa" dur="1.8s" begin="0s"   />
      <AnimDot id="p01b" color="#60a5fa" dur="1.8s" begin="0.6s" />
      <AnimDot id="p01c" color="#60a5fa" dur="1.8s" begin="1.2s" />
      <AnimDot id="p01d" color="#34d399" dur="1.5s" begin="0.9s" />
      <AnimDot id="p01e" color="#34d399" dur="1.5s" begin="1.5s" />
      <AnimDot id="p01f" color="#34d399" dur="1.5s" begin="2.1s" />
    </svg>
  );
}

// Pattern 02 — API Gateway / Load Balancer ↔ Broker Pattern
function Diagram02() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p02a" d="M80,110 L195,110" />
        <path id="p02b" d="M305,85  L420,45" />
        <path id="p02c" d="M305,110 L420,110" />
        <path id="p02d" d="M305,135 L420,175" />
      </defs>

      <Box x={10}  y={85} w={70}  h={50} text="Request" color="#60a5fa" fontSize={12} />

      <rect x={195} y={65} width={110} height={90} rx={10}
        fill="#6b3fa0" opacity="0.2" stroke="#6b3fa0" strokeWidth="2" />
      <text x={250} y={100}  textAnchor="middle" fill="#a78bfa" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Gateway</text>
      <text x={250} y={117}  textAnchor="middle" fill="#a78bfa" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">/ Broker</text>
      <text x={250} y={140}  textAnchor="middle" fill="#a78bfa80" fontSize={9}
        fontFamily="'Source Code Pro', monospace">inspect → route</text>

      <Box x={400} y={25}  w={70} h={40} text="/api/res"  color="#c084fc" fontSize={11} />
      <Box x={400} y={90}  w={70} h={40} text="/api/fuel" color="#c084fc" fontSize={11} />
      <Box x={400} y={155} w={70} h={40} text="/api/inv"  color="#c084fc" fontSize={11} />

      <line x1="80"  y1="110" x2="195" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="95"  x2="400" y2="45"  stroke="#c084fc" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="110" x2="400" y2="110" stroke="#c084fc" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="125" x2="400" y2="175" stroke="#c084fc" strokeWidth="1" opacity="0.3" />

      <AnimDot id="p02a" color="#60a5fa" dur="2s"   begin="0s" />
      <AnimDot id="p02b" color="#c084fc" dur="1.8s" begin="1s" />
      <AnimDot id="p02c" color="#c084fc" dur="1.8s" begin="1.4s" />
      <AnimDot id="p02d" color="#c084fc" dur="1.8s" begin="1.8s" />
    </svg>
  );
}

// Pattern 03 — Service Bus / Event Grid ↔ Observer / Pub-Sub
function Diagram03() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p03a" d="M90,110  L195,110" />
        <path id="p03b" d="M285,80  L400,40" />
        <path id="p03c" d="M285,110 L400,110" />
        <path id="p03d" d="M285,140 L400,180" />
      </defs>

      <Box x={15}  y={85} w={75} h={50} text="Publisher" color="#34d399" fontSize={12} />

      <rect x={195} y={75} width={90} height={70} rx={10}
        fill="#1a8a6a" opacity="0.2" stroke="#1a8a6a" strokeWidth="2" />
      <text x={240} y={105} textAnchor="middle" fill="#6ee7b7" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Event Bus</text>
      <text x={240} y={122} textAnchor="middle" fill="#6ee7b780" fontSize={10}
        fontFamily="'Source Code Pro', monospace">pub / sub</text>

      <Box x={390} y={20}  w={80} h={40} text="Sub A ✓" color="#6ee7b7" fontSize={11} />
      <Box x={390} y={90}  w={80} h={40} text="Sub B ✓" color="#6ee7b7" fontSize={11} />
      <Box x={390} y={160} w={80} h={40} text="Sub C ✓" color="#6ee7b7" fontSize={11} />

      <line x1="90"  y1="110" x2="195" y2="110" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="90"  x2="390" y2="40"  stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="110" x2="390" y2="110" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="130" x2="390" y2="180" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />

      <AnimDot id="p03a" color="#34d399" dur="2s"   begin="0s" />
      <AnimDot id="p03b" color="#6ee7b7" dur="1.5s" begin="1s" />
      <AnimDot id="p03c" color="#6ee7b7" dur="1.5s" begin="1.3s" />
      <AnimDot id="p03d" color="#6ee7b7" dur="1.5s" begin="1.6s" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 04 — Orchestrator ↔ Coordinator / Pipeline
// REDESIGNED: Orchestrator at center, 3 steps above it.
// React state drives a 6-tick cycle:
//   even ticks → command dot travels UP from orchestrator to step N
//   odd ticks  → ack dot travels DOWN from step N back to orchestrator
//   step N turns green once its ack tick fires
// ─────────────────────────────────────────────────────────────────────────────
function Diagram04() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 8), 850);
    return () => clearInterval(id);
  }, []);

  // Steps turn permanently green once their ack phase passes
  const stepDone = [tick >= 2, tick >= 4, tick >= 6];

  // Which step is currently active (0-indexed) and whether it's cmd or ack
  const activeStep = Math.min(Math.floor(tick / 2), 2); // 0,1,2
  const isCmd = tick % 2 === 0 && tick < 6;
  const isAck = tick % 2 === 1 && tick < 7;

  // Step layout: centers at x=75,235,395; y-center=47; orch top y=150
  const stepCX = [75, 235, 395];
  const stepBottomY = 70;
  const orchTopY = 152;

  // Command path: orchestrator center → step center (goes UP)
  const cmdPath = isCmd
    ? `M${stepCX[activeStep]},${orchTopY} L${stepCX[activeStep]},${stepBottomY}`
    : null;

  // Ack path: step center → orchestrator (goes DOWN)
  const ackPath = isAck
    ? `M${stepCX[activeStep]},${stepBottomY} L${stepCX[activeStep]},${orchTopY}`
    : null;

  const stepLabels  = ["Reserve", "Charge", "Notify"];
  const stepColors  = ["#22d3ee", "#22d3ee", "#22d3ee"];
  const doneColor   = "#4ade80";
  const statusText  = tick < 6
    ? (isCmd ? `→ ${stepLabels[activeStep]}` : `← ack`)
    : "✓ Complete";

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">

      {/* Header label */}
      <text x={240} y={14} textAnchor="middle" fill="#67e8f9" fontSize={10}
        fontFamily="'Source Code Pro', monospace" fontWeight="600" opacity="0.7">
        Orchestrator dispatches commands — steps reply with acks
      </text>

      {/* Steps */}
      {stepLabels.map((label, i) => {
        const cx = stepCX[i];
        const col = stepDone[i] ? doneColor : stepColors[i];
        const isActive = i === activeStep && tick < 6;
        return (
          <g key={i}>
            <rect x={cx - 45} y={25} width={90} height={45} rx={10}
              fill={col} fillOpacity={stepDone[i] ? 0.22 : isActive ? 0.18 : 0.08}
              stroke={col} strokeWidth={isActive ? 2 : 1.5} />
            <text x={cx} y={45} textAnchor="middle"
              fill={col} fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
              {label}
            </text>
            {stepDone[i] && (
              <text x={cx} y={62} textAnchor="middle"
                fill={doneColor} fontSize={10} fontFamily="'Source Code Pro', monospace">
                ✓ done
              </text>
            )}
            {/* Vertical guide line from step to orchestrator */}
            <line x1={cx} y1={stepBottomY} x2={cx} y2={orchTopY}
              stroke={col} strokeWidth="1" opacity="0.18" strokeDasharray="4,3" />
          </g>
        );
      })}

      {/* Orchestrator */}
      <rect x={30} y={152} width={420} height={55} rx={12}
        fill="#0077a8" fillOpacity="0.18" stroke="#0077a8" strokeWidth="2" />
      <text x={240} y={174} textAnchor="middle" fill="#67e8f9" fontSize={14}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        ORCHESTRATOR
      </text>
      <text x={240} y={194} textAnchor="middle" fill="#67e8f9" fontSize={11}
        fontFamily="'Source Code Pro', monospace" opacity="0.7">
        {statusText}
      </text>

      {/* Command dot traveling UP (Orch → Step) */}
      {isCmd && cmdPath && (
        <circle key={`cmd-${tick}`} r="5.5" fill="#22d3ee" opacity="0.95">
          <animateMotion dur="0.75s" repeatCount="1" fill="freeze" path={cmdPath} />
        </circle>
      )}

      {/* Ack dot traveling DOWN (Step → Orch), colored green */}
      {isAck && ackPath && (
        <circle key={`ack-${tick}`} r="5.5" fill="#4ade80" opacity="0.95">
          <animateMotion dur="0.75s" repeatCount="1" fill="freeze" path={ackPath} />
        </circle>
      )}

      {/* DAG edges: step1→step2, step2→step3 (shows sequential dependency) */}
      <line x1="120" y1="47" x2="190" y2="47" stroke="#22d3ee" strokeWidth="1" opacity="0.2" strokeDasharray="3,3"/>
      <polygon points="188,43 196,47 188,51" fill="#22d3ee" opacity="0.25" />
      <line x1="280" y1="47" x2="350" y2="47" stroke="#22d3ee" strokeWidth="1" opacity="0.2" strokeDasharray="3,3"/>
      <polygon points="348,43 356,47 348,51" fill="#22d3ee" opacity="0.25" />

      {/* State machine label (bottom left) */}
      <text x={40} y={212} fill="#9ca3af" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity="0.55">
        FSM: idle → step1 → step2 → step3 → complete
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 05 — Infrastructure as Code ↔ Saga Pattern
// REDESIGNED: Shows two complete animation cycles in sequence:
//   Cycle A (ticks 0–3): SUCCESS — all 3 forward steps complete with green dots
//   Cycle B (ticks 4–8): FAILURE — 2 steps succeed, step 3 fails,
//                                   then compensating actions fire in reverse
// ─────────────────────────────────────────────────────────────────────────────
function Diagram05() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // 9 ticks total: 0–3 success, 4–8 failure+compensation
    const id = setInterval(() => setTick(t => (t + 1) % 9), 820);
    return () => clearInterval(id);
  }, []);

  // ── Layout constants ───────────────────────────────────────────────────────
  const fwdY   = 48;   // y-center of forward step boxes
  const revY   = 168;  // y-center of compensation boxes
  const stepXs = [55, 185, 315]; // center-x of steps 1,2,3 (and their compensations)
  const failX  = 425;  // center-x of the FAIL marker

  // ── State derivation ──────────────────────────────────────────────────────
  const isSuccess = tick < 4;

  // Success cycle: ticks 0→step1 lit, 1→step2 lit, 2→step3 lit, 3→done
  const fwdDone_s = isSuccess
    ? [tick >= 1, tick >= 2, tick >= 3]
    : [false, false, false];

  // Failure cycle: ticks 4→step1 lit, 5→step2 lit, 6→FAIL, 7→comp1, 8→comp2
  const fwdDone_f = !isSuccess
    ? [tick >= 5, tick >= 6, false]   // step3 never completes
    : [false, false, false];

  const failActive = tick === 6;
  const comp1Active = tick === 7;  // Cancel (compensation for Ship)
  const comp2Active = tick === 8;  // Refund (compensation for Charge)

  // ── Animated dot paths ────────────────────────────────────────────────────
  // Success forward: dot travels step 1→2→3 in sequence
  const successFwdPath = isSuccess && tick < 3
    ? `M${stepXs[tick] - 40},${fwdY} L${stepXs[tick] + 40},${fwdY}`
    : null;

  // Failure forward: dots on steps 1 and 2
  const failFwdPath = !isSuccess && (tick === 4 || tick === 5)
    ? `M${stepXs[tick - 4] - 40},${fwdY} L${stepXs[tick - 4] + 40},${fwdY}`
    : null;

  // Failure arriving at FAIL box
  const arriveFail = tick === 6
    ? `M${stepXs[2] + 40},${fwdY} L${failX - 30},${fwdY}`
    : null;

  // Compensation dots moving left
  const comp1Path = tick === 7
    ? `M${stepXs[2] + 40},${revY} L${stepXs[2] - 40},${revY}`
    : null;
  const comp2Path = tick === 8
    ? `M${stepXs[1] + 40},${revY} L${stepXs[1] - 40},${revY}`
    : null;

  const fwdDone  = isSuccess ? fwdDone_s : fwdDone_f;
  const modeLabel = isSuccess ? "✓ SUCCESS — all steps committed" : (tick >= 7 ? "↩ COMPENSATING" : "✕ FAILURE at step 3");
  const modeColor = isSuccess ? "#4ade80" : (tick >= 7 ? "#fbbf24" : "#f87171");

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      {/* Mode label */}
      <text x={240} y={14} textAnchor="middle" fill={modeColor} fontSize={11}
        fontFamily="'Source Code Pro', monospace" fontWeight="700" opacity="0.85">
        {modeLabel}
      </text>

      {/* Forward row: step boxes */}
      {["Create", "Charge", "Ship"].map((label, i) => {
        const done = fwdDone[i];
        const col  = done ? "#4ade80" : "#34d399";
        return (
          <g key={i}>
            <rect x={stepXs[i] - 45} y={fwdY - 22} width={90} height={44} rx={8}
              fill={col} fillOpacity={done ? 0.22 : 0.1} stroke={col}
              strokeWidth={done ? 2 : 1.5} />
            <text x={stepXs[i]} y={fwdY - 2} textAnchor="middle"
              fill={col} fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
              {label}
            </text>
            {done && (
              <text x={stepXs[i]} y={fwdY + 13} textAnchor="middle"
                fill={col} fontSize={10} fontFamily="'Source Code Pro', monospace">✓</text>
            )}
          </g>
        );
      })}

      {/* FAIL box */}
      <rect x={failX - 35} y={fwdY - 22} width={70} height={44} rx={8}
        fill="#ef4444" fillOpacity={failActive ? 0.3 : 0.08}
        stroke="#ef4444" strokeWidth={failActive ? 2.5 : 1.5} />
      <text x={failX} y={fwdY - 2} textAnchor="middle"
        fill="#f87171" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        FAIL
      </text>
      <text x={failX} y={fwdY + 13} textAnchor="middle"
        fill="#f8717180" fontSize={10} fontFamily="'Source Code Pro', monospace">✕</text>

      {/* Forward step connectors */}
      <line x1={stepXs[0] + 45} y1={fwdY} x2={stepXs[1] - 45} y2={fwdY}
        stroke="#34d399" strokeWidth="1" opacity="0.25" />
      <polygon points={`${stepXs[1]-50},${fwdY-4} ${stepXs[1]-42},${fwdY} ${stepXs[1]-50},${fwdY+4}`}
        fill="#34d399" opacity="0.4" />
      <line x1={stepXs[1] + 45} y1={fwdY} x2={stepXs[2] - 45} y2={fwdY}
        stroke="#34d399" strokeWidth="1" opacity="0.25" />
      <polygon points={`${stepXs[2]-50},${fwdY-4} ${stepXs[2]-42},${fwdY} ${stepXs[2]-50},${fwdY+4}`}
        fill="#34d399" opacity="0.4" />
      <line x1={stepXs[2] + 45} y1={fwdY} x2={failX - 35} y2={fwdY}
        stroke="#ef4444" strokeWidth="1" opacity="0.2" strokeDasharray="4,3" />

      {/* Inverse function label */}
      <text x={240} y={112} textAnchor="middle" fill="#9ca3af" fontSize={18} opacity="0.6">
        {tick < 7 ? "f(x) →" : "← f⁻¹(x)"}
      </text>

      {/* Compensation row: reverse boxes (only visible in failure cycle) */}
      {!isSuccess && ["Undo", "Refund", "Cancel"].map((label, i) => {
        const compDone = (i === 2 && tick >= 7) || (i === 1 && tick >= 8);
        const isActiveComp = (i === 2 && tick === 7) || (i === 1 && tick === 8);
        const col  = compDone ? "#fbbf24" : "#f87171";
        return (
          <g key={i}>
            <rect x={stepXs[i] - 45} y={revY - 22} width={90} height={44} rx={8}
              fill={col} fillOpacity={isActiveComp ? 0.25 : compDone ? 0.18 : 0.06}
              stroke={col} strokeWidth={isActiveComp ? 2 : 1.5} opacity={tick < 7 ? 0.3 : 1} />
            <text x={stepXs[i]} y={revY - 2} textAnchor="middle"
              fill={col} fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700"
              opacity={tick < 7 ? 0.3 : 1}>
              {label}
            </text>
          </g>
        );
      })}

      {/* Compensation connectors (reverse arrows) */}
      {!isSuccess && (
        <>
          <line x1={stepXs[2] - 45} y1={revY} x2={stepXs[1] + 45} y2={revY}
            stroke="#f87171" strokeWidth="1" opacity="0.2" />
          <polygon points={`${stepXs[1]+50},${revY-4} ${stepXs[1]+42},${revY} ${stepXs[1]+50},${revY+4}`}
            fill="#f87171" opacity="0.3" />
          <line x1={stepXs[1] - 45} y1={revY} x2={stepXs[0] + 45} y2={revY}
            stroke="#f87171" strokeWidth="1" opacity="0.2" />
        </>
      )}

      {/* ── Animated dots ── */}

      {/* SUCCESS: forward dot on current step */}
      {isSuccess && successFwdPath && (
        <circle key={`sfwd-${tick}`} r="5.5" fill="#4ade80" opacity="0.9">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={successFwdPath} />
        </circle>
      )}

      {/* FAILURE: forward dots on steps 1 & 2 */}
      {!isSuccess && failFwdPath && (
        <circle key={`ffwd-${tick}`} r="5.5" fill="#34d399" opacity="0.9">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={failFwdPath} />
        </circle>
      )}

      {/* FAILURE: dot arriving at FAIL box */}
      {arriveFail && (
        <circle key={`farr-${tick}`} r="5.5" fill="#ef4444" opacity="0.95">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={arriveFail} />
        </circle>
      )}

      {/* COMPENSATION: reverse dots */}
      {comp1Path && (
        <circle key={`c1-${tick}`} r="5.5" fill="#fbbf24" opacity="0.95">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={comp1Path} />
        </circle>
      )}
      {comp2Path && (
        <circle key={`c2-${tick}`} r="5.5" fill="#fbbf24" opacity="0.95">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={comp2Path} />
        </circle>
      )}
    </svg>
  );
}

// Pattern 06 — Strangler Fig ↔ Adapter / Facade
// Piecewise Monotonic Substitution: traffic migrates from legacy to new system
function Diagram06() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p06req"  d="M70,110 L190,110" />
        <path id="p06leg"  d="M290,90  L400,50" />
        <path id="p06new1" d="M290,130 L400,170" />
        <path id="p06new2" d="M290,130 L400,170" />
        <path id="p06new3" d="M290,130 L400,170" />
      </defs>

      <text x={240} y={18} textAnchor="middle" fill="#4ade80" fontSize={10}
        fontFamily="'Source Code Pro', monospace" opacity="0.7">
        monotonic substitution — new surface only grows
      </text>

      <Box x={5} y={85} w={65} h={50} text="Request" color="#60a5fa" fontSize={11} />

      <rect x={190} y={72} width={100} height={76} rx={10}
        fill="#2d7d4f" opacity="0.2" stroke="#2d7d4f" strokeWidth="2" />
      <text x={240} y={102} textAnchor="middle" fill="#4ade80" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Strangler</text>
      <text x={240} y={118} textAnchor="middle" fill="#4ade80" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Proxy</text>
      <text x={240} y={134} textAnchor="middle" fill="#4ade8080" fontSize={9}
        fontFamily="'Source Code Pro', monospace">route → migrate</text>

      <rect x={400} y={25} width={72} height={50} rx={8}
        fill="#37415120" stroke="#6b7280" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x={436} y={47} textAnchor="middle"
        fill="#9ca3af" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">
        Legacy
      </text>
      <text x={436} y={62} textAnchor="middle"
        fill="#6b728080" fontSize={9} fontFamily="'Source Code Pro', monospace">
        retiring
      </text>

      <rect x={400} y={145} width={72} height={50} rx={8}
        fill="#2d7d4f" opacity="0.25" stroke="#4ade80" strokeWidth="2" />
      <text x={436} y={165} textAnchor="middle"
        fill="#4ade80" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        New
      </text>
      <text x={436} y={181} textAnchor="middle"
        fill="#4ade80" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        System
      </text>

      <line x1="70"  y1="110" x2="190" y2="110"
        stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="290" y1="90"  x2="400" y2="50"
        stroke="#6b7280" strokeWidth="1" opacity="0.3" strokeDasharray="5,3" />
      <line x1="290" y1="130" x2="400" y2="170"
        stroke="#4ade80" strokeWidth="2" opacity="0.45" />

      <text x={348} y={63} textAnchor="middle" fill="#9ca3af" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity="0.8">20%</text>
      <text x={348} y={163} textAnchor="middle" fill="#4ade80" fontSize={10}
        fontFamily="'Source Code Pro', monospace" fontWeight="600">80%</text>

      <AnimDot id="p06req"  color="#60a5fa" dur="1.8s" begin="0s" />
      <AnimDot id="p06req"  color="#60a5fa" dur="1.8s" begin="0.9s" />
      <AnimDot id="p06leg"  color="#9ca3af" dur="2.0s" begin="1.0s" />
      <AnimDot id="p06new1" color="#4ade80" dur="1.6s" begin="1.0s" />
      <AnimDot id="p06new2" color="#4ade80" dur="1.6s" begin="2.2s" />
      <AnimDot id="p06new3" color="#4ade80" dur="1.6s" begin="3.4s" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 07 — Circuit Breaker ↔ Try-Catch / Retry + Backoff
// REDESIGNED: Three-row layout showing the REQUEST FLOW for each breaker state.
//   Row 1 (CLOSED / green):   Request → [CLOSED] → Service ✓
//   Row 2 (OPEN   / red):     Request → [OPEN]   → Fast Fail ✕
//   Row 3 (HALF-OPEN / amber): [HALF-OPEN] → probe → Success → [CLOSED]
// React state cycles through all three scenarios every 1.8s.
// ─────────────────────────────────────────────────────────────────────────────
function Diagram07() {
  const [phase, setPhase] = useState(0); // 0=closed, 1=open, 2=half-open

  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 3), 1800);
    return () => clearInterval(id);
  }, []);

  // Row y-centers
  const rowY = [45, 115, 185];

  // Opacity: active row = full, inactive = dimmed
  const op = (row) => phase === row ? 1 : 0.22;

  // Animated dot paths (full row traversal left→right or probe→return)
  const closedPath  = "M68,45  L185,45  L295,45  L385,45";
  const openPath    = "M68,115 L185,115 L295,115 L390,115";
  // half-open: probe goes right then returns left to CLOSED row
  const probePath   = "M90,185 L225,185 L295,185 L295,45 L185,45";

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">

      {/* ── CLOSED row ── */}
      <g opacity={op(0)}>
        {/* Request → */}
        <Box x={5}   y={rowY[0]-20} w={60} h={40} text="Request" color="#4ade80" fontSize={10} />
        {/* State box */}
        <rect x={130} y={rowY[0]-22} width={110} height={44} rx={22}
          fill="#22c55e" fillOpacity="0.15" stroke="#22c55e" strokeWidth="2" />
        <text x={185} y={rowY[0]-2}  textAnchor="middle" dominantBaseline="central"
          fill="#4ade80" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
          CLOSED
        </text>
        <text x={185} y={rowY[0]+16} textAnchor="middle"
          fill="#4ade8080" fontSize={9} fontFamily="'Source Code Pro', monospace">requests flow</text>
        {/* Arrow */}
        <line x1="240" y1={rowY[0]} x2="295" y2={rowY[0]} stroke="#4ade80" strokeWidth="1.5" opacity="0.4" />
        <polygon points={`290,${rowY[0]-4} 298,${rowY[0]} 290,${rowY[0]+4}`} fill="#4ade80" opacity="0.5" />
        {/* Service */}
        <Box x={295} y={rowY[0]-20} w={90} h={40} text="Service ✓" color="#4ade80" fontSize={11} />
        {/* Animated dot */}
        {phase === 0 && (
          <circle key={`closed-${phase}`} r="5" fill="#4ade80" opacity="0.9">
            <animateMotion dur="1.6s" repeatCount="indefinite" path={closedPath} />
          </circle>
        )}
      </g>

      {/* ── OPEN row ── */}
      <g opacity={op(1)}>
        <Box x={5}   y={rowY[1]-20} w={60} h={40} text="Request" color="#f87171" fontSize={10} />
        <rect x={130} y={rowY[1]-22} width={110} height={44} rx={22}
          fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="2" />
        <text x={185} y={rowY[1]-2}  textAnchor="middle" dominantBaseline="central"
          fill="#f87171" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
          OPEN
        </text>
        <text x={185} y={rowY[1]+16} textAnchor="middle"
          fill="#f8717180" fontSize={9} fontFamily="'Source Code Pro', monospace">fail fast</text>
        {/* Arrow */}
        <line x1="240" y1={rowY[1]} x2="295" y2={rowY[1]} stroke="#f87171" strokeWidth="1.5" opacity="0.4" />
        <polygon points={`290,${rowY[1]-4} 298,${rowY[1]} 290,${rowY[1]+4}`} fill="#f87171" opacity="0.5" />
        {/* Fast Fail target */}
        <rect x={295} y={rowY[1]-20} width={100} height={40} rx={8}
          fill="#ef4444" fillOpacity="0.12" stroke="#ef4444" strokeWidth="1.5" />
        <text x={345} y={rowY[1]-2}  textAnchor="middle" fill="#f87171" fontSize={13}
          fontFamily="'Source Sans 3', sans-serif" fontWeight="700">✕</text>
        <text x={345} y={rowY[1]+14} textAnchor="middle"
          fill="#f8717180" fontSize={9} fontFamily="'Source Code Pro', monospace">fast fail</text>
        {/* Animated dot */}
        {phase === 1 && (
          <circle key={`open-${phase}`} r="5" fill="#f87171" opacity="0.9">
            <animateMotion dur="1.4s" repeatCount="indefinite" path={openPath} />
          </circle>
        )}
      </g>

      {/* ── HALF-OPEN row ── */}
      <g opacity={op(2)}>
        <rect x={5}   y={rowY[2]-22} width={120} height={44} rx={22}
          fill="#f59e0b" fillOpacity="0.15" stroke="#f59e0b" strokeWidth="2" />
        <text x={65} y={rowY[2]-2}  textAnchor="middle" dominantBaseline="central"
          fill="#fbbf24" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
          HALF-OPEN
        </text>
        <text x={65} y={rowY[2]+16} textAnchor="middle"
          fill="#fbbf2480" fontSize={9} fontFamily="'Source Code Pro', monospace">test probe</text>
        {/* Arrow right */}
        <line x1="125" y1={rowY[2]} x2="220" y2={rowY[2]} stroke="#fbbf24" strokeWidth="1.5" opacity="0.4" />
        <polygon points={`216,${rowY[2]-4} 224,${rowY[2]} 216,${rowY[2]+4}`} fill="#fbbf24" opacity="0.5" />
        {/* Probe label */}
        <text x={170} y={rowY[2]-8} textAnchor="middle"
          fill="#fbbf24" fontSize={9} fontFamily="'Source Code Pro', monospace" opacity="0.8">
          probe →
        </text>
        {/* Probe target */}
        <Box x={220} y={rowY[2]-20} w={80} h={40} text="Service?" color="#fbbf24" fontSize={11} />
        {/* Arrow curving up to CLOSED */}
        <path d="M295,175 C340,160 340,60 295,47"
          stroke="#4ade80" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="4,3" />
        <polygon points="291,43 299,47 291,51" fill="#4ade80" opacity="0.5" />
        <text x={355} y={110} textAnchor="middle"
          fill="#4ade8080" fontSize={9} fontFamily="'Source Code Pro', monospace">
          success → CLOSED
        </text>
        {/* Animated probe dot */}
        {phase === 2 && (
          <circle key={`probe-${phase}`} r="5" fill="#fbbf24" opacity="0.9">
            <animateMotion dur="2.0s" repeatCount="indefinite" path={probePath} />
          </circle>
        )}
      </g>

      {/* Row separator lines */}
      <line x1="0" y1="80" x2="480" y2="80" stroke="#374151" strokeWidth="0.5" opacity="0.4" />
      <line x1="0" y1="152" x2="480" y2="152" stroke="#374151" strokeWidth="0.5" opacity="0.4" />

      {/* Phase label (top right) */}
      <text x={468} y={12} textAnchor="end"
        fill={phase === 0 ? "#4ade80" : phase === 1 ? "#f87171" : "#fbbf24"}
        fontSize={10} fontFamily="'Source Code Pro', monospace" fontWeight="700">
        {phase === 0 ? "● CLOSED" : phase === 1 ? "● OPEN" : "● HALF-OPEN"}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 08 — CDN / Cache Layer ↔ Cache-Aside / Memoization
// REWORKED: Clear decision-tree showing both HIT and MISS paths.
// Cycles between two scenarios:
//   Scenario A (HIT):  App → Cache → HIT → return to App (fast, green)
//   Scenario B (MISS): App → Cache → MISS → DB → fill cache → return (amber)
// React state drives scenario selection; animated dots trace each path.
// ─────────────────────────────────────────────────────────────────────────────
function Diagram08() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // 6 ticks per cycle; tick 0-2 = HIT, tick 3-5 = MISS
    const id = setInterval(() => setTick(t => (t + 1) % 6), 900);
    return () => clearInterval(id);
  }, []);

  const isHit  = tick < 3;
  const isMiss = tick >= 3;

  // ── Coordinates ───────────────────────────────────────────────────────────
  // App box: x=10, y=82, w=75, h=56 → center (47, 110)
  // Cache box: x=185, y=70, w=110, h=80 → center (240, 110)
  // DB box: x=385, y=140, w=85, h=55 → center (427, 167)
  // HIT return label: y=50 arc back
  // MISS path: App→Cache→DB→(arc back to Cache)→App

  // HIT path: App → Cache → HIT label → return arc back to App
  const hitFwdPath  = "M85,110 L185,110";                      // app→cache
  const hitRetPath  = "M185,95 C140,60 100,60 85,95";          // cache→app (arc above)

  // MISS paths (sequential ticks 3,4,5)
  const missArrPath = "M85,120 L185,120";                      // app→cache (lower line = miss)
  const missDbPath  = "M295,120 C330,120 380,150 385,160";     // cache→db
  const missFillPath= "M385,148 C350,90 300,82 295,82";        // db→cache (fill arc)
  const missRetPath = "M185,88 C140,62 100,66 85,100";         // cache→app (return)

  // Which dot to show based on tick
  const dotConfig = isHit
    ? [
        { path: hitFwdPath,  color: "#4ade80", active: tick === 0 },
        { path: hitRetPath,  color: "#4ade80", active: tick === 1 },
      ]
    : [
        { path: missArrPath, color: "#f87171", active: tick === 3 },
        { path: missDbPath,  color: "#f87171", active: tick === 4 },
        { path: missFillPath,color: "#fbbf24", active: tick === 4 },  // fill simultaneously
        { path: missRetPath, color: "#4ade80", active: tick === 5 },
      ];

  const scenarioLabel = isHit
    ? "⚡ CACHE HIT — returned immediately"
    : tick === 3 ? "⚠ CACHE MISS — forwarding to origin"
    : tick === 4 ? "↑ Origin response — filling cache"
    : "✓ Cached — subsequent requests will hit";
  const scenarioColor = isHit ? "#4ade80" : tick === 5 ? "#4ade80" : "#fbbf24";

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">

      {/* Scenario label */}
      <text x={240} y={13} textAnchor="middle" fill={scenarioColor} fontSize={10}
        fontFamily="'Source Code Pro', monospace" fontWeight="700" opacity="0.9">
        {scenarioLabel}
      </text>

      {/* ── App box ── */}
      <rect x={10} y={82} width={75} height={56} rx={10}
        fill="#60a5fa" fillOpacity="0.1" stroke="#60a5fa" strokeWidth="1.5" />
      <text x={47} y={108} textAnchor="middle" fill="#93c5fd" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">App</text>
      <text x={47} y={126} textAnchor="middle" fill="#93c5fd80" fontSize={9}
        fontFamily="'Source Code Pro', monospace">request</text>

      {/* ── Cache box ── */}
      <rect x={185} y={70} width={110} height={80} rx={10}
        fill="#3a7d44" fillOpacity="0.2" stroke="#3a7d44" strokeWidth="2" />
      <text x={240} y={100} textAnchor="middle" fill="#4ade80" fontSize={13}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Cache</text>
      <text x={240} y={116} textAnchor="middle" fill="#4ade8080" fontSize={10}
        fontFamily="'Source Code Pro', monospace">Redis / Memory</text>
      {/* HIT / MISS indicator */}
      <text x={240} y={135} textAnchor="middle"
        fill={isHit ? "#4ade80" : "#f87171"} fontSize={11}
        fontFamily="'Source Code Pro', monospace" fontWeight="700">
        {isHit ? "HIT ✓" : "MISS ✕"}
      </text>

      {/* ── Connection lines from App to Cache ── */}
      {/* Upper line (hit path) */}
      <line x1="85"  y1="106" x2="185" y2="106" stroke="#4ade80" strokeWidth="1.5" opacity="0.3" />
      <polygon points="180,102 190,106 180,110" fill="#4ade80" opacity="0.4" />
      <text x={134} y={98} textAnchor="middle" fill="#4ade80" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity="0.7">hit →</text>

      {/* Lower line (miss path) */}
      <line x1="85"  y1="118" x2="185" y2="118" stroke="#f87171" strokeWidth="1" opacity="0.25"
        strokeDasharray="4,3" />
      <text x={134} y={133} textAnchor="middle" fill="#f87171" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity="0.6">miss →</text>

      {/* Return arc (above — fast HIT return) */}
      <path d="M185,88 C145,58 100,58 85,88"
        stroke="#4ade80" strokeWidth="1" fill="none" opacity="0.25" strokeDasharray="4,3" />
      <polygon points="87,84 83,92 90,88" fill="#4ade80" opacity="0.35" />
      <text x={132} y={58} textAnchor="middle" fill="#4ade80" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity="0.7">← return</text>

      {/* ── DB box ── */}
      <rect x={385} y={140} width={85} height={55} rx={10}
        fill="#60a5fa" fillOpacity={isMiss ? 0.12 : 0.05}
        stroke="#60a5fa" strokeWidth={isMiss ? 1.5 : 1} />
      <text x={427} y={165} textAnchor="middle" fill="#93c5fd" fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700"
        opacity={isMiss ? 1 : 0.4}>DB</text>
      <text x={427} y={183} textAnchor="middle" fill="#93c5fd80" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity={isMiss ? 1 : 0.4}>origin</text>

      {/* Cache → DB arrow (miss) */}
      <path d="M295,120 C330,120 375,150 385,160"
        stroke="#f87171" strokeWidth="1" fill="none" opacity={isMiss ? 0.35 : 0.1}
        strokeDasharray="4,3" />
      <polygon points="386,156 386,164 380,160" fill="#f87171"
        opacity={isMiss ? 0.5 : 0.1} />

      {/* DB → Cache arc (fill) */}
      <path d="M385,148 C350,95 305,78 295,80"
        stroke="#fbbf24" strokeWidth="1.5" fill="none"
        opacity={isMiss && tick >= 4 ? 0.5 : 0.1} strokeDasharray="5,3" />
      <text x={360} y={100} textAnchor="middle" fill="#fbbf24" fontSize={9}
        fontFamily="'Source Code Pro', monospace"
        opacity={isMiss && tick >= 4 ? 0.8 : 0.1}>fill cache</text>

      {/* ── Animated dots ── */}
      {dotConfig.map((d, i) =>
        d.active ? (
          <circle key={`d08-${tick}-${i}`} r="5.5" fill={d.color} opacity="0.9">
            <animateMotion dur="0.8s" repeatCount="1" fill="freeze" path={d.path} />
          </circle>
        ) : null
      )}
    </svg>
  );
}

// Pattern 09 — Leader Election ↔ Mutex / Monitor / Lock
function Diagram09() {
  const nodes = [
    { x: 140, y: 40,  label: "N1" },
    { x: 340, y: 40,  label: "N2" },
    { x: 80,  y: 160, label: "N3" },
    { x: 240, y: 180, label: "N4" },
    { x: 400, y: 160, label: "N5" },
  ];
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p09v1" d="M140,60  L240,100" />
        <path id="p09v2" d="M340,60  L240,100" />
        <path id="p09v3" d="M100,160 L240,100" />
        <path id="p09v4" d="M240,160 L240,100" />
        <path id="p09v5" d="M380,160 L240,100" />
      </defs>

      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={n.x} y1={n.y + 20} x2={240} y2={100}
            stroke="#a78bfa" strokeWidth="1" opacity="0.2" />
          <circle cx={n.x} cy={n.y + 15} r={20}
            fill="#6b4fa020" stroke="#8b68b8" strokeWidth="1.5" />
          <text x={n.x} y={n.y + 19} textAnchor="middle"
            fill="#c4b5fd" fontSize={12} fontFamily="'Source Code Pro', monospace" fontWeight="600">
            {n.label}
          </text>
        </g>
      ))}

      <circle cx={240} cy={100} r={28} fill="#fbbf2420" stroke="#f59e0b" strokeWidth="2" />
      <text x={240} y={96}  textAnchor="middle"
        fill="#fbbf24" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        LEADER
      </text>
      <text x={240} y={110} textAnchor="middle" fill="#fbbf24" fontSize={14}>👑</text>

      <text x={240} y={15} textAnchor="middle"
        fill="#9ca3af" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.6">
        votes converge → consensus on leader
      </text>

      <AnimDot id="p09v1" color="#a78bfa" dur="2s" begin="0s" />
      <AnimDot id="p09v2" color="#a78bfa" dur="2s" begin="0.4s" />
      <AnimDot id="p09v3" color="#a78bfa" dur="2s" begin="0.8s" />
      <AnimDot id="p09v4" color="#a78bfa" dur="2s" begin="1.2s" />
      <AnimDot id="p09v5" color="#a78bfa" dur="2s" begin="1.6s" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 10 — Consistent Hashing ↔ HashMap / Dictionary
// FIXED: Animation now shows the key → hash → ring → node journey.
// Two keys cycle in sequence, each going through:
//   Phase 0: key label appears at left
//   Phase 1: dot travels from key label to the landing point on the ring
//   Phase 2: dot traverses the ring clockwise to the nearest node
//   Phase 3: node highlights ("stored"), brief pause
// ─────────────────────────────────────────────────────────────────────────────
function Diagram10() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => (t + 1) % 8), 800);
    return () => clearInterval(id);
  }, []);

  const ringR  = 78;
  const cx     = 290, cy = 118;  // ring center (shifted right to leave room for key label)

  // Node positions on ring (angles in degrees, 0 = top/12-o'clock, clockwise)
  const nodeAngles = [0, 72, 144, 216, 288];
  const nodeLabels = ["N0", "N1", "N2", "N3", "N4"];

  const toRad = (deg) => (deg - 90) * Math.PI / 180;
  const nodeX  = (i) => cx + ringR * Math.cos(toRad(nodeAngles[i]));
  const nodeY  = (i) => cy + ringR * Math.sin(toRad(nodeAngles[i]));

  // Two key scenarios:
  //   key "k=42" lands at 36° (between N0@0° and N1@72°) → routes to N1
  //   key "k=7"  lands at 180° (between N2@144° and N3@216°) → routes to N2
  const keys = [
    {
      label: "k=42",
      landAngle: 36,    // landing point on ring
      targetNode: 1,    // N1 is nearest clockwise
    },
    {
      label: "k=7",
      landAngle: 165,
      targetNode: 2,    // N2 is nearest clockwise
    },
  ];

  // Each key gets 4 ticks; key 0 = ticks 0-3, key 1 = ticks 4-7
  const keyIdx  = tick < 4 ? 0 : 1;
  const keyTick = tick % 4; // 0=appear, 1=travel to ring, 2=arc to node, 3=highlight+pause
  const key     = keys[keyIdx];

  // Landing point on ring for this key
  const landX   = cx + ringR * Math.cos(toRad(key.landAngle));
  const landY   = cy + ringR * Math.sin(toRad(key.landAngle));

  // Target node position
  const targX   = nodeX(key.targetNode);
  const targY   = nodeY(key.targetNode);

  // Arc path along ring from landing to target node (clockwise)
  // We approximate the arc with several points along the ring
  const arcPath = (() => {
    const startAngle = key.landAngle;
    const endAngle   = nodeAngles[key.targetNode];
    // clockwise: if endAngle < startAngle, add 360
    const endA   = endAngle < startAngle ? endAngle + 360 : endAngle;
    const steps  = 6;
    let d = `M${landX.toFixed(1)},${landY.toFixed(1)}`;
    for (let i = 1; i <= steps; i++) {
      const a = startAngle + (endA - startAngle) * i / steps;
      const x = cx + ringR * Math.cos(toRad(a));
      const y = cy + ringR * Math.sin(toRad(a));
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return d;
  })();

  // Key label source position (left side of diagram)
  const srcX = 40, srcY = 110;
  const travelPath = `M${srcX},${srcY} L${landX.toFixed(1)},${landY.toFixed(1)}`;

  // Which node is highlighted (only during tick 3)
  const highlightNode = keyTick === 3 ? key.targetNode : -1;

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">

      {/* Header */}
      <text x={240} y={13} textAnchor="middle" fill="#f9a8d4" fontSize={10}
        fontFamily="'Source Code Pro', monospace" opacity="0.7">
        key → h(k) mod n → nearest node on ring
      </text>

      {/* Ring */}
      <circle cx={cx} cy={cy} r={ringR}
        fill="none" stroke="#c4558044" strokeWidth="2" strokeDasharray="6,4" />

      {/* Ring nodes */}
      {nodeAngles.map((a, i) => {
        const nx = nodeX(i), ny = nodeY(i);
        const isHighlighted = i === highlightNode;
        return (
          <g key={i}>
            <circle cx={nx} cy={ny} r={isHighlighted ? 18 : 15}
              fill={isHighlighted ? "#a63d6a40" : "#a63d6a15"}
              stroke={isHighlighted ? "#f9a8d4" : "#c45580"}
              strokeWidth={isHighlighted ? 2.5 : 1.5} />
            <text x={nx} y={ny + 4} textAnchor="middle"
              fill={isHighlighted ? "#fbcfe8" : "#f9a8d4"} fontSize={11}
              fontFamily="'Source Code Pro', monospace" fontWeight="600">
              {nodeLabels[i]}
            </text>
            {isHighlighted && (
              <text x={nx} y={ny - 24} textAnchor="middle"
                fill="#4ade80" fontSize={9} fontFamily="'Source Code Pro', monospace"
                fontWeight="700">
                ✓ stored
              </text>
            )}
          </g>
        );
      })}

      {/* Ring center label */}
      <text x={cx} y={cy - 4}  textAnchor="middle"
        fill="#f9a8d4" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">
        h(key)
      </text>
      <text x={cx} y={cy + 11} textAnchor="middle"
        fill="#f9a8d480" fontSize={10} fontFamily="'Source Code Pro', monospace">
        mod n
      </text>

      {/* Key label on the left (source) */}
      <rect x={8} y={srcY - 20} width={64} height={40} rx={8}
        fill="#a63d6a15" stroke="#c45580" strokeWidth="1.5" />
      <text x={40} y={srcY - 3} textAnchor="middle"
        fill="#f9a8d4" fontSize={12} fontFamily="'Source Code Pro', monospace" fontWeight="700">
        {key.label}
      </text>
      <text x={40} y={srcY + 13} textAnchor="middle"
        fill="#c4558080" fontSize={9} fontFamily="'Source Code Pro', monospace">
        key
      </text>

      {/* Landing point indicator on ring (small diamond) */}
      {keyTick >= 1 && (
        <polygon
          points={`${landX},${landY - 6} ${landX + 5},${landY} ${landX},${landY + 6} ${landX - 5},${landY}`}
          fill="#fbbf24" opacity="0.8" />
      )}

      {/* Phase 0 label */}
      {keyTick === 0 && (
        <text x={40} y={srcY + 32} textAnchor="middle"
          fill="#fbbf24" fontSize={9} fontFamily="'Source Code Pro', monospace">
          hash →
        </text>
      )}

      {/* ── Animated dots ── */}

      {/* Phase 1: key travels from source → landing on ring */}
      {keyTick === 1 && (
        <circle key={`travel-${tick}`} r="5.5" fill="#fbbf24" opacity="0.9">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={travelPath} />
        </circle>
      )}

      {/* Phase 2: dot arcs along ring to target node */}
      {keyTick === 2 && (
        <circle key={`arc-${tick}`} r="5.5" fill="#f9a8d4" opacity="0.9">
          <animateMotion dur="0.7s" repeatCount="1" fill="freeze" path={arcPath} />
        </circle>
      )}

      {/* Phase 3: dot stays at node (frozen at end of arc) */}
      {keyTick === 3 && (
        <circle cx={targX} cy={targY} r="5.5" fill="#4ade80" opacity="0.85" />
      )}

      {/* Key cycle label (top right) */}
      <text x={468} y={13} textAnchor="end"
        fill="#c45580" fontSize={9} fontFamily="'Source Code Pro', monospace" opacity="0.7">
        {keyIdx === 0 ? "cycle 1/2" : "cycle 2/2"}
      </text>
    </svg>
  );
}

// Pattern 11 — Service Mesh / Gossip ↔ Graph Traversal / BFS
function Diagram11() {
  const nodes = [
    { x: 60,  y: 50  }, { x: 180, y: 30  }, { x: 300, y: 50  }, { x: 420, y: 40  },
    { x: 120, y: 130 }, { x: 240, y: 150 }, { x: 360, y: 130 },
    { x: 180, y: 200 }, { x: 300, y: 200 },
  ];
  const edges = [
    [0,1],[1,2],[2,3],[0,4],[1,4],[1,5],[2,5],[2,6],[3,6],
    [4,5],[4,7],[5,7],[5,8],[5,6],[6,8],
  ];
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p11a" d={`M${nodes[0].x},${nodes[0].y} L${nodes[1].x},${nodes[1].y} L${nodes[2].x},${nodes[2].y} L${nodes[3].x},${nodes[3].y}`} />
        <path id="p11b" d={`M${nodes[0].x},${nodes[0].y} L${nodes[4].x},${nodes[4].y} L${nodes[5].x},${nodes[5].y} L${nodes[8].x},${nodes[8].y}`} />
        <path id="p11c" d={`M${nodes[0].x},${nodes[0].y} L${nodes[4].x},${nodes[4].y} L${nodes[7].x},${nodes[7].y}`} />
      </defs>

      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#3b82c4" strokeWidth="1" opacity="0.15" />
      ))}

      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 0 ? 14 : 10}
            fill={i === 0 ? "#3b82f620" : "#2b6cb015"}
            stroke={i === 0 ? "#60a5fa" : "#3b82c4"}
            strokeWidth={i === 0 ? 2 : 1} />
          {i === 0 && (
            <text x={n.x} y={n.y + 4} textAnchor="middle"
              fill="#60a5fa" fontSize={9} fontFamily="'Source Code Pro', monospace" fontWeight="700">
              SRC
            </text>
          )}
        </g>
      ))}

      <text x={240} y={16} textAnchor="middle"
        fill="#93c5fd" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.7">
        hop-by-hop propagation (BFS / gossip)
      </text>

      <AnimDot id="p11a" color="#60a5fa" dur="3s"   begin="0s" />
      <AnimDot id="p11b" color="#60a5fa" dur="3.5s" begin="0.5s" />
      <AnimDot id="p11c" color="#60a5fa" dur="2.5s" begin="1s" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern 12 — TLS / Diffie-Hellman ↔ Key Exchange Strategy
// REDESIGNED: Full lifecycle — key exchange handshake followed by a live
// bidirectional secure channel. Three-act structure:
//   Act 1 (tick 0-1): Alice → Bob (gᵃ mod p), Bob → Alice (gᵇ mod p)
//   Act 2 (tick 2):   Both compute gᵃᵇ mod p → 🔐 shared secret established
//   Act 3 (tick 3+):  Bidirectional secure channel — packets flow both ways
// ─────────────────────────────────────────────────────────────────────────────
function Diagram12() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    // 8 ticks: 0=alice send, 1=bob send, 2=secret established, 3-7=secure channel
    const id = setInterval(() => setTick(t => (t + 1) % 8), 900);
    return () => clearInterval(id);
  }, []);

  const aliceX = 55,  aliceY = 80;  // Alice box center
  const bobX   = 425, bobY   = 80;  // Bob box center

  // Key exchange paths
  const aliceToBob = `M${aliceX + 40},${aliceY - 10} L${bobX - 40},${aliceY - 10}`;
  const bobToAlice = `M${bobX - 40},${aliceY + 10} L${aliceX + 40},${aliceY + 10}`;

  // Secure channel paths (top and bottom of channel bar)
  // Multiple packets cycling in both directions
  const chanAtoB1 = "M80,162 L420,162";
  const chanBtoA1 = "M420,178 L80,178";
  const chanAtoB2 = "M80,162 L420,162";
  const chanBtoA2 = "M420,178 L80,178";

  const isExchange = tick < 2;
  const isSecret   = tick === 2;
  const isChannel  = tick >= 3;

  const channelActive = isChannel;

  const act = tick === 0 ? "Act 1 — Key Exchange"
    : tick === 1 ? "Act 1 — Key Exchange"
    : tick === 2 ? "Act 2 — Shared Secret"
    : "Act 3 — Secure Channel";
  const actColor = isChannel ? "#4ade80" : isSecret ? "#fbbf24" : "#93c5fd";

  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">

      {/* Act label */}
      <text x={240} y={13} textAnchor="middle" fill={actColor} fontSize={10}
        fontFamily="'Source Code Pro', monospace" fontWeight="700" opacity="0.85">
        {act}
      </text>

      {/* ── Alice box ── */}
      <rect x={15} y={50} width={80} height={60} rx={10}
        fill="#60a5fa15" stroke="#60a5fa" strokeWidth="1.5" />
      <text x={55} y={74} textAnchor="middle" fill="#93c5fd" fontSize={13}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Alice</text>
      <text x={55} y={92} textAnchor="middle" fill="#93c5fd80" fontSize={10}
        fontFamily="'Source Code Pro', monospace">secret: a</text>
      <text x={55} y={106} textAnchor="middle" fill="#60a5fa80" fontSize={9}
        fontFamily="'Source Code Pro', monospace">gᵃ mod p</text>

      {/* ── Bob box ── */}
      <rect x={385} y={50} width={80} height={60} rx={10}
        fill="#34d39915" stroke="#34d399" strokeWidth="1.5" />
      <text x={425} y={74} textAnchor="middle" fill="#6ee7b7" fontSize={13}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Bob</text>
      <text x={425} y={92} textAnchor="middle" fill="#6ee7b780" fontSize={10}
        fontFamily="'Source Code Pro', monospace">secret: b</text>
      <text x={425} y={106} textAnchor="middle" fill="#34d39980" fontSize={9}
        fontFamily="'Source Code Pro', monospace">gᵇ mod p</text>

      {/* ── Key exchange phase ── */}
      {/* Alice → Bob line */}
      <line x1="95" y1="70" x2="385" y2="70" stroke="#93c5fd" strokeWidth="1" opacity="0.25" />
      <text x={240} y={62} textAnchor="middle" fill="#93c5fd" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity={isExchange || isSecret ? 0.9 : 0.3}>
        gᵃ mod p →
      </text>

      {/* Bob → Alice line */}
      <line x1="385" y1="90" x2="95" y2="90" stroke="#6ee7b7" strokeWidth="1" opacity="0.25" />
      <text x={240} y={103} textAnchor="middle" fill="#6ee7b7" fontSize={9}
        fontFamily="'Source Code Pro', monospace" opacity={isExchange || isSecret ? 0.9 : 0.3}>
        ← gᵇ mod p
      </text>

      {/* ── Shared secret box ── */}
      <rect x={145} y={120} width={190} height={38} rx={8}
        fill={isSecret ? "#f59e0b20" : isChannel ? "#4ade8015" : "#f59e0b0a"}
        stroke={isChannel ? "#4ade80" : "#f59e0b"}
        strokeWidth={isSecret ? 2.5 : 1.5} />
      <text x={240} y={142} textAnchor="middle"
        fill={isChannel ? "#4ade80" : "#fbbf24"} fontSize={12}
        fontFamily="'Source Sans 3', sans-serif" fontWeight="700">
        {isChannel ? "🔐 Secure Channel Active" : "🔐 gᵃᵇ mod p = Shared Secret"}
      </text>

      {/* ── Secure channel (Act 3) ── */}
      {isChannel && (
        <>
          {/* Channel track */}
          <rect x={80} y={152} width={340} height={50} rx={8}
            fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.5" opacity="0.7" />

          {/* Direction labels */}
          <text x={88} y={165} fill="#4ade80" fontSize={8}
            fontFamily="'Source Code Pro', monospace" opacity="0.6">Alice → Bob</text>
          <text x={88} y={195} fill="#6ee7b7" fontSize={8}
            fontFamily="'Source Code Pro', monospace" opacity="0.6">Bob → Alice</text>

          {/* Packet labels on tracks */}
          <text x={240} y={165} textAnchor="middle" fill="#4ade8080" fontSize={8}
            fontFamily="'Source Code Pro', monospace">🔒 data</text>
          <text x={240} y={193} textAnchor="middle" fill="#6ee7b780" fontSize={8}
            fontFamily="'Source Code Pro', monospace">🔒 data</text>

          {/* A→B packets */}
          <circle r="5" fill="#4ade80" opacity="0.9">
            <animateMotion dur="1.4s" repeatCount="indefinite" path={chanAtoB1} />
          </circle>
          <circle r="5" fill="#4ade80" opacity="0.7">
            <animateMotion dur="1.4s" repeatCount="indefinite" begin="0.7s" path={chanAtoB2} />
          </circle>

          {/* B→A packets */}
          <circle r="5" fill="#6ee7b7" opacity="0.9">
            <animateMotion dur="1.4s" repeatCount="indefinite" begin="0.3s" path={chanBtoA1} />
          </circle>
          <circle r="5" fill="#6ee7b7" opacity="0.7">
            <animateMotion dur="1.4s" repeatCount="indefinite" begin="1.0s" path={chanBtoA2} />
          </circle>
        </>
      )}

      {/* ── Key exchange animated dots ── */}

      {/* Tick 0: Alice sends gᵃ mod p → Bob */}
      {tick === 0 && (
        <circle key="a2b" r="5.5" fill="#93c5fd" opacity="0.95">
          <animateMotion dur="0.8s" repeatCount="1" fill="freeze" path={aliceToBob} />
        </circle>
      )}

      {/* Tick 1: Bob sends gᵇ mod p → Alice */}
      {tick === 1 && (
        <circle key="b2a" r="5.5" fill="#6ee7b7" opacity="0.95">
          <animateMotion dur="0.8s" repeatCount="1" fill="freeze" path={bobToAlice} />
        </circle>
      )}

      {/* Tick 2: both sides compute — pulsing dots at each side converging */}
      {isSecret && (
        <>
          <circle key="sa" r="5.5" fill="#fbbf24" opacity="0.9">
            <animateMotion dur="0.75s" repeatCount="1" fill="freeze"
              path="M95,80 L145,135" />
          </circle>
          <circle key="sb" r="5.5" fill="#fbbf24" opacity="0.9">
            <animateMotion dur="0.75s" repeatCount="1" fill="freeze"
              path="M385,80 L335,135" />
          </circle>
        </>
      )}
    </svg>
  );
}

// =============================================================================
// DIAGRAM LOOKUP
// Index matches the slide index (0 = title, 1–12 = patterns, 13 = CTA).
// =============================================================================
const diagrams = [
  null,        // 0  — title slide
  Diagram01,   // 1  — Pattern 01: Reverse Proxy ↔ Mediator
  Diagram02,   // 2  — Pattern 02: API Gateway ↔ Broker
  Diagram03,   // 3  — Pattern 03: Service Bus ↔ Observer/Pub-Sub
  Diagram04,   // 4  — Pattern 04: Orchestrator ↔ Coordinator/Pipeline
  Diagram05,   // 5  — Pattern 05: IaC ↔ Saga
  Diagram06,   // 6  — Pattern 06: Strangler Fig ↔ Adapter/Facade
  Diagram07,   // 7  — Pattern 07: Circuit Breaker ↔ Try-Catch/Retry
  Diagram08,   // 8  — Pattern 08: CDN/Cache ↔ Cache-Aside/Memoization
  Diagram09,   // 9  — Pattern 09: Leader Election ↔ Mutex/Monitor/Lock
  Diagram10,   // 10 — Pattern 10: Consistent Hashing ↔ HashMap/Dictionary
  Diagram11,   // 11 — Pattern 11: Service Mesh/Gossip ↔ Graph Traversal/BFS
  Diagram12,   // 12 — Pattern 12: TLS/Diffie-Hellman ↔ Key Exchange Strategy
  null,        // 13 — CTA slide
];

// =============================================================================
// SLIDE COMPONENTS
// =============================================================================

function TitleSlide({ slide }) {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      {/* Glow accents */}
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.08),transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.06),transparent 70%)" }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 72px" }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 16, color: "#60a5fa", letterSpacing: 5, textTransform: "uppercase", marginBottom: 40, fontWeight: 500 }}>
          Software Architecture Series
        </div>
        <h1 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 82, fontWeight: 900, color: "#f9fafb", lineHeight: 1.1, margin: "0 0 24px" }}>
          {slide.title}
        </h1>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "0 0 32px" }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>
        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 30, color: "#d1d5db", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.45 }}>
          {slide.subtitle}
        </p>
        <p style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 18, color: "#60a5fa", margin: "40px 0 0", fontWeight: 400, letterSpacing: 1.5 }}>
          {slide.tagline}
        </p>
        <div style={{ marginTop: 72, borderTop: "1px solid #374151", paddingTop: 32 }}>
          <div style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, color: "#f3f4f6", fontWeight: 700 }}>
            {slide.author}
          </div>
          <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, color: "#9ca3af", fontWeight: 400, marginTop: 8 }}>
            {slide.credentials}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatternSlide({ slide, index }) {
  const DiagramComponent = diagrams[index];
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.02,
        backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Header: pattern number + core insight */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        padding: "28px 40px 0", position: "relative", zIndex: 1, gap: 14,
      }}>
        <div style={{
          fontFamily: "'Merriweather',Georgia,serif", fontSize: 44, fontWeight: 900,
          color: slide.infraColor, opacity: 0.25, lineHeight: 1, minWidth: 60,
        }}>
          {slide.number}
        </div>
        <div style={{
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, color: "#d1d5db",
          fontWeight: 400, fontStyle: "italic", lineHeight: 1.4, paddingTop: 6,
        }}>
          "{slide.coreInsight}"
        </div>
      </div>

      {/* Side-by-side: Platform card ↔ Application card */}
      <div style={{
        display: "flex", gap: 20, padding: "16px 40px 12px",
        position: "relative", zIndex: 1,
      }}>
        {/* ── Platform card (was "Infrastructure") ── */}
        <div style={{
          flex: 1, background: "#1f2937", borderRadius: 14,
          borderTop: `3px solid ${slide.infraColor}`, padding: "20px 22px",
        }}>
          <div style={{
            fontFamily: "'Source Code Pro',monospace", fontSize: 10, color: slide.infraColor,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 600,
          }}>
            Platform
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{slide.infraIcon}</span>
            <h2 style={{
              fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, fontWeight: 700,
              color: "#f3f4f6", margin: 0, lineHeight: 1.2,
            }}>
              {slide.infraTitle}
            </h2>
          </div>
          <div style={{
            fontFamily: "'Source Code Pro',monospace", fontSize: 11.5,
            color: slide.infraColor, fontWeight: 500, lineHeight: 1.4, opacity: 0.85,
          }}>
            {slide.infraExamples}
          </div>
        </div>

        {/* Connector arrow */}
        <div style={{ display: "flex", alignItems: "center", width: 36 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: "#1f2937",
            border: "1.5px solid #374151", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, color: "#9ca3af",
            fontFamily: "'Source Code Pro',monospace", fontWeight: 600,
          }}>
            ↔
          </div>
        </div>

        {/* Application card */}
        <div style={{
          flex: 1, background: "#1f2937", borderRadius: 14,
          borderTop: `3px solid ${slide.appColor}`, padding: "20px 22px",
        }}>
          <div style={{
            fontFamily: "'Source Code Pro',monospace", fontSize: 10, color: slide.appColor,
            letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 600,
          }}>
            Application
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{slide.appIcon}</span>
            <h2 style={{
              fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, fontWeight: 700,
              color: "#f3f4f6", margin: 0, lineHeight: 1.2,
            }}>
              {slide.appTitle}
            </h2>
          </div>
          <div style={{
            fontFamily: "'Source Code Pro',monospace", fontSize: 11.5,
            color: slide.appColor, fontWeight: 500, lineHeight: 1.4, opacity: 0.85,
          }}>
            {slide.appExamples}
          </div>
        </div>
      </div>

      {/* Animated diagram */}
      <div style={{
        flex: 1, margin: "0 40px", position: "relative", zIndex: 1,
        background: "#0d1117", borderRadius: 14, border: "1px solid #1f2937",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "10px 20px", minHeight: 0,
      }}>
        {DiagramComponent && <DiagramComponent />}
      </div>

      {/* Math foundation banner */}
      <div style={{
        margin: "12px 40px 28px", padding: "14px 20px",
        background: "#1f2937", borderRadius: 10,
        borderLeft: "3px solid #f59e0b",
        display: "flex", alignItems: "center", gap: 14,
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "'Source Code Pro',monospace", fontSize: 9, color: "#f59e0b",
          letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, minWidth: 50,
        }}>
          Math
        </div>
        <div style={{
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 15,
          color: "#e5e7eb", fontWeight: 500, lineHeight: 1.3,
        }}>
          {slide.mathFoundation}
        </div>
      </div>
    </div>
  );
}

function CTASlide({ slide }) {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 90px" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 48 }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>
        <h1 style={{
          fontFamily: "'Merriweather',Georgia,serif", fontSize: 68, fontWeight: 900,
          color: "#f9fafb", lineHeight: 1.15, margin: "0 0 32px", whiteSpace: "pre-line",
        }}>
          {slide.title}
        </h1>
        <p style={{
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 24, color: "#d1d5db",
          lineHeight: 1.55, margin: "0 0 56px", fontWeight: 400,
        }}>
          {slide.subtitle}
        </p>
        <div style={{
          display: "inline-block", padding: "18px 44px", borderRadius: 8,
          background: "#3b82f6", fontFamily: "'Source Sans 3',sans-serif",
          fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: 0.3,
        }}>
          {slide.ctaText}
        </div>
        <div style={{ marginTop: 56 }}>
          <div style={{
            fontFamily: "'Merriweather',Georgia,serif", fontSize: 20,
            color: "#9ca3af", fontWeight: 700,
          }}>
            {slide.author}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN CAROUSEL
// =============================================================================

export default function LinkedInCarousel() {
  const [cur, setCur] = useState(0);
  const [scale, setScale] = useState(0.45);

  // Responsive scaling: fit the 1080×1080 canvas into the available viewport.
  useEffect(() => {
    const updateScale = () => {
      const sw = (window.innerWidth - 140) / 1080;
      const sh = (window.innerHeight - 180) / 1080;
      setScale(Math.min(sw, sh, 0.7));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const s = slides[cur];

  const renderSlide = (slide, index) => {
    if (slide.type === "title") return <TitleSlide slide={slide} />;
    if (slide.type === "cta")   return <CTASlide   slide={slide} />;
    return <PatternSlide slide={slide} index={index} />;
  };

  /** Active dot color for navigation — uses the slide's infra accent or blue fallback. */
  const activeColor = (slide) => slide.type === "pattern" ? slide.infraColor : "#3b82f6";

  const canPrev = cur > 0;
  const canNext = cur < slides.length - 1;

  const navBtn = (disabled, label, onClick) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 40, height: 40, borderRadius: 8,
        background: disabled ? "#1f2937" : "#374151",
        border: "1px solid #4b5563",
        color: disabled ? "#4b5563" : "#e5e7eb",
        fontSize: 18, cursor: disabled ? "default" : "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 600,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0e17",
      display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0",
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{
          fontFamily: "'Merriweather',Georgia,serif", fontSize: 20,
          color: "#e5e7eb", fontWeight: 700, margin: "0 0 4px",
        }}>
          LinkedIn Carousel Preview
        </h1>
        <p style={{
          fontFamily: "'Source Sans 3',sans-serif", fontSize: 13,
          color: "#6b7280", margin: 0,
        }}>
          Slide {cur + 1} of {slides.length} — 1080 × 1080 px
        </p>
      </div>

      {/* Canvas + navigation arrows */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        {navBtn(!canPrev, "‹", () => setCur(cur - 1))}

        <div style={{
          width: 1080 * scale, height: 1080 * scale, borderRadius: 8,
          overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,.4)",
          border: "1px solid #1f2937",
        }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 1080, height: 1080 }}>
            {renderSlide(s, cur)}
          </div>
        </div>

        {navBtn(!canNext, "›", () => setCur(cur + 1))}
      </div>

      {/* Dot navigation */}
      <div style={{
        display: "flex", gap: 5, marginBottom: 16,
        flexWrap: "wrap", justifyContent: "center", maxWidth: 440,
      }}>
        {slides.map((sl, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            style={{
              width: i === cur ? 22 : 8, height: 8, borderRadius: 4,
              border: "none", cursor: "pointer",
              background: i === cur ? activeColor(sl) : "#374151",
              transition: "all .25s ease",
            }}
          />
        ))}
      </div>

      {/* Pattern label beneath canvas */}
      {s.type === "pattern" && (
        <div style={{
          textAlign: "center", padding: "8px 20px", borderRadius: 8,
          background: "#1f2937", border: "1px solid #374151",
        }}>
          <span style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 12, color: "#9ca3af" }}>
            #{s.number}&nbsp;
          </span>
          <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>
            {s.infraTitle}
          </span>
          <span style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 12, color: "#6b7280", margin: "0 6px" }}>
            ↔
          </span>
          <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>
            {s.appTitle}
          </span>
        </div>
      )}
    </div>
  );
}
