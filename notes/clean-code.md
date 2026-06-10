---
domain: computer-science
patterns: [coupling, modularity, abstraction-layers]
---

# clean code

> **in one line:** clean code is [[system-design]] shrunk to its smallest scale — the same discipline of decomposition, low coupling, and clear interfaces, aimed not at servers and services but at functions, names, and modules, and optimized for the one resource that dominates software cost: the next person who has to read it.

## what it is

code is **read far more often than it's written**, and the binding constraint in software is human comprehension, not typing speed. clean code is the practice of optimizing for the reader — and once you frame it that way, its rules turn out to be [[system-design]] in miniature, the exact same vocabulary at the granularity of a single file:

- **meaningful names.** a name is an [[abstraction-layers|interface]]: it should tell you *what* a thing is for, not *how* it works. good naming is the cheapest documentation there is, and renaming is the cheapest refactor.
- **small functions, one responsibility.** each function does one thing, so it fits in your head. this is decomposition and high cohesion — the single-responsibility principle — applied below the level of a service.
- **low coupling, high cohesion.** the load-bearing one. things that change together belong together; things that don't are kept apart. minimize what each part must know about another, so a change touches few places. this is just [[coupling]], scaled down from systems to functions.
- **DRY — don't repeat yourself.** one piece of knowledge lives in exactly one place. duplication is coupling-by-copy: a change now has to be made in *n* spots, and you will miss one.
- **readability over cleverness.** the clever one-liner that saves the author a minute costs every future reader ten. point-free [[currying]] pushed too far is the cautionary case.

```python
# clever: write once, read never
r = [x for s in data for x in s if x % 2 == 0][::-1]

# clean: named steps, each one obvious on its own
evens  = [x for sub in data for x in sub if is_even(x)]
result = list(reversed(evens))
```

### why it's the same thing as system design

swap "service" for "function" and "network call" for "function call" and the rules are *identical*: minimize coupling, hide the implementation behind an interface, give each part one job. clean code is system design at the scale of a file — which is exactly why the same words (coupling, cohesion, abstraction, interface, bottleneck) carry from a cluster diagram down to a thirty-line function without translation.

## where the model breaks down

- **"clean" is partly taste, and taste cargo-cults.** beyond a solid core — naming, small functions, don't repeat knowledge — much of the advice is contextual or just fashionable. applied as ritual, "best practices" produce over-abstracted, indirection-heavy code that's *harder* to follow than the blunt version it replaced.
- **premature abstraction is a real cost.** splitting into tiny functions and layers before you understand the shape of the problem is [[system-design|premature optimization]] aimed at readability — you bake the wrong seams in early, and wrong seams are expensive to move. sometimes the long, dumb, linear function genuinely *is* the clearest thing.
- **it optimizes maintainability, which isn't always the goal.** a one-off script, a research notebook, a hot inner loop have different objectives — delete-ability, raw speed — and applying enterprise clean-code ceremony to them is just mis-optimizing for a cost that won't be paid.
- **the rules conflict with each other.** DRY pulls against readability; "small functions" pulls against locality — chasing a single behavior through ten one-line helpers can be worse than reading one honest block. clean code is a set of **trade-offs, not commandments**, and treating any rule as absolute is itself the unclean move.

## related

- [[system-design]] — clean code as the same discipline at function-and-module scale
- [[coupling]] — low coupling and high cohesion as the central practice
- [[abstraction-layers]] — names and functions as interfaces that hide their implementation
- [[currying]] — point-free style as the cautionary tale of cleverness over clarity
- [[python]] — "readability counts" as a language built around the same value

#domain/computer-science #pattern/coupling #pattern/modularity #pattern/abstraction-layers
