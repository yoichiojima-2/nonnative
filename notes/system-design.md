---
domain: computer-science
---

# system design

> **in one line:** system design is the discipline of deciding how to divide a complex thing into parts, what each part is responsible for, how the parts communicate, and which trade-offs you're willing to accept — because no option is free.

## what it is

writing a single function is *coding*. deciding the **shape of the whole** — what the components are, where the boundaries fall, how information flows between them, what happens when a part fails — is system design. it's the level above the code, where you reason about a system as a structure of interacting parts rather than as lines to execute.

a system design is mostly answers to a handful of recurring questions:

- **decomposition** — what are the pieces, and what is each one responsible for? slice the system until each part is small enough to reason about cleanly.
- **coupling** — how independently can the pieces change? when a change in one part forces a change in another, they are [[coupling|tightly coupled]]. loose coupling is what lets different people work on different parts and lets the system evolve without everything moving at once.
- **communication** — what is the contract between parts? what does each one promise to provide, and what can it expect in return?
- **bottlenecks and failure** — where is throughput limited? which single part's failure would take the whole system down?
- **trade-offs** — and this is the heart of it: **there is no free option.** speed versus accuracy, simplicity versus flexibility, cost now versus cost later. you don't *solve* these tensions; you *choose which cost to pay*.

that last point is what distinguishes design from coding. a function can be correct or incorrect. a system design is rarely right or wrong outright — it is a set of trade-offs that fit a context, or don't. ask a system designer almost anything and the honest first answer is "it depends," because the best choice genuinely changes with scale, budget, and what matters most.

### the recurring vocabulary

a few ideas recur in almost every design problem:

- [[abstraction-layers]] — hiding messy details behind a simple interface
- [[coupling]] — how much a change in one part forces a change in another
- [[caching]] — keeping a copy of something close to where it's needed, to avoid recomputing it
- [[feedback-loop]] — how a system monitors itself and corrects its own behavior
- a **single point of failure** — a component whose failure brings everything else down
- and the recurring tensions: **speed versus accuracy**, **scalability versus simplicity**, **flexibility versus cost**

## where this falls short

- **not every system was designed.** evolution, markets, languages, and cultures are systems no one architected — they emerged. applying design vocabulary to them is useful for analysis but treats as intentional what was actually accidental.
- **the vocabulary can create false clarity.** having precise words for "coupling" or "bottleneck" can make a messy situation feel more analyzed than it actually is. a clean diagram does not guarantee the system actually works the way the diagram implies.
- **human and social trade-offs are about values, not just performance.** describing a political or moral choice as "an architecture decision" can frame a value judgment as a neutral technical observation. that framing is itself a move in an argument.
- **best practices change.** design patterns that were correct at one scale or cost structure become anti-patterns at another. there is far less eternal truth in the boxes-and-arrows than the diagrams suggest.

## related

- [[abstraction-layers]]
- [[coupling]]
- [[caching]]
- [[feedback-loop]]
- [[turing-machine]]
- [[lambda]]
- [[liberal-arts]]

#domain/computer-science #pattern/abstraction-layers #pattern/modularity #pattern/coupling
