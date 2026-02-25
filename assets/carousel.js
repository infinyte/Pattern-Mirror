// ============================================================================
// The Pattern Mirror — Vanilla JS Carousel
// Converted from pattern-carousel-v5.jsx — no React, no build step
// ============================================================================

const slides = [
  {
    type:"title", title:"The Pattern Mirror",
    subtitle:"Every Enterprise Pattern Has a Code-Level Twin",
    tagline:"Platform → Application → Pure Mathematics",
    author:"Kurt Mitchell",
    credentials:"Senior Software Engineer / Architect • 20 Years Enterprise Experience",
  },
  { type:"pattern", number:"01", infraTitle:"Reverse Proxy", infraExamples:"App Gateway, Nginx, Azure Front Door", infraIcon:"🛡️", appTitle:"Mediator Pattern", appExamples:"MediatR, Internal Event Bus", appIcon:"🔀", mathFoundation:"Betweenness Centrality — one node on the most shortest paths between all others", coreInsight:"Both place a single intermediary between many-to-many connections", infraColor:"#1e6b8a", appColor:"#2e7d5b" },
  { type:"pattern", number:"02", infraTitle:"API Gateway / Load Balancer", infraExamples:"Azure APIM, AWS ALB, Kong", infraIcon:"🔄", appTitle:"Broker Pattern", appExamples:"Message Router, Strategy Dispatch", appIcon:"📨", mathFoundation:"Weighted Distribution Functions — f(request) → destination, discrete probability over the stream", coreInsight:"Both inspect input properties and route each message to the correct destination", infraColor:"#6b3fa0", appColor:"#8b5bc4" },
  { type:"pattern", number:"03", infraTitle:"Service Bus / Event Grid", infraExamples:"Kafka, RabbitMQ, Azure Service Bus", infraIcon:"📡", appTitle:"Observer / Pub-Sub", appExamples:"EventHandler<T>, Rx, IObservable<T>", appIcon:"👁️", mathFoundation:"Set-Theoretic Relations — one event fans out to N subscriber subsets (unidirectional traceability)", coreInsight:"Both decouple event producers from consumers via subscription — publisher never knows who receives", infraColor:"#1a8a6a", appColor:"#24a67a" },
  { type:"pattern", number:"04", infraTitle:"Orchestrator", infraExamples:"Logic Apps, Step Functions, Durable Fn", infraIcon:"🎭", appTitle:"Coordinator / Pipeline", appExamples:"Workflow Engines, Stateful Handlers", appIcon:"⚙️", mathFoundation:"Finite State Machines / Directed Acyclic Graphs — centrally controlled state transitions", coreInsight:"Both manage stateful, multi-step processes with defined transitions and centralized control", infraColor:"#0077a8", appColor:"#0095b6" },
  { type:"pattern", number:"05", infraTitle:"Infrastructure as Code", infraExamples:"Terraform, ARM, Bicep, Pulumi", infraIcon:"🏗️", appTitle:"Saga Pattern", appExamples:"Compensating Transactions", appIcon:"🔁", mathFoundation:"Inverse Functions — f(x) applied forward, f⁻¹(x) reverses each step on failure", coreInsight:"Both solve: what happens when step N fails after steps 1..N-1 have already committed?", infraColor:"#b83340", appColor:"#d04e5a" },
  { type:"pattern", number:"06", infraTitle:"Strangler Fig", infraExamples:"Blue/Green Deploy, Canary, Traffic Shifting", infraIcon:"🌿", appTitle:"Adapter / Facade", appExamples:"Legacy Wrappers, Interface Bridges", appIcon:"🔧", mathFoundation:"Piecewise Monotonic Substitution — the set handled by new code only grows, never shrinks", coreInsight:"Both replace a running system incrementally — without ever stopping it to rewrite it", infraColor:"#2d7d4f", appColor:"#3a9e65" },
  { type:"pattern", number:"07", infraTitle:"Circuit Breaker", infraExamples:"Envoy, Istio, Health Probes", infraIcon:"⚡", appTitle:"Try-Catch / Retry + Backoff", appExamples:"Polly, Resilience4j, Retry Pipelines", appIcon:"🛡️", mathFoundation:"Finite Automaton / Geometric Progression — Closed → Open → Half-Open, exponential backoff", coreInsight:"Both protect systems from cascading failure through controlled fast-fail and recovery probes", infraColor:"#c27013", appColor:"#d98c2a" },
  { type:"pattern", number:"08", infraTitle:"CDN / Cache Layer", infraExamples:"Redis, Azure Cache, CloudFront", infraIcon:"💾", appTitle:"Cache-Aside / Memoization", appExamples:"IMemoryCache, Dictionary Lookup", appIcon:"🗂️", mathFoundation:"Space-Time Tradeoff / Bélády's Optimal Algorithm — trade memory for latency, everywhere", coreInsight:"Both answer: have I already computed this? If so, return it — don't do the work again.", infraColor:"#3a7d44", appColor:"#4a9e56" },
  { type:"pattern", number:"09", infraTitle:"Leader Election", infraExamples:"Raft, Paxos, ZooKeeper, etcd", infraIcon:"👑", appTitle:"Mutex / Monitor / Lock", appExamples:"lock{}, SemaphoreSlim, thread-sync primitives", appIcon:"🔒", mathFoundation:"Linearizability / CAP Theorem — mutual exclusion under partition, quorum or lease-based", coreInsight:"Who's in charge of this cluster? = Who owns this critical section? Same question, different scale.", infraColor:"#6b4fa0", appColor:"#8468b8" },
  { type:"pattern", number:"10", infraTitle:"Consistent Hashing", infraExamples:"Cassandra, DynamoDB, Redis Cluster", infraIcon:"🔗", appTitle:"HashMap / Dictionary", appExamples:"GetHashCode(), bucket allocation", appIcon:"📦", mathFoundation:"Modular Arithmetic / Ring Topology — h(key) mod n with minimal remapping on node change", coreInsight:"Both map a key to a location via h(k) mod n — one across machines, one across memory buckets", infraColor:"#a63d6a", appColor:"#c45580" },
  { type:"pattern", number:"11", infraTitle:"Service Mesh / Gossip", infraExamples:"Cassandra Gossip, Consul, Epidemic Protocols", infraIcon:"📶", appTitle:"Graph Traversal / BFS", appExamples:"BFS/DFS, Expander Graph Algorithms", appIcon:"🌐", mathFoundation:"Expander Graphs / Epidemic Spreading Models — O(log N) hops to reach all nodes", coreInsight:"Both propagate information through nodes without central coordination", infraColor:"#2b6cb0", appColor:"#3b82c4" },
  { type:"pattern", number:"12", infraTitle:"TLS / Diffie-Hellman", infraExamples:"mTLS, SSH, Zero Trust, VPN", infraIcon:"🔐", appTitle:"Key Exchange Strategy", appExamples:"ECDHE, DI of Cryptographic Providers", appIcon:"🤝", mathFoundation:"Modular Exponentiation / Discrete Logarithm Problem — (gᵃ)ᵇ = (gᵇ)ᵃ = gᵃᵇ mod p", coreInsight:"From algebraic one-way functions → every secure connection on earth. Same math, different layer.", infraColor:"#8b6914", appColor:"#a67e1e" },
  {
    type:"cta", title:"Same Problem.\nDifferent Layer.",
    subtitle:"Understanding this connection is the difference between implementing patterns and truly understanding architecture.",
    ctaText:"Follow for the deep-dive article →", author:"Kurt Mitchell",
  },
];

