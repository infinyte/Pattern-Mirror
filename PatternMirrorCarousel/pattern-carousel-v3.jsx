import { useState, useEffect } from "react";

const slides = [
  {
    type: "title",
    title: "The Pattern Mirror",
    subtitle: "Every Enterprise Pattern Has a Code-Level Twin",
    tagline: "Infrastructure → Application → Pure Mathematics",
    author: "Kurt Mitchell",
    credentials: "Senior Software Engineer / Architect • 20 Years Enterprise Experience",
  },
  {
    type: "pattern", number: "01",
    infraTitle: "Reverse Proxy", infraExamples: "App Gateway, Nginx, Front Door", infraIcon: "🛡️",
    appTitle: "Mediator Pattern", appExamples: "MediatR, Internal Event Bus", appIcon: "🔀",
    mathFoundation: "Graph Centrality — single node minimizing path length",
    coreInsight: "Both place a single intermediary between many-to-many connections",
    infraColor: "#1e6b8a", appColor: "#2e7d5b",
  },
  {
    type: "pattern", number: "02",
    infraTitle: "API Gateway / Load Balancer", infraExamples: "Azure APIM, AWS ALB, Kong", infraIcon: "🔄",
    appTitle: "Broker Pattern", appExamples: "Message Router, Strategy Dispatch", appIcon: "📨",
    mathFoundation: "Weighted Distribution Functions / Modular Arithmetic",
    coreInsight: "Both examine input properties and route to the correct destination",
    infraColor: "#6b3fa0", appColor: "#8b5bc4",
  },
  {
    type: "pattern", number: "03",
    infraTitle: "Orchestrator", infraExamples: "Logic Apps, Step Functions, Durable Fn", infraIcon: "🎭",
    appTitle: "Coordinator / Pipeline", appExamples: "Workflow Engines, Stateful Handlers", appIcon: "⚙️",
    mathFoundation: "Finite State Machines / Directed Acyclic Graphs",
    coreInsight: "Both manage stateful, multi-step processes with defined transitions",
    infraColor: "#0077a8", appColor: "#0095b6",
  },
  {
    type: "pattern", number: "04",
    infraTitle: "Infrastructure as Code", infraExamples: "Terraform, ARM, Bicep, Pulumi", infraIcon: "🏗️",
    appTitle: "Saga Pattern", appExamples: "Compensating Transactions", appIcon: "🔁",
    mathFoundation: "Inverse Functions — f(x) then f⁻¹(x) for rollback",
    coreInsight: "Both solve: what happens when step N fails after 1..N-1 succeeded?",
    infraColor: "#b83340", appColor: "#d04e5a",
  },
  {
    type: "pattern", number: "05",
    infraTitle: "Service Bus / Event Grid", infraExamples: "Kafka, RabbitMQ, Azure SB", infraIcon: "📡",
    appTitle: "Observer / Pub-Sub", appExamples: "EventHandler, Rx, IObservable", appIcon: "👁️",
    mathFoundation: "Set-Theoretic Relations — publisher maps to subscriber subsets",
    coreInsight: "Both decouple event producers from consumers via subscription",
    infraColor: "#1a8a6a", appColor: "#24a67a",
  },
  {
    type: "pattern", number: "06",
    infraTitle: "Circuit Breaker", infraExamples: "Envoy, Istio, Health Probes", infraIcon: "⚡",
    appTitle: "Try-Catch / Retry + Backoff", appExamples: "Polly, Resilience Patterns", appIcon: "🛡️",
    mathFoundation: "Threshold Functions / State Machines with Timed Transitions",
    coreInsight: "Both protect systems from cascading failure through controlled degradation",
    infraColor: "#c27013", appColor: "#d98c2a",
  },
  {
    type: "pattern", number: "07",
    infraTitle: "CDN / Distributed Cache", infraExamples: "Redis, Azure Cache, CloudFront", infraIcon: "💾",
    appTitle: "Cache-Aside / Memoization", appExamples: "MemoryCache, Dictionary Lookup", appIcon: "🗂️",
    mathFoundation: "Bijective Mapping — key → value with temporal decay",
    coreInsight: "Both answer: have I already computed this? Then don't do it again.",
    infraColor: "#3a7d44", appColor: "#4a9e56",
  },
  {
    type: "pattern", number: "08",
    infraTitle: "Leader Election", infraExamples: "Raft, Paxos, ZooKeeper", infraIcon: "👑",
    appTitle: "Mutex / Semaphore / Lock", appExamples: "Singleton, Thread Sync", appIcon: "🔒",
    mathFoundation: "Consensus Theory — Byzantine Fault Tolerance, Quorum Majorities",
    coreInsight: "Who's in charge of this cluster? = Who owns this critical section?",
    infraColor: "#6b4fa0", appColor: "#8468b8",
  },
  {
    type: "pattern", number: "09",
    infraTitle: "Consistent Hashing / DHT", infraExamples: "Cassandra, DynamoDB, CDN", infraIcon: "🔗",
    appTitle: "HashMap / Dictionary", appExamples: "GetHashCode, Bucket Allocation", appIcon: "📦",
    mathFoundation: "Modular Arithmetic — h(k) mod n with minimal remapping",
    coreInsight: "Both turn a key into a location using h(k) mod n — one machine vs. many",
    infraColor: "#a63d6a", appColor: "#c45580",
  },
  {
    type: "pattern", number: "10",
    infraTitle: "Mesh / Gossip Protocol", infraExamples: "BT Mesh, UWB, Cassandra Gossip", infraIcon: "📶",
    appTitle: "Graph Traversal / Chain of Resp.", appExamples: "BFS/DFS, Handler Chains", appIcon: "🌐",
    mathFoundation: "Graph Theory — Shortest Path, Epidemic Spreading Models",
    coreInsight: "Both propagate information through nodes without central coordination",
    infraColor: "#2b6cb0", appColor: "#3b82c4",
  },
  {
    type: "pattern", number: "11",
    infraTitle: "TLS / ECDHE / mTLS", infraExamples: "SSH, VPN, Zero Trust", infraIcon: "🔐",
    appTitle: "Key Exchange / Crypto Strategy", appExamples: "DI of Crypto Providers", appIcon: "🤝",
    mathFoundation: "Discrete Logarithm Problem over Finite Cyclic Groups",
    coreInsight: "From abstract algebra → modular arithmetic → every secure connection on earth",
    infraColor: "#8b6914", appColor: "#a67e1e",
  },
  {
    type: "cta",
    title: "Same Problem.\nDifferent Layer.",
    subtitle: "Understanding this connection is the difference between implementing patterns and truly understanding architecture.",
    ctaText: "Follow for the deep-dive article →",
    author: "Kurt Mitchell",
  },
];

