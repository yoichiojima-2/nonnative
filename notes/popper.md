---
domain: philosophy
---

# karl popper

> **in one line:** popper argues that what makes a theory scientific is not that evidence can confirm it but that observation could in principle refute it — knowledge grows not by piling up confirmations but by bold conjectures and ruthless attempts to falsify them.

## the project

popper's *The Logic of Scientific Discovery* (1934) sets out to answer a single question: what separates science from non-science? his answer reframes the whole picture of how knowledge works. the traditional view says science is the careful accumulation of confirming evidence. popper says confirmation is nearly worthless, and that the real engine of knowledge is **disproof.**

### the demarcation problem

popper's puzzle was sharpened by a contrast. einstein's relativity made a risky prediction — light would bend by a precise amount near the sun — that could easily have come out wrong; it survived a test it might have failed. meanwhile theories like marxist history and freudian psychoanalysis seemed able to *explain anything*: whatever happened, a confirming interpretation was always available. popper noticed that this apparent strength was a fatal weakness. **a theory that is compatible with every possible observation tells you nothing about the world**, because it forbids nothing. this is the **demarcation problem**: drawing the line between science and pseudoscience.

### falsifiability — the criterion

his solution: a theory is scientific only if it is **falsifiable** — only if there is some conceivable observation that would prove it false. "all swans are white" is scientific because a single black swan refutes it. a claim engineered to absorb any outcome is not. note the asymmetry that does the work here: **no number of confirming instances can prove a universal claim true** (you can't check every swan), **but a single counterexample can prove it false.** falsification, not confirmation, is where logic actually has force. so the demand is not "how much evidence supports this?" but "what would it take to break this, and has anyone tried?"

### conjectures and refutations — how knowledge grows

this overturns the picture of science as cautious generalization from data. for popper, knowledge advances through **conjectures and refutations**: you propose a bold hypothesis that sticks its neck out, then attack it as hard as you can. theories are not built up from observations; they are guesses, tested by trying to destroy them. the best theory is the one that has made the riskiest predictions and survived the most determined attempts to falsify it — and even it is only **not yet refuted**, never proven. this connects directly to [[hume]]: popper accepts that induction can never justify a theory, and argues science never needed induction in the first place. it runs on deduction and disproof.

### the open society — the same logic in politics

popper extended the idea to politics in *The Open Society and Its Enemies* (1945). he attacked **historicism** — the belief that history obeys inevitable laws leading to a predetermined utopia — as both unfalsifiable and dangerous, since it licenses any present sacrifice for a guaranteed future. against grand, irreversible blueprints he argued for **piecemeal social engineering**: treat policies as hypotheses, implement them in small reversible steps, watch for failure, and correct. an open society is one organized so that **bad rulers and bad policies can be removed without violence** — the political version of falsifiability.

## where this account falls short

- **theories never face the tribunal alone.** the duhem–quine problem: any prediction relies on a bundle of auxiliary assumptions, so when a test fails, you can't tell whether the core theory is wrong or some supporting assumption broke. scientists routinely — and often rightly — save a good theory by revising an auxiliary, which clean falsificationism forbids.
- **scientists don't, and shouldn't, abandon theories at the first refutation.** [[kuhn]] showed that real science tolerates anomalies for long stretches and only discards a paradigm when a better one is available. strict falsificationism is a poor description of actual scientific practice.
- **degrees of confirmation seem to matter after all.** a theory that has survived many severe tests does feel better supported than a brand-new one, yet popper's framework, which denies that evidence confirms anything, struggles to capture why.
- **the criterion is sharper in principle than in practice.** much real science — historical, statistical, probabilistic — does not yield the clean, decisive refutations the model imagines.

## related

- [[science]] — popper is the source of the falsifiability criterion that the scientific method rests on
- [[kuhn]] — the great rival account: popper says science *should* try to refute theories; kuhn describes how it actually clings to paradigms until they break
- [[hume]] — popper accepts hume's problem of induction and builds a philosophy of science that needs no induction at all
- [[tdd]] — the same instinct in software: you don't trust code by confirming it works, you write tests that try to make it fail
- [[statistics]] — the hypothesis test is falsification made quantitative: reject the null, never prove your claim true
- [[feedback-loop]] — conjecture → test → refutation → revision, and the open society as politics that can correct its own errors
- [[philosophy]]

#domain/philosophy #pattern/feedback-loop #pattern/versioning #pattern/observability