// ── SVG Diagram strings for each pattern ───────────────────────────────────

const diagrams = {
  "01": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs>
    <path id="p01a" d="M60,45  L175,110"/><path id="p01b" d="M60,110 L175,110"/>
    <path id="p01c" d="M60,175 L175,110"/><path id="p01d" d="M305,110 L395,45"/>
    <path id="p01e" d="M305,110 L395,110"/><path id="p01f" d="M305,110 L395,175"/>
  </defs>
  <rect x="5" y="25" width="55" height="40" rx="8" fill="#60a5fa" opacity=".15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="32" y="49" text-anchor="middle" fill="#60a5fa" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Client A</text>
  <rect x="5" y="90" width="55" height="40" rx="8" fill="#60a5fa" opacity=".15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="32" y="114" text-anchor="middle" fill="#60a5fa" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Client B</text>
  <rect x="5" y="155" width="55" height="40" rx="8" fill="#60a5fa" opacity=".15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="32" y="179" text-anchor="middle" fill="#60a5fa" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Client C</text>
  <rect x="175" y="80" width="130" height="60" rx="10" fill="#1e6b8a" opacity=".25" stroke="#1e6b8a" stroke-width="2"/>
  <text x="240" y="105" text-anchor="middle" fill="#5bb8d4" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Proxy / Mediator</text>
  <text x="240" y="122" text-anchor="middle" fill="#5bb8d480" font-size="10" font-family="'Source Code Pro',monospace">single intermediary</text>
  <rect x="395" y="25" width="78" height="40" rx="8" fill="#34d399" opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="434" y="49" text-anchor="middle" fill="#34d399" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Service X</text>
  <rect x="395" y="90" width="78" height="40" rx="8" fill="#34d399" opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="434" y="114" text-anchor="middle" fill="#34d399" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Service Y</text>
  <rect x="395" y="155" width="78" height="40" rx="8" fill="#34d399" opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="434" y="179" text-anchor="middle" fill="#34d399" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Service Z</text>
  <line x1="60" y1="45" x2="175" y2="110" stroke="#60a5fa" stroke-width="1" opacity=".2"/>
  <line x1="60" y1="110" x2="175" y2="110" stroke="#60a5fa" stroke-width="1" opacity=".2"/>
  <line x1="60" y1="175" x2="175" y2="110" stroke="#60a5fa" stroke-width="1" opacity=".2"/>
  <line x1="305" y1="110" x2="395" y2="45" stroke="#34d399" stroke-width="1" opacity=".2"/>
  <line x1="305" y1="110" x2="395" y2="110" stroke="#34d399" stroke-width="1" opacity=".2"/>
  <line x1="305" y1="110" x2="395" y2="175" stroke="#34d399" stroke-width="1" opacity=".2"/>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0s"><mpath href="#p01a"/></animateMotion></circle>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.6s"><mpath href="#p01b"/></animateMotion></circle>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1.2s"><mpath href="#p01c"/></animateMotion></circle>
  <circle r="5" fill="#34d399" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="0.9s"><mpath href="#p01d"/></animateMotion></circle>
  <circle r="5" fill="#34d399" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1.5s"><mpath href="#p01e"/></animateMotion></circle>
  <circle r="5" fill="#34d399" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="2.1s"><mpath href="#p01f"/></animateMotion></circle>
</svg>`,

  "02": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs><path id="p02a" d="M80,110 L195,110"/><path id="p02b" d="M305,85 L420,45"/><path id="p02c" d="M305,110 L420,110"/><path id="p02d" d="M305,135 L420,175"/></defs>
  <rect x="10" y="85" width="70" height="50" rx="8" fill="#60a5fa" opacity=".15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="45" y="114" text-anchor="middle" fill="#60a5fa" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="600">Request</text>
  <rect x="195" y="65" width="110" height="90" rx="10" fill="#6b3fa0" opacity=".2" stroke="#6b3fa0" stroke-width="2"/>
  <text x="250" y="100" text-anchor="middle" fill="#a78bfa" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Gateway</text>
  <text x="250" y="117" text-anchor="middle" fill="#a78bfa" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">/ Broker</text>
  <text x="250" y="140" text-anchor="middle" fill="#a78bfa80" font-size="9" font-family="'Source Code Pro',monospace">inspect → route</text>
  <rect x="400" y="25" width="70" height="40" rx="8" fill="#c084fc" opacity=".15" stroke="#c084fc" stroke-width="1.5"/>
  <text x="435" y="49" text-anchor="middle" fill="#c084fc" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">/api/res</text>
  <rect x="400" y="90" width="70" height="40" rx="8" fill="#c084fc" opacity=".15" stroke="#c084fc" stroke-width="1.5"/>
  <text x="435" y="114" text-anchor="middle" fill="#c084fc" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">/api/fuel</text>
  <rect x="400" y="155" width="70" height="40" rx="8" fill="#c084fc" opacity=".15" stroke="#c084fc" stroke-width="1.5"/>
  <text x="435" y="179" text-anchor="middle" fill="#c084fc" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">/api/inv</text>
  <line x1="80" y1="110" x2="195" y2="110" stroke="#60a5fa" stroke-width="1" opacity=".3"/>
  <line x1="305" y1="95" x2="400" y2="45" stroke="#c084fc" stroke-width="1" opacity=".3"/>
  <line x1="305" y1="110" x2="400" y2="110" stroke="#c084fc" stroke-width="1" opacity=".3"/>
  <line x1="305" y1="125" x2="400" y2="175" stroke="#c084fc" stroke-width="1" opacity=".3"/>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#p02a"/></animateMotion></circle>
  <circle r="5" fill="#c084fc" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1s"><mpath href="#p02b"/></animateMotion></circle>
  <circle r="5" fill="#c084fc" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1.4s"><mpath href="#p02c"/></animateMotion></circle>
  <circle r="5" fill="#c084fc" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="1.8s"><mpath href="#p02d"/></animateMotion></circle>
</svg>`,

  "03": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs><path id="p03a" d="M90,110 L195,110"/><path id="p03b" d="M285,80 L400,40"/><path id="p03c" d="M285,110 L400,110"/><path id="p03d" d="M285,140 L400,180"/></defs>
  <rect x="15" y="85" width="75" height="50" rx="8" fill="#34d399" opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="52" y="114" text-anchor="middle" fill="#34d399" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="600">Publisher</text>
  <rect x="195" y="75" width="90" height="70" rx="10" fill="#1a8a6a" opacity=".2" stroke="#1a8a6a" stroke-width="2"/>
  <text x="240" y="105" text-anchor="middle" fill="#6ee7b7" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Event Bus</text>
  <text x="240" y="122" text-anchor="middle" fill="#6ee7b780" font-size="10" font-family="'Source Code Pro',monospace">pub / sub</text>
  <rect x="390" y="20" width="80" height="40" rx="8" fill="#6ee7b7" opacity=".15" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="430" y="44" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Sub A ✓</text>
  <rect x="390" y="90" width="80" height="40" rx="8" fill="#6ee7b7" opacity=".15" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="430" y="114" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Sub B ✓</text>
  <rect x="390" y="160" width="80" height="40" rx="8" fill="#6ee7b7" opacity=".15" stroke="#6ee7b7" stroke-width="1.5"/>
  <text x="430" y="184" text-anchor="middle" fill="#6ee7b7" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Sub C ✓</text>
  <line x1="90" y1="110" x2="195" y2="110" stroke="#34d399" stroke-width="1" opacity=".3"/>
  <line x1="285" y1="90" x2="390" y2="40" stroke="#6ee7b7" stroke-width="1" opacity=".3"/>
  <line x1="285" y1="110" x2="390" y2="110" stroke="#6ee7b7" stroke-width="1" opacity=".3"/>
  <line x1="285" y1="130" x2="390" y2="180" stroke="#6ee7b7" stroke-width="1" opacity=".3"/>
  <circle r="5" fill="#34d399" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#p03a"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1s"><mpath href="#p03b"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1.3s"><mpath href="#p03c"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".9"><animateMotion dur="1.5s" repeatCount="indefinite" begin="1.6s"><mpath href="#p03d"/></animateMotion></circle>
</svg>`,

  "04": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <text x="240" y="14" text-anchor="middle" fill="#67e8f9" font-size="10" font-family="'Source Code Pro',monospace" font-weight="600" opacity=".7">Orchestrator dispatches commands — steps reply with acks</text>
  <rect x="30" y="25" width="90" height="45" rx="10" fill="#22d3ee" fill-opacity=".12" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="75" y="45" text-anchor="middle" fill="#22d3ee" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Reserve</text>
  <rect x="190" y="25" width="90" height="45" rx="10" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="235" y="45" text-anchor="middle" fill="#22d3ee" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Charge</text>
  <rect x="350" y="25" width="90" height="45" rx="10" fill="#22d3ee" fill-opacity=".08" stroke="#22d3ee" stroke-width="1.5"/>
  <text x="395" y="45" text-anchor="middle" fill="#22d3ee" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Notify</text>
  <line x1="75" y1="70" x2="75" y2="152" stroke="#22d3ee" stroke-width="1" opacity=".18" stroke-dasharray="4,3"/>
  <line x1="235" y1="70" x2="235" y2="152" stroke="#22d3ee" stroke-width="1" opacity=".18" stroke-dasharray="4,3"/>
  <line x1="395" y1="70" x2="395" y2="152" stroke="#22d3ee" stroke-width="1" opacity=".18" stroke-dasharray="4,3"/>
  <line x1="120" y1="47" x2="190" y2="47" stroke="#22d3ee" stroke-width="1" opacity=".2" stroke-dasharray="3,3"/>
  <polygon points="188,43 196,47 188,51" fill="#22d3ee" opacity=".25"/>
  <line x1="280" y1="47" x2="350" y2="47" stroke="#22d3ee" stroke-width="1" opacity=".2" stroke-dasharray="3,3"/>
  <polygon points="348,43 356,47 348,51" fill="#22d3ee" opacity=".25"/>
  <rect x="30" y="152" width="420" height="55" rx="12" fill="#0077a8" fill-opacity=".18" stroke="#0077a8" stroke-width="2"/>
  <text x="240" y="174" text-anchor="middle" fill="#67e8f9" font-size="14" font-family="'Source Sans 3',sans-serif" font-weight="700">ORCHESTRATOR</text>
  <text x="240" y="194" text-anchor="middle" fill="#67e8f9" font-size="11" font-family="'Source Code Pro',monospace" opacity=".7">centralized control</text>
  <text x="40" y="212" fill="#9ca3af" font-size="9" font-family="'Source Code Pro',monospace" opacity=".55">FSM: idle → step1 → step2 → step3 → complete</text>
</svg>`,

  "05": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <text x="240" y="14" text-anchor="middle" fill="#4ade80" font-size="11" font-family="'Source Code Pro',monospace" font-weight="700" opacity=".85">f(x) forward — f⁻¹(x) compensates on failure</text>
  <rect x="10" y="26" width="90" height="44" rx="8" fill="#34d399" fill-opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="55" y="46" text-anchor="middle" fill="#34d399" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Create</text>
  <text x="55" y="61" text-anchor="middle" fill="#34d399" font-size="10" font-family="'Source Code Pro',monospace">✓</text>
  <rect x="140" y="26" width="90" height="44" rx="8" fill="#34d399" fill-opacity=".15" stroke="#34d399" stroke-width="1.5"/>
  <text x="185" y="46" text-anchor="middle" fill="#34d399" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Charge</text>
  <text x="185" y="61" text-anchor="middle" fill="#34d399" font-size="10" font-family="'Source Code Pro',monospace">✓</text>
  <rect x="270" y="26" width="90" height="44" rx="8" fill="#34d399" fill-opacity=".1" stroke="#34d399" stroke-width="1.5"/>
  <text x="315" y="46" text-anchor="middle" fill="#34d399" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Ship</text>
  <rect x="390" y="26" width="70" height="44" rx="8" fill="#ef4444" fill-opacity=".15" stroke="#ef4444" stroke-width="1.5"/>
  <text x="425" y="46" text-anchor="middle" fill="#f87171" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">FAIL</text>
  <text x="425" y="61" text-anchor="middle" fill="#f8717180" font-size="10" font-family="'Source Code Pro',monospace">✕</text>
  <line x1="100" y1="48" x2="140" y2="48" stroke="#34d399" stroke-width="1" opacity=".25"/>
  <line x1="230" y1="48" x2="270" y2="48" stroke="#34d399" stroke-width="1" opacity=".25"/>
  <line x1="360" y1="48" x2="390" y2="48" stroke="#ef4444" stroke-width="1" opacity=".2" stroke-dasharray="4,3"/>
  <text x="240" y="112" text-anchor="middle" fill="#9ca3af" font-size="18" opacity=".6">← f⁻¹(x)</text>
  <rect x="10" y="146" width="90" height="44" rx="8" fill="#f87171" fill-opacity=".06" stroke="#f87171" stroke-width="1.5"/>
  <text x="55" y="170" text-anchor="middle" fill="#f87171" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Undo</text>
  <rect x="140" y="146" width="90" height="44" rx="8" fill="#fbbf24" fill-opacity=".15" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="185" y="170" text-anchor="middle" fill="#fbbf24" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Refund</text>
  <rect x="270" y="146" width="90" height="44" rx="8" fill="#fbbf24" fill-opacity=".15" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="315" y="170" text-anchor="middle" fill="#fbbf24" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Cancel</text>
  <line x1="270" y1="168" x2="230" y2="168" stroke="#f87171" stroke-width="1" opacity=".2"/>
  <line x1="140" y1="168" x2="100" y2="168" stroke="#f87171" stroke-width="1" opacity=".2"/>
</svg>`,

  "06": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <text x="240" y="18" text-anchor="middle" fill="#4ade80" font-size="10" font-family="'Source Code Pro',monospace" opacity=".7">monotonic substitution — new surface only grows</text>
  <defs><path id="p06req" d="M70,110 L190,110"/><path id="p06leg" d="M290,90 L400,50"/><path id="p06new1" d="M290,130 L400,170"/></defs>
  <rect x="5" y="85" width="65" height="50" rx="8" fill="#60a5fa" opacity=".15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="37" y="114" text-anchor="middle" fill="#60a5fa" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Request</text>
  <rect x="190" y="72" width="100" height="76" rx="10" fill="#2d7d4f" opacity=".2" stroke="#2d7d4f" stroke-width="2"/>
  <text x="240" y="102" text-anchor="middle" fill="#4ade80" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Strangler</text>
  <text x="240" y="118" text-anchor="middle" fill="#4ade80" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">Proxy</text>
  <text x="240" y="134" text-anchor="middle" fill="#4ade8080" font-size="9" font-family="'Source Code Pro',monospace">route → migrate</text>
  <rect x="400" y="25" width="72" height="50" rx="8" fill="#37415120" stroke="#6b7280" stroke-width="1.5" stroke-dasharray="5,3"/>
  <text x="436" y="47" text-anchor="middle" fill="#9ca3af" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="600">Legacy</text>
  <text x="436" y="62" text-anchor="middle" fill="#6b728080" font-size="9" font-family="'Source Code Pro',monospace">retiring</text>
  <rect x="400" y="145" width="72" height="50" rx="8" fill="#2d7d4f" opacity=".25" stroke="#4ade80" stroke-width="2"/>
  <text x="436" y="165" text-anchor="middle" fill="#4ade80" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">New</text>
  <text x="436" y="181" text-anchor="middle" fill="#4ade80" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">System</text>
  <line x1="70" y1="110" x2="190" y2="110" stroke="#60a5fa" stroke-width="1" opacity=".3"/>
  <line x1="290" y1="90" x2="400" y2="50" stroke="#6b7280" stroke-width="1" opacity=".3" stroke-dasharray="5,3"/>
  <line x1="290" y1="130" x2="400" y2="170" stroke="#4ade80" stroke-width="2" opacity=".45"/>
  <text x="348" y="63" text-anchor="middle" fill="#9ca3af" font-size="9" font-family="'Source Code Pro',monospace" opacity=".8">20%</text>
  <text x="348" y="163" text-anchor="middle" fill="#4ade80" font-size="10" font-family="'Source Code Pro',monospace" font-weight="600">80%</text>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0s"><mpath href="#p06req"/></animateMotion></circle>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="1.8s" repeatCount="indefinite" begin="0.9s"><mpath href="#p06req"/></animateMotion></circle>
  <circle r="5" fill="#9ca3af" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="1s"><mpath href="#p06leg"/></animateMotion></circle>
  <circle r="5" fill="#4ade80" opacity=".9"><animateMotion dur="1.6s" repeatCount="indefinite" begin="1s"><mpath href="#p06new1"/></animateMotion></circle>
  <circle r="5" fill="#4ade80" opacity=".9"><animateMotion dur="1.6s" repeatCount="indefinite" begin="2.2s"><mpath href="#p06new1"/></animateMotion></circle>
  <circle r="5" fill="#4ade80" opacity=".9"><animateMotion dur="1.6s" repeatCount="indefinite" begin="3.4s"><mpath href="#p06new1"/></animateMotion></circle>
</svg>`,

  "07": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <line x1="0" y1="80" x2="480" y2="80" stroke="#374151" stroke-width=".5" opacity=".4"/>
  <line x1="0" y1="152" x2="480" y2="152" stroke="#374151" stroke-width=".5" opacity=".4"/>
  <rect x="5" y="25" width="60" height="40" rx="8" fill="#4ade80" opacity=".15" stroke="#4ade80" stroke-width="1.5"/>
  <text x="35" y="49" text-anchor="middle" fill="#4ade80" font-size="10" font-family="'Source Sans 3',sans-serif" font-weight="600">Request</text>
  <rect x="130" y="23" width="110" height="44" rx="22" fill="#22c55e" fill-opacity=".15" stroke="#22c55e" stroke-width="2"/>
  <text x="185" y="43" text-anchor="middle" fill="#4ade80" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">CLOSED</text>
  <text x="185" y="61" text-anchor="middle" fill="#4ade8080" font-size="9" font-family="'Source Code Pro',monospace">requests flow</text>
  <line x1="240" y1="45" x2="295" y2="45" stroke="#4ade80" stroke-width="1.5" opacity=".4"/>
  <rect x="295" y="25" width="90" height="40" rx="8" fill="#4ade80" opacity=".15" stroke="#4ade80" stroke-width="1.5"/>
  <text x="340" y="49" text-anchor="middle" fill="#4ade80" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Service ✓</text>
  <rect x="5" y="95" width="60" height="40" rx="8" fill="#f87171" opacity=".15" stroke="#f87171" stroke-width="1.5"/>
  <text x="35" y="119" text-anchor="middle" fill="#f87171" font-size="10" font-family="'Source Sans 3',sans-serif" font-weight="600">Request</text>
  <rect x="130" y="93" width="110" height="44" rx="22" fill="#ef4444" fill-opacity=".15" stroke="#ef4444" stroke-width="2"/>
  <text x="185" y="113" text-anchor="middle" fill="#f87171" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">OPEN</text>
  <text x="185" y="131" text-anchor="middle" fill="#f8717180" font-size="9" font-family="'Source Code Pro',monospace">fail fast</text>
  <line x1="240" y1="115" x2="295" y2="115" stroke="#f87171" stroke-width="1.5" opacity=".4"/>
  <rect x="295" y="95" width="100" height="40" rx="8" fill="#ef4444" fill-opacity=".12" stroke="#ef4444" stroke-width="1.5"/>
  <text x="345" y="113" text-anchor="middle" fill="#f87171" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">✕</text>
  <text x="345" y="129" text-anchor="middle" fill="#f8717180" font-size="9" font-family="'Source Code Pro',monospace">fast fail</text>
  <rect x="5" y="163" width="120" height="44" rx="22" fill="#f59e0b" fill-opacity=".15" stroke="#f59e0b" stroke-width="2"/>
  <text x="65" y="183" text-anchor="middle" fill="#fbbf24" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">HALF-OPEN</text>
  <text x="65" y="201" text-anchor="middle" fill="#fbbf2480" font-size="9" font-family="'Source Code Pro',monospace">test probe</text>
  <line x1="125" y1="185" x2="220" y2="185" stroke="#fbbf24" stroke-width="1.5" opacity=".4"/>
  <rect x="220" y="165" width="80" height="40" rx="8" fill="#fbbf24" opacity=".15" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="260" y="189" text-anchor="middle" fill="#fbbf24" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">Service?</text>
  <path d="M295,175 C340,160 340,60 295,47" stroke="#4ade80" stroke-width="1.5" fill="none" opacity=".4" stroke-dasharray="4,3"/>
  <text x="355" y="110" text-anchor="middle" fill="#4ade8080" font-size="9" font-family="'Source Code Pro',monospace">success → CLOSED</text>
</svg>`,

  "08": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <text x="240" y="13" text-anchor="middle" fill="#4ade80" font-size="10" font-family="'Source Code Pro',monospace" font-weight="700" opacity=".9">Cache: check → hit? return → miss? compute, store, return</text>
  <rect x="10" y="82" width="75" height="56" rx="10" fill="#60a5fa" fill-opacity=".1" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="47" y="108" text-anchor="middle" fill="#93c5fd" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">App</text>
  <text x="47" y="126" text-anchor="middle" fill="#93c5fd80" font-size="9" font-family="'Source Code Pro',monospace">request</text>
  <rect x="185" y="70" width="110" height="80" rx="10" fill="#3a7d44" fill-opacity=".2" stroke="#3a7d44" stroke-width="2"/>
  <text x="240" y="100" text-anchor="middle" fill="#4ade80" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Cache</text>
  <text x="240" y="116" text-anchor="middle" fill="#4ade8080" font-size="10" font-family="'Source Code Pro',monospace">Redis / Memory</text>
  <line x1="85" y1="106" x2="185" y2="106" stroke="#4ade80" stroke-width="1.5" opacity=".3"/>
  <text x="134" y="98" text-anchor="middle" fill="#4ade80" font-size="9" font-family="'Source Code Pro',monospace" opacity=".7">hit →</text>
  <line x1="85" y1="118" x2="185" y2="118" stroke="#f87171" stroke-width="1" opacity=".25" stroke-dasharray="4,3"/>
  <text x="134" y="133" text-anchor="middle" fill="#f87171" font-size="9" font-family="'Source Code Pro',monospace" opacity=".6">miss →</text>
  <path d="M185,88 C145,58 100,58 85,88" stroke="#4ade80" stroke-width="1" fill="none" opacity=".25" stroke-dasharray="4,3"/>
  <text x="132" y="58" text-anchor="middle" fill="#4ade80" font-size="9" font-family="'Source Code Pro',monospace" opacity=".7">← return</text>
  <rect x="385" y="140" width="85" height="55" rx="10" fill="#60a5fa" fill-opacity=".08" stroke="#60a5fa" stroke-width="1"/>
  <text x="427" y="165" text-anchor="middle" fill="#93c5fd" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">DB</text>
  <text x="427" y="183" text-anchor="middle" fill="#93c5fd80" font-size="9" font-family="'Source Code Pro',monospace">origin</text>
  <path d="M295,120 C330,120 375,150 385,160" stroke="#f87171" stroke-width="1" fill="none" opacity=".25" stroke-dasharray="4,3"/>
  <path d="M385,148 C350,95 305,78 295,80" stroke="#fbbf24" stroke-width="1.5" fill="none" opacity=".35" stroke-dasharray="5,3"/>
  <text x="360" y="100" text-anchor="middle" fill="#fbbf24" font-size="9" font-family="'Source Code Pro',monospace" opacity=".7">fill cache</text>
</svg>`,

  "09": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs>
    <path id="p09v1" d="M140,60 L240,100"/><path id="p09v2" d="M340,60 L240,100"/>
    <path id="p09v3" d="M100,160 L240,100"/><path id="p09v4" d="M240,160 L240,100"/>
    <path id="p09v5" d="M380,160 L240,100"/>
  </defs>
  <text x="240" y="15" text-anchor="middle" fill="#9ca3af" font-size="10" font-family="'Source Code Pro',monospace" opacity=".6">votes converge → consensus on leader</text>
  <line x1="140" y1="55" x2="240" y2="100" stroke="#a78bfa" stroke-width="1" opacity=".2"/>
  <line x1="340" y1="55" x2="240" y2="100" stroke="#a78bfa" stroke-width="1" opacity=".2"/>
  <line x1="80" y1="175" x2="240" y2="100" stroke="#a78bfa" stroke-width="1" opacity=".2"/>
  <line x1="240" y1="175" x2="240" y2="100" stroke="#a78bfa" stroke-width="1" opacity=".2"/>
  <line x1="400" y1="175" x2="240" y2="100" stroke="#a78bfa" stroke-width="1" opacity=".2"/>
  <circle cx="140" cy="55" r="20" fill="#6b4fa020" stroke="#8b68b8" stroke-width="1.5"/>
  <text x="140" y="59" text-anchor="middle" fill="#c4b5fd" font-size="12" font-family="'Source Code Pro',monospace" font-weight="600">N1</text>
  <circle cx="340" cy="55" r="20" fill="#6b4fa020" stroke="#8b68b8" stroke-width="1.5"/>
  <text x="340" y="59" text-anchor="middle" fill="#c4b5fd" font-size="12" font-family="'Source Code Pro',monospace" font-weight="600">N2</text>
  <circle cx="80" cy="175" r="20" fill="#6b4fa020" stroke="#8b68b8" stroke-width="1.5"/>
  <text x="80" y="179" text-anchor="middle" fill="#c4b5fd" font-size="12" font-family="'Source Code Pro',monospace" font-weight="600">N3</text>
  <circle cx="240" cy="195" r="20" fill="#6b4fa020" stroke="#8b68b8" stroke-width="1.5"/>
  <text x="240" y="199" text-anchor="middle" fill="#c4b5fd" font-size="12" font-family="'Source Code Pro',monospace" font-weight="600">N4</text>
  <circle cx="400" cy="175" r="20" fill="#6b4fa020" stroke="#8b68b8" stroke-width="1.5"/>
  <text x="400" y="179" text-anchor="middle" fill="#c4b5fd" font-size="12" font-family="'Source Code Pro',monospace" font-weight="600">N5</text>
  <circle cx="240" cy="100" r="28" fill="#fbbf2420" stroke="#f59e0b" stroke-width="2"/>
  <text x="240" y="96" text-anchor="middle" fill="#fbbf24" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="700">LEADER</text>
  <text x="240" y="110" text-anchor="middle" fill="#fbbf24" font-size="14">👑</text>
  <circle r="5" fill="#a78bfa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="0s"><mpath href="#p09v1"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="0.4s"><mpath href="#p09v2"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="0.8s"><mpath href="#p09v3"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="1.2s"><mpath href="#p09v4"/></animateMotion></circle>
  <circle r="5" fill="#a78bfa" opacity=".9"><animateMotion dur="2s" repeatCount="indefinite" begin="1.6s"><mpath href="#p09v5"/></animateMotion></circle>
</svg>`,

  "10": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <text x="240" y="13" text-anchor="middle" fill="#f9a8d4" font-size="10" font-family="'Source Code Pro',monospace" opacity=".7">key → h(k) mod n → nearest node on ring</text>
  <circle cx="290" cy="118" r="78" fill="none" stroke="#c4558044" stroke-width="2" stroke-dasharray="6,4"/>
  <circle cx="290" cy="40" r="15" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="290" y="44" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Code Pro',monospace" font-weight="600">N0</text>
  <circle cx="364" cy="82" r="15" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="364" y="86" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Code Pro',monospace" font-weight="600">N1</text>
  <circle cx="338" cy="166" r="15" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="338" y="170" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Code Pro',monospace" font-weight="600">N2</text>
  <circle cx="242" cy="166" r="15" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="242" y="170" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Code Pro',monospace" font-weight="600">N3</text>
  <circle cx="216" cy="82" r="15" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="216" y="86" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Code Pro',monospace" font-weight="600">N4</text>
  <text x="290" y="114" text-anchor="middle" fill="#f9a8d4" font-size="11" font-family="'Source Sans 3',sans-serif" font-weight="600">h(key)</text>
  <text x="290" y="129" text-anchor="middle" fill="#f9a8d480" font-size="10" font-family="'Source Code Pro',monospace">mod n</text>
  <rect x="8" y="90" width="64" height="40" rx="8" fill="#a63d6a15" stroke="#c45580" stroke-width="1.5"/>
  <text x="40" y="107" text-anchor="middle" fill="#f9a8d4" font-size="12" font-family="'Source Code Pro',monospace" font-weight="700">k=42</text>
  <text x="40" y="123" text-anchor="middle" fill="#c4558080" font-size="9" font-family="'Source Code Pro',monospace">key</text>
</svg>`,

  "11": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs>
    <path id="p11a" d="M60,50 L180,30 L300,50 L420,40"/>
    <path id="p11b" d="M60,50 L120,130 L240,150 L300,200"/>
    <path id="p11c" d="M60,50 L120,130 L180,200"/>
  </defs>
  <text x="240" y="16" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="'Source Code Pro',monospace" opacity=".7">hop-by-hop propagation (BFS / gossip)</text>
  <line x1="60" y1="50" x2="180" y2="30" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="180" y1="30" x2="300" y2="50" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="300" y1="50" x2="420" y2="40" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="60" y1="50" x2="120" y2="130" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="180" y1="30" x2="120" y2="130" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="180" y1="30" x2="240" y2="150" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="300" y1="50" x2="240" y2="150" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="300" y1="50" x2="360" y2="130" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="420" y1="40" x2="360" y2="130" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="120" y1="130" x2="240" y2="150" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="120" y1="130" x2="180" y2="200" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="240" y1="150" x2="180" y2="200" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="240" y1="150" x2="300" y2="200" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="240" y1="150" x2="360" y2="130" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <line x1="360" y1="130" x2="300" y2="200" stroke="#3b82c4" stroke-width="1" opacity=".15"/>
  <circle cx="60" cy="50" r="14" fill="#3b82f620" stroke="#60a5fa" stroke-width="2"/>
  <text x="60" y="54" text-anchor="middle" fill="#60a5fa" font-size="9" font-family="'Source Code Pro',monospace" font-weight="700">SRC</text>
  <circle cx="180" cy="30" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="300" cy="50" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="420" cy="40" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="120" cy="130" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="240" cy="150" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="360" cy="130" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="180" cy="200" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle cx="300" cy="200" r="10" fill="#2b6cb015" stroke="#3b82c4" stroke-width="1"/>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="3s" repeatCount="indefinite" begin="0s"><mpath href="#p11a"/></animateMotion></circle>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="3.5s" repeatCount="indefinite" begin="0.5s"><mpath href="#p11b"/></animateMotion></circle>
  <circle r="5" fill="#60a5fa" opacity=".9"><animateMotion dur="2.5s" repeatCount="indefinite" begin="1s"><mpath href="#p11c"/></animateMotion></circle>
</svg>`,

  "12": `<svg viewBox="0 0 480 220" width="100%" height="100%">
  <defs>
    <path id="p12atb" d="M95,70 L385,70"/>
    <path id="p12bta" d="M385,90 L95,90"/>
    <path id="p12ch1" d="M80,170 L420,170"/>
    <path id="p12ch2" d="M420,190 L80,190"/>
  </defs>
  <text x="240" y="13" text-anchor="middle" fill="#93c5fd" font-size="10" font-family="'Source Code Pro',monospace" font-weight="700" opacity=".85">Key Exchange → Secure Channel</text>
  <rect x="15" y="50" width="80" height="60" rx="10" fill="#60a5fa15" stroke="#60a5fa" stroke-width="1.5"/>
  <text x="55" y="74" text-anchor="middle" fill="#93c5fd" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Alice</text>
  <text x="55" y="92" text-anchor="middle" fill="#93c5fd80" font-size="10" font-family="'Source Code Pro',monospace">secret: a</text>
  <rect x="385" y="50" width="80" height="60" rx="10" fill="#34d39915" stroke="#34d399" stroke-width="1.5"/>
  <text x="425" y="74" text-anchor="middle" fill="#6ee7b7" font-size="13" font-family="'Source Sans 3',sans-serif" font-weight="700">Bob</text>
  <text x="425" y="92" text-anchor="middle" fill="#6ee7b780" font-size="10" font-family="'Source Code Pro',monospace">secret: b</text>
  <line x1="95" y1="70" x2="385" y2="70" stroke="#93c5fd" stroke-width="1" opacity=".25"/>
  <text x="240" y="62" text-anchor="middle" fill="#93c5fd" font-size="9" font-family="'Source Code Pro',monospace" opacity=".8">gᵃ mod p →</text>
  <line x1="385" y1="90" x2="95" y2="90" stroke="#6ee7b7" stroke-width="1" opacity=".25"/>
  <text x="240" y="103" text-anchor="middle" fill="#6ee7b7" font-size="9" font-family="'Source Code Pro',monospace" opacity=".8">← gᵇ mod p</text>
  <rect x="145" y="120" width="190" height="38" rx="8" fill="#4ade8015" stroke="#4ade80" stroke-width="1.5"/>
  <text x="240" y="142" text-anchor="middle" fill="#4ade80" font-size="12" font-family="'Source Sans 3',sans-serif" font-weight="700">🔐 gᵃᵇ mod p = Shared Secret</text>
  <rect x="80" y="160" width="340" height="40" rx="8" fill="#1a2e1a" stroke="#4ade80" stroke-width="1.5" opacity=".7"/>
  <text x="88" y="173" fill="#4ade80" font-size="8" font-family="'Source Code Pro',monospace" opacity=".6">Alice → Bob</text>
  <text x="88" y="195" fill="#6ee7b7" font-size="8" font-family="'Source Code Pro',monospace" opacity=".6">Bob → Alice</text>
  <circle r="5" fill="#93c5fd" opacity=".9"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0s"><mpath href="#p12atb"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".9"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0.5s"><mpath href="#p12bta"/></animateMotion></circle>
  <circle r="5" fill="#4ade80" opacity=".9"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0s"><mpath href="#p12ch1"/></animateMotion></circle>
  <circle r="5" fill="#4ade80" opacity=".7"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0.7s"><mpath href="#p12ch1"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".9"><animateMotion dur="1.4s" repeatCount="indefinite" begin="0.3s"><mpath href="#p12ch2"/></animateMotion></circle>
  <circle r="5" fill="#6ee7b7" opacity=".7"><animateMotion dur="1.4s" repeatCount="indefinite" begin="1s"><mpath href="#p12ch2"/></animateMotion></circle>
</svg>`,
};

// ── Rendering ──────────────────────────────────────────────────────────────

const root = document.getElementById("carousel-root");
let cur = 0;

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function renderTitle(s) {
  return `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;padding:32px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;opacity:.03;background-image:linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px);background-size:48px 48px"></div>
    <div style="position:relative;z-index:1">
      <div style="font-family:'Source Code Pro',monospace;font-size:11px;color:#60a5fa;letter-spacing:4px;text-transform:uppercase;margin-bottom:24px">Software Architecture Series</div>
      <h1 style="font-family:'Merriweather',Georgia,serif;font-size:clamp(28px,6vw,48px);font-weight:900;color:#f9fafb;line-height:1.1;margin:0 0 16px">${esc(s.title)}</h1>
      <div style="display:flex;gap:8px;justify-content:center;margin:0 0 20px"><span style="width:48px;height:4px;background:#3b82f6;border-radius:2px;display:block"></span><span style="width:48px;height:4px;background:#10b981;border-radius:2px;display:block"></span><span style="width:48px;height:4px;background:#f59e0b;border-radius:2px;display:block"></span></div>
      <p style="font-family:'Source Sans 3',sans-serif;font-size:clamp(14px,3vw,20px);color:#d1d5db;margin:0 0 8px">${esc(s.subtitle)}</p>
      <p style="font-family:'Source Code Pro',monospace;font-size:12px;color:#60a5fa;margin:24px 0 0;letter-spacing:1.5px">${esc(s.tagline)}</p>
      <div style="margin-top:32px;border-top:1px solid #374151;padding-top:16px">
        <div style="font-family:'Merriweather',Georgia,serif;font-size:16px;color:#f3f4f6;font-weight:700">${esc(s.author)}</div>
        <div style="font-family:'Source Sans 3',sans-serif;font-size:12px;color:#9ca3af;margin-top:4px">${esc(s.credentials)}</div>
      </div>
    </div>
  </div>`;
}

function renderPattern(s) {
  const diag = diagrams[s.number] || "";
  return `<div style="display:flex;flex-direction:column;height:100%;padding:16px;overflow:hidden;position:relative">
    <div style="position:absolute;inset:0;opacity:.02;background-image:linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px);background-size:48px 48px"></div>
    <div style="display:flex;align-items:flex-start;gap:10px;position:relative;z-index:1">
      <div style="font-family:'Merriweather',Georgia,serif;font-size:32px;font-weight:900;color:${s.infraColor};opacity:.25;line-height:1;min-width:42px">${s.number}</div>
      <div style="font-family:'Source Sans 3',sans-serif;font-size:12px;color:#d1d5db;font-style:italic;line-height:1.4;padding-top:4px">"${esc(s.coreInsight)}"</div>
    </div>
    <div style="display:flex;gap:10px;padding:10px 0;position:relative;z-index:1">
      <div style="flex:1;background:#1f2937;border-radius:10px;border-top:3px solid ${s.infraColor};padding:12px">
        <div style="font-family:'Source Code Pro',monospace;font-size:9px;color:${s.infraColor};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;font-weight:600">Platform</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:20px">${s.infraIcon}</span><span style="font-family:'Merriweather',Georgia,serif;font-size:15px;font-weight:700;color:#f3f4f6">${esc(s.infraTitle)}</span></div>
        <div style="font-family:'Source Code Pro',monospace;font-size:10px;color:${s.infraColor};opacity:.85">${esc(s.infraExamples)}</div>
      </div>
      <div style="display:flex;align-items:center"><div style="width:28px;height:28px;border-radius:8px;background:#1f2937;border:1px solid #374151;display:flex;align-items:center;justify-content:center;font-size:12px;color:#9ca3af;font-family:'Source Code Pro',monospace">↔</div></div>
      <div style="flex:1;background:#1f2937;border-radius:10px;border-top:3px solid ${s.appColor};padding:12px">
        <div style="font-family:'Source Code Pro',monospace;font-size:9px;color:${s.appColor};letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;font-weight:600">Application</div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="font-size:20px">${s.appIcon}</span><span style="font-family:'Merriweather',Georgia,serif;font-size:15px;font-weight:700;color:#f3f4f6">${esc(s.appTitle)}</span></div>
        <div style="font-family:'Source Code Pro',monospace;font-size:10px;color:${s.appColor};opacity:.85">${esc(s.appExamples)}</div>
      </div>
    </div>
    <div style="flex:1;background:#0d1117;border-radius:10px;border:1px solid #1f2937;display:flex;align-items:center;justify-content:center;padding:8px;min-height:0;position:relative;z-index:1;overflow:hidden">${diag}</div>
    <div style="padding:10px 12px;background:#1f2937;border-radius:8px;border-left:3px solid #f59e0b;display:flex;align-items:center;gap:10px;margin-top:8px;position:relative;z-index:1">
      <div style="font-family:'Source Code Pro',monospace;font-size:8px;color:#f59e0b;letter-spacing:2px;text-transform:uppercase;font-weight:600;min-width:36px">Math</div>
      <div style="font-family:'Source Sans 3',sans-serif;font-size:12px;color:#e5e7eb;line-height:1.3">${esc(s.mathFoundation)}</div>
    </div>
  </div>`;
}

function renderCTA(s) {
  return `<div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:100%;text-align:center;padding:32px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;opacity:.03;background-image:linear-gradient(rgba(255,255,255,.4) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.4) 1px,transparent 1px);background-size:48px 48px"></div>
    <div style="position:relative;z-index:1">
      <div style="display:flex;gap:8px;justify-content:center;margin-bottom:32px"><span style="width:48px;height:4px;background:#3b82f6;border-radius:2px;display:block"></span><span style="width:48px;height:4px;background:#10b981;border-radius:2px;display:block"></span><span style="width:48px;height:4px;background:#f59e0b;border-radius:2px;display:block"></span></div>
      <h1 style="font-family:'Merriweather',Georgia,serif;font-size:clamp(24px,5.5vw,42px);font-weight:900;color:#f9fafb;line-height:1.15;margin:0 0 20px;white-space:pre-line">${esc(s.title)}</h1>
      <p style="font-family:'Source Sans 3',sans-serif;font-size:clamp(13px,2.5vw,16px);color:#d1d5db;line-height:1.55;margin:0 0 32px">${esc(s.subtitle)}</p>
      <div style="display:inline-block;padding:12px 32px;border-radius:8px;background:#3b82f6;font-family:'Source Sans 3',sans-serif;font-size:16px;font-weight:600;color:#fff">${esc(s.ctaText)}</div>
      <div style="margin-top:32px;font-family:'Merriweather',Georgia,serif;font-size:14px;color:#9ca3af;font-weight:700">${esc(s.author)}</div>
    </div>
  </div>`;
}

function renderSlide(idx) {
  const s = slides[idx];
  if (s.type === "title") return renderTitle(s);
  if (s.type === "cta") return renderCTA(s);
  return renderPattern(s);
}

function render() {
  const s = slides[cur];
  const slideHtml = renderSlide(cur);
  const activeColor = s.type === "pattern" ? s.infraColor : "#3b82f6";

  const dots = slides.map((sl, i) => {
    const isActive = i === cur;
    const bg = isActive ? (sl.type === "pattern" ? sl.infraColor : "#3b82f6") : "#374151";
    return `<button class="carousel-dot${isActive?" active":""}" data-idx="${i}" style="background:${bg}${isActive?";width:22px":""}"></button>`;
  }).join("");

  const label = s.type === "pattern"
    ? `<span style="opacity:.5">#${s.number}</span> ${esc(s.infraTitle)} <span style="opacity:.4;margin:0 4px">↔</span> ${esc(s.appTitle)}`
    : "";

  root.innerHTML = `
    <div class="carousel-container">
      <div class="carousel-slide" style="background:#111827">${slideHtml}</div>
      <div class="carousel-controls">
        <button class="carousel-btn" id="prev-btn" ${cur===0?"disabled":""}>&lsaquo;</button>
        <div class="carousel-dots">${dots}</div>
        <button class="carousel-btn" id="next-btn" ${cur===slides.length-1?"disabled":""}>&rsaquo;</button>
      </div>
      <div class="carousel-label">${label}</div>
    </div>`;

  // Event listeners
  document.getElementById("prev-btn")?.addEventListener("click", () => { if(cur>0){cur--;render();} });
  document.getElementById("next-btn")?.addEventListener("click", () => { if(cur<slides.length-1){cur++;render();} });
  root.querySelectorAll(".carousel-dot").forEach(d => {
    d.addEventListener("click", () => { cur = parseInt(d.dataset.idx); render(); });
  });
}

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && cur > 0) { cur--; render(); }
  if (e.key === "ArrowRight" && cur < slides.length - 1) { cur++; render(); }
});

render();
