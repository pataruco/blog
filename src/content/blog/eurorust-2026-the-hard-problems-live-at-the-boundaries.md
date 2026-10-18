---
title: 'EuroRust 2026: the hard problems live at the boundaries'
date: 2026-10-18T00:00:00.000Z
excerpt: "In Barcelona we had two days, fourteen talks, one thread: the compiler fulfils most of Rust's promises, but at each boundary the guarantees turn into contracts which you have to keep"
slug: eurorust-2026-the-hard-problems-live-at-the-boundaries
---

I was in Barcelona from the 15th to the 16th of October 2026 attending EuroRust, the Rust conference arranged by Mainmatter. The conference had two stages and featured fourteen talks; I watched a number of them on video since some of the side talks clashed with those on the main stage. A central theme in all the talks was that the compiler looks after most of Rust's promises for you, but at each boundary the guarantees turn into agreements which you have to follow yourself.

The following points can be put into practice by Rust developers: First, care must be taken when dealing with boundaries such as FFI or unsafe code—in these cases, one has to carry out their own checks rather than relying merely on the type system. Second, agreements should be documented and enforced at these interfaces, this being achieved for example by using types that cannot be cloned, by carrying out explicit tests that compare the output with that of the old systems, or by means of configuration files which make trust explicit. Lastly, it is important to set up secure, correct workflows as the standard in your projects so essential checks do not have to depend on memory or on habit. These lessons were illustrated in the various talks and provided practical methods for extending Rust's safety beyond what the compiler can detect.

The time it takes to compile and the time it takes to run the program, the safe and the unsafe options, the relationship between Rust and the C++ it has to work with, your own code and the libraries that your code depends on—each topic was treated in turn, with every speaker explaining from their own point of view what is required in order to cross those boundaries safely.

Safety is not a keyword but a contract.

The following are the points that I concluded, in the order in which the talks took place.

_Day one — Thursday 15 October_

## Oli Scherer — Move your problems to compile-time and get new capabilities out of it

