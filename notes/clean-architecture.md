---
domain: computer-science
---

# clean architecture

> **in one line:** clean architecture is a single organizing rule — the core business logic depends on nothing, and every volatile detail depends inward on the core — so the parts that change most often can be swapped without touching the parts that matter most.

## what it is

software rots when business logic gets tangled with the framework and the database — until you cannot change one without disturbing everything else. clean architecture (and its close relatives, hexagonal architecture and ports-and-adapters) offers one principle to prevent this: the **dependency rule**.

picture the system as concentric rings. the stable, most important logic sits at the center. the volatile, easily-replaced details sit at the outside. **dependencies point only inward.** outer rings know about inner rings; inner rings know nothing about what surrounds them.

the rings, from inside out:

- **core business rules** — the logic that would be true regardless of what technology runs it. most stable.
- **application use cases** — the application-specific workflows that orchestrate the core.
- **interface adapters** — translators between the core logic and the outside world (controllers, response formatters, data translators).
- **external systems** — the database, the web framework, the UI, third-party services. most volatile, outermost ring.

the core declares an **interface** — what it needs — and the outer layer writes an **implementation** that satisfies it. the database plugs into the core; the core doesn't know the database exists. when you need to swap the database, change the web framework, or test the logic in isolation, the core is unaffected.

## where this falls short

- **the indirection isn't free.** ports, adapters, translators, and intermediate objects multiply. for a small application, the ceremony of maintaining all these seams can dwarf the logic it's protecting. the architecture adds flexibility you may never use.
- **"the database is a detail" oversells.** for data-heavy systems, the database and the shape of its queries are often the central design problem, not a swappable accessory. treating storage as a peripheral concern can push you toward lowest-common-denominator abstractions that discard the actual power of the storage system.
- **the layer boundaries are judgment calls.** put the seams in the wrong place and a simple change requires translating an object across four levels. where the right seams are is a design problem; the architecture names the principle but doesn't tell you where to draw the lines.
- **you rarely actually swap the framework.** the headline benefit — replace the database, swap the web framework, switch to a different UI — is invoked far more often than exercised. you pay the complexity cost upfront for flexibility you may never spend.
- **it assumes logic and I/O cleanly separate.** in some domains the work *is* the data movement — pipelines, glue code, data transformation. when the job is mostly I/O, there may not be a substantial logic core to protect.

## related

- [[system-design]] — clean architecture as system design under one constraint: dependency arrows point inward
- [[coupling]] — the dependency rule as a way of enforcing loose coupling by direction
- [[abstraction-layers]] — the core declares interfaces; external details plug in as implementations
- [[clean-code]] — the same instinct applied at smaller scale; and the shared failure mode of over-abstraction
- [[tdd]] — the core behind well-defined interfaces is what makes it testable without external systems

#domain/computer-science #pattern/coupling #pattern/abstraction-layers #pattern/modularity
