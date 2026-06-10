---
domain: computer-science
---

# medallion architecture

> **in one line:** medallion architecture routes all incoming data through three progressively cleaner tiers — raw, cleaned, and aggregated — so that the messiness of real-world sources is contained at the edge and every consumer works with data at the level of refinement they need.

## what it is

data that arrives from the outside world is messy: missing fields, duplicate records, inconsistent formats, shifting structures. medallion architecture is an organizing principle for a data storage system that says: **don't try to clean data at the moment it arrives; ingest everything as-is, then refine in stages.** each stage adds quality without discarding history.

### bronze — raw, as received

bronze is the landing zone. data is written exactly as it was received: no type enforcement, no deduplication, no transformation beyond what's needed to store it. the defining rule is **append-only** — records are added, never modified or deleted.

this preserves the complete, original record. if later stages are corrupted or their logic changes, you can replay from bronze. bronze is the audit trail: the unaltered record of what arrived, when.

### silver — cleaned and standardized

silver applies the first substantive processing: remove duplicate records, enforce consistent types, join to reference data, validate against expected schemas, and standardize dates and identifiers. silver is fit for analysis — someone working with it does not need to write defensive code to handle malformed data.

silver is also where messiness from the source is absorbed so it doesn't propagate downstream. when an upstream system changes its format, only the bronze-to-silver logic needs to update; consumers of silver and gold are insulated.

### gold — business-ready aggregates

gold contains domain-shaped tables built for specific consumers: summary dashboards, machine learning feature tables, pre-joined reporting views, monthly rollups. each gold table is designed for a particular use case. gold stores the results of expensive aggregations so consumers get fast queries instead of rerunning heavy computations every time they need an answer.

### one-way dependency — reprocessing flows downward

because bronze is immutable and silver/gold are derived from it, the system is always recoverable: fix the silver logic and replay bronze → silver → gold. the dependency is one-way — gold depends on silver depends on bronze — and that direction holds the whole structure together. upstream changes require updates only to the logic at the appropriate stage, not to the raw data.

## where this falls short

- **three tiers is a simplification.** real data pipelines often need more stages: a quarantine zone for records that fail validation, intermediate joins before aggregation. the three-tier names are conventions; the actual structure may be more complex.
- **bronze is never truly unprocessed.** the act of ingestion involves choices: file format, storage encoding, partitioning strategy, how late-arriving data is handled. "exact copy of the source" collides with the reality that storage always imposes some structure.
- **gold tables multiply and diverge.** because gold tables are tailored to specific consumers, they proliferate. teams add new gold tables; old ones are never retired. over time, the gold layer accumulates overlapping, inconsistently defined versions of the same metric. what started as consumer-friendly becomes the next cleanup problem.
- **append-only conflicts with privacy law.** regulations such as GDPR require that personal data can be deleted on request. pure append-only bronze is incompatible with this unless you implement specific mechanisms for targeted deletion — which adds significant complexity.
- **streaming is harder than batch.** the model was designed for batch pipelines. a streaming pipeline running continuously must handle out-of-order events, time windows, and partial results at every stage. the clean "replay from bronze" recovery story becomes complicated when bronze is a temporary stream rather than a permanent file store.

## related

- [[abstraction-layers]] — bronze/silver/gold as quality tiers that hide source messiness behind cleaner interfaces at each level
- [[caching]] — gold as a stored result of expensive aggregations; bronze as the durable checkpoint
- [[coupling]] — silver as the isolation point that absorbs upstream format changes before they reach consumers
- [[clean-architecture]] — the one-way dependency (consumers depend on more refined data, never the reverse) mirrors the architectural dependency rule
- [[spark]] — the typical processing engine for medallion pipelines

#domain/computer-science #pattern/abstraction-layers #pattern/caching #pattern/coupling
