---
layout: post
title: "OpenZL, Explained: Format-Aware Compression with a Universal Decoder"
tags: tutorial compression data-engineering performance openzl
image: /img/posts/Introducing-OpenZL-Meta.webp
typewriter-delay: 20
---

*TL;DR:* **OpenZL** is a modern, **lossless** compression framework that learns the *shape* of your data and composes a fast pipeline of transforms + entropy coding to beat generic compressors on structured payloads-**without** shipping a bespoke decoder per format. When structure is weak, it falls back to a solid general-purpose path. 🚀

---

## Why this matters (now)

Most production data isnt random bytes. Its tables, logs, metrics, events, feature vectors-highly **structured**. Classic tools (gzip, zstd, xz) treat everything the same and leave wins on the table. Teams hack around this with custom format-specific codecs, then drown in operational overhead (distribution, patching, compatibility, audits).

**OpenZL** aims to hedge both sides: *format-aware gains* with *single-binary operability*. One decoder. Many shapes. Fewer headaches. 🧩

---

## The mental model: compression as a graph

OpenZL formalizes compression as a **directed acyclic graph (DAG)** of modular transforms and codecs. You describe (or OpenZL infers) how bytes map to fields; the framework splits the input into homogeneous streams and applies type-appropriate transforms before entropy coding.

**Core ideas:**

- **Schema-aware streams.** Split records into columns/fields (struct-of-arrays) so like values sit together (e.g., timestamps, enums, coordinates).
- **Type-specific transforms.** Examples: `delta`/`xor` for monotone numbers, `rle` for repeats, `frame-of-reference` (FOR) for bounded ranges, dictionary/tokenization for low-cardinality strings, `transpose` for fixed-width structs.
- **Entropy stage.** After decorrelation, OpenZL runs a modern entropy coder (bitpacking + ANS/Huffman range variants). The choice is part of the plan.
- **Self-describing frames.** Each output frame embeds a small **decode recipe** (the plan) so **one universal decoder** can decompress any OpenZL frame you produced-no out-of-band configs.
- **Fallback path.** If structure is absent (free-form text, already-compressed media), OpenZL uses a generic pipeline so you dont regress badly. 👍

The graph is small but expressive: a few carefully chosen transforms composed in the right order often yield large wins with predictable CPU cost.

---

## What "format-aware" looks like in practice

Imagine a telemetry table:

```text
ts:   2025-10-13T08:00:00Z, 2025-10-13T08:00:01Z, ...
dev:  A13, A13, A13, A14, ...
temp: 24.1, 24.1, 24.2, 24.2, ...
```

A reasonable OpenZL plan would:

1) **Columnize** the rows → streams: `ts[]`, `dev[]`, `temp[]`  
2) On `ts[]`: `delta → varint → bitpack`  
3) On `dev[]`: `tokenize (dictionary) → rle (if clustered) → bitpack`  
4) On `temp[]`: `frame-of-reference → zigzag (for small deltas) → bitpack`  
5) **Containerize** the 3 streams in one frame with a compact header + recipe

End result: better compression **and** faster decode due to simpler, more cache-friendly data paths. 🏎️

---

## Frame layout (at a glance)

```
+-------------------+
| Magic + Version   |  -> future-proofing
+-------------------+
| Recipe (Plan DAG) |  -> operators, parameters, stream map
+-------------------+
| Stream Directory  |  -> offsets, checksums, types
+-------------------+
| Encoded Streams   |  -> one blob per field/column
+-------------------+
| Footer (CRC)      |  -> integrity
+-------------------+
```

The **recipe** is small (think a few hundred bytes for most datasets) and lets the universal decoder execute exactly the pipeline used at compress-time.

---

## Performance model: what to expect

- **Throughput.** Transform cost dominates compression. Simple binary inputs (already columnar) can reach hundreds of MB/s per core; CSV/JSON require parsing, which caps speed unless you use a fast parser. Decompression is typically much faster because its streaming and branch-light.
- **Ratios.** Expect meaningful wins on structured data (columns, bounded ranges, enums, timestamps). On unstructured text, wins shrink; the fallback protects you from large regressions.
- **Knobs that matter.**
  - **Plan choice** (which transforms in what order) is the real "level."
  - **Block size** balances ratio vs. memory & parallelism.
  - **Dictionary scope** (per-file vs. per-corpus) changes startup gains for stringy data.
