---
domain: computer-science
---

# currying

> **in one line:** currying turns a function that takes multiple arguments at once into a chain of functions that each take one argument at a time — so you can supply arguments piece by piece, whenever they become available.

## what it is

named after the logician haskell curry. take a function that needs three pieces of information. **curry** it and you get a function that takes the first piece and returns a new function — one that takes the second and returns yet another, which finally takes the third and produces the result. the computation is unchanged; only the shape is different.

### partial application — the practical payoff

because each step returns a function, you don't have to supply all arguments at once. you can stop partway and hold onto the half-finished function. fix some arguments now, supply the rest later. this is **partial application**: specializing a general function into a specific one by baking in some of its inputs.

a general "add any two numbers" function becomes a specific "add ten to this number" function by fixing the first argument as ten. the specialized version can be passed around, stored, and used wherever that particular operation is needed.

### why it exists — the theoretical foundation

in [[lambda|lambda calculus]], every function takes exactly one argument. there is no syntax for a function of multiple arguments. so multi-argument functions are *defined* by currying: a function of two arguments is a one-argument function that returns a one-argument function. currying is not an optional technique in that context — it is the only way to handle more than one input.

some programming languages (notably haskell) adopt this by default: every function automatically takes one argument at a time, and partial application works everywhere without requiring any special syntax.

## where this falls short

- **currying adds no new capability, only shape.** curried and uncurried forms compute the same result. in most languages currying is purely ergonomic — a style choice rather than a meaningful distinction.
- **currying and partial application are not the same thing.** currying always produces a chain of strictly one-argument functions; partial application simply means fixing some arguments of a function while leaving others open. you can partially apply without currying. the two are often conflated.
- **functions with a variable number of arguments resist currying.** currying needs to know how many arguments are coming. a function that accepts any number of arguments has no fixed chain length to unfold.
- **chains of functions have a performance cost.** each step creates a new function object that holds references to previously-supplied arguments. in languages not built around currying, this overhead can matter.
- **point-free style can wreck readability.** deeply curried, argument-free programming can collapse into a pipeline where nothing is named and the flow of data is invisible. the abstraction stops paying for itself.

## related

- [[lambda]] — currying is native to lambda calculus, where every function is unary by definition
- [[abstraction-layers]] — partial application as carving a specific interface out of a general one
- [[coupling]] — currying allows arguments to be supplied at different times, loosening when each input must be known
- [[clean-code]] — point-free style as the cautionary case of cleverness over clarity

#domain/computer-science #pattern/abstraction #pattern/interface
