---
domain: computer-science
patterns: [horizontal-scaling, caching, abstraction-layers]
---

# apache spark

> **in one line:** spark is what map-reduce looks like once it's hidden behind a single-list illusion — you write transformations as if on one ordinary collection, and the engine secretly splits it across a cluster, runs the pieces in parallel, and doesn't actually compute anything until you ask for an answer.

![spark's lazy execution: read, filter, and groupBy are transformations that only build a plan (a DAG), where filter is narrow and stays local but groupBy is wide and needs a shuffle; nothing runs until an action like show() pulls on the plan and the cluster executes it](assets/spark-lazy-dag.svg)

## what it is

spark is a distributed data-processing engine. its central abstraction is a dataset — an RDD, or more commonly a **DataFrame** — that *looks* like one collection but is physically **partitioned across many machines**. you program against the logical whole; spark handles the split. four ideas carry the design.

### partitioning — horizontal scaling of a computation

the data is cut into partitions, each living on a different worker (an **executor**). an operation runs on all partitions at once. this is [[system-design|horizontal scaling]] aimed at a computation rather than a web tier: you go faster by adding *more machines*, not a bigger one — throughput scales out, not up.

### transformations vs. actions — laziness and the DAG

spark splits operations into two kinds. **transformations** (`map`, `filter`, `join`) *describe* a new dataset; **actions** (`count`, `collect`, `write`) *demand* a concrete result. the trick is that transformations are **lazy** — they don't run, they just extend a plan: a DAG of steps. nothing executes until an action pulls on it. why bother? because seeing the *whole* plan before running it lets spark optimize — reorder filters, fuse steps, prune columns — exactly like a query planner or a compiler optimizing before it emits code. laziness is an [[abstraction-layers|optimization-enabling layer]].

```python
df  = spark.read.parquet("logs")                         # lazy — just a plan
hot = df.filter(df.level == "ERROR").groupBy("svc").count()  # still lazy — still a plan
hot.show()                                               # action — NOW the cluster runs the DAG
```

### narrow vs. wide — the shuffle is the bottleneck

a **narrow** transformation (`filter`, `map`) needs only its own local partition — embarrassingly parallel, cheap. a **wide** one (`groupBy`, `join`) needs matching rows from *every* partition to meet in one place, which means moving data across the network between machines: a **shuffle**. the shuffle is spark's dominant cost and its real bottleneck — tuning spark is, more than anything, the art of avoiding and shrinking shuffles. it's [[system-design|latency vs. throughput]] made physical: the network move is the slow step.

### in-memory caching — the original edge over hadoop

spark's first win over hadoop map-reduce was [[caching]]: keep intermediate data **in memory** instead of writing it to disk between every step. iterative workloads — especially machine learning — sweep the same dataset many times; `cache()` keeps it hot so each pass skips the reload. the classic cache bargain: spend memory to buy speed.

these run on a **driver** (the coordinator that holds the plan and schedules work) talking to many executors — a star-shaped topology in which the driver is a [[spof|single point of failure]].

## where the model breaks down

- **the single-list illusion leaks hardest exactly where it matters.** an operation that's trivial on a local list — sort, dedup, join — can be catastrophic distributed, because it silently triggers a shuffle. the abstraction hides the network, and the network is the whole cost; you cannot tune spark without breaking the illusion and thinking about partitions.
- **laziness scrambles debugging.** errors surface at the *action*, far from the transformation that actually caused them — the stack trace points at `show()`, not at the malformed `filter` twenty lines up. the convenience of "it's just a plan" is paid back in confusing failures.
- **`collect()` quietly kills the distribution story.** pull the whole distributed dataset back to the driver and you've funneled everything into one node's RAM — the "scales to any size" promise dies at the driver, OOM-ing the coordinator the architecture was built to avoid leaning on.
- **below a threshold, spark is pure overhead.** distribution has fixed costs — serialization, scheduling, shuffle machinery — that you only earn back at real scale. for data that fits on one machine, a single pandas or DuckDB process beats a cluster handily. reaching for spark too early is [[system-design|premature optimization]] wearing a big-data costume.

## related

- [[system-design]] — horizontal scaling, bottlenecks, and latency-vs-throughput made concrete
- [[caching]] — in-memory persistence of intermediate data as spark's original edge over hadoop
- [[abstraction-layers]] — a distributed dataset presented as one logical collection; the lazy DAG as an optimizer layer
- [[lambda]] — transformations take functions (`map`, `filter`); spark inherits the functional lineage
- [[spof]] — the driver and the shuffle as the design's bottlenecks
- [[python]] — pyspark as the python control plane over the scala/JVM engine

#domain/computer-science #pattern/horizontal-scaling #pattern/caching #pattern/abstraction-layers
