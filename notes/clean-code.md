---
domain: computer-science
---

# clean code

> **in one line:** clean code is the practice of writing software that the next person can read and understand — optimizing not for the machine's speed but for the human's comprehension, since that is the scarce resource in software development.

## what it is

code is **read far more often than it is written.** the bottleneck in software is human comprehension, not typing speed or machine performance. clean code is the practice of writing for the reader — and when you frame it that way, its principles turn out to be the same problems of decomposition and dependency that arise in any large, complex system, just at the scale of a single file.

- **meaningful names.** a name is a promise: it should tell you what something is *for*, not how it works inside. good naming is the cheapest form of documentation, and it costs nothing to change.
- **small units, one responsibility each.** each function or module should do one thing, so it fits in your head. when something has multiple responsibilities tangled together, a change to one concern forces understanding of the other.
- **low coupling, high cohesion.** things that change together belong together; things that don't are kept apart. minimize what each part must know about another, so a change touches as few places as possible.
- **don't repeat yourself.** one piece of knowledge lives in exactly one place. duplication is hidden coupling: a change now has to be made in multiple spots, and you will miss one.
- **readability over cleverness.** the compact expression that saves the author a minute costs every future reader ten. code is communication with future colleagues, including your future self.

## where this falls short

- **"clean" is partly aesthetic and contextual.** beyond a solid core — naming, small units, no duplication — much of the advice is fashionable or situational. applied as ritual, clean code principles can produce heavily abstracted, indirection-heavy code that is *harder* to follow than the blunt version it replaced.
- **premature abstraction is expensive.** splitting into small functions and layers before you understand the shape of the problem bakes the wrong seams in early. wrong seams are costly to move; a long, direct, linear function is sometimes genuinely clearer.
- **it optimizes for maintainability, which isn't always the goal.** a one-off script, a prototype, a performance-critical inner loop have different objectives. applying software-craftsmanship principles to work that will be thrown away or run once is misallocating effort.
- **the principles conflict with each other.** "don't repeat yourself" pulls against "keep things close together for readability"; "small functions" pulls against "understand what a thing does without jumping around." these are trade-offs, not commandments, and treating any one as absolute is a mistake.

## related

- [[system-design]] — the same discipline at function and module scale
- [[coupling]] — low coupling and high cohesion as the central practice
- [[abstraction-layers]] — names and functions as interfaces that hide their implementation
- [[python]] — "readability counts" as a design value built into a language

#domain/computer-science #pattern/coupling #pattern/modularity #pattern/abstraction-layers