/* ---- Animated Diagrams ---- */

function Box({ x, y, w, h, text, color, fontSize, r }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={r||8} fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
      <text x={x + w / 2} y={y + h / 2} textAnchor="middle" dominantBaseline="central"
        fill={color} fontSize={fontSize || 13} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">
        {text}
      </text>
    </g>
  );
}

function AnimDot({ id, color, path, dur, begin }) {
  return (
    <circle r="5" fill={color} opacity="0.9">
      <animateMotion dur={dur || "2s"} repeatCount="indefinite" begin={begin || "0s"}>
        <mpath href={`#${id}`} />
      </animateMotion>
    </circle>
  );
}

function Diagram01() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p01a" d="M60,45 L200,110" />
        <path id="p01b" d="M60,110 L200,110" />
        <path id="p01c" d="M60,175 L200,110" />
        <path id="p01d" d="M280,110 L400,45" />
        <path id="p01e" d="M280,110 L400,110" />
        <path id="p01f" d="M280,110 L400,175" />
      </defs>
      <Box x={5} y={25} w={55} h={40} text="Client A" color="#60a5fa" fontSize={11} />
      <Box x={5} y={90} w={55} h={40} text="Client B" color="#60a5fa" fontSize={11} />
      <Box x={5} y={155} w={55} h={40} text="Client C" color="#60a5fa" fontSize={11} />
      <rect x={175} y={80} width={130} height={60} rx={10} fill="#1e6b8a" opacity="0.25" stroke="#1e6b8a" strokeWidth="2" />
      <text x={240} y={105} textAnchor="middle" fill="#5bb8d4" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Proxy / Mediator</text>
      <text x={240} y={122} textAnchor="middle" fill="#5bb8d480" fontSize={10} fontFamily="'Source Code Pro', monospace">single intermediary</text>
      <Box x={395} y={25} w={70} h={40} text="Service X" color="#34d399" fontSize={11} />
      <Box x={395} y={90} w={70} h={40} text="Service Y" color="#34d399" fontSize={11} />
      <Box x={395} y={155} w={70} h={40} text="Service Z" color="#34d399" fontSize={11} />
      <line x1="60" y1="45" x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="60" y1="110" x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="60" y1="175" x2="175" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="110" x2="395" y2="45" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="110" x2="395" y2="110" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="110" x2="395" y2="175" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <AnimDot id="p01a" color="#60a5fa" dur="2.5s" begin="0s" />
      <AnimDot id="p01b" color="#60a5fa" dur="2.5s" begin="0.8s" />
      <AnimDot id="p01c" color="#60a5fa" dur="2.5s" begin="1.6s" />
      <AnimDot id="p01d" color="#34d399" dur="2.5s" begin="0.4s" />
      <AnimDot id="p01e" color="#34d399" dur="2.5s" begin="1.2s" />
      <AnimDot id="p01f" color="#34d399" dur="2.5s" begin="2.0s" />
    </svg>
  );
}

