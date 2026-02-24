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
    infraColor: "#1e6b8a",
    appColor: "#2e7d5b",
    accentLight: "#e8f4f8",
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
    infraColor: "#6b3fa0",
    appColor: "#8b5bc4",
    accentLight: "#f3eefa",
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
    infraColor: "#0077a8",
    appColor: "#0095b6",
    accentLight: "#e5f5fa",
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
    coreInsight: "Both solve: what happens when step N fails after steps 1..N-1 succeeded?",
    infraColor: "#b83340",
    appColor: "#d04e5a",
    accentLight: "#fce8ea",
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
    infraColor: "#1a8a6a",
    appColor: "#24a67a",
    accentLight: "#e6f7f2",
  },
  {
    type: "pattern",
    number: "06",
    infraTitle: "Circuit Breaker",
    infraExamples: "Envoy, Istio, Health Probes",
    infraIcon: "⚡",
    infraDesc: "Detects failing downstream services and trips to prevent cascading failures — auto-recovers after cooldown",
    appTitle: "Try-Catch / Retry + Backoff",
    appExamples: "Polly, Resilience Patterns",
    appIcon: "🛡️",
    appDesc: "Wraps risky operations with error handling, retry logic, and exponential backoff to gracefully handle failures",
    mathFoundation: "Threshold Functions / State Machines with Timed Transitions",
    mathIcon: "📊",
    coreInsight: "Both protect systems from cascading failure through controlled degradation",
    infraColor: "#c27013",
    appColor: "#d98c2a",
    accentLight: "#fef4e6",
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
    coreInsight: "Both answer: have I already computed this? Then don't do it again.",
    infraColor: "#3a7d44",
    appColor: "#4a9e56",
    accentLight: "#ebf5ec",
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
    coreInsight: "Who's in charge of this cluster? = Who owns this critical section?",
    infraColor: "#6b4fa0",
    appColor: "#8468b8",
    accentLight: "#f0ebf8",
  },
  {
    type: "pattern",
    number: "09",
    infraTitle: "Consistent Hashing / DHT",
    infraExamples: "Cassandra, DynamoDB, CDN Routing",
    infraIcon: "🔗",
    infraDesc: "Distributes data across a hash ring of nodes — when nodes join or leave, only nearby keys remap",
    appTitle: "HashMap / Dictionary",
    appExamples: "GetHashCode, Bucket Allocation",
    appIcon: "📦",
    appDesc: "Hash function maps key to array index for O(1) lookup — the single-machine version of distributed hashing",
    mathFoundation: "Modular Arithmetic — h(k) mod n with minimal remapping",
    mathIcon: "♾️",
    coreInsight: "Both turn a key into a location using h(k) mod n — one machine vs. many",
    infraColor: "#a63d6a",
    appColor: "#c45580",
    accentLight: "#f9eaf0",
  },
  {
    type: "pattern",
    number: "10",
    infraTitle: "Mesh / Gossip Protocol",
    infraExamples: "BT Mesh, UWB, Cassandra Gossip",
    infraIcon: "📶",
    infraDesc: "Messages hop through intermediate relay nodes — no central authority, each node forwards to neighbors",
    appTitle: "Graph Traversal / Chain of Resp.",
    appExamples: "BFS/DFS, Handler Chains",
    appIcon: "🌐",
    appDesc: "BFS visits immediate neighbors first, then theirs — Chain of Responsibility passes requests along handlers",
    mathFoundation: "Graph Theory — Shortest Path, Epidemic Spreading Models",
    mathIcon: "🕸️",
    coreInsight: "Both propagate information through connected nodes without central coordination",
    infraColor: "#2b6cb0",
    appColor: "#3b82c4",
    accentLight: "#e8f0fb",
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
    infraColor: "#8b6914",
    appColor: "#a67e1e",
    accentLight: "#faf4e4",
  },
  {
    type: "cta",
    title: "Same Problem.\nDifferent Layer.",
    subtitle: "Understanding this connection is the difference between implementing patterns and truly understanding architecture.",
    ctaText: "Follow for the deep-dive article →",
    author: "Kurt Mitchell",
  },
];

