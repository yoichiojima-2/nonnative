---
domain: engineering
---

# feedback loop

> **in one line:** a feedback loop is when a system watches its own output and uses it as an input — so it can steer toward a target, or spiral away from one.

## what it is

a system with a feedback loop *responds to its own results.* it measures where it is, compares that to where it should be, and uses the difference to decide what to do next. that difference — the **error signal** — is the engine. the two types behave in opposite ways:

- **negative feedback — self-correcting.** the loop pushes *against* any deviation from a target, shrinking the gap. a thermostat is the textbook case: too cold → heat on, too warm → heat off. negative feedback produces **stability** — the system settles toward a setpoint and stays there.
- **positive feedback — self-reinforcing.** the loop *amplifies* its own output, so each cycle feeds the next. this is runaway behavior: compound interest, a microphone in front of a speaker, a viral rumor. there is no setpoint — just acceleration, until something external interrupts it.

the key elements are: a **target** (what the system is trying to achieve), a **measurement** (what is actually happening), an **error** (the gap between them), and a **correction** (the response). the direction of that response determines whether the loop stabilizes or accelerates.

## where this falls short

- **delay turns stabilizing into destabilizing.** if the correction arrives too late, the system overshoots, corrects too hard the other way, and begins to oscillate. the same mechanism that should dampen deviation instead amplifies it, just more slowly.
- **positive isn't "bad" and negative isn't "good."** the names are mechanical, not moral. positive feedback drives growth, learning, and innovation; negative feedback can trap a system in an unproductive equilibrium. which one you want depends entirely on the goal.
- **not everything has a clear target.** the model assumes a well-defined setpoint to steer toward. many real systems have shifting, contested, or undefined goals — in which case "the error signal" is not well-defined either.
- **loops interact.** real systems contain many feedback loops working simultaneously, reinforcing and counteracting each other. isolating "the" feedback loop is almost always a simplification.

## related

- [[science]] — the scientific method as a loop that corrects models against reality
- [[buddhism]] — craving as a self-reinforcing positive loop with no setpoint
- [[capitalism]] — profit and loss as the signal; competition as the feedback mechanism
- [[react]] — state change drives a re-render, and reconciliation corrects the screen back to the state
- [[coupling]]

#domain/engineering #pattern/feedback-loop #pattern/control