function Diagram02() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p02a" d="M80,110 L195,110" />
        <path id="p02b" d="M305,85 L420,45" />
        <path id="p02c" d="M305,110 L420,110" />
        <path id="p02d" d="M305,135 L420,175" />
      </defs>
      <Box x={10} y={85} w={70} h={50} text="Request" color="#60a5fa" fontSize={12} />
      <rect x={195} y={65} width={110} height={90} rx={10} fill="#6b3fa0" opacity="0.2" stroke="#6b3fa0" strokeWidth="2" />
      <text x={250} y={100} textAnchor="middle" fill="#a78bfa" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Gateway</text>
      <text x={250} y={117} textAnchor="middle" fill="#a78bfa" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">/ Broker</text>
      <text x={250} y={140} textAnchor="middle" fill="#a78bfa80" fontSize={9} fontFamily="'Source Code Pro', monospace">inspect → route</text>
      <Box x={400} y={25} w={70} h={40} text="/api/res" color="#c084fc" fontSize={11} />
      <Box x={400} y={90} w={70} h={40} text="/api/fuel" color="#c084fc" fontSize={11} />
      <Box x={400} y={155} w={70} h={40} text="/api/inv" color="#c084fc" fontSize={11} />
      <line x1="80" y1="110" x2="195" y2="110" stroke="#60a5fa" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="95" x2="400" y2="45" stroke="#c084fc" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="110" x2="400" y2="110" stroke="#c084fc" strokeWidth="1" opacity="0.3" />
      <line x1="305" y1="125" x2="400" y2="175" stroke="#c084fc" strokeWidth="1" opacity="0.3" />
      <AnimDot id="p02a" color="#60a5fa" dur="2s" begin="0s" />
      <AnimDot id="p02b" color="#c084fc" dur="1.8s" begin="1s" />
      <AnimDot id="p02c" color="#c084fc" dur="1.8s" begin="1.4s" />
      <AnimDot id="p02d" color="#c084fc" dur="1.8s" begin="1.8s" />
    </svg>
  );
}

function Diagram03() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p03a" d="M95,70 L195,70" />
        <path id="p03b" d="M275,70 L375,70" />
        <path id="p03c" d="M95,160 L195,160" />
        <path id="p03d" d="M275,160 L375,160" />
      </defs>
      <text x={240} y={25} textAnchor="middle" fill="#67e8f9" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600" opacity="0.7">Orchestrator manages state across steps</text>
      <Box x={20} y={48} w={75} h={44} text="Step 1" color="#22d3ee" fontSize={12} />
      <Box x={195} y={48} w={75} h={44} text="Step 2" color="#22d3ee" fontSize={12} />
      <Box x={375} y={48} w={75} h={44} text="Step 3" color="#22d3ee" fontSize={12} />
      <line x1="95" y1="70" x2="195" y2="70" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <line x1="270" y1="70" x2="375" y2="70" stroke="#22d3ee" strokeWidth="1" opacity="0.3" />
      <polygon points="190,65 200,70 190,75" fill="#22d3ee" opacity="0.5" />
      <polygon points="370,65 380,70 370,75" fill="#22d3ee" opacity="0.5" />
      <text x={240} y={115} textAnchor="middle" fill="#9ca3af" fontSize={10} fontFamily="'Source Code Pro', monospace">state: idle → running → complete</text>
      <rect x={140} y={130} width={200} height={50} rx={8} fill="#0077a8" opacity="0.15" stroke="#0077a8" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x={240} y={155} textAnchor="middle" fill="#67e8f9" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">State Machine</text>
      <text x={240} y={170} textAnchor="middle" fill="#67e8f980" fontSize={10} fontFamily="'Source Code Pro', monospace">tracks + retries</text>
      <line x1="95" y1="155" x2="140" y2="155" stroke="#67e8f9" strokeWidth="1" opacity="0.2" />
      <line x1="340" y1="155" x2="400" y2="155" stroke="#67e8f9" strokeWidth="1" opacity="0.2" />
      <AnimDot id="p03a" color="#22d3ee" dur="2s" begin="0s" />
      <AnimDot id="p03b" color="#22d3ee" dur="2s" begin="1s" />
    </svg>
  );
}

function Diagram04() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p04fwd" d="M50,55 L155,55 L260,55 L370,55" />
        <path id="p04rev" d="M370,165 L260,165 L155,165 L50,165" />
      </defs>
      <text x={240} y={25} textAnchor="middle" fill="#fca5a5" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600" opacity="0.7">Forward steps → then compensate on failure ←</text>
      <Box x={20} y={35} w={70} h={40} text="Create" color="#34d399" fontSize={12} />
      <Box x={130} y={35} w={70} h={40} text="Charge" color="#34d399" fontSize={12} />
      <Box x={240} y={35} w={70} h={40} text="Ship" color="#34d399" fontSize={12} />
      <rect x={345} y={35} width={70} height={40} rx={8} fill="#ef444420" stroke="#ef4444" strokeWidth="1.5" />
      <text x={380} y={55} textAnchor="middle" dominantBaseline="central" fill="#ef4444" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">FAIL ✕</text>
      <polygon points="100,50 110,55 100,60" fill="#34d399" opacity="0.5" />
      <polygon points="210,50 220,55 210,60" fill="#34d399" opacity="0.5" />
      <polygon points="320,50 330,55 320,60" fill="#34d399" opacity="0.5" />
      <line x1="90" y1="55" x2="130" y2="55" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="200" y1="55" x2="240" y2="55" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="310" y1="55" x2="345" y2="55" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <text x={240} y={110} textAnchor="middle" fill="#9ca3af" fontSize={20}>↓ f⁻¹(x) ↓</text>
      <Box x={20} y={145} w={70} h={40} text="Undo" color="#f87171" fontSize={12} />
      <Box x={130} y={145} w={70} h={40} text="Refund" color="#f87171" fontSize={12} />
      <Box x={240} y={145} w={70} h={40} text="Cancel" color="#f87171" fontSize={12} />
      <polygon points="130,160 120,165 130,170" fill="#f87171" opacity="0.5" />
      <polygon points="240,160 230,165 240,170" fill="#f87171" opacity="0.5" />
      <polygon points="345,160 335,165 345,170" fill="#f87171" opacity="0.5" />
      <line x1="130" y1="165" x2="90" y2="165" stroke="#f87171" strokeWidth="1" opacity="0.3" />
      <line x1="240" y1="165" x2="200" y2="165" stroke="#f87171" strokeWidth="1" opacity="0.3" />
      <line x1="345" y1="165" x2="310" y2="165" stroke="#f87171" strokeWidth="1" opacity="0.3" />
      <AnimDot id="p04fwd" color="#34d399" dur="3s" begin="0s" />
      <AnimDot id="p04rev" color="#f87171" dur="3s" begin="1.5s" />
    </svg>
  );
}

