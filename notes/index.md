# index

> **a map of content for this vault.** every note explains something through the lens of system design. the **engineering primitives** are the shared vocabulary; the **domain concepts** borrow them as lenses and link back — hubs and spokes.

## the vocabulary — engineering primitives

explained concept-first; these are the building blocks everything else reuses.

- [[system-design]] — the lens itself: parts, interfaces, bottlenecks, and trade-offs
- [[abstraction-layers]] — hiding the messy details behind a simple interface
- [[caching]] — a small fast copy kept close to where it's needed
- [[coupling]] — how much a change in one part forces a change in another
- [[feedback-loop]] — a system feeding its own output back into its input
- [[turing-machine]] — the bare-metal definition of what counts as computation
- [[lambda]] — computation built out of nothing but functions
- [[currying]] — turning a many-argument function into a chain of one-argument ones
- [[python]] — a language that optimizes human time over machine time
- [[spark]] — a distributed computation disguised as a single list
- [[medallion-architecture]] — raw → cleaned → aggregated: three quality tiers that contain source messiness at the edge
- [[clean-code]] — system design shrunk to the scale of a single file
- [[clean-architecture]] — one rule about which way the dependency arrows point
- [[tdd]] — write the failing test first; a red-green-refactor loop

## the concepts — by domain

### philosophy

- [[philosophy]] — the base layer of the knowledge stack
- [[buddhism]] — an incident postmortem for the mind, scaled out to emptiness and compassion
- [[descartes]] — a secure boot for knowledge
- [[kant]] — the mind as a rendering pipeline
- [[wittgenstein]] — two major versions of meaning
- [[john-locke]] — legitimate government as a terminable service contract
- [[rousseau]] — political authority as a consensus protocol producing the general will

### science

- [[science]] — test-driven development against reality

### economics

- [[neoliberalism]] — coordination as a decentralized protocol
- [[capitalism]] — private ownership and a self-compounding surplus loop
- [[socialism]] — collective ownership and shared infrastructure instead of private accumulation

### religion

- [[christianity]] — a salvation protocol with a root-level mediating proxy

### literature

- [[1984]] — a totalitarian state as a distributed surveillance system with a SPOF by design

## by pattern

the same engineering idea recurs across domains; follow a tag to see everywhere it shows up:

`#pattern/abstraction` · `#pattern/abstraction-layers` · `#pattern/caching` · `#pattern/consensus` · `#pattern/control` · `#pattern/coupling` · `#pattern/decentralization` · `#pattern/feedback-loop` · `#pattern/hard-limits` · `#pattern/horizontal-scaling` · `#pattern/interface` · `#pattern/interpreter` · `#pattern/modularity` · `#pattern/mutable-state` · `#pattern/observability` · `#pattern/spof` · `#pattern/versioning`
