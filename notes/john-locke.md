---
domain: philosophy
patterns: [abstraction, protocol, interface, consent]
---

# john locke

> **in one line:** locke treats legitimate government as a service running on a contract — natural rights are the invariant spec the state must not violate, the social contract is the authorization users grant, and revolution is the rollback triggered when the service breaches its own terms.

## the mapping

locke's political philosophy in the *two treatises of government* (1689) is structured like a **service-level agreement between citizens and the state**. before the state, there is a natural order with natural rights; the state is a layer added on top to enforce those rights more reliably. legitimacy comes not from tradition or divine appointment but from the contract — from consent. and like any contract, it is terminable when the provider violates the terms.

### the pre-state layer — natural rights as the invariant spec

locke's baseline is a **state of nature** where people already have rights: to life, liberty, and property. these are not granted by government; they precede it. in system terms, they are the invariant specification — the guarantees that must hold regardless of what runtime runs on top.

property, for locke, originates in labor: mixing your effort with an unclaimed thing makes it yours. this is the **write permission model**: you acquire ownership by doing work that leaves your mark on a thing. others cannot read that write without consent.

### the social contract — a voluntary service subscription

the state of nature has a problem: enforcement. your rights are real but unguaranteed; a stronger party can violate them with no reliable recourse. so people **voluntarily contract** to give up some freedom of self-enforcement in exchange for a reliable enforcement service — law courts, police, a legislature.

the contract is the authorization mechanism. the state gets power only because individuals grant it. this is the foundational move that makes locke's political theory a **consent-based authorization model** rather than a command-based one. legitimacy flows upward from the governed, not downward from a monarch.

```
# hobbesian model (rejected): state has absolute authority, no rollback
state = Sovereign(power=absolute, terminable=False)

# lockean model: state is a contracted service with revocable authorization
state = Service(
    spec=["protect life", "protect liberty", "protect property"],
    authorized_by=consent_of_governed,
    terminable=True  # see: right of revolution
)
```

### separation of powers — fault isolation

locke argued for splitting legislative and executive power. this is **fault isolation**: if one branch misbehaves, the other is not compromised. concentrating both in one entity creates a [[spof|single point of failure]] — a legislature that also executes its own laws has no check on whether execution matches the spec.

this directly influenced montesquieu's fuller separation-of-powers theory and the u.s. constitutional design.

### the right of revolution — rollback as a designed feature

the sharpest and most radical part of locke's system is that citizens retain the right to dissolve a government that has broken the contract. if the state uses its power against the rights it was created to protect — arbitrary seizure, rule without consent — the authorization is revoked and the contract terminated.

this is **rollback as a designed-in feature**, not a failure mode. the system is correct precisely because it includes a mechanism for replacing a provider that has violated the SLA. locke is careful: revolution isn't triggered by every grievance; the threshold is systematic breach, not inconvenience. but the mechanism must exist, or the contract is not a contract — it's just subjection with extra steps.

### property and its limits — an often-forgotten clause

locke's labor theory of property has a proviso: acquisition is legitimate only when there is "enough and as good left in common for others." this is a **resource constraint** built into the ownership model: you can accumulate from the commons only up to the point where others are not deprived of a fair share of what was common.

locke himself thought money allowed this constraint to be bypassed (people can consent to inequality). later thinkers — and critics of [[capitalism]] — found the proviso more radical than locke acknowledged.

## where the analogy breaks down

- **consent is mostly fictional.** locke never solved the bootstrapping problem: no one actually signs the social contract. later philosophers (Rousseau, Rawls) wrestled with what it means to "consent" by being born into and staying in a society. the analogy makes the authorization look cleaner than it ever is in practice.
- **"natural rights" need a source.** calling life, liberty, and property invariant spec begs the question of where that spec comes from. locke grounds it in God; a secular reader has to find another foundation. the spec isn't self-evidently correct — it encodes a particular set of values (especially around property) that aren't universal.
- **the labor theory of property is contested.** mixing labor with a thing is a metaphor, not a mechanism. it isn't obvious why effort transfers ownership rather than just constituting effort. locke's own provisos cut against unlimited accumulation, but his system has been used to justify it.
- **the model assumes individuals as the unit.** locke's contract is between discrete, rational adults. it struggles with children, the severely impaired, and anyone whose position is fundamentally shaped by group membership rather than individual negotiation.
- **rollback in practice is not clean.** revolution is not a git reset. it produces violence, power vacuums, and uncertain outcomes. the "right of revolution" provides legitimation more than it provides a reliable procedure.

## related

- [[abstraction-layers]] — natural rights as the base layer the state is built on top of
- [[coupling]] — separating legislative and executive as deliberate loose coupling between branches
- [[rousseau]] — a different theory of the social contract; more collectivist, less property-centric
- [[kant]] — grounds rights in reason rather than labor and natural law
- [[neoliberalism]] — property rights and limited government as the platform layer; locke is a root
- [[capitalism]] — the labor theory of property is one philosophical foundation for private ownership
- [[philosophy]]

#domain/philosophy #pattern/abstraction #pattern/interface #pattern/coupling
