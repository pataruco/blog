---
title: 'EuroRust 2026: the hard problems live at the boundaries'
date: 2026-10-18T00:00:00.000Z
excerpt: "Two days in Barcelona, fourteen talks, one thread: the compiler keeps most of Rust's promises, but at every boundary the guarantees become contracts you have to keep"
slug: eurorust-2026-the-hard-problems-live-at-the-boundaries
---

On the 15th and 16th of October 2026, I spent two days in Barcelona at [EuroRust](https://eurorust.eu), the Rust conference organised by [Mainmatter](https://mainmatter.com/). Two stages, fourteen talks — a few of them caught up on video afterwards, because the side track kept clashing with the main stage — and one thread running through all of them: **the compiler keeps most of Rust's promises for you, but at every boundary the guarantees turn into contracts you have to keep yourself.**

Compile time and runtime. Safe and `unsafe`. Rust and the C++ it has to live next to. Your code and the crates underneath it. One thread and the next. Every speaker, from their own corner, was standing on one of those lines and explaining what it takes to cross it without getting hurt.

> Safety is a contract, not a keyword.

Here's what I took away, in the order the talks happened.

_Day one — Thursday 15 October_

## Oli Scherer — Move your problems to compile-time and get new capabilities out of it

[Oli](https://github.com/oli-obk/) opened the conference with a history lesson that turned into a roadmap. Rust 1.0 shipped with _two_ const evaluators — one for statics, one for consts — and they didn't agree on which programs were valid. When `const fn` landed in Rust 1.31, instead of fixing both, the team added a third evaluator, sharing its core with [Miri](https://github.com/rust-lang/miri), and deleted the other two. It was so powerful they had to add code to restrict it.

Every slow stabilisation since follows the same pattern. Mutable references in `const` took about fifty releases, because "we are either fixing the edge cases or forbidding the edge cases".

The roadmap is compile-time reflection. The current design is called "type info" — "Very boring. Don't let compiler developers name things" — and it turns [`TypeId`](https://doc.rust-lang.org/std/any/struct.TypeId.html) into a first-class value you can walk at compile time: names, variants, fields, field types. Once you can do that, you can serialise anything, and therefore debug anything, without a `derive` in sight. Coming soon: a JSON config parsed by the compiler straight into a static on an embedded target.

The hazards got equal time: public fields become semver, parametricity is already broken (`size_of` has been breaking it since 1.0), and `TypeId` only works on `'static` types. But the capability I keep thinking about is "comptime-only" functions — things with no runtime answer at all, like allocating on a compile-time heap and turning the result into a static, or reading a whole asset directory into the binary. Not faster code. New code.

## Benedikt Wiethof & Theophil Spiegeler Castañeda — The future of unmanned systems is built on Rust

A sponsored talk from [Quantum Systems](https://quantum-systems.com/), and the one where I wrote "hexagonal architecture → drones!" in my notebook, exclamation mark included.

The problem: every legacy ground-control station assumes one operator and one vehicle. Theophil and Benedikt's team is building Mosaic, a ground-control system for _n_ operators, _m_ vehicles and _k_ stations. The first attempt was in C++. It passed its tests but was fragile — undefined behaviour, dependency pain — and "kinda went into the wrong direction". The Rust rewrite started with "basically zero developers" and took twelve to thirteen months.

The architecture is a [hexagonal](https://en.wikipedia.org/wiki/Hexagonal_architecture_%28software%29) core per station. Vehicles plug in through [gRPC](https://grpc.io/) drivers that declare their capabilities up front, so a mission plan the drone can't fly is rejected before take-off. Operators get role-based access from a local identity provider. Cores talk to each other as peers over [mTLS](https://en.wikipedia.org/wiki/Mutual_authentication) on [QUIC](https://en.wikipedia.org/wiki/QUIC) — "no leader, no follower" — with exactly one owner per entity and read-only replicas everywhere else. Video is lossy by design and reaches the operator over [WebRTC](https://webrtc.org/) on the last hop.

That's what the exclamation mark was about. Strip away the drones and this is the shape of [Crux](https://redbadger.github.io/crux/), the framework we build at [Red Badger](https://red-badger.com/): a pure core that owns the state and the decisions, side effects pushed out to the edges, capabilities declared rather than assumed. They even use the same words — core, capabilities. We reach for that pattern to keep an app testable across iOS, Android and the web. They reach for it where a mistake isn't a failing test. Some patterns are resilient enough to run at military grade, where lives depend on them.

They were honest about the cost: an actor-based core means a minor feature touches fifty files. The payoff was a demo video of an interceptor locking on to one of their own target drones at about 300 ms latency, and the closing line: "Rust was the right choice."

## Jana Dönszelmann — Optimizing rustc's next trait solver

[Jana](https://donsz.nl) works full time on the performance of rustc's new trait solver, and this was the clearest explanation of what a trait solver _is_ that I've heard. It's a proof engine. `u64: Clone`? Prove it. The analogy is [Prolog](https://en.wikipedia.org/wiki/Prolog): facts, rules and a search — at which point lcnr, in the audience, shook their head, and Jana admitted: "I will lie a little bit today."

The scale is the surprise. Compiling the standard library proves `Sized` about 800,000 times. And because an `impl` with an associated type is really a function from types to types, the solver is Turing complete — [`typenum`](https://crates.io/crates/typenum) does arithmetic in it, someone wrote chess in it — so a single query can take arbitrarily long. Micro-optimisations buy 5–10%. Algorithmic fixes "literally make 100% difference".

The lever is caching, and the clever bit is canonicalisation: generalise a goal so that two queries that differ only in what their type parameters are called hit the same cache entry. The hit rate is now around 80%. One fix for opaque types halved the compile time of a parser benchmark; over the year, that benchmark went from 200 billion CPU cycles to about seven billion.

The outlier graph said it all: a thousand crates, once up to 16× slower than the old solver, now mostly sitting at 1.0×. Stabilisation is in its final comment period, aimed at Rust 1.101.

## Arya Dradjica — Building a query system

[Arya](https://bal-e.org/) has spent a year and a half writing a Rust compiler, mostly on her own. "Mistake, maybe. Sure." It's called Crabby, and the argument for its existence is that rustc's high-level architecture is now its biggest bottleneck — but rustc is too big, too busy and too stability-bound to try radical changes in. So Crabby is the playground.

The talk was about its query system, Capillary, and started with a trick question: who here has used a query system? Anyone who didn't raise a hand was wrong, because a Makefile is a dependency graph, and "query systems are [Make](https://en.wikipedia.org/wiki/Make_%28software%29)". The difference in a compiler is that the dependencies are discovered as you go, and the unit of work is a single Rust item, not a file.

Three bets follow from that. One: Cargo parallelises per crate, so a one-line change deep in rustc used 1.4 of her 16 CPUs — "they're good CPUs, but rustc just won't use them, guys". Capillary parallelises per item. Two: target folders. She ran [`ncdu`](https://dev.yorhel.nl/ncdu) live over hers: 57 GB, 22 GB of it in `deps`, and about 16 GB of that identical rlibs duplicated across projects. Queries can evict their own caches and deduplicate. Three: queries in rustc and [Salsa](https://github.com/salsa-rs/salsa) run sub-queries one at a time, so she made hers `async`. "We just turn everything async, and somehow that works."

The line that stuck with me: "Please never implement name resolution."

## Timo Bachmann — Rebuilding the Tower of Babel: write your own language server with Tree-sitter

[Timo](https://github.com/tfachmann) is a robotics researcher at the German Aerospace Center, and the problem is wonderfully specific. A colleague wrote a process manager in 2010 — "that was the year of domain-specific languages, so of course he invented something" — and its config language now runs thirteen robots with about 200 users. "Which is quite some, but just not enough to do tooling." Every editor shows it in black and white.

The fix is one [Tree-sitter](https://tree-sitter.github.io/tree-sitter/) grammar, about thirty lines of JavaScript, as the single source of truth. From it: syntax highlighting (even the [Typst](https://typst.app/) slides were highlighted through it), formatting via [Topiary](https://topiary.tweag.io/), and a language server built on [`tower-lsp-server`](https://crates.io/crates/tower-lsp-server). The LSP trait has 68 methods; only two are required. A 5,000-line file parses in about 5 ms and an incremental reparse takes 0.3 ms, so the syntax tree _is_ the server's model.

The intelligence — hover, diagnostics, completion, go-to-definition, rename — is a `match` on the node under your cursor and its parent. And because the keywords are generated at compile time, changing the grammar breaks the server's build. "Exactly how we would expect it to be."

I had a stake in this one. I maintain [zed-mjml](https://github.com/pataruco/zed-mjml), a Zed extension for [MJML](https://mjml.io), and [wrote about building it](https://pataruco.dev/blog/wasm-beyond-the-browser-and-back-again/) back in March. Same road, two shortcuts: I borrowed the `tree-sitter-html` grammar and only wrote the query files, because MJML is HTML with different tag names; and the diagnostics come from [mrml](https://github.com/jdrouet/mrml), a real MJML parser, not from the syntax tree.

Which is exactly the caveat from the Q&A: Tree-sitter carries no semantics. If you already have a compiler — or, in my case, a parser — build on that. Timo's talk was about how trivial it is to start from nothing. Mine started from something, and reached the same place.

## Filip Petkovski — Running safely with scissors: lock-free concurrency for maximum throughput

[Filip](https://fpetkovski.github.io/) builds the internal observability platform at Shopify, and the case study was the in-memory buffer of their metrics database: one writer appending at a constant rate, many readers scanning. They started with an [`RwLock`](https://doc.rust-lang.org/std/sync/struct.RwLock.html). With readers scanning ranges of 1,024 entries, the writer degraded and the readers stalled.

The design that replaced it has two rules: every memory region has exactly one writer, and inserts are append-only. A fixed-size array never moves and its elements never change, so readers don't need a lock at all; the writer just publishes a watermark atomically. To grow, a pre-allocated "spine" points at segments that each double in size, and the segment count and last-segment length are bit-packed into one atomic. Readers never block the writer. Full stop.

Then the part I came for. All of this needs `unsafe`, and "performance should not come at the expense of safety". The protocol is invisible to the borrow checker, so safety becomes a contract held up by three things together: the types (the writer isn't `Clone`, `push` takes `&mut self`, storage is a `Box<[UnsafeCell<T>]>` that can't grow), the API surface (readers get no mutating methods), and the implementation (write the value, then `Release` the length; readers `Acquire` it). "It's not enough to just omit the `unsafe` keyword from the function declaration." `std::sync::Mutex` is built exactly the same way.

The closer was [Miri](https://github.com/rust-lang/miri) catching a swapped publish order that a normal test sailed through. It also planted an idea for how I'd teach ownership: one writer, many readers, acted out as reading and writing. Another post.

## lcnr — What's next for Rust's type system

[lcnr](https://lcnr.de) co-leads the Types team, and the first half of the talk was a reminder that most of its work is invisible. The team's priorities, in order: sound, consistent, evolvable, fast. Sound came with an unsoundness that has been open since 1.0 — eleven years — because fixing it needed years of groundwork and nobody hits it in practice. Consistent came with a one-liner: call the same method twice on an integer literal and get two different results, because the first call pins the type to `i32`. "You only notice them by no longer noticing the ways in which it goes wrong."

Then the good news, delivered deadpan. The [never type](https://doc.rust-lang.org/std/primitive.never.html) — the running joke was that `!` is named after its stabilisation date — ships in Rust 1.100 on the 12th of November. The talk proposal said the next-gen trait solver would "hopefully be done by the time of this conference". It landed three days before. Stable for Christmas, if nothing crops up. [Polonius](https://github.com/rust-lang/polonius), the new borrow checker, is on nightly.

That foundation is what unblocks the things people actually ask for: `impl Trait` in type aliases, const traits, richer const generics, and new implicit bounds (`MetaSized`, `Move`, `Forget`) aimed at the problems `Pin` currently papers over. There are 33 open project goals on the type system alone.

The closing line, repeated throughout: "It works better if we have money."

## Johan Rosengren & Sergio Gonzalez Martin — Image codecs rustification in Chromium

[Johan](https://eurorust.eu/talks/image-codecs-rustification-in-chromium/) and [Sergio](https://github.com/telecos) are on the Microsoft Edge security team, working with Chrome's, and they closed day one with its most grounded talk. Why image decoders? "The browser doesn't choose the input. The attacker does." The vulnerability pattern is always the same: a wrong size calculation followed by a memory copy that trusts it. The 2023 [libwebp bug](https://nvd.nist.gov/vuln/detail/CVE-2023-4863) was a miscalculated Huffman table, exploited in the wild. In Rust, "the bug is still a bug, but it's not an exploitable one."

Google's PNG port was the icebreaker: about two years, mostly spent fixing Chromium's Rust infrastructure rather than decoding PNGs. "PNG paid the cost that every project that came after would benefit from." Microsoft's BMP and ICO work rode on it. Upstreaming resumable BMP decoding into the [`image`](https://crates.io/crates/image) crate meant turning one unreviewable PR into more than ten small ones.

The sentence I'd frame came from the ICO work: "as soon as it hits that FFI boundary, it's no longer just metadata. You're signing a contract." The Rust decoder reported 128×128 as the largest frame, Blink locked that in, then 256×256 arrived and the browser crashed. The sizes were in the file all along.

Shipping to a billion users is a process, not a rewrite: feature flag, differential tests against the C++ decoder, Canary, Finch, then hold for two or three stable releases and delete the C++. "The Rust code was actually the nice thing. It was the integration hell that we all love."

_Day two — Friday 16 October_

## Cristián Maureira-Fredes — Rust's influence on C++ and Python: shaping the future of three communities

Day two opened with a keynote from outside the bubble. [Cristián](https://maureira.dev) works on PySide, the Python bindings for Qt, and was just elected vice chair of the Python Software Foundation — "a serial conference organiser, not a serial killer". The thesis: "much of what is coming in Rust is most likely being shaped outside the Rust ecosystem." And the question: "Are you all prepared if 30 million people just come to the Rust ecosystem?"

The C++ half was a safety-crisis timeline: decades of RAII, MISRA, smart pointers and sanitisers, then the NSA, CISA, the White House and the EU's [Cyber Resilience Act](https://en.wikipedia.org/wiki/Cyber_Resilience_Act) all saying "do not use unsafe languages". Three responses — Profiles (opt-in, missed C++26), [Circle](https://safecpp.org/) (a real borrow checker, rejected), [Carbon](https://github.com/carbon-language/carbon-lang) — and five to ten years of mixed codebases ahead. Which makes bindings the main thing: bindgen, CXX, autocxx, Crubit, Zngur, Diplomat. "Six ways. Which one is the one that we should use?"

The Python half was where the numbers got silly. [PyO3](https://pyo3.rs/) and [Maturin](https://www.maturin.rs/) made Rust the easy choice for native extensions. The `rpds` crate has modest download numbers on crates.io; its Python binding, [`rpds-py`](https://pypi.org/project/rpds-py/), hit roughly 470 million downloads in thirty days the moment `jsonschema` adopted it. "Surprise, now you have almost half a billion users more." And who is paying that maintainer?

The ask wasn't a call to arms but a call to action: "please look at your neighbours, because they are already looking at you."

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