function TitleSlide({ slide }) {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column", justifyContent: "center",
      alignItems: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.035,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "absolute", top: -200, right: -200, width: 500, height: 500,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.08), transparent 70%)",
      }} />
      <div style={{
        position: "absolute", bottom: -150, left: -150, width: 400, height: 400,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 72px" }}>
        <div style={{
          fontFamily: "'Source Code Pro', monospace", fontSize: 16, color: "#60a5fa",
          letterSpacing: 5, textTransform: "uppercase", marginBottom: 40, fontWeight: 500,
        }}>
          Software Architecture Series
        </div>

        <h1 style={{
          fontFamily: "'Merriweather', Georgia, serif", fontSize: 82, fontWeight: 900,
          color: "#f9fafb", lineHeight: 1.1, margin: "0 0 24px 0",
        }}>
          {slide.title}
        </h1>

        <div style={{
          display: "flex", gap: 8, justifyContent: "center", margin: "0 0 32px",
        }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>

        <p style={{
          fontFamily: "'Source Sans 3', 'Source Sans Pro', sans-serif", fontSize: 30,
          color: "#d1d5db", fontWeight: 400, margin: "0 0 12px 0", lineHeight: 1.45,
        }}>
          {slide.subtitle}
        </p>

        <p style={{
          fontFamily: "'Source Code Pro', monospace", fontSize: 18, color: "#60a5fa",
          margin: "40px 0 0 0", fontWeight: 400, letterSpacing: 1.5,
        }}>
          {slide.tagline}
        </p>

        <div style={{ marginTop: 72, borderTop: "1px solid #374151", paddingTop: 32 }}>
          <div style={{
            fontFamily: "'Merriweather', Georgia, serif", fontSize: 22, color: "#f3f4f6", fontWeight: 700,
          }}>
            {slide.author}
          </div>
          <div style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 16, color: "#9ca3af",
            fontWeight: 400, marginTop: 8,
          }}>
            {slide.credentials}
          </div>
        </div>
      </div>
    </div>
  );
}

