---
domain: computer-science
---

# react

> **in one line:** react is a way of building user interfaces by describing what the screen should look like for a given state, and letting a library figure out how to make the screen match.

## what it is

a user interface is a moving target. data arrives, the user clicks, time passes — and the pixels on screen have to keep up. the old way of doing this was **imperative**: you wrote step-by-step instructions to find the right element and mutate it ("locate the counter, read its text, add one, write it back"). every possible change needed its own hand-written transition, and keeping all those transitions consistent was where the bugs lived.

**react** inverts this. instead of describing the *transitions*, you describe the *destinations*. you write a function from state to a description of the ui — conceptually `ui = f(state)` — and react takes responsibility for getting the screen there. the core ideas:

- **components.** the unit of construction is a **component**: a function that takes inputs (*props*) and returns a description of some piece of the interface. components nest inside other components, so a whole application is one big function composed of smaller ones. this is ordinary [[abstraction-layers|abstraction]] applied to the screen — each component hides its internals behind a small, declarative surface.
- **declarative rendering.** you never say "change this text." you say "for this state, the text is *N*." when the state changes, you re-run the function and get a fresh description. you express *what*, not *how*.
- **state and re-rendering.** a component can hold **state** — data that persists across renders and, when updated, tells react to run the function again. a state change is the only thing that moves the picture; the render is always a pure consequence of it.
- **the virtual dom and reconciliation.** naively re-running everything and repainting the whole screen would be ruinously slow. so react renders to a lightweight in-memory description (the *virtual dom*), **diffs** the new description against the previous one, and applies only the minimal set of real changes. you get to *think* as if the whole screen is rebuilt every time, while the machine quietly does the cheap incremental update.
- **unidirectional data flow.** data flows down from parent to child through props; events flow back up through callbacks. there is one direction, so to understand why the screen looks the way it does you trace state downward rather than chasing mutations in every direction at once.

the whole thing is a single bargain: **give up direct control of the dom, and in return the gap between "what the data is" and "what the screen shows" closes by itself.**

## where this falls short

- **the abstraction leaks under performance pressure.** "just re-run the function" is the promise, but real apps spend enormous effort *preventing* re-renders — memoizing components, stabilizing callbacks, splitting state — to keep the diffing cheap. the moment performance matters, you are forced back into reasoning about exactly the mechanics react claimed to hide.
- **state has nowhere natural to live.** react tells you *how* to render from state but not *where* state should sit. as apps grow, deciding what is local, what is shared, and what is global becomes the hard problem, and an entire ecosystem of state-management libraries exists because the core model is silent on it.
- **`ui = f(state)` is a half-truth.** the function is supposed to be pure, yet real components are riddled with *effects* — fetching data, subscribing, touching the world — which are precisely the impure, ordered, imperative steps the model wanted to banish. effects are the awkward seam where the declarative ideal meets a stateful world, and they are a notorious source of bugs.
- **the diff is a heuristic, not magic.** reconciliation guesses which elements correspond across renders. when its guesses are wrong — most visibly when list items lack stable *keys* — it preserves or discards the wrong state, and you have to understand the algorithm to fix it.

## related

- [[abstraction-layers]] — a component hides its internals behind a declarative surface, exactly the move of hiding complexity behind an interface
- [[coupling]] — unidirectional data flow and props are a discipline for keeping components loosely coupled
- [[feedback-loop]] — state change → re-render → new screen is a controlled loop, with reconciliation as the corrector that keeps output matched to state
- [[caching]] — memoization and the virtual-dom diff are caching: keep the previous result, recompute only what actually changed
- [[lambda]] — components are just functions composed from functions; the ui is built the way lambda calculus builds everything
- [[clean-code]] — small, single-purpose components are the readability argument applied to interface code

#domain/computer-science #pattern/abstraction #pattern/feedback-loop #pattern/mutable-state #pattern/modularity
