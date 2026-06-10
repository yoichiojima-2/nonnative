---
domain: computer-science
patterns: [abstraction, interpreter, hard-limits]
---

# lambda

> **in one line:** lambda is computation built out of nothing but functions — the discovery that a function is itself a value you can pass around, and that this one idea is enough to compute anything a computer can.

## what it is

"lambda" wears two faces that are really the same idea. up close it's the everyday **anonymous function** — `lambda x: x + 1`, a function written as a value rather than declared with a name. underneath it's **lambda calculus**, the formal model of computation that everyday lambdas are a fragment of: the claim that *functions alone* are a complete foundation for computing. lead with the small one, then watch it scale all the way down to bedrock.

### the everyday lambda — a function that is a value

normally a function is a thing you *define* and then *call*. a lambda skips the naming: it's a function written inline, in the middle of an expression, as a value like `5` or `"hi"`. that small move has a big consequence — functions become **first-class**: you can pass one as an argument, return one from another function, and store one in a variable.

```python
add_one = lambda x: x + 1          # a function, held in a variable like any value
list(map(lambda x: x * 2, nums))   # a function, passed as an argument
```

a function that takes or returns functions is **higher-order** — `map`, `filter`, `reduce` are the canonical three. once functions are values, you can build with them the way you build with data.

### lambda calculus — computation from functions alone

now strip everything else away. lambda calculus (alonzo church, 1930s) has exactly three forms, and *nothing else*:

```
  x            a variable
  λx. M        abstraction  — a function of x with body M
  M N          application  — apply function M to argument N
```

no numbers. no booleans. no loops. no built-in anything — just functions and the act of applying them. there is a single operation, **beta-reduction**: to apply a function, substitute the argument for the variable in the body.

```
  (λx. x + 1) 5   →   5 + 1   →   6
            substitute x := 5
```

the startling part is that this is *enough*. numbers can be encoded as functions (a "church numeral" *n* is the function that applies another function *n* times). true and false can be encoded as functions that pick one of two arguments. pairs, lists, recursion, arithmetic — all of it falls out of pure functions with no primitives underneath. and because there are no guard rails, the model also contains non-termination for free: `(λx. x x)(λx. x x)` reduces to itself, forever — the same unfixable [[turing-machine|halting]] limit, showing up from the other side.

### church–turing — the same ceiling, a different machine

this is the deep result. lambda calculus and the [[turing-machine]] compute **exactly the same set of functions** — church and turing proved their models equivalent. two utterly different starting points — a tape with a head crawling along it, versus pure substitution of functions — climb to the *identical* capability ceiling. neither can compute anything the other can't.

that equivalence is why programming has two great lineages that are secretly the same machine: the imperative tradition (C, python's statements, step-by-step mutation) descends from the turing machine; the functional tradition (lisp, ml, haskell) descends from lambda calculus. same power, different ergonomics — one thinks in *steps that change state*, the other in *values that flow through functions*.

## where the model breaks down

- **pure lambda calculus is unusable as an actual computer.** encoding the number 3 as "apply a function three times" is elegant and absurd — addition costs real reductions, and there's no I/O, no state, no clock, no time. it's a model of *what is computable*, not a thing you'd compute with. real functional languages bolt primitives (actual integers, actual effects) back on.
- **"a function is just a value" hides closures.** an everyday lambda usually captures variables from the surrounding scope — it drags an environment along with it. pure lambda calculus has no environment to capture; the clean substitution story gets more complicated the moment a real language adds mutable state.
- **equivalence is about capability, not cost.** same as the turing-machine caveat: lambda calculus computes the same functions, but says nothing about whether it does so in a second or a century. turing-completeness is not a performance claim.
- **untyped, it permits nonsense.** with no type system every term can be applied to every term, including self-application and non-terminating loops — you can write questions that have no answer. typed lambda calculi tame this, at the cost of rejecting some valid programs.

## related

- [[turing-machine]] — the equivalent model from the opposite direction; the church–turing thesis pins them to the same ceiling
- [[currying]] — in lambda calculus every function takes exactly one argument, so multi-argument functions *only* exist by currying
- [[abstraction-layers]] — the function as the fundamental unit of abstraction: a named promise hiding a body
- [[system-design]] — first-class functions as a building block you can pass between components
- [[science]]

#domain/computer-science #pattern/abstraction #pattern/interpreter #pattern/hard-limits
