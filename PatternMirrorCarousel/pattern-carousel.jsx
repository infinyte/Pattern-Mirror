import { useState, useEffect } from "react";

const slides = [
  {
    type: "title",
    title: "The Pattern Mirror",
    subtitle: "Every Enterprise Pattern Has a Code-Level Twin",
    tagline: "Infrastructure → Application → Pure Mathematics",
    author: "Kurt Mitchell",
    credentials: "Senior Software Engineer / Architect • 20 Years Enterprise Experience",
    bgGradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accentColor: "#00f5d4",
  },
  {
    type: "pattern",
    number: "01",
    infraTitle: "Reverse Proxy",
    infraExamples: "Azure App Gateway, Nginx, Front Door",
    infraIcon: "🛡️",
    infraDesc: "External-facing gateway that intercepts all client requests, handles SSL, load balancing, and hides internal topology",
    appTitle: "Mediator Pattern",
    appExamples: "MediatR, Internal Event Bus",
    appIcon: "🔀",
    appDesc: "Internal-facing hub that manages communication between components without them knowing about each other",
    mathFoundation: "Graph Centrality — single node minimizing path length",
    mathIcon: "📐",
    coreInsight: "Both place a single intermediary between many-to-many connections",
    bgColor: "#FF6B35",
    accentColor: "#FFE66D",
    darkBg: "#1a0a00",
  },
  {
    type: "pattern",
    number: "02",
    infraTitle: "API Gateway / Load Balancer",
    infraExamples: "Azure APIM, AWS ALB, Kong",
    infraIcon: "🔄",
    infraDesc: "Routes incoming requests to appropriate backend services based on path, headers, or content inspection",
    appTitle: "Broker Pattern",
    appExamples: "Message Router, Strategy Dispatch",
    appIcon: "📨",
    appDesc: "Routes application messages to the correct handler based on type, content, or configuration rules",
    mathFoundation: "Weighted Distribution Functions / Modular Arithmetic",
    mathIcon: "⚖️",
    coreInsight: "Both examine input properties and route to the correct destination",
    bgColor: "#7B2FBE",
    accentColor: "#E040FB",
    darkBg: "#0d0019",
  },
  {
    type: "pattern",
    number: "03",
    infraTitle: "Orchestrator",
    infraExamples: "Logic Apps, Step Functions, Durable Functions",
    infraIcon: "🎭",
    infraDesc: "Manages complex multi-step infrastructure workflows with state tracking, retries, and conditional branching",
    appTitle: "Coordinator / Pipeline",
    appExamples: "Workflow Engines, Stateful Handlers",
    appIcon: "⚙️",
    appDesc: "Manages multi-step business processes within application code, maintaining state across operations",
    mathFoundation: "Finite State Machines / Directed Acyclic Graphs",
    mathIcon: "🔷",
    coreInsight: "Both manage stateful, multi-step processes with defined transitions",
    bgColor: "#00B4D8",
    accentColor: "#90E0EF",
    darkBg: "#001219",
  },
  {
    type: "pattern",
    number: "04",
    infraTitle: "Infrastructure as Code",
    infraExamples: "Terraform, ARM, Bicep, Pulumi",
    infraIcon: "🏗️",
    infraDesc: "Provisions multi-resource deployments with rollback capabilities — if step 3 fails, tear down steps 1 and 2",
    appTitle: "Saga Pattern",
    appExamples: "Compensating Transactions, Distributed TX",
    appIcon: "🔁",
    appDesc: "Breaks distributed business transactions into steps with compensating actions for each — reverse on failure",
    mathFoundation: "Inverse Functions — f(x) then f⁻¹(x) for rollback",
    mathIcon: "↩️",
    coreInsight: "Both solve 'what happens when step N fails after steps 1..N-1 succeeded?'",
    bgColor: "#E63946",
    accentColor: "#FFB4A2",
    darkBg: "#1a0005",
  },
  {
    type: "pattern",
    number: "05",
    infraTitle: "Service Bus / Event Grid",
    infraExamples: "Kafka, RabbitMQ, Azure Service Bus",
    infraIcon: "📡",
    infraDesc: "Decouples services via async message delivery — publishers emit events, subscribers consume independently",
    appTitle: "Observer / Pub-Sub",
    appExamples: "EventHandler, Rx, IObservable",
    appIcon: "👁️",
    appDesc: "Objects subscribe to events from a subject — when state changes, all subscribers are notified automatically",
    mathFoundation: "Set-Theoretic Relations — publisher maps to subscriber subsets",
    mathIcon: "∩",
    coreInsight: "Both decouple event producers from consumers via subscription",
    bgColor: "#2EC4B6",
    accentColor: "#CBF3F0",
    darkBg: "#001a16",
  },
  {
    type: "pattern",
    number: "06",
    infraTitle: "Circuit Breaker",
    infraExamples: "Envoy, Istio, Health Probes",
    infraIcon: "⚡",
    infraDesc: "Detects failing downstream services and 'trips' to prevent cascading failures — auto-recovers after cooldown",
    appTitle: "Try-Catch / Retry + Backoff",
    appExamples: "Polly, Resilience Patterns",
    appIcon: "🛡️",
    appDesc: "Wraps risky operations with error handling, retry logic, and exponential backoff to gracefully handle failures",
    mathFoundation: "Threshold Functions / State Machines with Timed Transitions",
    mathIcon: "📊",
    coreInsight: "Both protect systems from cascading failure through controlled degradation",
    bgColor: "#F77F00",
    accentColor: "#FCBF49",
    darkBg: "#1a0e00",
  },
  {
    type: "pattern",
    number: "07",
    infraTitle: "CDN / Distributed Cache",
    infraExamples: "Redis, Azure Cache, CloudFront",
    infraIcon: "💾",
    infraDesc: "Stores frequently accessed data closer to consumers — reduces latency and backend load across regions",
    appTitle: "Cache-Aside / Memoization",
    appExamples: "MemoryCache, Dictionary Lookup",
    appIcon: "🗂️",
    appDesc: "Check local storage first; if miss, compute/fetch and store result for future calls — same data, faster path",
    mathFoundation: "Bijective Mapping — key → value with temporal decay",
    mathIcon: "🗺️",
    coreInsight: "Both answer: 'Have I already computed this? Then don't do it again.'",
    bgColor: "#06D6A0",
    accentColor: "#B5FFE1",
    darkBg: "#001a10",
  },
  {
    type: "pattern",
    number: "08",
    infraTitle: "Leader Election",
    infraExamples: "Raft, Paxos, ZooKeeper, Service Fabric",
    infraIcon: "👑",
    infraDesc: "Distributed nodes reach consensus on which single node coordinates work — automatic failover on leader death",
    appTitle: "Mutex / Semaphore / Lock",
    appExamples: "Singleton, Thread Synchronization",
    appIcon: "🔒",
    appDesc: "One thread wins exclusive access to a shared resource — others wait until the lock is released",
    mathFoundation: "Consensus Theory — Byzantine Fault Tolerance, Quorum Majorities",
    mathIcon: "🗳️",
    coreInsight: "'Who's in charge of this cluster?' = 'Who owns this critical section?'",
    bgColor: "#9B5DE5",
    accentColor: "#D0BFFF",
    darkBg: "#0d0026",
  },
  {
    type: "pattern",
    number: "09",
    infraTitle: "Consistent Hashing / DHT",
    infraExamples: "Cassandra, DynamoDB, CDN Routing",
    infraIcon: "🔗",
    infraDesc: "Distributes data across a hash ring of nodes — when nodes join/leave, only nearby keys remap",
    appTitle: "HashMap / Dictionary",
    appExamples: "GetHashCode, Bucket Allocation",
    appIcon: "📦",
    appDesc: "Hash function maps key to array index for O(1) lookup — the single-machine version of distributed hashing",
    mathFoundation: "Modular Arithmetic — h(k) mod n with minimal remapping",
    mathIcon: "♾️",
    coreInsight: "Both turn a key into a location using h(k) mod n — one machine vs. many",
    bgColor: "#FF006E",
    accentColor: "#FF85A1",
    darkBg: "#1a0010",
  },
  {
    type: "pattern",
    number: "10",
    infraTitle: "Mesh / Gossip Protocol",
    infraExamples: "BT Mesh, UWB, Cassandra Gossip",
    infraIcon: "📶",
    infraDesc: "Messages hop through intermediate relay nodes — no central authority, each node forwards to neighbors",
    appTitle: "Graph Traversal / Chain of Responsibility",
    appExamples: "BFS/DFS, Handler Chains",
    appIcon: "🌐",
    appDesc: "BFS visits immediate neighbors first then their neighbors — Chain of Responsibility passes requests along handlers",
    mathFoundation: "Graph Theory — Shortest Path, Epidemic Spreading Models",
    mathIcon: "🕸️",
    coreInsight: "Both propagate information through connected nodes without central coordination",
    bgColor: "#3A86FF",
    accentColor: "#8ECAE6",
    darkBg: "#00091a",
  },
  {
    type: "pattern",
    number: "11",
    infraTitle: "TLS / ECDHE / mTLS",
    infraExamples: "SSH, VPN, Zero Trust Handshakes",
    infraIcon: "🔐",
    infraDesc: "Two parties establish a shared secret over an insecure channel — g^a mod p and g^b mod p → g^(ab) mod p",
    appTitle: "Key Exchange / Crypto Strategy",
    appExamples: "DI of Crypto Providers, Shared Context",
    appIcon: "🤝",
    appDesc: "Strategy pattern for negotiating shared context between untrusted components — same handshake, application layer",
    mathFoundation: "Discrete Logarithm Problem over Finite Cyclic Groups",
    mathIcon: "🔢",
    coreInsight: "From abstract algebra theorem → modular arithmetic → every secure connection on earth",
    bgColor: "#FFD166",
    accentColor: "#FFF3B0",
    darkBg: "#1a1500",
  },
  {
    type: "cta",
    title: "Same Problem. Different Layer.",
    subtitle: "Understanding this connection is the difference between implementing patterns and truly understanding architecture.",
    ctaText: "Follow for the deep dive →",
    author: "Kurt Mitchell",
    bgGradient: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    accentColor: "#00f5d4",
  },
];

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Syne:wght@400;500;600;700;800&display=swap');
`;

// --- TITLE SLIDE ---
function TitleSlide({ slide }) {
  return (
    <div
      style={{
        width: 1080, height: 1080, background: slide.bgGradient,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      {/* Decorative orbs */}
      <div style={{
        position: "absolute", top: -120, right: -120, width: 400, height: 400,
        borderRadius: "50%", background: `radial-gradient(circle, ${slide.accentColor}22, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80, width: 300, height: 300,
        borderRadius: "50%", background: "radial-gradient(circle, #ff006e22, transparent 70%)",
      }} />
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 60px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: slide.accentColor,
          letterSpacing: 6, textTransform: "uppercase", marginBottom: 32, fontWeight: 500,
        }}>
          Software Architecture Series
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 88, fontWeight: 800, color: "#fff",
          lineHeight: 1.05, margin: "0 0 20px 0", letterSpacing: -2,
        }}>
          {slide.title}
        </h1>
        <div style={{
          width: 120, height: 4, background: `linear-gradient(90deg, ${slide.accentColor}, #ff006e)`,
          margin: "0 auto 28px", borderRadius: 2,
        }} />
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 32, color: "#ffffffcc", fontWeight: 400,
          margin: "0 0 16px 0", lineHeight: 1.4,
        }}>
          {slide.subtitle}
        </p>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: slide.accentColor,
          margin: "40px 0 0 0", fontWeight: 500, letterSpacing: 1,
        }}>
          {slide.tagline}
        </p>
        <div style={{
          marginTop: 64, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 32,
        }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 24, color: "#fff", fontWeight: 600,
          }}>
            {slide.author}
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "#ffffff88", fontWeight: 400, marginTop: 6,
          }}>
            {slide.credentials}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- PATTERN SLIDE ---