function Diagram05() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p05a" d="M90,110 L195,110" />
        <path id="p05b" d="M285,80 L400,40" />
        <path id="p05c" d="M285,110 L400,110" />
        <path id="p05d" d="M285,140 L400,180" />
      </defs>
      <Box x={15} y={85} w={75} h={50} text="Publisher" color="#34d399" fontSize={12} />
      <rect x={195} y={75} width={90} height={70} rx={10} fill="#1a8a6a" opacity="0.2" stroke="#1a8a6a" strokeWidth="2" />
      <text x={240} y={105} textAnchor="middle" fill="#6ee7b7" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Event Bus</text>
      <text x={240} y={122} textAnchor="middle" fill="#6ee7b780" fontSize={10} fontFamily="'Source Code Pro', monospace">pub/sub</text>
      <Box x={390} y={20} w={80} h={40} text="Sub A ✓" color="#6ee7b7" fontSize={11} />
      <Box x={390} y={90} w={80} h={40} text="Sub B ✓" color="#6ee7b7" fontSize={11} />
      <Box x={390} y={160} w={80} h={40} text="Sub C ✓" color="#6ee7b7" fontSize={11} />
      <line x1="90" y1="110" x2="195" y2="110" stroke="#34d399" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="90" x2="390" y2="40" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="110" x2="390" y2="110" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <line x1="285" y1="130" x2="390" y2="180" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <AnimDot id="p05a" color="#34d399" dur="2s" begin="0s" />
      <AnimDot id="p05b" color="#6ee7b7" dur="1.5s" begin="1s" />
      <AnimDot id="p05c" color="#6ee7b7" dur="1.5s" begin="1.3s" />
      <AnimDot id="p05d" color="#6ee7b7" dur="1.5s" begin="1.6s" />
    </svg>
  );
}

function Diagram06() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p06loop" d="M150,110 C150,40 330,40 330,110 C330,180 150,180 150,110" />
      </defs>
      <rect x={65} y={55} width={100} height={50} rx={25} fill="#22c55e20" stroke="#22c55e" strokeWidth="2" />
      <text x={115} y={80} textAnchor="middle" dominantBaseline="central" fill="#4ade80" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">CLOSED</text>
      <text x={115} y={120} textAnchor="middle" fill="#4ade8080" fontSize={10} fontFamily="'Source Code Pro', monospace">requests flow</text>
      <rect x={190} y={55} width={100} height={50} rx={25} fill="#ef444420" stroke="#ef4444" strokeWidth="2" />
      <text x={240} y={80} textAnchor="middle" dominantBaseline="central" fill="#f87171" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">OPEN</text>
      <text x={240} y={120} textAnchor="middle" fill="#f8717180" fontSize={10} fontFamily="'Source Code Pro', monospace">fail fast</text>
      <rect x={315} y={55} width={100} height={50} rx={25} fill="#f59e0b20" stroke="#f59e0b" strokeWidth="2" />
      <text x={365} y={80} textAnchor="middle" dominantBaseline="central" fill="#fbbf24" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">HALF-OPEN</text>
      <text x={365} y={120} textAnchor="middle" fill="#fbbf2480" fontSize={10} fontFamily="'Source Code Pro', monospace">test probe</text>
      <line x1="165" y1="68" x2="190" y2="68" stroke="#9ca3af" strokeWidth="1" opacity="0.4" />
      <polygon points="186,64 194,68 186,72" fill="#9ca3af" opacity="0.4" />
      <text x={178} y={60} textAnchor="middle" fill="#9ca3af" fontSize={8} fontFamily="'Source Code Pro', monospace">threshold</text>
      <line x1="290" y1="80" x2="315" y2="80" stroke="#9ca3af" strokeWidth="1" opacity="0.4" />
      <polygon points="311,76 319,80 311,84" fill="#9ca3af" opacity="0.4" />
      <text x={303} y={72} textAnchor="middle" fill="#9ca3af" fontSize={8} fontFamily="'Source Code Pro', monospace">timeout</text>
      <path d="M365,105 C365,175 115,175 115,105" stroke="#4ade80" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4,3" />
      <text x={240} y={175} textAnchor="middle" fill="#4ade8080" fontSize={9} fontFamily="'Source Code Pro', monospace">success → back to closed</text>
      <path d="M365,55 C365,10 240,10 240,55" stroke="#f87171" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4,3" />
      <text x={303} y={20} textAnchor="middle" fill="#f8717180" fontSize={9} fontFamily="'Source Code Pro', monospace">fail → reopen</text>
      <AnimDot id="p06loop" color="#fbbf24" dur="4s" begin="0s" />
    </svg>
  );
}

