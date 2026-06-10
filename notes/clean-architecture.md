---
domain: computer-science
patterns: [coupling, abstraction-layers, modularity]
---

# clean architecture

> **in one line:** clean architecture is a single rule about which way the arrows point — your core business logic depends on nothing, and every volatile detail (database, web framework, UI) depends *inward* on the core, so the things that change fastest can be swapped without touching the things that matter most.

![concentric layers with dependencies pointing inward: frameworks and drivers depend on interface adapters, which depend on use cases, which depend on entities at the stable core — and never the reverse](assets/clean-architecture-dependency-rule.svg)

## what it is

systems rot when business logic gets braided into the framework and the database, until you can't change one without disturbing the others. clean architecture — and its close kin, hexagonal / **ports-and-adapters** and onion architecture — is one organizing principle for preventing that: the **dependency rule**. picture the system as concentric rings, stable core at the center, volatile detail at the rim.

- **entities** — the core business rules, the part truest regardless of any app. most stable.
- **use cases** — application-specific logic that orchestrates the entities.
- **interface adapters** — controllers, presenters, gateways that translate between the core and the outside world.
- **frameworks & drivers** — the web framework, the database, the UI, external services. the most volatile, the outermost ring.

**the dependency rule: source-code dependencies point only inward.** an inner ring knows nothing about an outer one. the database does not get to dictate your business logic; your business logic doesn't even know a database *exists*.

### dependency inversion — the trick that makes it possible

naively the arrow points the wrong way: business logic needs to save a user, so it depends on the database. clean architecture **inverts** that. the core declares an interface — a **port** — for what it needs; the outer layer writes an **adapter** that implements it. now the database depends on an abstraction the *core* owns, not the reverse. the detail plugs into the core.

```python
# core owns the interface (the port) and knows nothing about postgres
class UserRepo(Protocol):
    def save(self, u: User) -> None: ...

class CreateUser:                       # a use case — depends only on the abstraction
    def __init__(self, repo: UserRepo): self.repo = repo

# outer layer (a detail) implements the core's interface — the arrow points inward
class PostgresUserRepo:                 # depends on the core, not vice versa
    def save(self, u: User) -> None: ...
```

the payoff is insulation: swap postgres for an in-memory store in tests, swap the web framework for a CLI, defer the database choice for months — the core never notices. it's [[coupling|loose coupling]] enforced by *direction*. the framework and database become **plugins to your application rather than its foundation** ("the database is a detail"). read it as [[system-design]] narrowed to one opinionated constraint: protect what's expensive to change from what's cheap and churny.

## where the model breaks down

- **the indirection isn't free.** ports, adapters, mappers, and DTOs multiply; for a small app or a thin CRUD service the ceremony can dwarf the logic it's protecting. that's [[clean-code|premature abstraction]] hoisted to architecture scale — layers added for a flexibility the app will never use.
- **"the database is a detail" oversells.** for data-heavy systems the database and the *shape of its queries* are the core problem, not a swappable accessory. pretending otherwise pushes you toward leaky, lowest-common-denominator persistence that throws away the engine's actual power.
- **the layer boundaries are judgment calls, not law.** put the seams in the wrong place and a one-field change means translating an object across four rings. the [[abstraction-layers|cut has to be in the right place]], and where that is isn't given — it's designed, and easy to get wrong.
- **you rarely actually swap the framework.** the headline payoff — replace postgres with mongo, replace the web with a CLI — is invoked far more often than it's exercised. you pay the abstraction tax up front for optionality you may never spend (the YAGNI tension at full volume).
- **it assumes logic and I/O cleanly separate.** in some domains the logic *is* the I/O — streaming, glue, ETL ([[spark]] jobs) — and there's little framework-independent "core" left to protect once you remove the data movement. the onion has no center.

## related

- [[system-design]] — clean architecture as system design under one constraint: arrows point inward
- [[coupling]] — the dependency rule as loose coupling enforced by direction
- [[abstraction-layers]] — ports as interfaces that turn the database and framework into plugins
- [[clean-code]] — the same instinct one level down; and the shared failure mode of over-abstraction
- [[tdd]] — isolating the core behind ports is what makes it testable without the real database

#domain/computer-science #pattern/coupling #pattern/abstraction-layers #pattern/modularity