function PatternSlide({ slide }) {
  const darkenedBg = slide.darkBg || "#0a0a0a";
  return (
    <div
      style={{
        width: 1080, height: 1080, background: darkenedBg,
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Subtle grid */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "36px 36px",
      }} />

      {/* Top bar with number and core insight */}
      <div style={{
        display: "flex", alignItems: "center", padding: "32px 40px 0",
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontSize: 56, fontWeight: 800,
          color: slide.bgColor, opacity: 0.3, lineHeight: 1, marginRight: 16,
        }}>
          {slide.number}
        </div>
        <div style={{
          flex: 1, fontFamily: "'Outfit', sans-serif", fontSize: 17,
          color: slide.accentColor, fontWeight: 500, letterSpacing: 0.5,
          lineHeight: 1.3,
        }}>
          {slide.coreInsight}
        </div>
      </div>

      {/* Main content: side by side */}
      <div style={{
        flex: 1, display: "flex", gap: 20, padding: "20px 40px",
        position: "relative", zIndex: 1,
      }}>
        {/* LEFT — Infrastructure */}
        <div style={{
          flex: 1, background: `linear-gradient(160deg, ${slide.bgColor}18, ${slide.bgColor}08)`,
          borderRadius: 20, border: `2px solid ${slide.bgColor}44`,
          padding: "28px 24px", display: "flex", flexDirection: "column",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: slide.bgColor, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 12, fontWeight: 600,
          }}>
            🏢 Infrastructure
          </div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{slide.infraIcon}</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 700,
            color: "#fff", margin: "0 0 8px 0", lineHeight: 1.15,
          }}>
            {slide.infraTitle}
          </h2>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: slide.bgColor, marginBottom: 16, fontWeight: 500, lineHeight: 1.5,
          }}>
            {slide.infraExamples}
          </div>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "#ffffffbb",
            lineHeight: 1.55, margin: 0, flex: 1,
          }}>
            {slide.infraDesc}
          </p>
        </div>

        {/* CENTER — Connection arrow */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", width: 44,
        }}>
          <div style={{
            width: 3, flex: 1, background: `linear-gradient(180deg, transparent, ${slide.bgColor}66, transparent)`,
          }} />
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: `linear-gradient(135deg, ${slide.bgColor}, ${slide.accentColor})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 700, color: "#000",
            boxShadow: `0 0 20px ${slide.bgColor}44`,
          }}>
            ↔
          </div>
          <div style={{
            width: 3, flex: 1, background: `linear-gradient(180deg, transparent, ${slide.bgColor}66, transparent)`,
          }} />
        </div>

        {/* RIGHT — Application */}
        <div style={{
          flex: 1, background: `linear-gradient(160deg, ${slide.accentColor}12, ${slide.accentColor}05)`,
          borderRadius: 20, border: `2px solid ${slide.accentColor}33`,
          padding: "28px 24px", display: "flex", flexDirection: "column",
        }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: slide.accentColor, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 12, fontWeight: 600,
          }}>
            💻 Application
          </div>
          <div style={{ fontSize: 40, marginBottom: 12 }}>{slide.appIcon}</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 700,
            color: "#fff", margin: "0 0 8px 0", lineHeight: 1.15,
          }}>
            {slide.appTitle}
          </h2>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
            color: slide.accentColor, marginBottom: 16, fontWeight: 500, lineHeight: 1.5,
          }}>
            {slide.appExamples}
          </div>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "#ffffffbb",
            lineHeight: 1.55, margin: 0, flex: 1,
          }}>
            {slide.appDesc}
          </p>
        </div>
      </div>

      {/* Bottom bar — Math Foundation */}
      <div style={{
        margin: "0 40px 32px", padding: "18px 24px",
        background: "rgba(255,255,255,0.04)", borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "center", gap: 14,
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: `linear-gradient(135deg, ${slide.bgColor}33, ${slide.accentColor}33)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, flexShrink: 0,
        }}>
          {slide.mathIcon}
        </div>
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: "#ffffff55", letterSpacing: 2, textTransform: "uppercase", marginBottom: 3,
          }}>
            Pure Math Foundation
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "#ffffffcc",
            fontWeight: 500,
          }}>
            {slide.mathFoundation}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- CTA SLIDE ---