function Diagram07() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p07hit" d="M105,80 L220,80" />
        <path id="p07miss" d="M105,170 L220,170" />
        <path id="p07db" d="M320,170 L420,170" />
        <path id="p07fill" d="M420,155 C440,120 350,80 320,80" />
      </defs>
      <Box x={15} y={55} w={90} h={50} text="App Request" color="#60a5fa" fontSize={12} />
      <rect x={220} y={50} width={100} height={60} rx={10} fill="#3a7d44" opacity="0.2" stroke="#3a7d44" strokeWidth="2" />
      <text x={270} y={77} textAnchor="middle" fill="#4ade80" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Cache</text>
      <text x={270} y={95} textAnchor="middle" fill="#4ade8080" fontSize={10} fontFamily="'Source Code Pro', monospace">Redis / Memory</text>
      <text x={170} y={70} textAnchor="middle" fill="#4ade80" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600">HIT ✓</text>
      <line x1="105" y1="80" x2="220" y2="80" stroke="#4ade80" strokeWidth="1.5" opacity="0.4" />
      <polygon points="215,75 225,80 215,85" fill="#4ade80" opacity="0.5" />
      <text x={170} y={160} textAnchor="middle" fill="#f87171" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600">MISS ✕</text>
      <line x1="105" y1="170" x2="220" y2="170" stroke="#f87171" strokeWidth="1" opacity="0.3" strokeDasharray="5,3" />
      <line x1="320" y1="170" x2="410" y2="170" stroke="#f87171" strokeWidth="1" opacity="0.3" />
      <polygon points="405,165 415,170 405,175" fill="#f87171" opacity="0.4" />
      <rect x={410} y={140} width={60} height={55} rx={8} fill="#60a5fa" opacity="0.1" stroke="#60a5fa" strokeWidth="1.5" />
      <text x={440} y={165} textAnchor="middle" fill="#60a5fa" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">DB</text>
      <text x={440} y={180} textAnchor="middle" fill="#60a5fa80" fontSize={9} fontFamily="'Source Code Pro', monospace">source</text>
      <path d="M420,140 C430,110 340,80 320,80" stroke="#fbbf24" strokeWidth="1" opacity="0.3" fill="none" strokeDasharray="4,3" />
      <text x={385} y={105} textAnchor="middle" fill="#fbbf2480" fontSize={9} fontFamily="'Source Code Pro', monospace">fill cache</text>
      <AnimDot id="p07hit" color="#4ade80" dur="2s" begin="0s" />
      <AnimDot id="p07miss" color="#f87171" dur="2s" begin="1s" />
      <AnimDot id="p07db" color="#f87171" dur="1.5s" begin="2s" />
      <AnimDot id="p07fill" color="#fbbf24" dur="1.5s" begin="2.5s" />
    </svg>
  );
}

function Diagram08() {
  const nodes = [
    { x: 140, y: 40, label: "N1" },
    { x: 340, y: 40, label: "N2" },
    { x: 80, y: 160, label: "N3" },
    { x: 240, y: 180, label: "N4" },
    { x: 400, y: 160, label: "N5" },
  ];
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p08v1" d="M140,60 L240,100" />
        <path id="p08v2" d="M340,60 L240,100" />
        <path id="p08v3" d="M100,160 L240,100" />
        <path id="p08v4" d="M240,160 L240,100" />
        <path id="p08v5" d="M380,160 L240,100" />
      </defs>
      {nodes.map((n, i) => (
        <g key={i}>
          <line x1={n.x} y1={n.y + 20} x2={240} y2={100} stroke="#a78bfa" strokeWidth="1" opacity="0.2" />
          <circle cx={n.x} cy={n.y + 15} r={20} fill="#6b4fa020" stroke="#8b68b8" strokeWidth="1.5" />
          <text x={n.x} y={n.y + 19} textAnchor="middle" fill="#c4b5fd" fontSize={12} fontFamily="'Source Code Pro', monospace" fontWeight="600">{n.label}</text>
        </g>
      ))}
      <circle cx={240} cy={100} r={28} fill="#fbbf2420" stroke="#f59e0b" strokeWidth="2" />
      <text x={240} y={96} textAnchor="middle" fill="#fbbf24" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">LEADER</text>
      <text x={240} y={110} textAnchor="middle" fill="#fbbf24" fontSize={14}>👑</text>
      <text x={240} y={15} textAnchor="middle" fill="#9ca3af" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.6">votes converge → consensus on leader</text>
      <AnimDot id="p08v1" color="#a78bfa" dur="2s" begin="0s" />
      <AnimDot id="p08v2" color="#a78bfa" dur="2s" begin="0.4s" />
      <AnimDot id="p08v3" color="#a78bfa" dur="2s" begin="0.8s" />
      <AnimDot id="p08v4" color="#a78bfa" dur="2s" begin="1.2s" />
      <AnimDot id="p08v5" color="#a78bfa" dur="2s" begin="1.6s" />
    </svg>
  );
}

