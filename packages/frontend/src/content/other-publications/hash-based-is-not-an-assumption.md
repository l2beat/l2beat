---
title: "Hash-based is not an assumption"
description: "Why we need to be careful when calling hash-based signatures \"minimal assumptions,\" shown through one small counterexample."
publishedOn: "2026-11-25"
authorId: l2beat_research
tag: Research
---

## The "minimal assumptions" argument

In Ethereum's post-quantum debate, hash-based cryptography is increasingly framed as "post-AI" as well, i.e. safe even if AI finds mathematical attacks humans missed. In the [pqai27 proposal](https://ethereum-magicians.org/t/an-ethlabs-view-on-post-quantum-and-post-ai-timelines-pqai27/30351), Ethlabs defines post-AI cryptography as resting on *"as few assumptions as possible"*, calling Ethereum *"plausibly post-AI, not provably"*, and writes:

> *"The planned cryptography is built around hash functions, to minimize the assumptions we need to rely on. This is also the approach for the rest of the cryptography, such as aggregation. Minimal assumptions address both quantum computers and AI alike, so the existing plan already covers the cryptography for both."*

In [PQAI #0](https://blog.ethereum.org/2026/11/23/pqai-0), the Ethereum Foundation (EF) frames the case pragmatically: cryptography should use *"the most conservative assumptions,"* and relying on *"what we believe to be weaker assumptions"* is prudent risk management. Read in context, "minimal" in this debate means **practically minimal**. Unlike lattice schemes such as [ML-DSA](https://csrc.nist.gov/pubs/fips/204/final) or [Falcon](https://falcon-sign.info/), hash-based designs avoid introducing an algebraic assumption family like [Module-LWE](https://en.wikipedia.org/wiki/Learning_with_errors) or [NTRU](https://en.wikipedia.org/wiki/NTRU).

Even so, that pragmatic framing easily slips into the stronger claim that replacing elliptic curves with hash-based signatures adds **no new assumptions**. In PQAI #0, the EF writes: *"The Ethereum protocol already relies on hashes being secure, so importantly this does not add a new assumption."* The same shorthand shows up in core dev discussions: in the [ACDE #249](https://forkcast.org/calls/acde/249) call chat, SPHINCS was defended with *"SPHINCS does not add new crypto assumptions (we already have [Keccak]), while Lattices would."*

**"Hash-based" names a building block, not an assumption.** Saying a hash function $f$ is secure can mean very different things, starting with three classic properties:

1. **One-wayness (preimage resistance):** Given only the output $f(x)$ for a random input $x$, nobody can find *any* input that hashes to it.
2. **Second-preimage resistance:** Given a random input $x$, nobody can find a *different* input $x' \neq x$ with $f(x') = f(x)$.
3. **Collision resistance:** Nobody can find *any* pair of distinct inputs $x \neq x'$ with $f(x) = f(x')$.

These are not equivalent, and even all three together do not cover everything hash-based schemes rely on.

Elliptic curves will not survive large quantum computers, so adding post-quantum signatures is not in question. Dropping elliptic curves at the same time is not free. Whenever a hash-based scheme introduces new hash assumptions of its own, you are trading risk rather than purely removing it: **if one of those new assumptions breaks while elliptic curves are still standing, dropping them leaves you worse off.**