function CTASlide({ slide }) {
  return (
    <div
      style={{
        width: 1080, height: 1080, background: slide.bgGradient,
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", inset: 0, opacity: 0.06,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: `radial-gradient(circle, ${slide.accentColor}11, transparent 70%)`,
      }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 80px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 60, marginBottom: 32,
        }}>
          🪞
        </div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 800, color: "#fff",
          lineHeight: 1.1, margin: "0 0 28px 0", letterSpacing: -1,
        }}>
          {slide.title}
        </h1>
        <div style={{
          width: 120, height: 4, background: `linear-gradient(90deg, ${slide.accentColor}, #ff006e)`,
          margin: "0 auto 32px", borderRadius: 2,
        }} />
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 26, color: "#ffffffbb",
          lineHeight: 1.5, margin: "0 0 48px 0",
        }}>
          {slide.subtitle}
        </p>
        <div style={{
          display: "inline-block", padding: "18px 48px", borderRadius: 60,
          background: `linear-gradient(135deg, ${slide.accentColor}, #00bbf9)`,
          fontFamily: "'Outfit', sans-serif", fontSize: 24, fontWeight: 700,
          color: "#0f0c29", letterSpacing: 0.5,
        }}>
          {slide.ctaText}
        </div>
        <div style={{ marginTop: 48 }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 20, color: "#ffffff88",
          }}>
            {slide.author}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN CAROUSEL VIEWER ---