- **Hardware.** OpenZLs primitives vectorize well (SIMD) and are cache-aware. Youll see near-linear gains with shard-level parallelism.

Reality check: you wont win on already-compressed payloads (JPEG, MP4, ZIP). Dont waste CPU. ❌

---

## When to use OpenZL (and when not)

**Great fit** ✅  
- Columnar tables (CSV/Parquet-like), logs/events, metrics/time-series  
- Feature stores, ID/enumeration-heavy streams  
- Binary records with predictable layouts (telemetry, IoT, finance ticks)

**Probably skip** ⚠️  
- Human prose, source code dumps, random blobs  
- Media or archives already compressed elsewhere

---

## Quick start (CLI)

> The commands below illustrate the developer workflow. Adapt names/paths to your setup.

### 1) Compress, generic path

```bash
# Single file → .ozl frame using the default (safe) plan
openzl compress input.bin -o input.bin.ozl
```

### 2) Teach OpenZL your data shape (simple schema)

```yaml
# schema.yaml (skeletal)
type: record
fields:
  - name: ts
    type: u64
    transforms: [delta, varint, bitpack]
  - name: dev
    type: string
    transforms: [tokenize, rle, bitpack]
  - name: temp
    type: f32
    transforms: [for, zigzag, bitpack]
```

```bash
openzl compress telemetry.csv --schema schema.yaml -o telemetry.ozl
```

### 3) Train a plan (find the best speed/ratio frontier)

```bash
# Explore candidate graphs and emit a pinned plan
openzl train --schema schema.yaml --input shard/*.csv --out plan.json

# Use that plan for deterministic builds
openzl compress telemetry.csv --plan plan.json -o telemetry.ozl
```

### 4) Decompress anywhere (universal decoder)

```bash
openzl decompress telemetry.ozl -o telemetry.csv
```

If your consumer only needs a subset of columns, **project** at decode time:

```bash
openzl decompress telemetry.ozl --columns ts,dev -o two-cols.csv
```

Nice side-effect: column projection reduces I/O and speeds up downstream jobs. ⚡️

---

## Integration playbook (pragmatic and boring, on purpose)

1) **Pick one high-volume lane** (e.g., analytics events).  
2) **Model the schema** or write a thin parser. Keep it brutally simple first.  
3) **Run `train`** on a representative shard; pin the resulting `plan.json`.  
4) **Benchmark** on your real SLOs (throughput, CPU, size).  
5) **Ship**: adopt `.ozl` frames in storage + streaming paths; standardize the **decoder** everywhere.  
6) **Iterate plans** as data drifts-no decoder redeploys needed. 🔁

---

## Safety, compatibility, and ops

- **Self-describing frames** mean old decoders can still read new data as long as opcodes are known; unknown ops can be gated behind version flags.  
- **Checksums** on each stream + frame footer reduce "silent corruption" risks.  
- **Resource caps** (max block size, max dictionary size) guard against hostile inputs.  
- **Observability hooks** (per-stage timings, ratios) make regressions obvious during rollouts.  
- **Backpressure-friendly** streaming APIs avoid ballooning memory in pipelines.

Pro tip: treat your **plan** like a binary-review it, version it, and roll it out with feature flags. 🛡️

---

## FAQ

**Is OpenZL lossless?**  
Yes. Its byte-for-byte reversible. (Transforms are decorrelation only; entropy coding is exact.)

**Do I need a schema?**  
No, but a schema (or even a partial one) unlocks the big wins. Otherwise you get the safe generic path.

**Will I beat zstd on everything?**  
No. Youll shine on structured data; youll break even (or fall back) on messy text or already-compressed inputs.

**Whats the migration risk?**  
Low, if you pin plans and run shadow traffic first. The universal decoder keeps ops surface small. 🙂

---

## Closing thoughts

Compression is moving from "one level fits all" to **data-aware** pipelines. OpenZL leans into that reality: take a small amount of structure, compose a simple graph, and harvest predictable, repeatable wins. The decoder cost stays flat; the *plan* does the heavy lifting. If your payloads are structured (and most are), OpenZL is worth a serious trial. 💡
