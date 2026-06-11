---
domain: computer-science
---

# caching

> **in one line:** a cache is a small, fast copy of data kept close to where it's needed, so you don't pay the full cost of retrieving or recomputing it every time.

## what it is

fetching data from a slow source — a database, a network, a disk — or recomputing an expensive result takes time. a **cache** sidesteps that by keeping a copy of the answer somewhere fast and nearby. the next time you need it, you read the copy instead of redoing the work.

the mechanics recur everywhere:

- **hit and miss.** a *cache hit* is when the data you want is already in the cache — you get it quickly. a *miss* is when it isn't, so you fall back to the slow source and usually store the result for next time.
- **staleness.** the cached copy is a snapshot taken at one moment. if the underlying source changes, the copy no longer matches reality — but the cache doesn't know that. a stale cache returns the wrong answer with full confidence.
- **invalidation.** deciding when to discard or refresh a stale copy. famously difficult: refresh too often and you lose the speed benefit; too rarely and you serve wrong answers.
- **eviction.** a cache is small, so when it fills up something must go. common policies drop whichever item was used least recently, on the bet that recent use predicts future use.

the whole thing is a single trade: **speed bought with the risk of being out of date.**

## where this falls short

- **a cache can quietly lie.** its defining failure mode is returning a confident answer that is no longer correct. unlike a slow-but-accurate source, a stale cache *looks* fine — there is no visible signal that something is wrong.
- **invalidation has no general solution.** knowing exactly when a copy went stale often requires being tightly connected to the source — which is exactly the kind of connection the cache was meant to avoid.
- **multiple caches compound the problem.** once several caches hold copies of the same thing, keeping them consistent with each other and with the source becomes a hard problem in its own right.
- **it is not always worth it.** caching adds complexity and a new class of bugs. for cheap, rarely-repeated work, the overhead of maintaining a cache outweighs the benefit.

## related

- [[buddhism]] — craving as a fixed expectation the mind refuses to update, even as reality moves on
- [[science]] — a theory as a provisional model continuously checked against new observations
- [[cognitive-function]] — working vs. long-term memory as a fast-tier / slow-tier hierarchy in the mind
- [[large-language-model]] — the trained weights as a lossy compressed cache of the training data, with the same staleness and invalidation problems
- [[coupling]]
- [[abstraction-layers]]

#domain/computer-science #pattern/caching
