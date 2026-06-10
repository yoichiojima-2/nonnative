---
domain: computer-science
---

# coupling

> **in one line:** coupling is how much two parts of a system depend on each other — how much a change in one forces a change in, or breaks, the other.

## what it is

build anything out of interacting parts and you have to decide how tightly those parts are connected. **coupling** measures the strength of that connection.

when two parts are *tightly coupled*, you cannot touch one without understanding and probably changing the other. when they are *loosely coupled*, each can change, fail, or be replaced on its own, as long as the agreement between them — the **interface** — still holds.

the usual patterns:

- **interfaces reduce coupling.** if part A interacts with part B only through a stable, agreed-upon contract, B's internal workings can change freely. the interface absorbs the change and prevents it from propagating. the interface is the seam that keeps the two sides independent.
- **why loose coupling matters.** loosely coupled parts can be developed, tested, deployed, and reasoned about independently. one can fail without dragging others down with it.
- **tight coupling causes cascades.** when A's behavior depends directly on B's internal state, a change or failure in B propagates into A, and from there outward. a small local problem becomes a system-wide failure.
- **cohesion is the complement.** the goal is not zero connections — it is keeping things that genuinely belong together close (high cohesion) and keeping things that don't need each other apart (low coupling).

## where this falls short

- **some coupling is irreducible.** parts that genuinely must cooperate have to share something. you can move coupling onto an interface or a shared protocol, but you cannot eliminate it entirely. "zero coupling" usually means the parts are not actually working together.
- **loose coupling has costs.** every layer of indirection added to separate two parts is one more thing to understand and maintain. aggressively minimizing coupling can produce elaborate, hard-to-follow structures that hide what is actually a simple, direct relationship.
- **hidden coupling is worse than visible coupling.** two components with no explicit connection can still be coupled through shared data, timing assumptions, or implicit expectations — dependencies you cannot see are harder to manage than the ones you can.

## related

- [[buddhism]] — attachment as tightly coupling your wellbeing to states you don't control
- [[philosophy]] — its branches coupled bidirectionally rather than in a clean one-way hierarchy
- [[caching]]
- [[abstraction-layers]]

#domain/computer-science #pattern/coupling
