# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**The Pattern Mirror** is a 4-part LinkedIn Newsletter series by Kurt Mitchell that maps enterprise/platform infrastructure patterns to application-level equivalents, each traced to mathematical foundations. Core thesis: "Same Problem, Different Layer" — architecture is fractal.

The repo contains written content (Markdown + styled HTML previews) and an interactive React/JSX carousel component. There is no build system, package.json, or test framework.

## Repository Structure

- `Episode1/` through `Episode4/` — Each contains a `.md` (raw content for LinkedIn) and `.html` (styled preview)
- `PatternMirrorCarousel/` — React JSX carousel component; `pattern-carousel-v5.jsx` is the latest version
- `docs/` — Published HTML (Episode 1 as index.html)
- `pattern-mirror-summary.md` — Comprehensive context document with style guide, series structure, and constraints

## Content Architecture

12 pattern pairs across 4 episodes (3 per episode), each with: Platform Pattern ↔ Application Pattern ↔ Mathematical Foundation.

- **Ep 1 "The Middlemen"**: Communication patterns (Reverse Proxy/Mediator, API Gateway/Broker, Service Bus/Observer)
- **Ep 2 "The Workflows"**: Process patterns (Orchestrator/Pipeline, EaC/Saga, Strangler Fig/Adapter)
- **Ep 3 "Resilience & Performance"**: Survival patterns (Circuit Breaker/Retry, CDN/Memoization, Leader Election/Mutex)
- **Ep 4 "The Deep End"**: CS meets math (Consistent Hashing/HashMap, Service Mesh/Graph Traversal, TLS/Key Exchange)

## Article Structure (follow exactly for new/revised episodes)

Series badge → Title → Subtitle → Intro → Three patterns (each with Platform, Application with C# code, insight callout, Math Foundation callout) → "The Bigger Picture" closing with comparison table and career section → Series footer with author byline.

## Style & Voice

- Technical but accessible; real-world analogies; honest about tradeoffs
- Code examples primarily in C# (.NET), Java (Spring Boot) where it broadens reach
- Name specific technologies (Azure APIM, Terraform, Polly, Kafka, etc.)
- **NEVER** reference specific company projects or identifiable work details
- Author byline: **Kurt Mitchell** — Enterprise Architect & Senior Software Engineer | Designing distributed systems across DoD, hospitality, healthcare, aviation, and cloud platforms for 20 years.

## HTML Preview Design System

- Background: `#0a0e17`, Cards: `#1f2937`
- Fonts: Merriweather (headings), Source Sans 3 (body), Source Code Pro (code) — all Google Fonts
- Callout colors: Math = amber border (`#f59e0b`), Warning = red (`#2e1a1a`/`#fca5a5`), Insight = green (`#1a2e1a`/`#86efac`), Bridge = indigo/purple
- Pattern numbers: large, faded blue (`#60a5fa`, opacity 0.15)
- Code highlighting: keywords purple (`#c084fc`), types cyan (`#67e8f9`), strings green (`#34d399`), comments gray (`#6b7280`)

## Cross-Episode Continuity

Episodes reference each other — check `pattern-mirror-summary.md` "Cross-Episode Bridges" section before editing to maintain established callbacks (e.g., Ep 2 teases "registry problem" delivered in Ep 3; Ep 2 "step memoization" revisited in Ep 3 Cache section).

## Carousel Component

The JSX carousel (`pattern-carousel-v5.jsx`) is a standalone React component with 13 animated SVG slides (title + 12 patterns + CTA). Uses React hooks (useState, useEffect), no external dependencies beyond React. Would need integration into a React app to run.
