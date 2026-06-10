---
domain: computer-science
---

# test-driven development

> **in one line:** TDD inverts the usual order — you write the test before the code, so you define precisely what you want before building it, and a tight feedback loop keeps working behavior locked in as the code evolves.

## what it is

the ordinary approach: write code, then (maybe) test it. TDD flips this. the **test comes first**, and you only ever write code to satisfy a failing test. the discipline runs as a three-beat loop, repeated for every small piece of behavior.

- **red — write a failing test.** describe the behavior you want as a test for code that doesn't yet exist, run it, and watch it fail. the failure is the point: a test you've *seen* fail is a test you know is actually checking something. a test that was never observed to fail could be checking nothing at all.
- **green — make it pass, minimally.** write the simplest thing that makes the test pass. not elegant, not general — just passing. the only job at this step is to satisfy the test in front of you.
- **refactor — improve under green.** now that a passing test pins the behavior in place, clean up the code — rename, reorganize, remove duplication — and rerun the tests. because the test holds the behavior steady, you can improve the code without fear of breaking it.

writing the test first forces you to define the interface before implementing it — you have to decide what something should do before you decide how it works. the accumulating test suite is also a living description of the system's behavior: unlike documentation, it cannot describe something wrong without showing up as a failure.

## where this falls short

- **passing means "matches the spec you wrote," not "correct."** you can faithfully follow TDD and still build the wrong thing, if the tests describe the wrong behavior. the loop converges on what you specified, not necessarily on what you needed.
- **it biases toward what's easy to test.** pure, self-contained functions are easy to test and tend to get thorough coverage. the parts that involve real-world side effects, timing, and external dependencies — often the riskiest parts — resist test-first and quietly receive less attention.
- **test coverage is a proxy metric.** "every line ran during tests" is not the same as "every important behavior is verified." optimizing coverage as a number can produce suites that run everywhere and assert almost nothing.
- **tests can couple too tightly to the implementation.** writing tests before the code sometimes pushes toward artificially decomposed designs that are testable but unnecessarily complex. tests that depend on internal details break on every refactor, defeating the stability the loop was supposed to provide.
- **it doesn't fit exploratory work.** when you don't yet know what you're building — research, prototyping, feeling out how a UI should work — writing tests first is writing specifications for behavior you haven't discovered yet. test-first assumes you already know the target.

## related

- [[science]] — a parallel structure: both involve defining what would count as failure before running the experiment
- [[feedback-loop]] — the red-green-refactor cycle as a self-correcting loop
- [[clean-code]] — refactoring under green as the safe path to cleaner code
- [[clean-architecture]] — designing the interface from the caller's side before implementing it
- [[abstraction-layers]] — test-first as a way to define what a layer promises before building what's underneath

#domain/computer-science #pattern/feedback-loop #pattern/interface