function Diagram09() {
  const ringR = 80;
  const cx = 240, cy = 115;
  const nodeAngles = [0, 72, 144, 216, 288];
  const nodeLabels = ["N0", "N1", "N2", "N3", "N4"];
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p09ring" d={`M${cx + ringR},${cy} A${ringR},${ringR} 0 1,1 ${cx + ringR - 0.01},${cy + 0.01}`} />
      </defs>
      <circle cx={cx} cy={cy} r={ringR} fill="none" stroke="#c4558044" strokeWidth="2" strokeDasharray="6,4" />
      {nodeAngles.map((a, i) => {
        const rad = (a - 90) * Math.PI / 180;
        const nx = cx + ringR * Math.cos(rad);
        const ny = cy + ringR * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={nx} cy={ny} r={16} fill="#a63d6a20" stroke="#c45580" strokeWidth="1.5" />
            <text x={nx} y={ny + 4} textAnchor="middle" fill="#f9a8d4" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600">{nodeLabels[i]}</text>
          </g>
        );
      })}
      <text x={cx} y={cy - 5} textAnchor="middle" fill="#f9a8d4" fontSize={11} fontFamily="'Source Sans 3', sans-serif" fontWeight="600">h(key)</text>
      <text x={cx} y={cy + 10} textAnchor="middle" fill="#f9a8d480" fontSize={10} fontFamily="'Source Code Pro', monospace">mod n</text>
      <text x={80} y={50} fill="#9ca3af" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.7">key → hash →</text>
      <text x={80} y={65} fill="#9ca3af" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.7">nearest node</text>
      <line x1="130" y1="55" x2={cx + ringR * Math.cos((-90) * Math.PI / 180) - 16} y2={cy + ringR * Math.sin((-90) * Math.PI / 180)} stroke="#f9a8d4" strokeWidth="1" opacity="0.3" strokeDasharray="4,3" />
      <AnimDot id="p09ring" color="#f9a8d4" dur="5s" begin="0s" />
    </svg>
  );
}

function Diagram10() {
  const nodes = [
    { x: 60, y: 50 }, { x: 180, y: 30 }, { x: 300, y: 50 }, { x: 420, y: 40 },
    { x: 120, y: 130 }, { x: 240, y: 150 }, { x: 360, y: 130 },
    { x: 180, y: 200 }, { x: 300, y: 200 },
  ];
  const edges = [[0,1],[1,2],[2,3],[0,4],[1,4],[1,5],[2,5],[2,6],[3,6],[4,5],[4,7],[5,7],[5,8],[5,6],[6,8]];
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p10a" d={`M${nodes[0].x},${nodes[0].y} L${nodes[1].x},${nodes[1].y} L${nodes[2].x},${nodes[2].y} L${nodes[3].x},${nodes[3].y}`} />
        <path id="p10b" d={`M${nodes[0].x},${nodes[0].y} L${nodes[4].x},${nodes[4].y} L${nodes[5].x},${nodes[5].y} L${nodes[8].x},${nodes[8].y}`} />
        <path id="p10c" d={`M${nodes[0].x},${nodes[0].y} L${nodes[4].x},${nodes[4].y} L${nodes[7].x},${nodes[7].y}`} />
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#3b82c4" strokeWidth="1" opacity="0.15" />
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={i === 0 ? 14 : 10} fill={i === 0 ? "#3b82f620" : "#2b6cb015"} stroke={i === 0 ? "#60a5fa" : "#3b82c4"} strokeWidth={i === 0 ? 2 : 1} />
          {i === 0 && <text x={n.x} y={n.y + 4} textAnchor="middle" fill="#60a5fa" fontSize={9} fontFamily="'Source Code Pro', monospace" fontWeight="700">SRC</text>}
        </g>
      ))}
      <text x={240} y={16} textAnchor="middle" fill="#93c5fd" fontSize={10} fontFamily="'Source Code Pro', monospace" opacity="0.7">hop-by-hop propagation (BFS / gossip)</text>
      <AnimDot id="p10a" color="#60a5fa" dur="3s" begin="0s" />
      <AnimDot id="p10b" color="#60a5fa" dur="3.5s" begin="0.5s" />
      <AnimDot id="p10c" color="#60a5fa" dur="2.5s" begin="1s" />
    </svg>
  );
}

