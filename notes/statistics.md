---
domain: science
---

# statistics

> **in one line:** statistics is the discipline of reasoning under uncertainty — drawing conclusions about a whole from a part, and being honest about how much you could be wrong.

## the core problem

you can almost never measure everything. you want to know something about a **population** — every voter, every manufactured part, every patient with a disease — but all you can afford to look at is a **sample**, a handful drawn from it. statistics is the set of tools for crossing that gap: for saying something quantitative about the whole when you have only seen a piece, *and for quantifying how much that leap might be off.*

the second clause is what separates statistics from ordinary counting. a number describing your sample — the average height of the hundred people you measured — is just a fact. statistics begins when you ask what that sample average tells you about the millions you didn't measure, and how confident you are allowed to be.

### description vs. inference

the field splits into two halves. **descriptive statistics** summarizes data you have: the mean as a center of mass, the variance as a measure of spread, a histogram as the shape of the whole. it makes no claims beyond the data in hand.

**inferential statistics** is the harder and more interesting half. it uses the sample to make claims about the population it came from — and every such claim is a bet whose odds the method tries to make explicit. inference is where uncertainty stops being an embarrassment and becomes the actual subject matter.

### the signal-and-noise framing

every measurement is a mixture of **signal** — the real underlying pattern — and **noise** — the random variation that comes from sampling a finite, jittery world. the central difficulty is that any given sample's quirks look exactly like signal until you have a way to discount them. statistics is, at bottom, a discipline for telling the two apart: for deciding whether the pattern you see is really there or is just the shape this particular handful of data happened to take.

### the hypothesis test and the p-value

the dominant tool for that decision is the **hypothesis test**. you set up a *null hypothesis* — a deliberately boring claim that there is no effect, the coin is fair, the drug does nothing — and ask: if that were true, how surprising is the data i actually got? the **p-value** answers exactly that and only that — *the probability of seeing data this extreme if the null hypothesis were true.* a small p-value means your data would be a strange coincidence under the boring story, so you reject the boring story.

note how indirect this is. the test never tells you the probability that your hypothesis is true. it tells you how compatible your data is with the *opposite* hypothesis, and lets you argue by elimination. this awkward, double-negative structure is the source of nearly every misuse of statistics.

### the law of large numbers and regression to the mean

two deep regularities make the whole enterprise possible. the **law of large numbers** says that as a sample grows, its average converges on the population's — noise averages out, so more data buys more certainty. and **regression to the mean** says that extreme results tend to be followed by less extreme ones, simply because the extremity was partly luck, and luck doesn't repeat. together they explain why bigger samples are trustworthier and why spectacular outliers usually disappoint on a second look.

## where this falls short

- **correlation is not causation, and statistics cannot fix that on its own.** the tools can establish that two things move together with great precision, but the leap to "one causes the other" requires assumptions the math itself does not supply. a lurking third variable can manufacture a flawless correlation between things that have nothing to do with each other.
- **the p-value is almost universally misunderstood.** it is not the probability the hypothesis is true, nor the probability the result was due to chance. treating an arbitrary threshold (0.05) as a line between real and unreal has produced a replication crisis: run enough tests and some noise will cross the line by luck alone (*p-hacking*).
- **garbage in, garbage out — the sample must be representative.** every inference assumes the sample was drawn fairly from the population. a biased sample yields confident, precise, and completely wrong conclusions; the math gives no warning, because the numbers look just as clean.
- **it quantifies only the uncertainty it can see.** sampling error is estimable. but systematic error — a miscalibrated instrument, a leading survey question, an entire excluded subpopulation — is invisible to the formulas. the reported margin of error is a floor on your ignorance, not a ceiling.
- **a model is a choice, not a discovery.** behind most inference sits an assumed distribution (often the normal curve) and a chosen model. pick the wrong model and the confident outputs are confidently wrong, with no internal signal that anything broke.

## related

- [[science]] — statistics is the machinery science uses to decide whether an experimental result is signal or noise
- [[popper]] — the hypothesis test is falsification made quantitative: you try to reject the null, never to prove your claim true
- [[hume]] — the problem of induction at the root of all inference: why a sample can never *guarantee* anything about the unseen rest
- [[caching]] — a sample as a small, cheap stand-in for an expensive whole, valid only while it stays representative
- [[feedback-loop]] — more data tightens the estimate: each observation corrects the running picture of the population

#domain/science #pattern/abstraction #pattern/feedback-loop #pattern/observability
