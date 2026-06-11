---
domain: computer-science
---

# large language model

> **in one line:** a large language model is a function trained to predict the next chunk of text from everything before it — and almost everything that looks like understanding is a side effect of doing that one task at enormous scale.

## what it is

a **large language model** (llm) is, at bottom, a next-token predictor. you give it a stretch of text, and it returns a probability distribution over what comes next — a guess about the most likely following **token** (a word or word-fragment). sample from that distribution, append the result, feed the whole thing back in, and repeat. fluent paragraphs, working code, and step-by-step arguments all fall out of running this one humble operation over and over.

the surprise of the last decade is how much capability that single objective drags along with it. to predict the next word in a sentence about chemistry, or in the middle of a proof, or at the punchline of a joke, the model is pressured to internalize something about chemistry, logic, and humor — because a better internal model of how text is generated yields better predictions. nobody programmed those competences in; they were the cheapest way to lower prediction error.

### the transformer — attention over a context window

modern llms are built on the **transformer** architecture. its central mechanism is **attention**: when processing each token, the model weighs every other token in view and decides which ones are relevant, letting it wire together "the animal ... it" across a long sentence. the span it can see at once is the **context window** — a hard ceiling on how much text the model can attend to in a single pass. anything outside the window does not exist to the model; it has no memory of it at all.

the model itself is a vast stack of these attention layers with billions of numerical **parameters** — the weights adjusted during training. those weights are where everything the model "knows" is stored, compressed into a fixed-size grid of numbers.

### training — compression by prediction

training runs in stages. **pretraining** sweeps a huge corpus of text and nudges the parameters, one tiny correction at a time, to make the model's predictions match what actually came next. this is the expensive stage, and it is where the bulk of the model's knowledge is laid down — the entire corpus squeezed, lossily, into the weights. the model is in this sense a [[caching|cache]] of its training data: a fast, compressed copy you can query, with the cache's defining flaw — it will return a confident answer that no longer matches, or never matched, reality.

then comes **fine-tuning** and **alignment**: a smaller pass that shapes the raw predictor into something that follows instructions and behaves. the dominant technique, **reinforcement learning from human feedback** (rlhf), is a [[feedback-loop]] — humans rank the model's outputs, those rankings train a reward signal, and the model is steered toward what people preferred. this is what turns a pure autocomplete into an assistant, but it changes manner far more than it changes knowledge.

### why it works — scale as the active ingredient

the striking empirical fact is the **scaling law**: predictably, as you grow the parameter count, the training data, and the compute together, the model gets better — and past certain thresholds, abilities it was never trained for (arithmetic, translation, chain-of-thought reasoning) appear to switch on. capability here is bought less by clever design than by sheer magnitude. the architecture is almost embarrassingly simple; the size is the point.

## where this falls short

- **it predicts plausibility, not truth.** the objective rewards text that *looks* like a good continuation, and a confident fabrication often looks more plausible than a hedged correctness. **hallucination** — fluent, well-formed falsehood delivered with no signal that it is false — is not a bug to be patched but the direct shadow of what the model optimizes. it is the [[caching|cache]]'s stale read with no way to tell that it is stale.
- **there is no ground beneath the words.** the model learns the statistical shape of language about the world without ever touching the world. its symbols are defined only by other symbols — a closed loop of text referring to text. whether this constitutes "understanding" or an elaborate mimicry of it is exactly the question [[wittgenstein]]'s two pictures of meaning, and [[science]]'s worry about theory without observation, were already circling.
- **knowledge is frozen at training time.** the weights are a snapshot. the world moves on; the model does not, until it is retrained at great cost. it inherits the [[caching|cache]]'s invalidation problem with no clean solution — bolting on live retrieval helps but does not change what the underlying weights believe.
- **the context window is a hard wall.** anything beyond the window is simply gone — the model has no persistent memory across that boundary, only the illusion of one when text is fed back in. like the [[turing-machine|turing machine]]'s idealized infinite tape inverted, the constraint here is finitude, and it shapes everything the model can and cannot do over long interactions.
- **scale is not a plan.** "make it bigger" has carried the field remarkably far, but it is an empirical regularity, not a theory of intelligence. it gives no account of *why* a given ability emerges when it does, offers no guarantee the curve continues, and says nothing about which capabilities will appear next.

## related

- [[turing-machine]] — the formal ceiling on what any machine can compute; the llm is a particular, statistical inhabitant of that space, bounded by a finite context where the turing machine assumed an infinite tape
- [[caching]] — the model as a lossy compressed copy of its training data, sharing the cache's staleness and invalidation failure modes
- [[cognitive-function]] — perception as the brain's best guess filling underdetermined input; the llm's next-token guess is the same move, and hallucination is its version of a confident false memory
- [[feedback-loop]] — rlhf as the loop that steers a raw predictor toward human-preferred behavior
- [[science]] — the worry about a model built from text alone, never checked against the world it describes
- [[hume]] — prediction from past patterns with no guarantee about the next case; induction as the engine and the weakness both
- [[abstraction-layers]] — the model as a layer that hides billions of weights behind the simple interface of a prompt

#domain/computer-science #pattern/abstraction #pattern/caching #pattern/feedback-loop #pattern/hard-limits