export default function LinkedInCarouselPreview() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const updateScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const scaleW = (w - 160) / 1080;
      const scaleH = (h - 200) / 1080;
      setScale(Math.min(scaleW, scaleH, 0.65));
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const slide = slides[currentSlide];

  const renderSlide = (s) => {
    if (s.type === "title") return <TitleSlide slide={s} />;
    if (s.type === "cta") return <CTASlide slide={s} />;
    return <PatternSlide slide={s} />;
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0f",
      display: "flex", flexDirection: "column", alignItems: "center",
      fontFamily: "'Outfit', sans-serif", padding: "24px 0",
    }}>
      <style>{fontImport}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#fff",
          fontWeight: 700, margin: "0 0 6px 0",
        }}>
          LinkedIn Carousel Preview
        </h1>
        <p style={{ fontSize: 14, color: "#ffffff66", margin: 0 }}>
          Slide {currentSlide + 1} of {slides.length} • 1080×1080px
        </p>
      </div>

      {/* Slide viewer */}
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        gap: 16, marginBottom: 20,
      }}>
        {/* Prev button */}
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: currentSlide === 0 ? "#ffffff11" : "#ffffff22",
            border: "none", color: currentSlide === 0 ? "#ffffff33" : "#fff",
            fontSize: 20, cursor: currentSlide === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          ←
        </button>

        {/* Slide container */}
        <div style={{
          width: 1080 * scale, height: 1080 * scale,
          borderRadius: 12, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <div style={{
            transform: `scale(${scale})`, transformOrigin: "top left",
            width: 1080, height: 1080,
          }}>
            {renderSlide(slide)}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: currentSlide === slides.length - 1 ? "#ffffff11" : "#ffffff22",
            border: "none",
            color: currentSlide === slides.length - 1 ? "#ffffff33" : "#fff",
            fontSize: 20,
            cursor: currentSlide === slides.length - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
        >
          →
        </button>
      </div>

      {/* Dot navigation */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap",
        justifyContent: "center", maxWidth: 400,
      }}>
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: i === currentSlide ? 28 : 10, height: 10,
              borderRadius: 5, border: "none",
              background: i === currentSlide
                ? (s.type === "pattern" ? s.bgColor : "#00f5d4")
                : "#ffffff22",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Slide info */}
      <div style={{
        textAlign: "center", maxWidth: 500, padding: "0 20px",
      }}>
        {slide.type === "pattern" && (
          <div style={{
            display: "inline-block", padding: "8px 20px", borderRadius: 20,
            background: `${slide.bgColor}22`, border: `1px solid ${slide.bgColor}44`,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            color: slide.bgColor, fontWeight: 500,
          }}>
            Pattern #{slide.number}: {slide.infraTitle} ↔ {slide.appTitle}
          </div>
        )}
      </div>
    </div>
  );
}