function PatternSlide({ slide }) {
  return (
    <div style={{
      width: 1080, height: 1080, background: "#111827",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.025,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Top section: number + insight */}
      <div style={{
        display: "flex", alignItems: "flex-start", padding: "36px 44px 0",
        position: "relative", zIndex: 1, gap: 16,
      }}>
        <div style={{
          fontFamily: "'Merriweather', Georgia, serif", fontSize: 52, fontWeight: 900,
          color: slide.infraColor, opacity: 0.25, lineHeight: 1,
          minWidth: 70,
        }}>
          {slide.number}
        </div>
        <div style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: 18,
          color: "#d1d5db", fontWeight: 400, fontStyle: "italic",
          lineHeight: 1.4, paddingTop: 8,
        }}>
          "{slide.coreInsight}"
        </div>
      </div>

      {/* Main content: side by side */}
      <div style={{
        flex: 1, display: "flex", gap: 24, padding: "24px 44px",
        position: "relative", zIndex: 1,
      }}>
        {/* LEFT — Infrastructure */}
        <div style={{
          flex: 1, background: "#1f2937",
          borderRadius: 16, borderTop: `4px solid ${slide.infraColor}`,
          padding: "28px 26px", display: "flex", flexDirection: "column",
        }}>
          <div style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 11,
            color: slide.infraColor, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 16, fontWeight: 600,
          }}>
            Infrastructure
          </div>
          <div style={{ fontSize: 36, marginBottom: 14 }}>{slide.infraIcon}</div>
          <h2 style={{
            fontFamily: "'Merriweather', Georgia, serif", fontSize: 26, fontWeight: 700,
            color: "#f3f4f6", margin: "0 0 10px 0", lineHeight: 1.2,
          }}>
            {slide.infraTitle}
          </h2>
          <div style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 12.5,
            color: slide.infraColor, marginBottom: 18, fontWeight: 500,
            lineHeight: 1.5, opacity: 0.85,
          }}>
            {slide.infraExamples}
          </div>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 17.5,
            color: "#d1d5db", lineHeight: 1.6, margin: 0, flex: 1,
          }}>
            {slide.infraDesc}
          </p>
        </div>

        {/* CENTER — Connection */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", width: 40,
        }}>
          <div style={{
            width: 2, flex: 1,
            background: `linear-gradient(180deg, transparent, #374151, transparent)`,
          }} />
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "#1f2937", border: "2px solid #374151",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#9ca3af",
            fontFamily: "'Source Code Pro', monospace", fontWeight: 600,
          }}>
            ↔
          </div>
          <div style={{
            width: 2, flex: 1,
            background: `linear-gradient(180deg, transparent, #374151, transparent)`,
          }} />
        </div>

        {/* RIGHT — Application */}
        <div style={{
          flex: 1, background: "#1f2937",
          borderRadius: 16, borderTop: `4px solid ${slide.appColor}`,
          padding: "28px 26px", display: "flex", flexDirection: "column",
        }}>
          <div style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 11,
            color: slide.appColor, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 16, fontWeight: 600,
          }}>
            Application
          </div>
          <div style={{ fontSize: 36, marginBottom: 14 }}>{slide.appIcon}</div>
          <h2 style={{
            fontFamily: "'Merriweather', Georgia, serif", fontSize: 26, fontWeight: 700,
            color: "#f3f4f6", margin: "0 0 10px 0", lineHeight: 1.2,
          }}>
            {slide.appTitle}
          </h2>
          <div style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 12.5,
            color: slide.appColor, marginBottom: 18, fontWeight: 500,
            lineHeight: 1.5, opacity: 0.85,
          }}>
            {slide.appExamples}
          </div>
          <p style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 17.5,
            color: "#d1d5db", lineHeight: 1.6, margin: 0, flex: 1,
          }}>
            {slide.appDesc}
          </p>
        </div>
      </div>

      {/* Bottom — Math Foundation */}
      <div style={{
        margin: "0 44px 36px", padding: "18px 24px",
        background: "#1f2937", borderRadius: 12,
        borderLeft: `4px solid #f59e0b`,
        display: "flex", alignItems: "center", gap: 16,
        position: "relative", zIndex: 1,
      }}>
        <div style={{
          fontSize: 24, width: 44, height: 44,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          {slide.mathIcon}
        </div>
        <div>
          <div style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 10,
            color: "#f59e0b", letterSpacing: 2.5, textTransform: "uppercase",
            marginBottom: 4, fontWeight: 600,
          }}>
            Pure Math Foundation
          </div>
          <div style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 16.5,
            color: "#e5e7eb", fontWeight: 500, lineHeight: 1.35,
          }}>
            {slide.mathFoundation}
          </div>
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
        position: "absolute", inset: 0, opacity: 0.035,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.05), transparent 70%)",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 90px" }}>
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", marginBottom: 48,
        }}>
          <div style={{ width: 48, height: 4, background: "#3b82f6", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#10b981", borderRadius: 2 }} />
          <div style={{ width: 48, height: 4, background: "#f59e0b", borderRadius: 2 }} />
        </div>

        <h1 style={{
          fontFamily: "'Merriweather', Georgia, serif", fontSize: 68, fontWeight: 900,
          color: "#f9fafb", lineHeight: 1.15, margin: "0 0 32px 0",
          whiteSpace: "pre-line",
        }}>
          {slide.title}
        </h1>

        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: 24, color: "#d1d5db",
          lineHeight: 1.55, margin: "0 0 56px 0", fontWeight: 400,
        }}>
          {slide.subtitle}
        </p>

        <div style={{
          display: "inline-block", padding: "18px 44px", borderRadius: 8,
          background: "#3b82f6",
          fontFamily: "'Source Sans 3', sans-serif", fontSize: 22, fontWeight: 600,
          color: "#fff", letterSpacing: 0.3,
        }}>
          {slide.ctaText}
        </div>

        <div style={{ marginTop: 56 }}>
          <div style={{
            fontFamily: "'Merriweather', Georgia, serif", fontSize: 20,
            color: "#9ca3af", fontWeight: 700,
          }}>
            {slide.author}
          </div>
        </div>
      </div>
    </div>
  );
}

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

  const getSlideColor = (s) => {
    if (s.type === "pattern") return s.infraColor;
    return "#3b82f6";
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0e17",
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "28px 0",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Source+Sans+3:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Code+Pro:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{
          fontFamily: "'Merriweather', Georgia, serif", fontSize: 20, color: "#e5e7eb",
          fontWeight: 700, margin: "0 0 6px 0",
        }}>
          LinkedIn Carousel Preview
        </h1>
        <p style={{
          fontFamily: "'Source Sans 3', sans-serif", fontSize: 14,
          color: "#6b7280", margin: 0,
        }}>
          Slide {currentSlide + 1} of {slides.length} — 1080 × 1080 px
        </p>
      </div>

      {/* Slide viewer */}
      <div style={{
        position: "relative", display: "flex", alignItems: "center",
        gap: 16, marginBottom: 20,
      }}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          style={{
            width: 44, height: 44, borderRadius: 8,
            background: currentSlide === 0 ? "#1f2937" : "#374151",
            border: "1px solid #4b5563",
            color: currentSlide === 0 ? "#4b5563" : "#e5e7eb",
            fontSize: 18, cursor: currentSlide === 0 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          ‹
        </button>

        <div style={{
          width: 1080 * scale, height: 1080 * scale,
          borderRadius: 8, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          border: "1px solid #1f2937",
        }}>
          <div style={{
            transform: `scale(${scale})`, transformOrigin: "top left",
            width: 1080, height: 1080,
          }}>
            {renderSlide(slide)}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
          disabled={currentSlide === slides.length - 1}
          style={{
            width: 44, height: 44, borderRadius: 8,
            background: currentSlide === slides.length - 1 ? "#1f2937" : "#374151",
            border: "1px solid #4b5563",
            color: currentSlide === slides.length - 1 ? "#4b5563" : "#e5e7eb",
            fontSize: 18,
            cursor: currentSlide === slides.length - 1 ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600,
            transition: "all 0.15s",
          }}
        >
          ›
        </button>
      </div>

      {/* Dot navigation */}
      <div style={{
        display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap",
        justifyContent: "center", maxWidth: 420,
      }}>
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            style={{
              width: i === currentSlide ? 24 : 8, height: 8,
              borderRadius: 4, border: "none",
              background: i === currentSlide ? getSlideColor(s) : "#374151",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
          />
        ))}
      </div>

      {/* Current slide label */}
      {slide.type === "pattern" && (
        <div style={{
          textAlign: "center", padding: "10px 24px", borderRadius: 8,
          background: "#1f2937", border: "1px solid #374151",
        }}>
          <span style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 13,
            color: "#9ca3af", fontWeight: 500,
          }}>
            #{slide.number}
          </span>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 14,
            color: "#e5e7eb", fontWeight: 500, margin: "0 8px",
          }}>
            {slide.infraTitle}
          </span>
          <span style={{
            fontFamily: "'Source Code Pro', monospace", fontSize: 13,
            color: "#6b7280",
          }}>
            ↔
          </span>
          <span style={{
            fontFamily: "'Source Sans 3', sans-serif", fontSize: 14,
            color: "#e5e7eb", fontWeight: 500, margin: "0 8px",
          }}>
            {slide.appTitle}
          </span>
        </div>
      )}
    </div>
  );
}
