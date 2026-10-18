---
title: 'EuroRust 2026: the hard problems live at the boundaries'
date: 2026-10-18T00:00:00.000Z
excerpt: "In Barcelona we had two days, fourteen talks, one thread: the compiler fulfils most of Rust's promises, but at each boundary the guarantees turn into contracts which you have to keep"
slug: eurorust-2026-the-hard-problems-live-at-the-boundaries
---

On 15 and 16 October 2026, I spent two days in Barcelona at [EuroRust](https://eurorust.eu), the Rust conference organised by [Mainmatter](https://mainmatter.com/). The main idea in all of them: **the compiler handles most of Rust's promises for you. Still, at every boundary, the guarantees become agreements you must follow yourself.**

Compile time and runtime. Safe and `unsafe`. Rust and the C++ it has to work alongside.

Here's what I took away, in the order the talks happened, but TL;DR:

> Safety is a contract, not a keyword.

## Day one

### Oli Scherer: Move your problems to compile-time and get new capabilities out of it

[Oli](https://github.com/oli-obk/) opened the conference with a history lesson that turned into a roadmap. Rust 1.0 came with _two_ constant evaluators: one for static values, one for constants, and they didn't agree on which programs were valid. When `const fn` arrived in Rust 1.31, instead of fixing both, the team added a third evaluator, sharing its core with [Miri](https://github.com/rust-lang/miri), and removed the other two. It was so powerful they had to add code to limit it.

Every slow update since follows the same pattern. Mutable references in `const` took about fifty releases because "we are either fixing the tricky cases or banning the tricky cases".

The roadmap now is compile-time reflection and the current design is called "type info". But it turns [`TypeId`](https://doc.rust-lang.org/std/any/struct.TypeId.html) into a main value you can explore during compilation: names, variants, fields, and field types. Once you can do that, you can convert anything into a format for storage, and therefore debug anything, without needing a `derive`.

What was incredible to hear is that coming soon: a JSON config read by the compiler directly into a fixed value on an embedded device.

And the feature I keep thinking about is "comptime-only" functions—things that have no runtime result, like allocating memory at compile time and turning the result into a fixed value, or loading an entire asset folder into the binary.

### Benedikt Wiethof & Theophil Spiegeler Castañeda: The future of unmanned systems is built on Rust

A sponsored talk from [Quantum Systems](https://quantum-systems.com/).

The problem: every old ground-control station assumes one operator and one vehicle. Theophil and Benedikt's team is building Mosaic, a ground-control system for multiple operators, vehicles, and stations.

The first version was in C++. It passed its tests but was fragile and then rewrite in Rust started with "basically zero developers" and took twelve to thirteen months.

The design uses a [hexagonal](https://en.wikipedia.org/wiki/Hexagonal_architecture_%28software%29) core for each station. Vehicles connect through [gRPC](https://grpc.io/) drivers that list their abilities upfront, so the system rejects any mission plan the drone can't handle before take-off. Operators get role-based access from a local identity system. Cores communicate as equals over secure connections using [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) on [QUIC](https://en.wikipedia.org/wiki/QUIC), so "no leader, no follower", with exactly one owner per entity and read-only copies everywhere else. Video is intentionally compressed and reaches the operator over [WebRTC](https://webrtc.org/) on the final step.

Now, strip away the drones and this is the shape of [Crux](https://redbadger.github.io/crux/), the framework we build at [Red Badger](https://red-badger.com/): a pure core that owns the state and the decisions, side effects pushed out to the edges, capabilities declared rather than assumed. Victor and Stu did that pattern to keep an app testable across iOS, Android and the Web.

Some patterns are resilient enough to run at military grade.

### Jana Dönszelmann: Optimizing rustc's next trait solver

[Jana](https://donsz.nl) works full-time on improving the speed of rustc's new trait solver, and this was the clearest explanation of what a trait solver _is_ that I've heard. It's a system that checks proofs.

The analogy is [Prolog](https://en.wikipedia.org/wiki/Prolog):

> Prolog is intended primarily as a declarative programming language: the program is a set of facts and rules, which define relations. A computation is initiated by running a query over the program.

<small>From Wikipedia</small>

The size is surprising. Compiling the standard library checks `Sized` about 800,000 times. And because an `impl` with an associated type works like a function from types to types, the solver can do any computation. On this [`typenum`](https://crates.io/crates/typenum) does math with it, and a single query can take a very long time, so small improvements reduce the compile time.

Now, the key is caching, and the smart part is canonicalisation: making a goal more general so two queries that differ only in the names of their type parameters use the same cache entry. The success rate is now about 80%. One fix for hidden types cut a parser test's compile time in half; and over the year, that test went from 200 billion CPU cycles to about seven billion.

All these improvements are aimed at Rust [1.101](https://releases.rs/docs/1.101.0/)

### Timo Bachmann: Rebuilding the Tower of Babel: write your own language server with Tree-sitter

[Timo](https://github.com/tfachmann), who is a robotics researcher at the German Aerospace Center, has to deal with a problem that is wonderfully specific. A colleague developed a process manager by creating his own language and currently the configuration language is being used by thirteen robots and around 200 users, on his words "That's quite a number, but still not enough to allow for tooling.", so all the editors display it in black and white.

The solution is a single [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) consisting of about thirty lines of JavaScript, which serves as the main source of truth; based on it, syntax highlighting is provided, formatting is carried out using [Topiary](https://topiary.tweag.io/), and a language server is built on top of [`tower-lsp-server`](https://crates.io/crates/tower-lsp-server). So the syntax tree is the server's model.

The various intelligent feature that you expect in a text editor: hover, diagnostics, completion, go-to-definition, and rename—work by matching the node under the cursor with its parent. Since the keywords are generated when the program is compiled, altering the grammar causes the server to fail during the building process. Which is exactly in the way we would expect it to be.

I was very interested in this project. I maintain [`zed-mjml`](https://github.com/pataruco/zed-mjml), a Zed extension for [MJML](https://mjml.io), and I [wrote an article](https://pataruco.dev/blog/wasm-beyond-the-browser-and-back-again) about building it back in March 2026. I took the same approach but used two shortcuts: I used the `tree-sitter-html` grammar and only prepared the query files since MJML is just HTML with different tag names; and the diagnostics are provided by [`mrml`](https://github.com/jdrouet/mrml), which is an actual MJML parser, not by the syntax tree.

### Filip Petkovski: Running safely with scissors: lock-free concurrency for maximum throughput

[Filip](https://fpetkovski.github.io/) builds the internal observability platform at Shopify, and the case study was the in-memory buffer of their metrics database: one writer appending at a constant rate and many readers scanning.

They started with an [`RwLock`](https://doc.rust-lang.org/std/sync/struct.RwLock.html). So when readers scanned ranges of 1,024 entries, the writer degraded, and the readers stalled.

The new design has two rules:

1. Each memory area has only one writer,
2. New data is only added at the end.

A fixed-size array stays in place, and its items never change, so readers don't need a lock; the writer just updates a marker in one step. To expand, a pre-made "spine" points to segments that each double in size, and the segment count and last-segment length are bit-packed into one atomic: **Readers never stop the writer**.

Then the part I was interested in. All of this requires `unsafe` code, but "performance should not sacrifice safety."

The system is not checked by the borrow checker, so safety depends on three things working together:

1. The types (the writer cannot be copied, `push` requires exclusive access, storage is a fixed-size boxed array that cannot grow),
2. The API (readers cannot change data),
3. How the API works (write the value, then update the length with `Release`; readers read it with `Acquire`).

### lcnr — What's next for Rust's type system

[lcnr](https://lcnr.de) co-leads the Types team, and the first half of the talk was a reminder that most of its work is invisible.

The team's priorities, in order, are:

- sound,
- consistent
- evolvable
- fast.

Soundness has been an open issue since 1.0, because fixing it required years of groundwork, and nobody hits it in practice.

Consistent is calling the same method twice on an integer literal and get two different results, because the first call pins the type to `i32`.So you only notice it by no longer noticing the ways it goes wrong.

Then the good news: The [never type](https://doc.rust-lang.org/std/primitive.never.html) ships in Rust 1.100, and [Polonius](https://github.com/rust-lang/polonius), the new borrow checker, is on nightly.

That foundation is what unblocks the things people actually ask for: `impl Trait` in type aliases, const traits, richer const generics, and new implicit bounds (`MetaSized`, `Move`, `Forget`)

## Johan Rosengren & Sergio Gonzalez Martin: Image codecs rustification in Chromium

[Johan](https://eurorust.eu/talks/image-codecs-rustification-in-chromium/) and [Sergio](https://github.com/telecos) are on the Microsoft Edge security team, working with Chromium/

They talked about **Why image decoders?** saying that:

> The browser doesn't choose the input. The attacker does.

Vulnerability patterns are similar: a wrong size calculation followed by a memory copy that trusts it.

So in Rust, **"the bug is still a bug, but it's not an exploitable one."**

They found that working on Google's PNG port was the icebreaker after about two years, mostly spent fixing Chromium's Rust infrastructure rather than decoding PNGs. Just using the [`image`](https://crates.io/crates/image) crate meant they squash so many vulnerabilities.

## Day two

## Cristián Maureira-Fredes: Rust's influence on C++ and Python: shaping the future of three communities

Day two opened with a keynote from outside the bubble. [Cristián](https://maureira.dev) works on PySide, the Python bindings for Qt, and was just elected vice chair of the Python Software Foundation.

His thesis is:

> much of what is coming in Rust is most likely being shaped outside the Rust ecosystem.

Most of them from C++ and Python.

The C++ half because a safety-crisis timeline: decades of RAII, MISRA, smart pointers and sanitisers, then the NSA, CISA, the White House and the EU's [Cyber Resilience Act](https://en.wikipedia.org/wiki/Cyber_Resilience_Act) all saying "do not use unsafe languages".

So three responses came in:

- Profiles (opt-in, missed C++26),
- [Circle](https://safecpp.org/) (a real borrow checker, rejected),
- [Carbon](https://github.com/carbon-language/carbon-lang) — and five to ten years of mixed codebases ahead.

Which makes bindings the main thing:

- [bindgen](https://github.com/rust-lang/rust-bindgen),
- [CXX](https://cxx.rs/),
- [autocxx](https://github.com/google/autocxx),
- [Crubit](https://github.com/google/crubit),
- [Zngur](https://github.com/HKalbasi/zngur),
- [Diplomat](https://github.com/rust-diplomat/diplomat).

So it is six ways, but which one is the one that we should use?

The Python half: [PyO3](https://pyo3.rs/) and [Maturin](https://www.maturin.rs/) made Rust the easy choice for native extensions. The `rpds` crate has modest download numbers on crates.io; its Python binding, [`rpds-py`](https://pypi.org/project/rpds-py/), hit roughly 470 million downloads in thirty days the moment `jsonschema` adopted it.

He joked saying

> "Surprise, now you have almost half a billion users more." And who is paying that maintainer?

From my point of view, he was asking about that Rust consumers are now coming from C++ and Python.

## Sanskar Jaiswal — Designing state machines for streaming proxies in Rust

[Sanskar](https://sanskarjaiswal.net) builds serverless API gateways at [Kong](https://konghq.com/), and the running example was a 4 GB upload answered mid-stream by a 413. The textbook request-then-response model is "pretty deceptive": the upstream answers as soon as it sees the first chunks, so both directions stream at once. Now the proxy has to forward the 413, stop reading the body, and decide whether each connection is clean enough to reuse — because a dirty buffer corrupts the next request.

What makes it hard in async Rust is that futures can be cancelled at any moment, so partial progress evaporates, and some steps are irreversible: once response headers hit the socket, you can't send a 502 later. Four invariants fall out of that: partial progress survives cancellation, committed output is recorded, only protocol-clean connections are reused, and request and response are separate exchanges with causality between them.

The controversial bit: "It's okay to say no to [typestate](https://cliffle.com/blog/rust-typestate/) sometimes." Typestate suits linear flows; with bidirectional IO it "really becomes a mess". Instead: three small enums (request progress, response progress, commitment), one durable `ProxyState` that governs them, and a [`select!`](https://docs.rs/tokio/latest/tokio/macro.select.html) loop where the branches only read and the write happens afterwards, outside any `await`. Reuse becomes a type: `validate` only hands you a reusable connection if it's clean, and the pool accepts nothing else.

"I don't think we should be afraid of runtime checking. It's fine as long as you know what you're doing." And on splitting the work into tasks and channels: "I blame microservices for this."

## Matthias Rauter — Qt Bridges: bringing a mature C++ UI framework to Rust

[Matthias](https://eurorust.eu/talks/qt-bridges-bringing-a-mature-c-ui-framework-to-rust/) used Qt for fifteen years, simulating avalanches and tsunamis in C++, before joining The Qt Company. Two years into Qt Bridges: "I don't want to go back to C++." Also starring: two pet birds, Miss Moneypenny and Miss Wednesday, as the demo objects.

The pitch is simple. Rust people don't want Qt's C++ core; they want crates, Cargo and "a way to get into QML". Qt Bridges is one `#[qobject]` macro on an `impl` block, properties with notify signals, `#[qslot]` for callable methods, and a `QApp` to enter the event loop. "90% of our API fits onto this slide." It works with Tokio, reqwest and serde. Where C++ Qt needs macros plus an extra preprocessor — "proc macros for poor people" — Rust's macros give QML's by-name reflection natively.

Underneath, it gets interesting. Objects live in `Rc<RefCell<T>>` and are borrowed at runtime on every QML → C++ → Rust call, so a re-entrant call would borrow twice. The fix is a small borrow-state machine — and it turned out the team had re-invented [Stacked Borrows](https://plv.mpi-sws.org/rustbelt/stacked-borrows/), Miri's aliasing model. "Miri is happy with it, I'm happy with it, I hope you are happy with it."

The trade-offs were stated plainly: you need a Qt install and a C++ compiler, QML errors only appear at runtime, and a panic crossing C++ aborts. "Rust has a lot of rules. QML, not so much." Pick what fits.

## Francois Mockers — Supply chain attacks, and how to protect ourselves

[Francois](https://vleue.com) maintains [Bevy](https://bevy.org/) and writes Rust at a fintech — "as we handle money, it's kind of important not to get attacked". The room was over capacity, and this was the talk I took the most notes on.

`cargo add` is four acts of trust: identity, authenticity, integrity, and the maintainer. Each has been broken. A crates.io phishing mail from a `.dev` domain. `faster_log`, a working clone of `fast_log` that quietly exfiltrated credentials from logs for four months. A clone of `proc-macro2` with a credential-stealing build script, pulled in through a dependency bump with every older version yanked so Cargo nagged you to upgrade. Taken down in 86 minutes, which is plenty of time to do damage. And the uncomfortable fact: the tarball on crates.io isn't the repo. An audit Francois is running over every crate version found only about 70% verifiably match their declared commit. You review the git diff. You ship the tarball.

The toolbox, for the record: [cargo-audit](https://crates.io/crates/cargo-audit) and [cargo-deny](https://crates.io/crates/cargo-deny) for advisories and bans, [cargo-vet](https://crates.io/crates/cargo-vet) and [cargo-crev](https://crates.io/crates/cargo-crev) for borrowed trust, [cargo-supply-chain](https://crates.io/crates/cargo-supply-chain) and [cargo-cyclonedx](https://crates.io/crates/cargo-cyclonedx) for inventory, [cargo-machete](https://crates.io/crates/cargo-machete) and [cargo-udeps](https://crates.io/crates/cargo-udeps) for pruning, and [cargo-auditable](https://crates.io/crates/cargo-auditable) to bake the SBOM — which the Cyber Resilience Act will soon want — into the binary itself.

But the real message was about defaults: "a check that you have to remember to run is a check that doesn't run." So: a minimum publish age of seven days in a committed `.cargo/config.toml`, the only thing that protects local runs. Commit the lockfile and let CI run `cargo update`. Pin in `Cargo.lock`, never in `Cargo.toml`. Give Dependabot a seven-day cooldown. Publish only from CI, with [trusted publishing](https://crates.io/docs/trusted-publishing). Longer term: proc macros in a WASM sandbox, the way Zed runs its extensions. I've been on the other side of that sandbox with zed-mjml, and it's strict enough that the real work ended up in a native binary — which is both the point and the problem. And a policy-driven registry mirror as the public default — Francois built one, Haven, with a seven-day quarantine — leaving crates.io as the unreviewed inbox.

> Make the secure path the default path.

## Martin Ombura Jr. — Atomic design patterns in Rust: from orderings to code

[Martin](https://martinomburajr.com) opened by apologising to anyone who saw last year's version — "a lot of information kind of shoved down in thirty minutes. I can't promise anything has changed" — and then walked through the vocabulary slowly enough that it finally stuck. Atomics solve two problems. Atomicity is the intuitive part. Synchronisation is the hard 99%.

The vocabulary is from C++20: a modification order per atomic, and [happens-before](https://en.wikipedia.org/wiki/Happened-before) built from program order plus an `Acquire` load that reads a `Release` store. "Now whenever you see a release, you know somewhere floating around there's likely to be an acquire." [`Arc`](https://doc.rust-lang.org/std/sync/struct.Arc.html) is the worked example: `clone` is a `Relaxed` `fetch_add`, because the clone you hold proves the object exists; `drop` is a `Release` `fetch_sub` plus an `Acquire` fence before the final free, so the last thread sees everyone's final use.

The pattern I'll reuse is Probe, Validate, Execute: a cheap `Relaxed` load to peek, a stronger re-check because the value may have moved, then act. Channels and work-stealing queues are built on it.

The best part was the defence of `SeqCst`, the ordering Rust devs "slap on" when confused. It adds a single total order, which means you can _disprove_ a bad interleaving. [Rayon](https://github.com/rayon-rs/rayon)'s sleep-and-wake logic has a lost-wakeup case that two `SeqCst` fences make impossible — the proof is in their README. "You can't have World War Two came before World War One and World War One came before World War Two at the same time."

The bonus content — "the EuroRust DLC" — was false sharing and [`CachePadded`](https://docs.rs/crossbeam-utils/latest/crossbeam_utils/struct.CachePadded.html). Benchmark first.

## Albert Lockett — Building a high-performance, thread-per-core, zero-copy OpenTelemetry engine in Rust

[Albert](https://github.com/albertlockett) maintains [OTel Arrow](https://github.com/open-telemetry/otel-arrow) at F5, and the whole talk was one principle applied three times: a telemetry engine's job is throughput per unit of compute, so design around the hardware.

First, the data. OTLP ships telemetry as protobuf rows; OTAP, the OTel Arrow Protocol, ships it as [Apache Arrow](https://arrow.apache.org/) columns. Every log's severity sits next to every other log's severity: cache locality, SIMD, better compression — and Arrow IPC's wire bytes _are_ the in-memory buffers, so serialisation is zero-copy.

Second, the threads. One copy of the entire pipeline per core, each on its own single-threaded Tokio runtime. They share nothing and never synchronise. Tokio's work-stealing scheduler would do this for you, but a stolen task's data lives in another core's cache or [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access) node, and when every worker runs identical code on similar data, stealing buys little. The "mysterious advantage": because tasks never migrate, "our futures don't need to be `Send`". No atomics, no mutexes, and a custom channel that benchmarked ahead of `tokio::sync::mpsc`.

Third, the decode. The usual route — Prost decodes protobuf into a struct — creates "an intermediate representation only to then go throw it away". Instead, view traits with lifetime-carrying associated types, so a `LogRecordView` over raw bytes decodes a field only when the Arrow builder asks for it.

Transforms run on [DataFusion](https://datafusion.apache.org/), which "bills itself as the LLVM for databases". And the Q&A admission about io_uring — "this will reveal maybe a little bit about the maturity of the project" — made me like it more.

## My insight

I work mostly on the web, where the platform does the heavy lifting and my job is to get out of its way. I expected a conference about a language with a famously strict compiler to be about the compiler doing the same.

It was, partly. Jana, Arya, lcnr and Oli are rebuilding its foundations so it can prove more, faster. But that's not what the other ten talks were about. They were about the lines the compiler can't see across. The `unsafe` block in Filip's array. The FFI boundary where Johan's metadata became a contract. The `Rc<RefCell>` where Qt meets QML. The `select!` branch that gets cancelled mid-write. The 86 minutes a malicious crate sat on crates.io.

At every one of those lines the guarantee stops and a contract starts, and someone has to write it down: in a type that can't be cloned, in a README proof, in a `.cargo/config.toml`, in a differential test against the old C++ decoder.

The compiler keeps its promises. The rest are ours to keep.

## PS

I also sat in on Andre Bogus's _From Deref into Borrow_ and Amos Wenger's _Beyond cargo build_ on day two. My notes for each are a single underlined heading — the sign of a talk you were too busy listening to — so I'll wait for the videos before writing about them.
