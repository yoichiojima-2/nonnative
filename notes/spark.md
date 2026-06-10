---
domain: computer-science
---

# apache spark

> **in one line:** spark is a distributed data-processing engine that presents a cluster of machines as a single collection — you write transformations as if working with one dataset, and the engine splits the work across many machines, runs it in parallel, and defers execution until you ask for a result.

## what it is

apache spark processes data at scale by distributing it across many machines simultaneously. its central design is an abstraction: a dataset that *looks* like one collection but is physically divided across a cluster. you write code against the logical whole; spark handles the distribution.

### partitioning — parallel computation by dividing the data

the data is cut into partitions, each residing on a different worker node. an operation runs on all partitions simultaneously. this is the fundamental approach to handling data that exceeds what any single machine can hold or process: add more machines, not a bigger one.

### lazy evaluation — plan now, execute later

spark distinguishes between **transformations** (filter, join, aggregate — operations that describe a new dataset) and **actions** (count, write, display — operations that demand a concrete result). transformations are **lazy**: they don't run immediately, they accumulate into an execution plan. nothing actually runs until an action triggers it.

the reason for this design: seeing the complete plan before executing it allows the engine to optimize — reorder operations, eliminate redundant work, push filters closer to the data. the delay enables better execution, not just deferred execution.

### narrow vs. wide — when data must move between machines

a **narrow** transformation operates on data already on a single machine: filtering out rows, mapping values. each machine processes only its own data, independently.

a **wide** transformation — grouping, joining on a key, sorting — requires bringing matching data from all machines to the same place. this involves moving data across the network between machines: a **shuffle**. the shuffle is the dominant cost in spark workloads. tuning spark performance is, more than anything else, the discipline of avoiding or minimizing shuffles.

### in-memory caching

spark's original advantage over its predecessor (hadoop map-reduce) was keeping intermediate data **in memory** rather than writing it to disk between steps. iterative workloads — especially machine learning training, which processes the same data many times — benefit enormously from keeping the dataset warm in memory across repeated passes.

## where this falls short

- **the single-collection abstraction leaks at the worst moment.** operations that are trivial on local data — sort, deduplicate, join — can be catastrophically expensive distributed, because they silently trigger shuffles. you cannot tune spark without breaking the abstraction and thinking explicitly about partitions and data movement.
- **lazy evaluation scrambles debugging.** errors surface at the action, far from the transformation that caused them. the stack trace points at "show the result," not at the filter written twenty lines earlier that produced malformed data.
- **pulling data back to one machine defeats the distribution.** returning the entire distributed dataset to a single machine as a local list is easy to write and silently destroys the scalability the architecture was built to provide. that single machine's memory becomes the limit.
- **spark is overhead for small data.** distribution carries fixed costs: serialization, scheduling, network coordination. below a certain scale, a single machine running simpler tools handles the same work faster and with less complexity. reaching for distributed processing before the data requires it adds cost without benefit.

## related

- [[system-design]] — horizontal scaling, bottlenecks, and the tradeoff between throughput and latency made concrete
- [[caching]] — in-memory persistence of intermediate results as spark's original performance advantage
- [[abstraction-layers]] — a distributed dataset presented as a single logical collection; lazy evaluation as an optimization layer
- [[lambda]] — transformations pass functions; spark inherits the functional programming lineage
- [[python]] — pyspark as the python interface to a java/scala execution engine

#domain/computer-science #pattern/horizontal-scaling #pattern/caching #pattern/abstraction-layers
