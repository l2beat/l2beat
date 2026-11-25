---
title: "Hash-based is not an assumption"
description: "Why we need to be careful when calling hash-based signatures \"minimal assumptions,\" shown through one small counterexample."
publishedOn: "2026-11-25"
authorId: l2beat_research
tag: Research
---

## The "minimal assumptions" argument

In Ethereum's post-quantum debate, hash-based cryptography is increasingly framed not just as post-quantum, but as a path to being "post-AI" as well, meaning safe even if AI systems start finding mathematical attacks that humans missed. In the [pqai27 proposal](https://ethereum-magicians.org/t/an-ethlabs-view-on-post-quantum-and-post-ai-timelines-pqai27/30351), Ethlabs defines post-AI cryptography as resting on *"as few assumptions as possible"* (making Ethereum *"plausibly post-AI, not provably"*), and writes:

> *"The planned cryptography is built around hash functions, to minimize the assumptions we need to rely on. This is also the approach for the rest of the cryptography, such as aggregation. Minimal assumptions address both quantum computers and AI alike, so the existing plan already covers the cryptography for both."*

In [PQAI #0](https://blog.ethereum.org/2026/11/23/pqai-0), the Ethereum Foundation (EF) frames the case pragmatically: cryptography should use *"the most conservative assumptions,"* and relying on *"what we believe to be weaker assumptions"* (assumptions that ask less of the underlying primitive, and are therefore harder to break) is prudent risk management. Read in context, "minimal" in this debate means **practically minimal**. Unlike lattice schemes such as [ML-DSA](https://csrc.nist.gov/pubs/fips/204/final) or [Falcon](https://falcon-sign.info/), hash-based designs avoid introducing an entire algebraic assumption family like [Module-LWE](https://en.wikipedia.org/wiki/Learning_with_errors) or [NTRU](https://en.wikipedia.org/wiki/NTRU).

Even so, that pragmatic framing easily slips into the stronger claim that replacing elliptic curves with hash-based signatures adds **no new assumptions**. In PQAI #0, the EF writes: *"The Ethereum protocol already relies on hashes being secure, so importantly this does not add a new assumption."* You hear the same shorthand in core dev discussions too. In the [ACDE #249](https://forkcast.org/calls/acde/249) call chat, SPHINCS was defended with *"SPHINCS does not add new crypto assumptions (we already have [Keccak]), while Lattices would."*

The problem is that **"hash-based" names a building block, not an assumption.** Saying a hash function $f$ is secure can mean very different things, starting with a familiar three-step ladder (for compressing hashes, each rung asks for more than the one before):

1. **One-wayness (preimage resistance):** Given only the output $f(x)$ for a random input $x$, nobody can find *any* input that hashes to it.
2. **Second-preimage resistance:** Given a random input $x$, nobody can find a *different* input $x' \neq x$ with $f(x') = f(x)$.
3. **Collision resistance:** Nobody can find *any* pair of distinct inputs $x \neq x'$ with $f(x) = f(x')$.

These are not equivalent. A function can be one-way without being second-preimage-resistant, and second-preimage-resistant without being collision-resistant. Even that textbook trio is incomplete: real hash-based designs also rely on properties outside this ladder altogether, such as outputs looking indistinguishable from random.

Replacing elliptic curves with a hash-based scheme is therefore not automatically a strict reduction in assumptions. Elliptic curves will not survive large quantum computers, so adding post-quantum signatures is not in question. What matters is whether dropping elliptic curves at the same time comes for free. Whenever a scheme introduces new hash assumptions of its own, you are trading risk rather than purely removing it: **if one of those new assumptions breaks while elliptic curves are still standing, having dropped them leaves you worse off.**

To see how quickly new hash assumptions appear, even before touching Ethereum's full stack, we compare two one-time signature schemes built on the same hash function $f$. **Lamport** is the minimal hash-based signature scheme. **Winternitz** is the standard efficiency optimization on top of it, and the core building block inside [XMSS](https://datatracker.ietf.org/doc/html/rfc8391), [SPHINCS+](https://csrc.nist.gov/pubs/fips/205/final), `leanXMSS`, and `leanSPHINCS`. The result:

- **One-wayness alone is enough for Lamport.**
- **One-wayness alone is provably *not* enough for textbook Winternitz.** We'll build an explicit hash function that is one-way whenever SHA-256 is (so Lamport over it stays secure), yet lets an attacker forge Winternitz signatures 100% of the time.

Nobody in this debate claims one-wayness is all Ethereum needs. Ethereum already assumes full 256-bit Keccak-256 is collision-resistant. We use one-wayness as the starting line because it is the only level where "no new assumptions" holds automatically for every signature scheme, and Lamport vs. textbook Winternitz is the smallest setting where a new assumption appears the moment a scheme gets more efficient. After the counterexample, we address tweaked variants like WOTS+, then check what Ethereum's actual PQ stack adds beyond what Ethereum assumes today.

---

## Why one-wayness is the theoretical minimum

For digital signatures, you cannot go lower than one-wayness, because **secure signatures exist if and only if one-way functions exist.** Even this theoretical minimum is an unproven assumption: one-way functions imply $\mathsf{P} \neq \mathsf{NP}$, while the converse remains open.