function Diagram11() {
  return (
    <svg viewBox="0 0 480 220" width="100%" height="100%">
      <defs>
        <path id="p11a" d="M95,60 L385,60" />
        <path id="p11b" d="M385,100 L95,100" />
        <path id="p11s" d="M95,175 L385,175" />
      </defs>
      <rect x={20} y={30} width={75} height={60} rx={10} fill="#60a5fa15" stroke="#60a5fa" strokeWidth="1.5" />
      <text x={58} y={55} textAnchor="middle" fill="#93c5fd" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Alice</text>
      <text x={58} y={72} textAnchor="middle" fill="#93c5fd80" fontSize={10} fontFamily="'Source Code Pro', monospace">secret: a</text>
      <rect x={385} y={30} width={75} height={60} rx={10} fill="#34d39915" stroke="#34d399" strokeWidth="1.5" />
      <text x={423} y={55} textAnchor="middle" fill="#6ee7b7" fontSize={13} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">Bob</text>
      <text x={423} y={72} textAnchor="middle" fill="#6ee7b780" fontSize={10} fontFamily="'Source Code Pro', monospace">secret: b</text>
      <line x1="95" y1="60" x2="385" y2="60" stroke="#93c5fd" strokeWidth="1" opacity="0.3" />
      <text x={240} y={52} textAnchor="middle" fill="#93c5fd" fontSize={10} fontFamily="'Source Code Pro', monospace" fontWeight="500">g^a mod p →</text>
      <line x1="385" y1="100" x2="95" y2="100" stroke="#6ee7b7" strokeWidth="1" opacity="0.3" />
      <text x={240} y={92} textAnchor="middle" fill="#6ee7b7" fontSize={10} fontFamily="'Source Code Pro', monospace" fontWeight="500">← g^b mod p</text>
      <text x={240} y={135} textAnchor="middle" fill="#fbbf24" fontSize={11} fontFamily="'Source Code Pro', monospace" fontWeight="600">Both compute: g^(ab) mod p</text>
      <rect x={145} y={155} width={190} height={40} rx={8} fill="#f59e0b15" stroke="#f59e0b" strokeWidth="1.5" />
      <text x={240} y={178} textAnchor="middle" fill="#fbbf24" fontSize={12} fontFamily="'Source Sans 3', sans-serif" fontWeight="700">🔐 Shared Secret Established</text>
      <AnimDot id="p11a" color="#93c5fd" dur="2.5s" begin="0s" />
      <AnimDot id="p11b" color="#6ee7b7" dur="2.5s" begin="1.2s" />
      <circle r="4" fill="#fbbf24" opacity="0.8">
        <animateMotion dur="2s" repeatCount="indefinite" begin="2.5s">
          <mpath href="#p11s" />
        </animateMotion>
      </circle>
    </svg>
  );
}

const diagrams = [null, Diagram01, Diagram02, Diagram03, Diagram04, Diagram05, Diagram06, Diagram07, Diagram08, Diagram09, Diagram10, Diagram11, null];

/* ---- Slide Components ---- */

function TitleSlide({ slide }) {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
        backgroundSize: "48px 48px" }} />
      <div style={{ position: "absolute", top: -200, right: -200, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(59,130,246,.08),transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -150, left: -150, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.06),transparent 70%)" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 72px" }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 16, color: "#60a5fa", letterSpacing: 5, textTransform: "uppercase", marginBottom: 40, fontWeight: 500 }}>Software Architecture Series</div>
        <h1 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 82, fontWeight: 900, color: "#f9fafb", lineHeight: 1.1, margin: "0 0 24px" }}>{slide.title}</h1>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", margin: "0 0 32px" }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>
        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 30, color: "#d1d5db", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.45 }}>{slide.subtitle}</p>
        <p style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 18, color: "#60a5fa", margin: "40px 0 0", fontWeight: 400, letterSpacing: 1.5 }}>{slide.tagline}</p>
        <div style={{ marginTop: 72, borderTop: "1px solid #374151", paddingTop: 32 }}>
          <div style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, color: "#f3f4f6", fontWeight: 700 }}>{slide.author}</div>
          <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, color: "#9ca3af", fontWeight: 400, marginTop: 8 }}>{slide.credentials}</div>
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
      <div style={{ position: "absolute", inset: 0, opacity: 0.02,
        backgroundImage: "linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)",
        backgroundSize: "48px 48px" }} />

      {/* Top: number + insight */}
      <div style={{ display: "flex", alignItems: "flex-start", padding: "28px 40px 0", position: "relative", zIndex: 1, gap: 14 }}>
        <div style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 44, fontWeight: 900, color: slide.infraColor, opacity: 0.25, lineHeight: 1, minWidth: 60 }}>{slide.number}</div>
        <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 16, color: "#d1d5db", fontWeight: 400, fontStyle: "italic", lineHeight: 1.4, paddingTop: 6 }}>"{slide.coreInsight}"</div>
      </div>

      {/* Side by side cards */}
      <div style={{ display: "flex", gap: 20, padding: "16px 40px 12px", position: "relative", zIndex: 1 }}>
        {/* Left - Infrastructure */}
        <div style={{ flex: 1, background: "#1f2937", borderRadius: 14, borderTop: `3px solid ${slide.infraColor}`, padding: "20px 22px" }}>
          <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 10, color: slide.infraColor, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Infrastructure</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{slide.infraIcon}</span>
            <h2 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, fontWeight: 700, color: "#f3f4f6", margin: 0, lineHeight: 1.2 }}>{slide.infraTitle}</h2>
          </div>
          <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 11.5, color: slide.infraColor, fontWeight: 500, lineHeight: 1.4, opacity: 0.85 }}>{slide.infraExamples}</div>
        </div>

        {/* Connector */}
        <div style={{ display: "flex", alignItems: "center", width: 36 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1f2937", border: "1.5px solid #374151", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#9ca3af", fontFamily: "'Source Code Pro',monospace", fontWeight: 600 }}>↔</div>
        </div>

        {/* Right - Application */}
        <div style={{ flex: 1, background: "#1f2937", borderRadius: 14, borderTop: `3px solid ${slide.appColor}`, padding: "20px 22px" }}>
          <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 10, color: slide.appColor, letterSpacing: 3, textTransform: "uppercase", marginBottom: 10, fontWeight: 600 }}>Application</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 28 }}>{slide.appIcon}</span>
            <h2 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 22, fontWeight: 700, color: "#f3f4f6", margin: 0, lineHeight: 1.2 }}>{slide.appTitle}</h2>
          </div>
          <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 11.5, color: slide.appColor, fontWeight: 500, lineHeight: 1.4, opacity: 0.85 }}>{slide.appExamples}</div>
        </div>
      </div>

      {/* Animated Diagram */}
      <div style={{
        flex: 1, margin: "0 40px", position: "relative", zIndex: 1,
        background: "#0d1117", borderRadius: 14, border: "1px solid #1f2937",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "10px 20px", minHeight: 0,
      }}>
        {DiagramComponent && <DiagramComponent />}
      </div>

      {/* Math Foundation */}
      <div style={{
        margin: "12px 40px 28px", padding: "14px 20px",
        background: "#1f2937", borderRadius: 10,
        borderLeft: "3px solid #f59e0b",
        display: "flex", alignItems: "center", gap: 14,
        position: "relative", zIndex: 1,
      }}>
        <div style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 9, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", fontWeight: 600, minWidth: 50 }}>Math</div>
        <div style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 15, color: "#e5e7eb", fontWeight: 500, lineHeight: 1.3 }}>{slide.mathFoundation}</div>
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
      <div style={{ position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px)",
        backgroundSize: "48px 48px" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 90px" }}>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 48 }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>
        <h1 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 68, fontWeight: 900, color: "#f9fafb", lineHeight: 1.15, margin: "0 0 32px", whiteSpace: "pre-line" }}>{slide.title}</h1>
        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 24, color: "#d1d5db", lineHeight: 1.55, margin: "0 0 56px", fontWeight: 400 }}>{slide.subtitle}</p>
        <div style={{ display: "inline-block", padding: "18px 44px", borderRadius: 8, background: "#3b82f6", fontFamily: "'Source Sans 3',sans-serif", fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: 0.3 }}>{slide.ctaText}</div>
        <div style={{ marginTop: 56 }}>
          <div style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 20, color: "#9ca3af", fontWeight: 700 }}>{slide.author}</div>
        </div>
      </div>
    </div>
  );
}