[Oli](https://github.com/oli-obk/) began the conference with a history lesson which served as a roadmap for the future. When Rust 1.0 was released it included two const evaluators — one for statics and one for consts — and these two disagreed as to which programs were valid. With the introduction of `const fn` in Rust 1.31, rather than fixing both, the team added a third evaluator that shared its core with Miri and got rid of the other two. It was so powerful that they had to add code to limit it.

All the gradual improvements that came afterwards followed the same pattern: it took about fifty releases to deal with mutable references in `const` since "we are either fixing the tricky cases or banning them".

The plan is to use compile-time reflection. The present design is referred to as "type info" — "That's very boring. Don't let compiler developers name things" — and it makes TypeId into a primary value that you can examine at compile time, including its names, variants, fields, and the types of the fields. When you have that capability, you can convert anything into a format suitable for storage and thus be able to debug anything without having to use a `derive`. A JSON configuration will soon be parsed by the compiler and turned into a static value on the embedded device.

The risks were also looked at: public fields have an impact on versioning, parametricity is already compromised (since 1.0, the `size_of` function has been the cause of this), and `TypeId` only works with `'static` types. The feature which I am still thinking about though is "comptime-only" functions—that is, things which have no answer at runtime, such as allocating memory at compile time and then turning the result into a static value, or reading an entire asset folder into the program. For instance, suppose you wanted to embed configuration files or lookup tables directly into your firmware: with comptime-only functions you could read an entire directory of assets at compile time, serialize their data, and have them available as pure static values in your Rust binary—there would be no need for runtime file I/O or deserialization. Or you could generate large deterministic data structures, for example by parsing and embedding a font or a decompression dictionary during compilation, so that complex resources become instantly available at runtime. Not faster code, but new kinds of code.

## Benedikt Wiethof & Theophil Spiegeler Castañeda — The future of unmanned systems is built on Rust

It was a talk organised by [Quantum Systems](https://quantum-systems.com/), the one in which I had written 'hexagonal architecture → drones!' in my notebook, including the exclamation mark.

The issue is that all existing ground-control stations are based on the assumption that there is a single operator and a single vehicle. Theophil and Benedikt's team are developing Mosaic, a ground-control system which is designed to handle multiple operators, vehicles, and stations. Their initial version was written in C++ and although it passed the tests it was quite fragile — it exhibited unpredictable behaviour and had dependency problems — and had "kind of gone in the wrong direction". The rewrite in Rust began with "basically zero developers" and took twelve to thirteen months.

Each station has a hexagonal core; the vehicles connect via gRPC drivers which specify their capabilities in advance, enabling the system to reject any mission that the drone is unable to carry out before take-off. Operators are given role-based access through a local identity provider. The cores communicate on an equal footing using mTLS over QUIC — that is, there is no leader and no follower — with exactly one owner assigned to each entity and read-only copies available at all other locations. The video is deliberately of low quality and is sent to the operator via WebRTC at the final stage.

That's the purpose of the exclamation mark. If you get rid of the drones, then Crux— the framework that we build at Red Badger— takes the form of a pure core which is in charge of state and decisions, with side effects moved to the edges and capabilities being declared rather than assumed. In fact, they use the same terms—core and capabilities. We apply this approach so that the app can be tested on iOS, Android, and the web. They do so in cases where a mistake doesn't just result in a failed test. Some patterns are so robust that they operate at a military level, where lives are at stake.

They were open about the costs since with a core that is based on actors each feature has an impact on fifty files. The only reward was a demonstration video showing an interceptor locking onto one of their own target drones with a delay of about 300 ms, and as the final comment: "Rust was the right choice."

## Jana Dönszelmann — Optimizing rustc's next trait solver

Jana, who can be found at https://donsz.nl, is currently working full time on the new trait solver in rustc, and this was the most clear explanation I have ever come across of what a trait solver actually is. It functions as a proof engine. If we're looking at 'u64: Clone', then we have to prove it. The analogy given is to Prolog: its use of facts, rules, and a search – at which point lcnr in the audience shook their head and Jana admitted, "I will lie a little bit today."

The extent of it is surprising. Putting together the standard library results in the `Sized` trait being instantiated some 800,000 times. Since an `impl` involving an associated type is in effect a function which takes types as input and returns types as output, the solver is Turing complete—`typenum` carries out arithmetic within it and someone has actually written a chess program for it—meaning that a single query can take any amount of time. Small optimisations lead to an improvement in speed of 5 to 10 per cent, while algorithmic fixes "literally make a 100% difference".

The important point is caching, with the clever aspect being canonicalisation—this involves generalising a goal so that two queries which differ only in the names of their type parameters end up using the same cache entry. The hit rate has now reached about 80%. A remedy for opaque types reduced the compile time of a parser benchmark by half; over the course of the year, the benchmark's time decreased from 200 billion CPU cycles to around seven billion.

The outlier graph made it clear that whereas the crates had once been up to 16 times slower than the old solver, they are now mostly running at 1.0×. The stabilisation process is in its final comment period, targeting Rust 1.101.

## Arya Dradjica — Building a query system

Arya has been working for one year and a half on a Rust compiler, mainly by herself. "That could be a mistake, of course." The compiler is called Crabby since the high-level design of rustc is now the main bottleneck—but rustc is too large, too busy, and too concerned with stability to attempt any major changes. Hence, Crabby serves as a testing ground.

The presentation focused on its query system, Capillary, and began with a trick question: who among you had used a query system? Anyone who did not raise their hand was mistaken, since a Makefile is essentially a dependency graph and "query systems are Make.". The distinction with a compiler is that it determines the dependencies as it proceeds, and the unit of work is a single Rust item rather than a file.

From that she arrived at three conclusions. First, Cargo carries out its tasks in parallel for each crate, and as a result a single line of code changed deep inside rustc used 1.4 of her 16 CPUs — "the CPUs are good ones, but rustc just won't make use of them, guys". Capillary, on the other hand, carries out its tasks in parallel for each item. Second, the matter of target folders; she ran ncdu in real time on her system and found that the total amount was 57 GB, with 22 GB in the deps directory and approximately 16 GB consisting of identical rlibs that had been copied across different projects. The queries themselves can clear their own caches and eliminate the duplicates. Third, the queries in both rustc and Salsa execute sub-queries one at a time, which is why she made her own version asynchronous — "we simply make everything asynchronous and in some way that works".

The phrase that remained with me was "Please never implement name resolution."

## Timo Bachmann — Rebuilding the Tower of Babel: write your own language server with Tree-sitter

Timo, who is a robotics researcher at the German Aerospace Center, says that the problem in question is quite particular. A colleague developed a process manager in 2010—since that was the year when domain-specific languages were all the rage, it's no surprise that he came up with his own language—and currently the configuration language of that manager is being used by thirteen robots and around 200 users. "That's a fairly large number, but still not enough to warrant the development of tools." All the editors display it in simple black and white.

The entire system is based on a single Tree-sitter grammar, consisting of about thirty lines of JavaScript, which serves as the definitive source. Syntax highlighting is provided by it (even the highlighting in the Typst slides was achieved using this grammar), formatting is carried out using Topiary, and the language server is built on top of tower-lsp-server. The LSP component has 68 methods, only two of which are necessary. It parses a 5,000-line file in about 5 milliseconds, and an incremental reparse takes 0.3 milliseconds, so the syntax tree serves as the server's model.

The various intelligent features—hover, diagnostics, completion, go-to-definition, and rename—work by matching the node under the cursor with its parent. Since the keywords are generated at compile time, altering the grammar causes the server's build to fail. "Precisely as we should expect it to."

I was interested in this project. I maintain zed-mjml, a Zed extension for MJML, and I wrote an article on how I built it in March. I used the same method, taking two shortcuts: I used the tree-sitter-html grammar and prepared only the query files since MJML is HTML with different tag names; and the diagnostics are provided by mrml, a real MJML parser, not by the syntax tree.

That is precisely the point made in the Q&A: the term 'tree-sitter' has no meaning. If you already have a compiler—or, as in my case, a parser—then build on that. Timo's talk was concerned with how easy it is to start from nothing, whereas mine began from something and arrived at the same destination.

## Filip Petkovski — Running safely with scissors: lock-free concurrency for maximum throughput

Filip, whose website is https://fpetkovski.github.io/, developed the internal monitoring platform at Shopify, and the example used was the in-memory buffer of their metrics database: one writer adding data at a steady rate and many readers scanning. They initially used an RwLock, but when the readers were scanning blocks of 1,024 entries the writer slowed down and the readers got stuck.

The new design consists of two rules: each memory area has exactly one writer and only adds data at the end. Since a fixed-size array neither moves nor has its elements changed, readers do not need any kind of lock; the writer simply atomically updates a marker. When growing, a pre-allocated 'spine' points to segments which each double in size, and the number of segments as well as the length of the last segment are packed together in a single atomic value. Readers are never blocked by the writer. Period.

The part I was looking for. Everything here requires `unsafe`, and "performance should not come at the cost of safety." Since the protocol is invisible to the borrow checker, safety is based on an agreement that relies on three elements: the types (the writer can't be `Clone`, `push` takes `&mut self`, and the storage is a `Box<[UnsafeCell<T>]>` which can't grow), the API (the readers have no methods that modify the data), and the implementation (write the value and then `Release` the length; the readers `Acquire` it). "It's not sufficient simply to omit the `unsafe` keyword from the function." `std::sync::Mutex` is constructed in the same way.

A key lesson is that when you are implementing or using unsafe abstractions, you should clearly document the safety agreements in both your code and your README. For each `unsafe` block, include a SAFETY comment that lists the conditions which must be maintained by the callers or by those who implement the code. Summarize the entire contract in the documentation at the module level, covering the soundness invariants and the requirements for use. Use Rust's `#[doc = "safety: ..."]` attribute or include an explicit "# Safety" section in the public APIs to state what must always be true if the abstraction is to remain correct. Refer to the locations where the contract is enforced and, where possible, add assertions or debug-only checks to detect errors early on. These practices not only safeguard your users but often also assist the next person—or your future self—in understanding the code, even though the compiler is unable to verify it.

The climax involved Miri spotting a swapped publish order that a standard test failed to detect; it also inspired me to think about a way of teaching ownership—that one person writes while many people read—see another post.

## lcnr — What's next for Rust's type system

lcnr](https://lcnr.de) is co-leading the Types team, and the first part of the talk served to remind us that a great deal of their work remains invisible—the order of the team's priorities being sound, consistent, evolvable, and fast. The problem of soundness has been open since 1.0 — that is, for eleven years — since fixing it required years of preliminary work, and people never come across it in practice. Consistency was demonstrated through a simple example: making two calls to the same method on an integer literal produces two different results, since the first call sets the type to i32. "You only realise these problems when you cease to notice the errors that occur."

Here's the good news, stated in a flat tone: the [never type](https://doc.rust-lang.org/std/primitive.never.html) — a running joke being that `!` is named after the date on which it was stabilised — will be included in Rust 1.100 on the 12th of November. The talk proposal had stated that the next-generation trait solver would "hopefully be ready by the time of this conference". It was actually landed three days before. It will be stable by Christmas unless anything arises. [Polonius](https://github.com/rust-lang/polonius), the new borrow checker, is now on nightly.

The foundation brings to light the features that people really want, such as `impl Trait` in type aliases, const traits, more rich const generics, and new implicit bounds (`MetaSized`, `Move`, `Forget`) which are intended to address the problems that `Pin` currently hides. There are 33 open project goals concerning just the type system.

The final statement, which is included repeatedly, is "It works better if we have money."

## Johan Rosengren & Sergio Gonzalez Martin — Image codecs rustification in Chromium

Johan and Sergio, who are members of the Microsoft Edge security team and work alongside the Chrome team, delivered the most practical presentation of all during their first day. They were asked to talk about image decoders because 'the browser doesn't select the input—the attacker does'. The vulnerability pattern is always identical: an incorrect size calculation is followed by a memory copy that relies on that calculation. The 2023 libwebp flaw was due to a miscalculated Huffman table and was actually exploited in the wild. In Rust, 'the bug is still a bug, but it's not an exploitable one'.

The first step was Google's PNG port: over a two-year period, the main effort was directed at improving Chromium's Rust infrastructure rather than at decoding PNGs. "The benefits of PNG have since been reaped by all subsequent projects," said Microsoft when carrying out its work on BMP and ICO. In order to add resumable BMP decoding to the image crate, one large, unreviewed PR was divided into more than ten smaller ones.

The sentence I want to draw attention to was from the ICO's work: "As soon as it crosses that FFI boundary, it's no longer just metadata. You're signing a contract." The Rust decoder had 128 times 128 as the largest frame, Blink fixed on that size, after which 256 times 256 arrived and the browser crashed. The sizes were always included in the file.

Getting the software delivered to a billion users is a process, not something that involves rewriting: you have to use a feature flag, carry out tests against the C++ decoder, deploy via Canary and then via Finch, before waiting for two or three stable releases before removing the C++. "The actual easy part was the Rust code; what we all enjoyed was the integration nightmare."

_Day two — Friday 16 October_

## Cristián Maureira-Fredes — Rust's influence on C++ and Python: shaping the future of three communities

On the second day there was a keynote lecture given from outside the bubble. [Cristián](https://maureira.dev) is involved with PySide, the Python bindings for Qt, and has just been elected vice chair of the Python Software Foundation—"a serial conference organiser, not a serial killer". His argument is that "much of what is coming in Rust is most likely being shaped outside the Rust ecosystem" and he raises the question of "whether you all are ready if 30 million people just come to the Rust ecosystem".

The C++ portion involved a safety crisis timeline: after years of using RAII, MISRA, smart pointers and sanitisers, the NSA, CISA, the White House and the EU's [Cyber Resilience Act](https://en.wikipedia.org/wiki/Cyber_Resilience_Act) all stated that unsafe languages should not be used. The responses were Profiles (an opt-in solution that missed C++26), [Circle](https://safecpp.org/) (a real borrow checker, which was rejected), and [Carbon](https://github.com/carbon-language/carbon-lang); as a result, the situation now involves codebases that are mixed for five to ten years. This is why bindings are the key issue: bindgen, CXX, autocxx, Crubit, Zngur and Diplomat. "There are six options—so which one should we choose?"

In the case of Python, the numbers became ridiculous. Both [PyO3](https://pyo3.rs/) and [Maturin](https://www.maturin.rs/) meant that Rust became the obvious option when writing native extensions. The `rpds` crate has only a small number of downloads on crates.io; however, when `jsonschema` adopted it, its Python binding, [`rpds-py`](https://pypi.org/project/rpds-py/), achieved about 470 million downloads in thirty days. "Surprise, now you have almost half a billion users more." And who is going to pay the maintainer?

The request was not an appeal to fight but an appeal to act: "please look at your neighbours, since they are already looking at you."

## Sanskar Jaiswal — Designing state machines for streaming proxies in Rust

Sanskar, who works on building serverless API gateways at Kong, provided an example in which a 4 GB upload was halted in the middle of the stream due to a 413 error. The conventional request-then-response approach is "rather misleading" in that the upstream server sends its reply as soon as it has received the first chunks, so traffic flows in both directions simultaneously. The proxy now has to pass on the 413 error, stop reading the body, and determine whether each connection is clean enough to be reused — since a contaminated buffer could corrupt the following request.

The difficulty in async Rust lies in the fact that futures can be cancelled at any time, which means that partial progress is lost and certain steps cannot be reversed: after response headers have been sent, it is not possible to send a 502 error later on. These four rules arise as a result of this situation: partial progress is preserved even if cancellation occurs, committed output is stored, only clean connections are reused, and the request and response constitute separate exchanges with a cause-and-effect relationship between them.

The contentious point is that "it's okay to say no to [typestate](https://cliffle.com/blog/rust-typestate/)" at times. Typestate is suitable for linear flow scenarios but "really turns into a mess" when it comes to bidirectional IO. As an alternative, use three small enums (one for request progress, one for response progress, and one for commitment), a single durable `ProxyState` to manage them, and a [`select!`](https://docs.rs/tokio/latest/tokio/macro.select.html) loop in which the various branches merely read and the writing takes place afterwards, outside of any `await`. Reuse is treated as a type in that `validate` only passes you a reusable connection if it is clean and the pool will not accept anything else.

In my opinion we needn't be afraid of runtime checking since one must know what one is about when doing so. As for dividing the work into tasks and channels, I place the blame on microservices.

## Matthias Rauter — Qt Bridges: bringing a mature C++ UI framework to Rust

Matthias, who can be contacted through [this link](https://eurorust.eu/talks/qt-bridges-bringing-a-mature-c-ui-framework-to-rust/), had used Qt for fifteen years, writing C++ code to simulate avalanches and tsunamis, before moving to The Qt Company. Two years into the Qt Bridges project he said, "I don't want to go back to C++". The demo also features two pet birds, Miss Moneypenny and Miss Wednesday, who act as the demo objects.

The proposal is straightforward: the Rust community don't want Qt's C++ core; instead they want the crates, Cargo and "a way of getting into QML". Qt Bridges consists of a single `#[qobject]` macro on an `impl` block, properties together with notify signals, `#[qslot]` for methods that can be called, and a `QApp` to start the event loop. "90% of our API can be shown on this slide." It is compatible with Tokio, reqwest and serde. In the case of C++ Qt you need macros as well as an additional preprocessor — sometimes referred to as "proc macros for poor people" — whereas in Rust the macros provide QML's by-name reflection natively.

Down below things become interesting. Objects are stored in `Rc<RefCell<T>>` and are borrowed at runtime each time there is a call from QML to C++ to Rust, which means that a re-entrant call would result in double borrowing. The solution is a simple borrow-state machine—indeed, it turned out that the team had independently reinvented [Stacked Borrows](https://plv.mpi-sws.org/rustbelt/stacked-borrows/), Miri's aliasing model. "Miri is happy with it, I'm happy with it, I hope you are happy with it."

The compromises were made clear in that you need to have Qt installed and a C++ compiler, QML errors only show up when the program is running, and if a panic occurs in C++ it causes an abort. "Rust has a lot of rules, whereas QML doesn't." Choose the one that suits you.

## Francois Mockers — Supply chain attacks, and how to protect ourselves

Francois, who can be found at vleue.com, is the person who maintains Bevy and also writes Rust at a fintech company since, given that we are dealing with money, it is important not to get attacked. The room was more than full, and this talk was the one that prompted me to take the most notes.

`cargo add` involves four acts of trust: identity, authenticity, integrity, and the maintainer, all of which have now been breached. This happened through a phishing email from a `.dev` domain on crates.io; there was the `faster_log` package, a working copy of `fast_log` that secretly stole credentials from logs over a period of four months; and a clone of `proc-macro2` which included a build script designed to steal credentials and was pulled in each time an older version was bumped, causing Cargo to continually prompt you to update. They removed it after just 86 minutes, which was enough time to cause damage. There's also the uncomfortable truth that the tarball available on crates.io does not correspond to the repository. An audit that Francois is carrying out on every version of the crate has found that only about 70% of the versions can be verified against the declared commit. You examine the git diff and then you release the tarball.

To be clear: [cargo-audit](https://crates.io/crates/cargo-audit) and [cargo-deny](https://crates.io/crates/cargo-deny) are the tools for handling advisories and bans, [cargo-vet](https://crates.io/crates/cargo-vet) and [cargo-crev](https://crates.io/crates/cargo-crev) are for borrowed trust, [cargo-supply-chain](https://crates.io/crates/cargo-supply-chain) and [cargo-cyclonedx](https://crates.io/crates/cargo-cyclonedx) are used for inventory, [cargo-machete](https://crates.io/crates/cargo-machete) and [cargo-udeps](https://crates.io/crates/cargo-udeps) are for pruning, and [cargo-auditable](https://crates.io/crates/cargo-auditable) is the one that enables the SBOM — which the Cyber Resilience Act will soon want — to be baked into the binary itself.

The main point, however, relates to defaults: "a check that you have to remember to run is a check that doesn't run." Therefore, set a minimum publish age of seven days in a committed `.cargo/config.toml` file, since this is the only measure that safeguards against local builds. An example of how this could be done would be to include `[registry]` settings with `min-publish-age = 7d` in your project's `.cargo/config.toml` in order to avoid accidental rapid publishing. Commit the lockfile and have the CI system carry out `cargo update`. This way, you build your application using the current lockfile during development, but only allow new dependencies or updates once they have been reviewed in a pull request. Fix your dependencies in `Cargo.lock`, not in `Cargo.toml`, so that both CI and production builds remain reproducible. If you are using Dependabot to automate dependency updates, set a seven-day cooling-off period by modifying its configuration file—this prevents new versions of crates from being pushed in too quickly. When it comes to publishing, make it necessary for all releases to go through CI pipelines rather than being published directly from local developer machines, using [trusted publishing](https://crates.io/docs/trusted-publishing) for authentication. In the longer term, it might be worth considering the use of a WASM sandbox for proc macros, just as Zed does with its extensions. I was on the other side of such a sandbox with zed-mjml, and the sandbox is strict enough that the actual work ended up being carried out in a native binary—which is both the intended outcome and the problem. And adopt a policy-driven registry mirror as the default for the public registry—Francois built one called Haven, which includes a seven-day quarantine period—leaving crates.io as the unreviewed inbox.

Set the secure path as the default path.

## Martin Ombura Jr. — Atomic design patterns in Rust: from orderings to code

Martin began by apologising to anyone who had seen the previous version — "a lot of information had been crammed in during thirty minutes and I can't guarantee that anything has changed" — and then went through the vocabulary slowly, which is why it finally stuck. The atomic model resolves two issues. The intuitive aspect is atomicity. Synchronisation is the difficult 99%.

The terminology is that of C++20: the modification order for an atomic variable is derived from the program order together with an 'Acquire' load that reads a 'Release' store. "Whenever you come across a release, you can be sure that somewhere there is likely an acquire." The example used is [`Arc`](https://doc.rust-lang.org/std/sync/struct.Arc.html): the `clone` operation is a `Relaxed` `fetch_add`, since the clone you possess serves as proof that the object exists; `drop` consists of a `Release` `fetch_sub` followed by an `Acquire` fence before the actual freeing, so that the last thread sees all the final uses.

The pattern that I'm going to use is Probe, Validate, Execute: first carry out a cheap `Relaxed` load just to have a look, then carry out a more rigorous re-check since the value might have changed, and only then take action. This approach is the one upon which channels and work-stealing queues are based.

The highlight was the treatment of `SeqCst`, the order that Rust developers put in place when they're unsure. This introduces a single total order, which in turn allows you to _disprove_ an incorrect interleaving. In the sleep-and-wake mechanism of [Rayon](https://github.com/rayon-rs/rayon) there is a lost-wakeup scenario which two `SeqCst` fences make impossible—the proof is given in their README. "It's not possible for World War Two to come before World War One and for World War One to come before World War Two at the same time."

The "EuroRust DLC" bonus content was an example of false sharing and used [`CachePadded`](https://docs.rs/crossbeam-utils/latest/crossbeam_utils/struct.CachePadded.html). Start with the benchmark.

## Albert Lockett — Building a high-performance, thread-per-core, zero-copy OpenTelemetry engine in Rust

Albert, who is associated with the GitHub account [Albert](https://github.com/albertlockett), is responsible for maintaining [OTel Arrow](https://github.com/open-telemetry/otel-arrow) at F5, and the entire talk was based on a single principle applied three times: the role of a telemetry engine is to achieve high throughput relative to the amount of compute used, therefore one should design the system with the hardware in mind.

To start with, the data—OTLP transmits telemetry in the form of protobuf rows while OTAP, which is the OTel Arrow Protocol, transmits it as Apache Arrow columns. The severity level of each log is placed beside the severity level of all the other logs: benefits include cache locality, SIMD, and better compression—and the wire bytes of Arrow IPC are the in-memory buffers themselves, which means that serialisation involves no copy.

Second, the threads. Each core gets its own full copy of the pipeline, operating within its own single-threaded Tokio runtime and sharing nothing with the others nor ever synchronising. Tokio's work-stealing scheduler would take care of that. That said, the data of a stolen task remains in the cache or [NUMA](https://en.wikipedia.org/wiki/Non-uniform_memory_access) node of another core, and since all the workers are running the same code on data that is similar, stealing provides only a small benefit. The "mysterious advantage" is that, as the tasks never migrate, "our futures don't need to be `Send`". There is no use of atomics or mutexes, and a custom channel that performed better in the benchmarks than `tokio::sync::mpsc`.

Thirdly, the decoding process. The conventional approach—Prost decoding the protobuf into a struct—results in 'an intermediate representation which is then discarded'. Instead, traits with associated types that carry lifetimes should be used, in such a way that a `LogRecordView` over the raw bytes decodes a field only when the Arrow builder requests it.

The transforms are based on [DataFusion](https://datafusion.apache.org/), a system that describes itself as the "LLVM for databases", and the comment in the Q&A regarding io_uring — "this will reveal maybe a little bit about the maturity of the project" — made me appreciate it more.

## My insight

I mainly work on the web, since the platform itself does the difficult work and all I have to do is get out of its way. Since the compiler is famous for being so strict, I had expected the conference to concentrate on the compiler.

It is at least in part the case. Jana, Arya, lcnr and Oli are working on reconstructing its foundations so as to enable it to demonstrate more quickly. However, that wasn't the subject of the other ten discussions. Those talks concerned the lines that the compiler cannot see across. Specifically, the `unsafe` block in Filip's array. The FFI boundary at which Johan's metadata turned into a contract. The `Rc<RefCell>` instance where Qt interfaces with QML. The `select!` branch which is cancelled during the writing process. The 86 minutes that a malicious crate remained on crates.io.

At each of those lines the guarantee comes to an end and a contract begins, and someone has to record it—for example, in a font that cannot be copied, in a README proof, in a `.cargo/config.toml` file, or in a differential test compared with the old C++ decoder. Those who come up against similar situations can follow a number of good practices: they should include clear SAFETY comments before each unsafe block, specifying precisely what invariants the callers are responsible for maintaining; they should summarise the safety contracts in the module-level documentation and in the README so that future maintainers or auditors will know what to look for; they should use explicit types and APIs to the extent possible in order to make illegal states unrepresentable; they should enforce the contracts using assertions, debug checks, and targeted tests, including comparisons across different platforms or with legacy systems; and they should provide links to relevant resources, such as the section on sound abstractions in the Rustonomicon or the official Rust API Guidelines. By making the contracts explicit in both code and documentation, invisible agreements become habits that you can count on.

The compiler keeps its promises. The rest are ours to keep.