We compare two one-time signature schemes on the same hash function $f$. **Lamport** is the minimal hash-based signature scheme. **Winternitz** is the standard efficiency optimization on top of it, and the core building block inside [XMSS](https://datatracker.ietf.org/doc/html/rfc8391), [SPHINCS+](https://csrc.nist.gov/pubs/fips/205/final), `leanXMSS`, and `leanSPHINCS`. The result:

- **One-wayness alone is enough for Lamport.**
- **Even one-wayness and collision resistance together are provably *not* enough for textbook Winternitz.** We'll build an explicit hash function that is both one-way and collision-resistant whenever SHA-256 is, so Lamport over it stays secure, yet lets an attacker forge Winternitz signatures almost 100% of the time.

Ethereum's core protocol uses of Keccak-256 rely primarily on collision and preimage resistance. This counterexample shows directly that neither property carries over automatically once you iterate a hash inside a Winternitz chain.

---

## One-wayness

For digital signatures, one-wayness is the theoretical floor: **secure signatures exist if and only if one-way functions exist.** Proving one-way functions exist is at least as hard as proving $\mathsf{P} \neq \mathsf{NP}$, and in [Impagliazzo's five worlds](https://en.wikipedia.org/wiki/Russell_Impagliazzo#Five_worlds_of_complexity_theory) there are worlds where $\mathsf{P} \neq \mathsf{NP}$ holds yet no one-way functions exist.

- **Necessary:** Every signature scheme maps random secret bits to a public key. If that mapping weren't one-way, anyone seeing your public key could invert it and forge signatures at will.
- **Sufficient in theory:** [Rompel (1990)](https://doi.org/10.1145/100216.100269) showed how to build a full signature scheme from *any* one-way function, with zero extra assumptions.

Rompel's construction is far too slow and large to deploy, so practical schemes buy efficiency by assuming more.

Take $f: \{0,1\}^n \to \{0,1\}^n$ and an attacker limited to $t$ basic operations playing this game:

1. Pick $x$ uniformly at random from $\{0,1\}^n$.
2. Compute $y = f(x)$ and give $y$ to the attacker.
3. The attacker outputs some $x'$.
4. The attacker wins if $f(x') = y$.

We say $f$ is **$(t, \varepsilon)$-one-way** if no attacker within budget $t$ wins with probability greater than $\varepsilon$. Intuitively, 128-bit security means budget $t$ buys a winning probability of at most roughly $t / 2^{128}$, so a high chance of success takes roughly $2^{128}$ operations.

**One-wayness is average-case over random inputs.** If a tiny sliver of inputs, say one in $2^{128}$, is trivially invertible, $f$ is *still* one-way. A random $x$ almost never lands there, so it only nudges the winning probability up by $2^{-128}$. Real hashes have such slivers too: anyone can precompute billions of hashes and invert them instantly.

---

## Lamport signatures

[Lamport signatures](https://en.wikipedia.org/wiki/Lamport_signature) are the simplest hash-based signature scheme. For simplicity, we sign an $L$-bit message $m = (m_1, \dots, m_L)$ directly:

- **$\mathsf{KeyGen}$:** For each bit position $i = 1 \dots L$, pick two random secrets $x_i[0]$ and $x_i[1]$ ($2L$ total). The public key $\mathsf{pk}$ is their $2L$ hashes $f(x_i[b])$, which we call **slots** indexed by $(i, b)$.
- **$\mathsf{Sign}(\mathsf{sk}, m)$:** For each position $i$, reveal $x_i[m_i]$ ($L$ secrets).
- **$\mathsf{Verify}(\mathsf{pk}, m, \sigma)$:** Hash each revealed value and check it matches slot $(i, m_i)$ in $\mathsf{pk}$.

![Lamport signature scheme on a 3-bit message](/images/publications/hash-based-is-not-an-assumption/00a-lamport-scheme.svg)

A Lamport key can only sign **once**. Signing two messages that differ in at least two bits reveals both secrets at those positions, letting anyone mix and match them into a third forged message without inverting anything.

The security goal is **one-time unforgeability**:

1. Generate $(\mathsf{sk}, \mathsf{pk})$ and give $\mathsf{pk}$ to the forger.
2. The forger chooses *any* message $m$ and receives $\sigma = \mathsf{Sign}(\mathsf{sk}, m)$.
3. The forger outputs a forgery $(m^*, \sigma^*)$.
4. The forger wins if $m^* \neq m$ and $\mathsf{Verify}(\mathsf{pk}, m^*, \sigma^*)$ accepts.

The forger picks *both* $m$ and $m^*$. Real attackers can often influence what gets signed, such as crafting a transaction or block header, so schemes must survive [chosen-message attacks](https://en.wikipedia.org/wiki/Digital_signature#Notions_of_security).

### Proof from one-wayness alone

Because $m^* \neq m$, they differ at some bit where the forger never saw the secret for $m^*$, only its hash in $\mathsf{pk}$. To prove security formally, we use a **reduction**: any algorithm that forges Lamport can be turned into an algorithm that inverts $f$.

> **Cryptographic reductions**
>
> If breaking into a house forces you to break the door, then as long as the door holds, the house holds. Showing that breaking Lamport lets you invert $f$ proves that one-wayness of $f$ protects Lamport.
>
> The proof runs backwards, from "Lamport breaks" to "$f$ breaks", because $A \Rightarrow B$ is equivalent to its contrapositive $\neg B \Rightarrow \neg A$, and negating *"for all"* gives *"there exists."*
>
> $$\begin{aligned}
> \text{Want:} \quad & (\forall\text{ inverters, fails}) \quad\Rightarrow\quad (\forall\text{ forgers, fails}) \\
> \text{Contrapositive:} \quad & (\exists\text{ a successful forger}) \quad\Rightarrow\quad (\exists\text{ a successful inverter})
> \end{aligned}$$
>
> Both lines say the same thing, yet only the second gives you something to compute with: it hands you **one** hypothetical forger, and you wrap it as a black box into **one** inverter. The only requirement is that whatever inputs your wrapper feeds the forger must look identical to real inputs, so the forger behaves as usual.

Suppose a forger wins the Lamport game with probability $p$. We wrap it into an **inverter** for $f$:

1. Receive a one-wayness challenge $y^* = f(x)$ for an unknown random $x$.
2. Pick one of the $2L$ public-key slots uniformly at random and **plant** $y^*$ there. Fill the other $2L - 1$ slots with hashes of real random secrets.
3. Hand $\mathsf{pk}$ to the forger. Every honest slot is $f(\text{random})$, and $y^*$ is also $f(\text{random})$, so $\mathsf{pk}$ has the exact distribution of a real key and the forger has zero information about which slot was planted. If it could spot $y^*$, it could dodge it or ask to sign that slot to force a forfeit.
4. The forger asks to sign some message $m$. If $m$ uses the planted slot, give up, since that secret is unknown. Otherwise, sign $m$ honestly.
5. Conditioned on surviving step 4, the forger sees a real Lamport game, so with probability $p$ it outputs a valid forgery $(m^*, \sigma^*)$. Let $j$ be the first bit where $m^*$ differs from $m$. Slot $(j,\, m^*_j)$ was not used by $m$, and if $y^*$ sits there, $\sigma^*$'s component at position $j$ is a preimage of $y^*$, which the inverter outputs to win.

**Success probability: $p / (2L)$.** Step 4 succeeds with probability $1 / 2$, since $m$ uses half of the $2L$ slots. Because $\sigma$ reveals only the slots $m$ used, the planted slot stays hidden after signing: conditioned on surviving step 4, it is equally likely to be any of the $L$ unused slots, including $(j,\, m^*_j)$. So the plant hits $(j,\, m^*_j)$ with probability $1 / L$, giving $(1 / 2) \cdot (1 / L) = 1 / (2L)$ whenever the forger succeeds.

![Planting the challenge y* in a Lamport public key](/images/publications/hash-based-is-not-an-assumption/00b-lamport-reduction.svg)

Thus the inverter breaks $f$ with probability at least $p / (2L)$. Flipping that around: if $f$ is $(t, \varepsilon)$-one-way, no Lamport forger spending roughly $t$ operations wins with probability above $2L \cdot \varepsilon$. For 256-bit messages, $2L = 512 = 2^9$, costing 9 bits of security with **zero assumptions beyond one-wayness**.

This worked cleanly because every public-key slot is a single hash $f(\text{random})$. Once Winternitz iterates $f$ along a chain, that guarantee breaks down.

---

## Winternitz signatures

Lamport's downside is size. With 32-byte hashes, signing a 256-bit message takes 512 public-key hashes, or 16 KB, and reveals 256 secrets, or 8 KB per signature.

[Winternitz](https://en.wikipedia.org/wiki/Hash-based_cryptography) shrinks both by signing a whole **base-$w$ digit** per secret using a hash chain.

Write $f^j(x)$ for $f$ applied $j$ times, with $f^0(x) = x$. A chain starts from a random secret $x$ and ends at $\mathsf{pk} = f^{w - 1}(x)$. Take $w = 4$, giving digits $0, 1, 2, 3$:

![A single Winternitz hash chain for w = 4](/images/publications/hash-based-is-not-an-assumption/01-lamport-vs-winternitz.svg)

- To sign digit $d$, reveal position $d$: $f^d(x)$.
- To verify digit $d$, hash the revealed value $w - 1 - d$ more times and check you land on $\mathsf{pk} = f^{w - 1}(x)$.

**Hashing forward is free.** If you sign digit $1$ by revealing $f(x)$, anyone can apply $f$ once to get $f^2(x)$ and forge digit $2$. Digit $3$ is also $\mathsf{pk}$, which is already public, so across a multi-digit message anyone could forge the all-3s message without seeing a signature at all.

Winternitz plugs both holes with a **checksum**. Write your message $m$ in base $w$ as digits $d_1, d_2, \dots, d_k$, and compute:

$$C(m) = \sum_{i=1}^{k} (w - 1 - d_i)$$

Sum how many steps *remain* above each message digit, write $C(m)$ in base $w$ using a fixed number of digits, enough for the largest possible checksum, and sign those checksum digits with chains of their own. For the all-3s message, $C(m) = 0$, so a valid signature must include the raw secret at position $0$ of every checksum chain.

> **Concrete example ($w = 4$, digits $0 \dots 3$)**
>
> A 2-digit base-4 message can reach $C(m) = 6$ on $(0, 0)$, so the checksum always takes 2 base-4 digits. Your private key holds 4 random secret seeds $x_1, x_2, x_3, x_4$, one per chain. For $m = (1, 2)$, the checksum is $C(m) = (3 - 1) + (3 - 2) = 3$, written $(0, 3)$. You sign 4 digits $(1, 2 \mid 0, 3)$:
>
> - Chain 1 reveals $f^1(x_1)$
> - Chain 2 reveals $f^2(x_2)$
> - Checksum chain 1 reveals $f^0(x_3)$
> - Checksum chain 2 reveals $f^3(x_4)$
>
> Try forging $m^* = (2, 2)$ by hashing Chain 1 forward once. The new checksum is $C(m^*) = (3 - 2) + (3 - 2) = 2$, written $(0, 2)$, forcing you to go *backwards* on Checksum chain 2 from $3$ to $2$.

With 32-byte hashes and $w = 4$, a 256-bit message takes 128 base-4 digits plus 5 checksum digits, or 133 chains and ~4.2 KB each for signature and public key. At $w = 16$ (classic XMSS), it takes 64 digits plus 3 checksum digits, or 67 chains and ~2.1 KB, down from Lamport's 8 KB signature and 16 KB public key.

**Checksum Lemma.** *For any forged message $m^* \neq m$, at least one digit of $m^*$, message or checksum, is strictly smaller than the corresponding digit of $m$.*

**Proof.** If any message digit went down, we're done. Otherwise, every message digit stayed the same or went up, and at least one went strictly up, so $C(m^*) < C(m)$. Written in the same fixed base-$w$ width, the first digit from the left where $C(m^*)$ and $C(m)$ differ must be strictly smaller in $C(m^*)$. ∎

So, as with Lamport, forging a Winternitz signature forces the attacker to **go backwards** on at least one chain.

Going backwards on a chain can happen in two ways. An attacker could branch off and merge back into the chain higher up, which collision resistance already blocks at 256 bits. Or an attacker could step directly backwards from a value already hashed multiple times, $v_d = f^d(x)$ for $d \geq 2$. One-wayness only guarantees that a *single* hash $f(x)$ of a random input $x$ is hard to invert. Neither one-wayness nor collision resistance guarantees that *iterated* chain values stay hard to invert.

---

## A collision-resistant one-way hash that breaks Winternitz

Start with *any* collision-resistant, one-way hash function $H: \{0,1\}^{384} \to \{0,1\}^{256}$. Picture $H$ as SHA-256 or Keccak-256: even if $H$ is ideal, the proof still works. From $H$, we build a single length-preserving function $f: \{0,1\}^{384} \to \{0,1\}^{384}$ such that:

1. $f$ is **both collision-resistant and one-way** whenever $H$ is, so Lamport over $f$ stays secure.
2. Winternitz over $f$ is **broken**: for every $w \geq 3$, an attacker can forge with probability $1 - 2^{-128}$.

Split each 384-bit input into a pair $(\mathsf{tag}, x)$, a 128-bit label and a 256-bit value. Fix two distinct 128-bit constants: $\mathsf{STEP1}$ and $\mathsf{STEP2}$.

$$f(\mathsf{tag}, x) = \begin{cases}
(\mathsf{STEP2},\, x) & \text{if } \mathsf{tag} = \mathsf{STEP1} \\
(\mathsf{STEP1},\, H(\mathsf{tag} \parallel x)) & \text{if } \mathsf{tag} \neq \mathsf{STEP1}
\end{cases}$$

- **Disjoint output tags:** Normal inputs ($\mathsf{tag} \neq \mathsf{STEP1}$) always output tag $\mathsf{STEP1}$, while shortcut inputs ($\mathsf{tag} = \mathsf{STEP1}$) always output tag $\mathsf{STEP2}$. Because $\mathsf{STEP1} \neq \mathsf{STEP2}$, the two lanes can never collide with each other, and the shortcut lane can never invert a normal output.
- **A free step back at position 2:** Hashing a random secret once lands on tag $\mathsf{STEP1}$. Hashing it a second time hits the shortcut lane and simply swaps $\mathsf{STEP1}$ to $\mathsf{STEP2}$ without touching the 256-bit payload.

The top row below defines $f$, and the bottom previews Claim 2's forgery from revealed $v_2$ back to $v_1$.

![The STEP1 and STEP2 collision-resistant counterexample](/images/publications/hash-based-is-not-an-assumption/03-step1-step2-counterexample.svg)

### Claim 1: $f$ is collision-resistant and one-way

*If $H$ is collision-resistant and $(t, \varepsilon)$-one-way, then $f$ is collision-resistant and $(\approx t,\, \varepsilon + 2^{-128})$-one-way.*

**Proof of collision resistance.** Suppose two distinct inputs collide under $f$. They cannot come from different lanes, because the normal lane always outputs tag $\mathsf{STEP1}$ and the shortcut lane always outputs $\mathsf{STEP2}$. They cannot both come from the shortcut lane either, because $(\mathsf{STEP1}, x) \mapsto (\mathsf{STEP2}, x)$ is one-to-one. So both must come from the normal lane, which yields a collision in $H$. ∎

**Proof of one-wayness.** Pick a random input $(\mathsf{tag}, x)$ and compute $y = f(\mathsf{tag}, x)$.

- **Rare case ($\mathsf{tag} = \mathsf{STEP1}$):** Happens with probability $2^{-128}$. Even if the attacker wins automatically here, it adds at most $2^{-128}$ to its winning probability.
- **Normal case ($\mathsf{tag} \neq \mathsf{STEP1}$):** Here $y = (\mathsf{STEP1}, H(\mathsf{tag} \parallel x))$. The shortcut lane never outputs tag $\mathsf{STEP1}$, so *every* valid preimage of $y$ must come from the normal lane and therefore inverts $H$.

Given a challenge $z = H(u)$ for a random 384-bit $u$, feed $(\mathsf{STEP1}, z)$ to any inverter for $f$. Up to the $2^{-128}$ event that $u$ starts with $\mathsf{STEP1}$, it sees the normal-case distribution, and any valid preimage $(\mathsf{tag}', x')$ gives a preimage $\mathsf{tag}' \parallel x'$ of $z$ under $H$. So any inverter wins overall with probability at most $\varepsilon + 2^{-128}$. ∎

Combined with our Lamport bound, **Lamport built from $f$ is secure**: no forger wins with probability above $2L \cdot (\varepsilon + 2^{-128})$. For 256-bit messages, where $2L = 2^9$, that leaves ~119 bits of security even if $H$ is only 128-bit secure.

### Claim 2: Winternitz with $f$ is forgeable for any $w \geq 3$

Take the first chain, starting from a random secret $v_0 = (\mathsf{tag}_0, x_0)$. As long as $\mathsf{tag}_0 \neq \mathsf{STEP1}$, which holds with probability $1 - 2^{-128}$, its first two hashes are:

$$v_0 \xrightarrow{f} v_1 = (\mathsf{STEP1},\, z) \xrightarrow{f} v_2 = (\mathsf{STEP2},\, z)$$

where $z = H(\mathsf{tag}_0 \parallel x_0)$.

**Attack.**

1. **Choose $m$ to sign:** Set $d_1 = 2$ and every other message digit to $w - 1$. Then $C(m) = w - 3$, so every checksum digit is $0$ except the lowest, which is $w - 3$. For every $w \geq 3$, that sits below $w - 1$, leaving room to add 1 without a carry.
2. **Read $v_2$ on chain 1:** The signature on $m$ reveals $v_2 = (\mathsf{STEP2}, z)$ at position $2$. For $w = 3$, $v_2 = \mathsf{pk}_1$ is already in the public key.
3. **Forge $m^*$, identical to $m$ except $d_1$ drops from $2$ to $1$:**
   - On chain 1, swap the tag back and output $\sigma_1^* = (\mathsf{STEP1}, z)$.
   - Lowering $d_1$ by 1 raises the lowest checksum digit from $w - 3$ to $w - 2$ while keeping higher checksum digits at $0$. Hash that checksum component forward once with $f$.
   - Keep every other component unchanged.

**Verification.** Position $1$ requires $w - 2$ hashes to reach $\mathsf{pk}_1$:

$$(\mathsf{STEP1}, z) \xrightarrow{f} (\mathsf{STEP2}, z) = v_2 \xrightarrow{f^{w - 3}} \mathsf{pk}_1$$

The first hash lands directly on $v_2$, and the remaining $w - 3$ hashes follow the real chain to $\mathsf{pk}_1$. The forgery succeeds with probability **$1 - 2^{-128}$**. ∎

On this same $f$:
- **Lamport hashes each random secret once**, so its public key stays in the normal lane and never exposes the shortcut.
- **Winternitz chains hashes**, so position 1 feeds tag $\mathsf{STEP1}$ straight into position 2, handing the attacker $v_1$ in plain sight.

---

## Scope of the proof

This counterexample does *not* mean Winternitz with Keccak-256 or SHA-256 is broken. It proves a **logical gap**: even *one-wayness, second-preimage resistance, and collision resistance together* do not imply *"Winternitz($f$) is secure."* Iterated chain values $f^d(\text{random})$ must also stay hard to invert.

Standard-model proofs for Winternitz and [WOTS+](https://huelsing.net/wordpress/wp-content/uploads/2013/05/wotsspr.pdf) get there by assuming **undetectability**, meaning $f(\text{random})$ is computationally indistinguishable from uniform random so iterated outputs look random too, or pseudorandomness. That condition is sufficient, not strictly required: a one-way permutation padded with a fixed `0` bit fails undetectability, yet still prevents forging a new Winternitz message. Either way, every known proof assumes something outside collision and preimage resistance, or models the hash in the [Random Oracle Model](https://en.wikipedia.org/wiki/Random_oracle).

Standard-model chain requirements were spelled out between 2002 and 2013, and the EF's own paper ([ePrint 2025/055](https://eprint.iacr.org/2025/055)) defines them explicitly alongside the recursion paradox. The gap we want to show here is only with the *"adds no new assumptions"* shorthand in public debate.

### Tweaks and target-sum encodings

Real deployments like [WOTS+](https://datatracker.ietf.org/doc/html/rfc8391#section-3.1), `leanXMSS`, and `leanSPHINCS` mix per-step tweaks into each hash, and `leanXMSS` and `leanSPHINCS` replace the checksum with a target-sum encoding where a hash output fixes the digits. Tweaks let proofs drop full collision resistance in favor of tweaked second-preimage resistance, yet tweaks fed in as hash inputs, as in SPHINCS+ and the lean specs, still fall to the same 2-tag shortcut, though random XOR bitmasks, as in RFC 8391, scramble the tag. Target-sum encoding turns the single-shot forgery into a search, yet free backward steps still sharply degrade security.

---

## Beyond Winternitz: Ethereum's PQ stack

Real schemes hash many one-time Winternitz keys into a Merkle tree to get a reusable key. Ethereum's draft proposals build two such schemes on 4-position chains: [leanXMSS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_xmss/main.tex) for validators and [leanSPHINCS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_sphincs/main.tex) for user accounts, alongside a hash-based blob commitment, [LeanDA](https://github.com/leanEthereum/leanVM/blob/main/doc/leanvm/body/10-ethereum.tex). Because these signatures are several kilobytes each, [leanVM](https://github.com/leanEthereum/leanVM) aggregates them inside a hash-based zkVM that also certifies `LeanDA`'s blob encoding.

Today, Ethereum's core uses of Keccak-256 in state, transactions, and 160-bit addresses rely primarily on collision and preimage resistance, while application patterns like Solidity storage offsets assume more. Consensus also models **SHA-256** as an idealized random hash in BLS ([RFC 9380](https://datatracker.ietf.org/doc/html/rfc9380#section-10.6)) and single-round KZG checks ([EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) and [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594)), plus public pseudorandomness in RANDAO and shuffling.

The PQ stack adds two shifts:

1. **Multi-round and recursive Fiat-Shamir inside `leanVM` (aggregation only).**
   Today, consensus uses Fiat-Shamir, deriving verifier challenges from a hash, only in single-round KZG checks, with no zkVM or recursion. Aggregating thousands of signatures per slot instead runs many rounds of Fiat-Shamir inside `leanVM`, while avoiding algebraic hashes like [Poseidon](https://eprint.iacr.org/2019/458). The deeper gap is **recursion**: a `leanVM` proof verifies child `leanVM` proofs inside itself. Its security proof treats Keccak as an external random black box, yet inside recursion the program runs the *real* Keccak function. `leanVM`'s [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) lists soundness across recursion under **"What is not proved"**, noting the model excludes programs evaluating their own Fiat-Shamir hash. Every deployed recursive Fiat-Shamir system shares this gap.
2. **Idealizing `Keccak-f[1600]` as a random permutation, with 128-bit signature digests.**
   While [ePrint 2025/055](https://eprint.iacr.org/2025/055) explored standard-model requirements, the current Lean 4 proofs model Keccak's internal permutation, [`Keccak-f[1600]`](https://keccak.team/keccak.html), as an ideal random permutation, known as the Random Permutation Model. As [PQAI #1](https://blog.ethereum.org/2026/11/24/pqai-1) notes, *"The security proofs for hash-based signatures, and the Fiat–Shamir step in the SNARGs that aggregate them, treat the hash as a random oracle,"* and once Ethereum migrates, *"if it is broken, everything else is broken."* Under that model, `leanXMSS` and `leanSPHINCS` truncate digests to 16 bytes (128 bits) while deriving ~127-bit classical forgery security (~64-bit conjectured quantum), whereas `leanVM` and `LeanDA` keep full 256-bit digests. The 128-bit truncation is not a separate assumption in the EF's proofs, yet it means 256-bit collision resistance cannot act as a fallback for the signatures. Keccak itself has nearly two decades of public cryptanalysis (since 2008).

`leanVM`'s [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) also lists a wider set of unproved items alongside its classical Lean 4 proofs, including quantum security bounds, multi-key signature security, `LeanDA` code binding for the deployed argument, and verifying the Rust prover and verifier implementations against the spec.

![Hash assumptions across Ethereum today, standard-model signatures, and the proposed PQ stack](/images/publications/hash-based-is-not-an-assumption/04-assumption-comparison.svg)

### Post-AI and hybrid implications

A hash-based stack still has a strong case as the most **practically minimal** post-quantum option: it removes elliptic-curve pairings, discrete-log assumptions, the KZG trusted setup, and the SHA-256 random-oracle assumptions inside BLS and KZG without introducing structured lattice problems like Module-LWE or NTRU. Historically, preimage-type hash properties have also held up better than collision resistance, as seen with [MD5](https://en.wikipedia.org/wiki/MD5#Collision_vulnerabilities) and [SHA-1](https://eprint.iacr.org/2017/190).

Still, reusing Keccak does not make the PQ stack a strict subset of what Ethereum already assumes. Hybrid designs, pairing BLS or ECDSA with a hash-based scheme so a forgery must break both, hedge those new assumptions at the cost of bandwidth, verification, and liveness complexity. That hedge only covers recursive aggregation if the elliptic-curve signatures are still verified natively outside the zkVM proof, since putting both checks inside one recursive proof leaves both exposed to a proof-system break. The real question for Ethereum's PQ roadmap is **which new assumptions the migration takes on, and how much confidence each one deserves.**
