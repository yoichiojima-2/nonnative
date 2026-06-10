---
domain: computer-science
---

# lambda

> **in one line:** lambda calculus is the discovery that functions alone — with nothing else — are sufficient to compute anything a computer can, and the anonymous function in everyday programming is a visible fragment of that deeper result.

## what it is

"lambda" appears in two related contexts that are the same idea at different scales.

**in everyday programming**, a lambda is an **anonymous function**: a function defined inline as a value, without giving it a name. this makes functions *first-class* — you can pass them as arguments, return them from other functions, and store them in variables, just like numbers or text. a function that takes or returns other functions is called higher-order.

**in mathematics**, lambda calculus (alonzo church, 1930s) is a formal model of computation built entirely from functions. it has exactly three elements: variables, the construction of a function (binding a variable), and the application of a function to an argument. no numbers, no booleans, no loops — just those three. everything else can be encoded within them.

what makes this remarkable: numbers can be represented as functions (a number *n* becomes the function that applies another function *n* times). true and false can be represented as functions that choose between two options. arithmetic, lists, conditional logic, and recursion all fall out of pure function application with no additional primitives. and because there are no stopping conditions, the model also contains non-termination: some expressions reduce forever, which turns out to map directly onto the halting problem.

### the church–turing equivalence

the deep result: lambda calculus and the [[turing-machine]] compute exactly the same set of functions. two radically different starting points — a tape with a read/write head versus pure substitution of function bodies — reach the same capability ceiling. neither can compute anything the other cannot.

this is why programming has two traditions that are, at bottom, the same: the imperative tradition (describing computation as a series of steps that change state) descends from the turing machine; the functional tradition (describing computation as values flowing through functions) descends from lambda calculus. same power, different ways of thinking.

## where this falls short

- **pure lambda calculus is not a practical computing tool.** encoding ordinary numbers as nested function applications is elegant in theory and absurd in practice. real functional programming languages add actual integers, I/O, and effects alongside the pure calculus.
- **"a function is just a value" hides closures.** in practice, a function created inside another function carries a reference to the surrounding environment. this is more complex than the pure substitution of lambda calculus, and the difference matters when a language also has mutable state.
- **equivalence says nothing about efficiency.** lambda calculus and a turing machine compute the same functions; they may differ wildly in how much time and space each computation requires. capability equivalence is not performance equivalence.
- **untyped lambda calculus allows nonsense.** without a type system, any function can be applied to any argument, including itself — which permits paradoxes and infinite loops. typed lambda calculi prevent this, at the cost of rejecting some otherwise-valid programs.

## related

- [[turing-machine]] — the equivalent model from a completely different foundation; church and turing proved them equivalent
- [[currying]] — in lambda calculus every function takes exactly one argument, so multi-argument functions require chaining
- [[abstraction-layers]] — the function as the fundamental unit of abstraction: a named promise hiding an implementation
- [[science]]

#domain/computer-science #pattern/abstraction #pattern/interpreter #pattern/hard-limits