/* ---- Main ---- */
export default function LinkedInCarousel() {
  const [cur, setCur] = useState(0);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const u = () => {
      const sw = (window.innerWidth - 140) / 1080;
      const sh = (window.innerHeight - 180) / 1080;
      setScale(Math.min(sw, sh, 0.7));
    };
    u();
    window.addEventListener("resize", u);
    return () => window.removeEventListener("resize", u);
  }, []);

  const s = slides[cur];
  const render = (s, i) => {
    if (s.type === "title") return <TitleSlide slide={s} />;
    if (s.type === "cta") return <CTASlide slide={s} />;
    return <PatternSlide slide={s} index={i} />;
  };
  const color = (s) => s.type === "pattern" ? s.infraColor : "#3b82f6";

  return (
    <div style={{ minHeight: "100vh", background: "#0a0e17", display: "flex", flexDirection: "column", alignItems: "center", padding: "24px 0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500;600;700&display=swap');`}</style>

      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <h1 style={{ fontFamily: "'Merriweather',Georgia,serif", fontSize: 20, color: "#e5e7eb", fontWeight: 700, margin: "0 0 4px" }}>LinkedIn Carousel Preview</h1>
        <p style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, color: "#6b7280", margin: 0 }}>Slide {cur + 1} of {slides.length} — 1080 × 1080 px</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={() => setCur(Math.max(0, cur - 1))} disabled={cur === 0}
          style={{ width: 40, height: 40, borderRadius: 8, background: cur === 0 ? "#1f2937" : "#374151", border: "1px solid #4b5563", color: cur === 0 ? "#4b5563" : "#e5e7eb", fontSize: 18, cursor: cur === 0 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>‹</button>

        <div style={{ width: 1080 * scale, height: 1080 * scale, borderRadius: 8, overflow: "hidden", boxShadow: "0 16px 48px rgba(0,0,0,.4)", border: "1px solid #1f2937" }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: 1080, height: 1080 }}>
            {render(s, cur)}
          </div>
        </div>

        <button onClick={() => setCur(Math.min(slides.length - 1, cur + 1))} disabled={cur === slides.length - 1}
          style={{ width: 40, height: 40, borderRadius: 8, background: cur === slides.length - 1 ? "#1f2937" : "#374151", border: "1px solid #4b5563", color: cur === slides.length - 1 ? "#4b5563" : "#e5e7eb", fontSize: 18, cursor: cur === slides.length - 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>›</button>
      </div>

      <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 400 }}>
        {slides.map((sl, i) => (
          <button key={i} onClick={() => setCur(i)}
            style={{ width: i === cur ? 22 : 8, height: 8, borderRadius: 4, border: "none", background: i === cur ? color(sl) : "#374151", cursor: "pointer", transition: "all .25s ease" }} />
        ))}
      </div>

      {s.type === "pattern" && (
        <div style={{ textAlign: "center", padding: "8px 20px", borderRadius: 8, background: "#1f2937", border: "1px solid #374151" }}>
          <span style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 12, color: "#9ca3af" }}>#{s.number} </span>
          <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>{s.infraTitle}</span>
          <span style={{ fontFamily: "'Source Code Pro',monospace", fontSize: 12, color: "#6b7280", margin: "0 6px" }}>↔</span>
          <span style={{ fontFamily: "'Source Sans 3',sans-serif", fontSize: 13, color: "#e5e7eb", fontWeight: 500 }}>{s.appTitle}</span>
        </div>
      )}
    </div>
  );
}