- **You can't do with less.** Every signature scheme has a key-generation procedure that turns random secret bits into a public key. If that mapping weren't one-way, anyone seeing your public key could invert it, recover valid secret bits, and forge signatures at will. So *every* secure signature scheme (ECDSA, BLS, lattices, hashes) at minimum implies a one-way function.
- **In theory, you don't need more.** [Rompel (1990)](https://doi.org/10.1145/100216.100269) showed how to build a full signature scheme from *any* one-way function, with zero extra assumptions.

The catch is that Rompel's construction is far too slow and large to deploy. Practical schemes buy efficiency by assuming more.

To prove where Winternitz crosses the one-wayness line, we first need a precise definition of one-wayness. Take a hash function $f: \{0,1\}^n \to \{0,1\}^n$, and imagine an attacker limited to at most $t$ basic operations playing this game:

1. Pick $x$ uniformly at random from $\{0,1\}^n$.
2. Compute $y = f(x)$ and give $y$ to the attacker.
3. The attacker outputs some $x'$.
4. The attacker wins if $f(x') = y$.

We say $f$ is **$(t, \varepsilon)$-one-way** if no attacker within budget $t$ wins with probability greater than $\varepsilon$. Intuitively, 128-bit security means an attacker with budget $t$ wins with probability at most roughly $t / 2^{128}$, so reaching a high probability of success takes roughly $2^{128}$ operations.

One detail in this definition matters later: **one-wayness is average-case over random inputs.** If a tiny sliver of inputs (say, one in every $2^{128}$) is trivially easy to invert, $f$ is *still* one-way. A random $x$ almost never lands in that sliver, so it only nudges the winning probability up by $2^{-128}$. Such easily invertible slivers exist even for real hashes like Keccak-256 or SHA-256, since anyone can precompute hashes of billions of inputs and invert them instantly.

---

## Lamport signatures: where one-wayness is enough

[Lamport signatures](https://en.wikipedia.org/wiki/Lamport_signature) are the simplest hash-based signature scheme. To sign an $L$-bit message $m = (m_1, \dots, m_L)$:

- **$\mathsf{KeyGen}$:** For each bit position $i = 1 \dots L$, generate two random secrets: $x_i[0]$ for bit $0$ and $x_i[1]$ for bit $1$ ($2L$ secrets total). The public key $\mathsf{pk}$ is the list of their $2L$ hashes $f(x_i[b])$, which we call public-key **slots** indexed by $(i, b)$.
- **$\mathsf{Sign}(\mathsf{sk}, m)$:** For each position $i$, reveal $x_i[m_i]$, the secret matching the $i$-th bit of $m$ ($L$ secrets in total).
- **$\mathsf{Verify}(\mathsf{pk}, m, \sigma)$:** Hash each of the $L$ revealed values and check that they match the corresponding slots $(i, m_i)$ in $\mathsf{pk}$.

Here the message itself is $L$ bits long, not an $L$-bit hash of a longer message, because compressing arbitrary messages with a fixed hash already requires collision resistance.

![Lamport signature scheme on a 3-bit message](/images/publications/hash-based-is-not-an-assumption/00a-lamport-scheme.svg)

A Lamport key can only sign **once**. If you sign two messages that differ in at least two bits, you reveal both secrets at those positions, letting anyone mix and match them into a third forged message without inverting anything.

So the security goal is **one-time unforgeability**, defined by this game:

1. Generate $(\mathsf{sk}, \mathsf{pk})$ and give $\mathsf{pk}$ to the forger.
2. The forger chooses *any* message $m$ and receives $\sigma = \mathsf{Sign}(\mathsf{sk}, m)$.
3. The forger outputs a forgery $(m^*, \sigma^*)$.
4. The forger wins if $m^* \neq m$ and $\mathsf{Verify}(\mathsf{pk}, m^*, \sigma^*)$ accepts.

The forger gets to pick *both* the message it asks you to sign and the message it forges. Real attackers can often influence what gets signed, for example by crafting a transaction or block header, so a scheme has to survive [chosen-message attacks](https://en.wikipedia.org/wiki/Digital_signature#Notions_of_security).

### Proof that Lamport needs only one-wayness

Intuitively, because $m^* \neq m$, they differ at some bit. At that position, the forger never saw the secret for $m^*$'s bit, only its hash in the public key. To turn that intuition into a proof, we use a **reduction**: we show that any algorithm able to forge a Lamport signature can be used to invert $f$.

> **How a cryptographic reduction proves security**
>
> If breaking into a house forces you to break the door, then as long as the door holds, the house holds. Showing that breaking Lamport lets you invert $f$ proves that one-wayness of $f$ protects Lamport.
>
> The proof runs backwards ("if Lamport breaks, $f$ breaks") instead of forwards ("if $f$ holds, Lamport holds") because in logic any implication $A \Rightarrow B$ is equivalent to its contrapositive $\neg B \Rightarrow \neg A$, and negating *"for all"* turns it into *"there exists."*
>
> $$\begin{aligned}
> \text{Want:} \quad & (\forall\text{ inverters, fails}) \quad\Rightarrow\quad (\forall\text{ forgers, fails}) \\
> \text{Contrapositive:} \quad & (\exists\text{ a successful forger}) \quad\Rightarrow\quad (\exists\text{ a successful inverter})
> \end{aligned}$$
>
> The two lines say the same thing, yet only the second gives you something to build with. "Every inverter fails" is a statement about all possible algorithms and gives you nothing to compute with. The contrapositive hands you **one** hypothetical forger, and you only have to wrap it (as a black box) into **one** inverter. The key requirement is that whatever inputs your wrapper feeds the forger must look identical to real inputs, so the forger behaves as usual.

Suppose a forger wins the Lamport game with probability $p$. We can use that forger as a black box to build an **inverter** that breaks the one-wayness of $f$:

1. The inverter receives a one-wayness challenge $y^* = f(x)$ for an unknown random $x$ (we write $y^*$ to mark it as the planted challenge).
2. It picks one of the $2L$ public-key slots uniformly at random and **plants** $y^*$ there. For all other $2L - 1$ slots, it generates real random secrets and hashes them normally.
3. It hands this public key to the forger. Every normal slot is $f(\text{random})$, and $y^*$ is *also* $f(\text{random})$. The public key has the exact same distribution as a real one, so the forger has zero information about which slot was planted. If the forger could spot the planted slot, it could dodge it by forging a different bit, or force the inverter to give up by asking to sign that slot.
4. The forger asks to sign some message $m$. If $m$ uses the planted slot, the inverter gives up (it doesn't know that secret). Otherwise, it knows all $L$ secrets $m$ needs and signs $m$ honestly.
5. Conditioned on surviving step 4, the forger sees a real Lamport game, so with probability $p$ it outputs a valid forgery $(m^*, \sigma^*)$. Let $j$ be the first bit where $m^*$ differs from $m$. The slot $(j,\, m^*_j)$ was not used by $m$, and if $y^*$ was planted there, $\sigma^*$'s component at position $j$ is a valid preimage of $y^*$, which the inverter outputs to win.

**Why this succeeds with probability $p / (2L)$.** The inverter survives step 4 with probability $1 / 2$, because half of the $2L$ slots are not used by $m$. Because $\sigma$ reveals only the slots $m$ used, the planted slot remains hidden after signing: conditioned on surviving step 4, it is equally likely to be any of the $L$ unused slots, and $(j,\, m^*_j)$ is one of them. So the plant lands on $(j,\, m^*_j)$ with probability $1 / L$, for an overall chance of $(1 / 2) \cdot (1 / L) = 1 / (2L)$ whenever the forger succeeds.

![Planting the challenge y* in a Lamport public key](/images/publications/hash-based-is-not-an-assumption/00b-lamport-reduction.svg)

Therefore, the inverter breaks $f$ with probability at least $p / (2L)$. Flipping that around: if $f$ is $(t, \varepsilon)$-one-way, no Lamport forger spending roughly $t$ operations can win with probability better than $2L \cdot \varepsilon$. For 256-bit messages, $2L = 512 = 2^9$, so the proof costs 9 bits of security and uses **zero assumptions beyond one-wayness**.

The proof worked cleanly for one reason: **planting $y^*$ in the public key was completely invisible to the forger**, because real public-key slots are single hashes of random inputs. That invisibility is no longer automatic once you start chaining hashes in Winternitz. We return to that detail after the counterexample.

---

## Winternitz signatures: trading keys for hash chains

Lamport's downside is size. With 32-byte hashes, signing a 256-bit message requires 512 public-key hashes (16 KB) and 256 revealed secrets (8 KB per signature).

[Winternitz](https://en.wikipedia.org/wiki/Hash-based_cryptography) shrinks both by signing a whole **base-$w$ digit** per secret instead of a single bit, using a hash chain, where the parameter $w$ is the number of values each digit can take.

Write $f^j(x)$ for $f$ applied $j$ times (with $f^0(x) = x$). A chain starts from a random secret $x$ and ends at the public key $\mathsf{pk} = f^{w - 1}(x)$. Take $w = 4$ (digits $0, 1, 2, 3$). A single chain looks like this:

![A single Winternitz hash chain for w = 4](/images/publications/hash-based-is-not-an-assumption/01-lamport-vs-winternitz.svg)

- To sign digit $d$, reveal the value at position $d$: $f^d(x)$.
- To verify digit $d$, hash the revealed value the remaining $w - 1 - d$ times and check that you land on $\mathsf{pk} = f^{w - 1}(x)$.

There's a catch: **hashing forward is free.** If you sign digit $1$ by revealing $f(x)$, anyone can apply $f$ once to get $f^2(x)$ and forge a signature on digit $2$. Digit $3$ is also $\mathsf{pk}$, which is already public. Since a real message has many digits (one chain each), anyone could forge the all-3s message without seeing a signature at all.

Winternitz plugs both holes with a **checksum**. Suppose your message $m$ is written in base $w$ as digits $d_1, d_2, \dots, d_k$. Compute:

$$C(m) = \sum_{i=1}^{k} (w - 1 - d_i)$$

Sum up how many steps *remain* at the top of each message chain, write $C(m)$ in base $w$ using a fixed number of digits (enough to hold the largest possible checksum), and sign those checksum digits with their own chains too. For the all-3s message, $C(m) = 0$, so a valid signature must include the raw secret at position $0$ of every checksum chain, meaning the public key alone no longer suffices.

> **Concrete example ($w = 4$, digits $0 \dots 3$)**
>
> A 2-digit base-4 message can reach checksum $C(m) = 6$ (on message $(0, 0)$), so the checksum always takes 2 base-4 digits. Your private key holds 4 random secret seeds $x_1, x_2, x_3, x_4$, one per chain. Suppose the message is $m = (1, 2)$. Its checksum is $C(m) = (3 - 1) + (3 - 2) = 3$, written in two base-4 digits as $(0, 3)$. So you sign 4 digits $(1, 2 \mid 0, 3)$:
>
> - Chain 1 reveals $f^1(x_1)$
> - Chain 2 reveals $f^2(x_2)$
> - Checksum chain 1 reveals $f^0(x_3)$
> - Checksum chain 2 reveals $f^3(x_4)$
>
> Now try to forge $m^* = (2, 2)$ by hashing Chain 1 forward once. The new checksum is $C(m^*) = (3 - 2) + (3 - 2) = 2$, written $(0, 2)$. To forge that last checksum digit, you'd have to go *backwards* on Checksum chain 2 from $3$ to $2$.

With 32-byte hashes and $w = 4$, a 256-bit message splits into 128 base-4 digits plus 5 checksum digits, totaling 133 chains (~4.2 KB each for signature and public key). At $w = 16$ (classic XMSS), it takes 64 base-16 digits plus 3 checksum digits, or 67 chains (~2.1 KB), down from Lamport's 8 KB signature and 16 KB public key.

The checksum trick works in general:

**Checksum Lemma.** *For any forged message $m^* \neq m$, at least one digit of $m^*$ (either a message digit or a checksum digit) is strictly smaller than the corresponding digit of $m$.*

**Proof.** If any message digit went down, we're done. Otherwise, every message digit stayed the same or went up, and at least one went strictly up, so the checksum satisfies $C(m^*) < C(m)$. Both checksums are written with the same fixed number of base-$w$ digits. Reading from the most significant digit, the first digit where they differ must be strictly smaller in $C(m^*)$, so at least one checksum digit went down. ∎

So, as with Lamport, forging a Winternitz signature forces the attacker to **go backwards** on at least one chain.

---

## A second way to go backwards

In Lamport, going backwards means one thing: inverting $f$. In Winternitz, there is a **second way** to go backwards without ever inverting the revealed value.

Stick with $w = 4$ and label the real chain values $v_i = f^i(x)$, so the chain reads $v_0 \to v_1 \to v_2 \to v_3 = \mathsf{pk}$. Suppose the signature revealed $v_1$ (digit $1$), and the forger wants to forge digit $0$ on this chain. It must output a value $\sigma^*$ for this chain such that hashing it 3 times lands on $\mathsf{pk}$:

$$\sigma^* \xrightarrow{f} f(\sigma^*) \xrightarrow{f} f^2(\sigma^*) \xrightarrow{f} f^3(\sigma^*) = v_3 = \mathsf{pk}$$

Since this forged path ends at $v_3$, it has to join the real chain *somewhere*. There are only two possibilities:

- **Case 1 (inversion): it joins at $v_1$.** That means $f(\sigma^*) = v_1$: the forger inverted $f$ on the revealed value $v_1$, which one-wayness blocks here because $v_1 = f(v_0)$ is a single hash of a random input (higher digits $d \geq 2$ introduce a separate subtlety we return to after the counterexample).
- **Case 2 (branch and merge): it joins *above* $v_1$.** The forged path misses $v_1$, lands on some *different* value $u \neq v_1$, and merges onto the real chain higher up, say at $v_2$:

![Two ways to forge digit 0 from revealed v1](/images/publications/hash-based-is-not-an-assumption/02-two-ways-backwards.svg)

Look at what Case 2 does:
- The forger **never recovers $v_0$**.
- The forger **never inverts $v_1$**.
- Instead, the forger finds a **second preimage** $u \neq v_1$ that hashes to the same next step ($f(u) = f(v_1) = v_2$), *together with* a known preimage $\sigma^*$ of $u$.

Call the property needed to block Case 2 **merge resistance** (our name for this chain-specific gap): given a revealed value $v_1$, it should be hard to find a value $\sigma^*$ whose path misses $v_1$ ($f(\sigma^*) \neq v_1$) yet merges back into the real chain higher up ($f(f(\sigma^*)) = f(v_1)$, or further along).

Compare merge resistance with textbook second-preimage resistance. Breaking second-preimage resistance asks for *any* $u \neq v_1$ with $f(u) = f(v_1)$, whereas breaking merge resistance asks for both $u$ *and* a preimage $\sigma^*$ that hashes to $u$.

To see the gap, take a toy hash $f(x)$ that drops the last bit of $x$ and runs SHA-256 on the remaining bits. Flipping the last bit of $v_1$ immediately gives a second preimage $u \neq v_1$ with $f(u) = f(v_1)$, so second-preimage resistance is trivially broken. Merge resistance still holds: $u$ sits at position $1$, not position $0$, and flipping a bit hands the attacker $u$ without giving a preimage $\sigma^*$ of $u$. Finding $\sigma^*$ still requires inverting SHA-256 on $u$, and merging higher up at $v_3$ hits the same wall (flipping the last bit of $v_2$ still forces inverting SHA-256, and any other merge requires a real SHA-256 collision).

![Second-preimage resistance versus merge resistance](/images/publications/hash-based-is-not-an-assumption/02b-2pr-vs-merge-resistance.svg)

In the other direction, collision resistance implies merge resistance, since blocking any colliding $u$ also blocks $(\sigma^*, u)$. Together with the toy hash above, that makes merge resistance strictly weaker than collision resistance.

Lamport never faces Case 2: the public-key slot you need to open is the hash of a secret that was *never revealed*, and there are no further hash steps above it. You have neither a known input $v_1$ to collide against nor a higher step $v_2$ to merge into. In Winternitz, as soon as chains have at least two hash steps ($w \geq 3$), Case 2 opens up, and one-wayness does not rule it out.

---

## The proof: a one-way function that breaks Winternitz

To prove that one-wayness is *not* enough for Winternitz, start with *any* secure one-way function $g$ mapping 256 bits to 256 bits. You can picture $g$ as SHA-256 or Keccak-256: even if $g$ is collision-resistant and ideal, the proof still works. From $g$, we construct a single hash function $f$ such that:

1. $f$ is **one-way whenever $g$ is** (so Lamport built from $f$ stays secure).
2. Winternitz built from $f$ is **broken** (for every $w \geq 3$, an attacker can forge with 100% probability).

Let $f$ map 384 bits to 384 bits, so its outputs can be fed back into $f$ along a chain. Split every 384-bit input into a pair $(\mathsf{tag}, r)$, where $\mathsf{tag}$ is a 128-bit label and $r$ is a 256-bit input to $g$. Fix three distinct 128-bit constants: $\mathsf{HASH}$, $\mathsf{BRIDGE}$, and $\mathsf{RAMP}$.

$$f(\mathsf{tag}, r) = \begin{cases}
(\mathsf{BRIDGE},\, r) & \text{if } \mathsf{tag} = \mathsf{RAMP} \\
(\mathsf{HASH},\, g(r)) & \text{if } \mathsf{tag} \neq \mathsf{RAMP}
\end{cases}$$

Three design choices make $f$ work:

- **Free second preimages:** In the normal lane ($\mathsf{tag} \neq \mathsf{RAMP}$), $f$ ignores the tag completely. So $(\mathsf{HASH}, r)$ and $(\mathsf{BRIDGE}, r)$ hash to the same output $(\mathsf{HASH}, g(r))$.
- **A one-step ramp:** Ignoring the tag alone only breaks second-preimage resistance, just like the drop-the-last-bit example above. Adding the $\mathsf{RAMP}$ lane supplies the missing preimage step: anyone who knows $r$ can step backwards from $(\mathsf{BRIDGE}, r)$ to $(\mathsf{RAMP}, r)$, because $f(\mathsf{RAMP}, r) = (\mathsf{BRIDGE}, r)$.
- **Three tags, not two:** $\mathsf{RAMP}$ outputs $\mathsf{BRIDGE}$ rather than $\mathsf{HASH}$ so it cannot invert normal outputs. If $f(\mathsf{RAMP}, r)$ output $(\mathsf{HASH}, r)$, anyone given $(\mathsf{HASH}, z)$ could invert it instantly by returning $(\mathsf{RAMP}, z)$, destroying one-wayness. Keeping $\mathsf{BRIDGE} \neq \mathsf{HASH}$ puts the ramp's outputs in a separate lane.

The figure below shows both halves of the argument: the top row is the definition of $f$, and the bottom row previews Claim 2's forgery (where $\sigma_1$ is the value revealed on the first chain and $\mathsf{pk}_1$ is that chain's public key).

![The HASH, BRIDGE, and RAMP counterexample](/images/publications/hash-based-is-not-an-assumption/03-hash-bridge-ramp-counterexample.svg)

### Claim 1: $f$ is one-way (so Lamport with $f$ is secure)

*If $g$ is $(t, \varepsilon)$-one-way, then $f$ is $(\approx t,\, \varepsilon + 2^{-128})$-one-way.*

**Proof.** Play the one-wayness game for $f$: pick a random input $(\mathsf{tag}, r)$ and compute $y = f(\mathsf{tag}, r)$.

- **Rare case ($\mathsf{tag} = \mathsf{RAMP}$):** This happens with probability $2^{-128}$. Even if the attacker wins automatically whenever this happens, it adds at most $2^{-128}$ to its winning probability (using the average-case property from earlier).
- **Normal case ($\mathsf{tag} \neq \mathsf{RAMP}$):** Now $y = (\mathsf{HASH}, g(r))$, where $r$ is uniformly random. The attacker cannot use $\mathsf{RAMP}$ to invert $y$, because $f(\mathsf{RAMP}, \cdot)$ always outputs a $\mathsf{BRIDGE}$ tag, never $\mathsf{HASH}$. So *every* valid preimage $(\mathsf{tag}', r')$ of $y$ must have taken the normal lane, meaning $g(r') = g(r)$.

That gives an immediate reduction to $g$: given a challenge $z = g(r)$ for $g$, feed $(\mathsf{HASH}, z)$ to any inverter for $f$. The inverter sees the normal-case distribution, and whenever it returns a valid preimage $(\mathsf{tag}', r')$, $r'$ is a valid preimage of $z$ under $g$.

So any inverter wins the normal case with probability at most $\varepsilon$, and wins overall with probability at most $\varepsilon + 2^{-128}$. ∎

Combined with our Lamport bound above, **Lamport built from $f$ is secure**: no forger wins with probability above $2L \cdot (\varepsilon + 2^{-128})$. For 256-bit messages ($2L = 2^9$), that still leaves ~119 bits of security ($128 - 9$) even if $g$ is only 128-bit secure.

### Claim 2: Winternitz with $f$ is 100% forgeable (for any $w \geq 3$)

**Attack.**

1. **Choose $m$ to sign:** Set the first message digit to $d_1 = 1$ and every other message digit to $w - 1$. Then the checksum is $C(m) = w - 2$, so every checksum digit is $0$ except the lowest digit, which is $w - 2$. That sits one step below $w - 1$, leaving room to raise it by 1 without a carry.
2. **Read the signature on $m$:** Look at the first chain's signature component $\sigma_1 = (\mathsf{tag}, r)$. Because $d_1 = 1$, $\sigma_1$ is an output of $f$, so its tag is either $\mathsf{HASH}$ or $\mathsf{BRIDGE}$, **never $\mathsf{RAMP}$**. Therefore, the next value on the real chain is $f(\sigma_1) = (\mathsf{HASH}, g(r))$.
3. **Forge $m^*$ (identical to $m$, except $d_1$ is lowered from $1$ to $0$):**
   - For the first chain (now digit $0$), output $\sigma_1^* = (\mathsf{RAMP}, r)$.
   - Lowering $d_1$ by 1 raises the lowest checksum digit from $w - 2$ to $w - 1$ while keeping all higher checksum digits at $0$. Moving up a chain is free: hash that lowest checksum component forward once with $f$.
   - Keep every other component unchanged.

**Why it always verifies.** Position $0$ requires $w - 1$ hashes to reach the first chain's public key $\mathsf{pk}_1$. Since $w \geq 3$, the verifier hashes $\sigma_1^*$ at least twice:

$$(\mathsf{RAMP}, r) \xrightarrow{f} (\mathsf{BRIDGE}, r) \xrightarrow{f} (\mathsf{HASH}, g(r)) = f(\sigma_1) \xrightarrow{f^{w - 3}} \mathsf{pk}_1$$

- First hash: $(\mathsf{RAMP}, r)$ lands on $(\mathsf{BRIDGE}, r)$. Whenever $\sigma_1$ had the $\mathsf{HASH}$ tag (all but a $2^{-128}$ fraction of keys), this gives a second preimage of $f(\sigma_1)$ distinct from $\sigma_1$, and in the rare $2^{-128}$ case where $\sigma_1$ already had the $\mathsf{BRIDGE}$ tag, it lands directly on $\sigma_1$ itself.
- Second hash: because $\mathsf{BRIDGE} \neq \mathsf{RAMP}$, $f$ takes the normal lane, ignores the tag, and outputs $(\mathsf{HASH}, g(r))$, which is *identical* to $f(\sigma_1)$, the real chain value at position $2$.
- The remaining $w - 3$ hashes walk the real chain straight to $\mathsf{pk}_1$.

The forged signature verifies with **probability 1**. ∎

Here is the difference between the two schemes on this same hash function $f$:
- The $\mathsf{RAMP}$ trick only works if you know the $r$ inside the revealed value.
- **Winternitz hands you $r$** by revealing $(\mathsf{tag}, r)$ in the middle of the chain.
- **Lamport never reveals $r$** for any slot you need to open, so the ramp is useless.

---

## What this proves, and what it doesn't

This counterexample does *not* mean Winternitz with Keccak-256 or SHA-256 is broken. Nobody expects Keccak-256 to hide a contrived $\mathsf{RAMP}$ lane.

What a counterexample proves in cryptography is a **logical gap**: the assumption *"$f$ is one-way"* is too weak to imply *"Winternitz($f$) is secure."* If you want to claim Winternitz is secure, you *must* assume extra properties of $f$ beyond one-wayness. The rungs of the ladder also come apart in practice. Both [MD5](https://en.wikipedia.org/wiki/MD5#Collision_vulnerabilities) and [SHA-1](https://eprint.iacr.org/2017/190) suffered practical collision attacks while their preimage resistance stayed practically unbroken. Those collisions would not forge a Winternitz signature, which requires a targeted merge rather than a free collision, yet they show that hash security is not a single property that stands or falls together.

Security proofs for Winternitz that name concrete properties of the hash (known as standard-model proofs) rely on two extra properties beyond one-wayness:

1. **Merge resistance (covered by collision resistance or tweaked second-preimage resistance).**
   Our $\mathsf{RAMP}$ construction shows merge resistance can fail even when one-wayness holds. Proofs usually get it from collision resistance, or in the tweaked schemes below from tweaked second-preimage resistance, because they imply merge resistance. For full 256-bit Keccak-256, Ethereum's existing collision-resistance assumption covers merge resistance. As we see below, Ethereum's proposed 128-bit signatures cannot rely on that fallback, because at 128 bits collision resistance is only ~64-bit, so they must assume tweaked second-preimage-style hardness directly.
2. **Undetectability (where even collision resistance stops covering you).**
   In our Lamport proof, planting $y^* = f(\text{random})$ in the public key worked because real public-key slots are also $f(\text{random})$. In Winternitz, a reduction has to plant its challenge at position $d \geq 2$ (mid-chain or directly at the public key), where real values have already been hashed multiple times ($f^d(\text{random})$). If repeated hashing makes $f^d(\text{random})$ distinguishable from $f(\text{random})$, or even exposes a shortcut after two steps, collision resistance alone does not save the scheme.

   Using the same 384-bit $(\mathsf{tag}, r)$ format and a collision-resistant $h: \{0,1\}^{384} \to \{0,1\}^{256}$, fix two distinct 128-bit tags $\mathsf{STEP1}$ and $\mathsf{STEP2}$ and define $f(\mathsf{tag}, r) = (\mathsf{STEP1}, h(\mathsf{tag}, r))$ when $\mathsf{tag} \neq \mathsf{STEP1}$, and $f(\mathsf{STEP1}, r) = (\mathsf{STEP2}, r)$ otherwise. This $f$ is both **one-way** (by the same $2^{-128}$ argument as Claim 1) and **collision-resistant** (the two tags keep branches disjoint, branch 1 inherits $h$'s collision resistance, and branch 2 is injective). Yet along any normal chain, $v_1 = (\mathsf{STEP1}, z)$ hashes to $v_2 = (\mathsf{STEP2}, z)$: anyone shown $v_2$ at digit $2$ can step straight backwards to $v_1 = (\mathsf{STEP1}, z)$ and forge digit $1$ for every $w \geq 3$ with probability $1 - 2^{-128}$ (signing $d_1 = 2$ with all other digits $w - 1$ gives checksum $w - 3$, so lowering $d_1$ to $1$ only increments the lowest checksum digit). That is why known standard-model Winternitz proofs also assume **undetectability** (or pseudorandomness), requiring $f(\text{random})$ to be computationally indistinguishable from a uniform random value, which applied step by step makes $f^d(\text{random})$ indistinguishable from $f(\text{random})$ too. That is a *distinguishing* assumption outside the preimage and collision ladder altogether.

### Modern tweaked schemes (WOTS+)

Real deployments don't use textbook Winternitz. They use variants like [WOTS+](https://datatracker.ietf.org/doc/html/rfc8391#section-3.1) that mix a per-step tweak (or random bitmask) into every hash along the chain. Tweaking avoids needing full *collision* resistance (letting proofs get merge resistance from tweaked second-preimage resistance instead) and defends against attacks aimed at many keys or positions at once. **But it does not get you back to one-wayness alone.** Even if the normal lane mixes the tweak $T$ into $(\mathsf{HASH}, g(T, r))$, keeping the ramp lane at $(\mathsf{BRIDGE}, r)$ still breaks tweaked Winternitz with probability 1, because both paths enter position $2$ under the same tweak $T_2$ (and with RFC 8391's public XOR bitmasks, XORing out the step-1 bitmask in $\sigma_1^*$ still breaks it with probability $1 - O(2^{-128})$). Tweaked hash chains still need tweaked versions of merge resistance (or second-preimage resistance) and undetectability. In practice, proofs often stop listing concrete properties of a real hash function altogether and instead model it as an idealized random black box (the [Random Oracle Model](https://en.wikipedia.org/wiki/Random_oracle)).

---

## Beyond Winternitz: what Ethereum's actual PQ stack adds

Winternitz is only the base building block. Because a Winternitz key signs once, real schemes hash many one-time keys into a Merkle tree to get a reusable key. Ethereum's draft proposals build two such signature schemes on top of 4-position Winternitz chains, [leanXMSS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_xmss/main.tex) for validators (58 chains, 2,404-byte signatures) and [leanSPHINCS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_sphincs/main.tex) for user accounts (64 chains, 7,740-byte signatures), alongside a hash-based blob commitment, [LeanDA](https://github.com/leanEthereum/leanVM/blob/main/doc/leanvm/body/10-ethereum.tex), for data availability. Because kilobyte-sized signatures cannot be sent individually across Ethereum's validator set, signatures are aggregated inside [leanVM](https://github.com/leanEthereum/leanVM), a hash-based zkVM (which also certifies `LeanDA`'s blob encoding).

Ethereum's hash assumptions today already go beyond 256-bit collision resistance. State and transaction hashes rely on full 256-bit Keccak-256 collision resistance, while addresses truncate Keccak-256 to 160 bits (~80-bit collision cost). On the consensus layer, BLS signatures ([RFC 9380](https://datatracker.ietf.org/doc/html/rfc9380#section-10.6)) and single-round KZG blob checks ([EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) and [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594)) already model **SHA-256** as an idealized random hash, and RANDAO and validator shuffling rely on it for public pseudorandomness. So the gap is not "ideal hash vs. none." It is which hash is idealized, in which role, and with how much margin.

The PQ stack introduces three shifts relative to today's protocol, ordered in our judgment from highest uncertainty to lowest:

1. **Multi-round and recursive Fiat-Shamir inside `leanVM`.**
   Today, Ethereum's consensus layer uses Fiat-Shamir (deriving verifier challenges from a hash) only in single-round KZG checks, with no zkVM or recursive proofs. Aggregating thousands of hash-based signatures per consensus slot instead runs many rounds of Fiat-Shamir over [`Keccak-duplex`](https://github.com/leanEthereum/leanVM/blob/main/doc/leanvm/body/08-end-to-end-protocol.tex), a streaming mode of Keccak that Ethereum does not use today. For a single proof, the stated classical soundness error is about $2^{-125}$ per adversary query. The design avoids algebraic hashes like [Poseidon](https://eprint.iacr.org/2019/458) and requires no unproven coding-theory conjectures.

   The deeper gap is **recursion**: to aggregate at scale, a `leanVM` proof verifies child `leanVM` proofs inside itself. Its security proof treats Keccak's internal permutation as an external random black box, yet inside the recursion the program executes the *real* Keccak permutation. `leanVM`'s own [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) lists soundness across recursion levels under **"What is not proved"**, noting that the model excludes programs evaluating their own Fiat-Shamir hash. That gap is shared by all Fiat-Shamir-based recursive proof systems, and sits in the setting of the [Khovratovich, Rothblum, and Soukhanov (2025)](https://eprint.iacr.org/2025/118) Fiat-Shamir attacks (no version of that attack is known against `leanVM`, yet the proof does not rule one out).
2. **128-bit truncated Keccak digests carrying signature security.**
   In the current specs (marked in the repo as draft / not yet stable), `leanXMSS` and `leanSPHINCS` truncate Keccak-256 outputs to 16 bytes (128 bits) and replace the checksum with a fixed-sum encoding (plus 6 zeroed digits in `leanXMSS`). Addresses already truncate Keccak-256 to 160 bits, but at 128 bits collision resistance drops to ~64 bits, so Ethereum's 256-bit collision-resistance assumption no longer covers merge resistance. Both schemes have to assume tweaked 128-bit second-preimage-style hardness directly (~127 bits classical, ~64 bits conjectured quantum, NIST category 1) across every chain step and tree node.
3. **Treating `Keccak-f[1600]` as an ideal random permutation.**
   Today, Keccak-256's consensus-critical uses (state, transactions, addresses) need only collision and preimage resistance, while BLS and KZG combine an idealized SHA-256 (its compression function in RFC 9380 and single-round Fiat-Shamir in KZG) with elliptic-curve pairings. The PQ stack moves that idealization onto Keccak's internal permutation, [`Keccak-f[1600]`](https://keccak.team/keccak.html), modeled as a random permutation queried both forward and inverse (the Random Permutation Model, or RPM). As the EF's [PQAI #1](https://blog.ethereum.org/2026/11/24/pqai-1) post notes, *"The security proofs for hash-based signatures, and the Fiat–Shamir step in the SNARGs that aggregate them, treat the hash as a random oracle,"* and once Ethereum migrates, *"if it is broken, everything else is broken."* Keccak's sponge is provably indifferentiable from a random oracle assuming an ideal `Keccak-f[1600]` (with a loose quantum bound so far), backed by nearly two decades of public cryptanalysis (since 2008).

Two proof obligations also remain open across the stack. `leanXMSS`, `leanSPHINCS`, `leanVM`, and `LeanDA` all come with Lean 4 formal proofs in the classical RPM. First, **no quantum security bound is formally proved yet** for any of them (the README's 62-bit quantum figure for `leanVM` is stated, not proved). Second, the signature proofs cover forging against a single signer's key pair in isolation: `leanVM`'s [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) leaves multi-key security unstated, which is the setting that matters across Ethereum's validator set and account base.

The figure below summarizes where each scheme sits, from bottom to top, noting that 128-bit digests in the top tier trade away the 256-bit collision resistance of the collision tier:

![The cryptographic assumption stack for Keccak](/images/publications/hash-based-is-not-an-assumption/04-assumption-ladder.svg)

### What this means for the "post-AI" and hybrid debates

A hash-based stack still has a strong case as the most **practically minimal** post-quantum option: it removes elliptic-curve pairings, discrete-log assumptions, the KZG trusted setup, and the SHA-256 random-oracle assumptions inside BLS and KZG without introducing structured lattice problems like Module-LWE or NTRU.

Still, reusing Keccak does not make the PQ stack a strict subset of what Ethereum already assumes. Hybrid designs (pairing BLS or ECDSA with a hash-based scheme so a forgery has to break both) hedge those new assumptions, at the cost of extra bandwidth, verification, and liveness complexity. The right question for Ethereum's PQ roadmap is not whether a scheme is hash-based. It is **which new assumptions the migration takes on, and how much confidence each one deserves.**
