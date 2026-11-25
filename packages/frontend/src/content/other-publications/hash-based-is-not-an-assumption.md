---
title: "Hash-based is not an assumption"
description: "Why we need to be careful when calling hash-based signatures \"minimal assumptions,\" shown through one small counterexample."
publishedOn: "2026-11-25"
authorId: l2beat_research
tag: Research
---

## The "minimal assumptions" argument

In Ethereum's post-quantum debate, hash-based cryptography is increasingly framed as "post-AI" as well: safe even if AI finds mathematical attacks humans missed. In the [pqai27 proposal](https://ethereum-magicians.org/t/an-ethlabs-view-on-post-quantum-and-post-ai-timelines-pqai27/30351), Ethlabs defines post-AI cryptography as resting on *"as few assumptions as possible"*, calling Ethereum *"plausibly post-AI, not provably"*, and writes:

> *"The planned cryptography is built around hash functions, to minimize the assumptions we need to rely on. This is also the approach for the rest of the cryptography, such as aggregation. Minimal assumptions address both quantum computers and AI alike, so the existing plan already covers the cryptography for both."*

In [PQAI #0](https://blog.ethereum.org/2026/11/23/pqai-0), the Ethereum Foundation (EF) frames the case pragmatically: cryptography should use *"the most conservative assumptions,"* and relying on *"what we believe to be weaker assumptions"* is prudent risk management. A weaker assumption asks less of the hash, so it is harder to break. Read in context, "minimal" in this debate means **practically minimal**. Unlike lattice schemes such as [ML-DSA](https://csrc.nist.gov/pubs/fips/204/final) or [Falcon](https://falcon-sign.info/), hash-based designs avoid introducing an algebraic assumption family like [Module-LWE](https://en.wikipedia.org/wiki/Learning_with_errors) or [NTRU](https://en.wikipedia.org/wiki/NTRU).

Even so, that pragmatic framing easily slips into the stronger claim that replacing elliptic curves with hash-based signatures adds **no new assumptions**. In PQAI #0, the EF writes: *"The Ethereum protocol already relies on hashes being secure, so importantly this does not add a new assumption."* The same shorthand shows up in core dev discussions: in the [ACDE #249](https://forkcast.org/calls/acde/249) call chat, SPHINCS was defended with *"SPHINCS does not add new crypto assumptions (we already have [Keccak]), while Lattices would."*

The problem is that **"hash-based" names a building block, not an assumption.** Saying a hash function $f$ is secure can mean very different things, starting with a familiar three-step ladder:

1. **One-wayness (preimage resistance):** Given only the output $f(x)$ for a random input $x$, nobody can find *any* input that hashes to it.
2. **Second-preimage resistance:** Given a random input $x$, nobody can find a *different* input $x' \neq x$ with $f(x') = f(x)$.
3. **Collision resistance:** Nobody can find *any* pair of distinct inputs $x \neq x'$ with $f(x) = f(x')$.

These are not equivalent. A function can be one-way without being second-preimage-resistant, and second-preimage-resistant without being collision-resistant. Even that trio is incomplete: real hash-based designs also rely on properties outside this ladder altogether, such as outputs looking indistinguishable from random.

Elliptic curves will not survive large quantum computers, so adding post-quantum signatures is not in question. What is not free is dropping elliptic curves at the same time. Whenever a hash-based scheme introduces new hash assumptions of its own, you are trading risk rather than purely removing it: **if one of those new assumptions breaks while elliptic curves are still standing, dropping them leaves you worse off.**

To see how quickly new hash assumptions appear, we compare two one-time signature schemes on the same hash function $f$. **Lamport** is the minimal hash-based signature scheme. **Winternitz** is the standard efficiency optimization on top of it, and the core building block inside [XMSS](https://datatracker.ietf.org/doc/html/rfc8391), [SPHINCS+](https://csrc.nist.gov/pubs/fips/205/final), `leanXMSS`, and `leanSPHINCS`. The result:

- **One-wayness alone is enough for Lamport.**
- **One-wayness alone is provably *not* enough for textbook Winternitz.** We'll build an explicit hash function that is one-way whenever SHA-256 is, so Lamport over it stays secure, yet lets an attacker forge Winternitz signatures 100% of the time.

Ethereum already assumes full 256-bit Keccak-256 is collision-resistant, not just one-way. We start at one-wayness because it is the only level where "no new assumptions" holds automatically for every signature scheme, and Lamport vs. textbook Winternitz is the smallest setting where efficiency adds a new assumption. After the counterexample, we look at what Ethereum's actual PQ stack adds.

---

## Why one-wayness is the theoretical minimum

For digital signatures, you cannot go lower than one-wayness, because **secure signatures exist if and only if one-way functions exist.** Even this theoretical minimum is unproven: one-way functions imply $\mathsf{P} \neq \mathsf{NP}$, while the converse remains open.

- **You can't do with less.** Every signature scheme maps random secret bits to a public key. If that mapping weren't one-way, anyone seeing your public key could invert it and forge signatures at will. So *every* secure signature scheme, whether ECDSA, BLS, lattices, or hashes, implies a one-way function.
- **In theory, you don't need more.** [Rompel (1990)](https://doi.org/10.1145/100216.100269) showed how to build a full signature scheme from *any* one-way function, with zero extra assumptions.

The catch is that Rompel's construction is far too slow and large to deploy. Practical schemes buy efficiency by assuming more.

To prove where Winternitz crosses the one-wayness line, we need a precise definition. Take $f: \{0,1\}^n \to \{0,1\}^n$ and an attacker limited to $t$ basic operations playing this game:

1. Pick $x$ uniformly at random from $\{0,1\}^n$.
2. Compute $y = f(x)$ and give $y$ to the attacker.
3. The attacker outputs some $x'$.
4. The attacker wins if $f(x') = y$.

We say $f$ is **$(t, \varepsilon)$-one-way** if no attacker within budget $t$ wins with probability greater than $\varepsilon$. Intuitively, 128-bit security means budget $t$ buys a winning probability of at most roughly $t / 2^{128}$, so a high chance of success takes roughly $2^{128}$ operations.

One detail matters later: **one-wayness is average-case over random inputs.** If a tiny sliver of inputs, say one in $2^{128}$, is trivially invertible, $f$ is *still* one-way. A random $x$ almost never lands there, so it only nudges the winning probability up by $2^{-128}$. Real hashes have such slivers too: anyone can precompute billions of hashes and invert them instantly.

---

## Lamport signatures: where one-wayness is enough

[Lamport signatures](https://en.wikipedia.org/wiki/Lamport_signature) are the simplest hash-based signature scheme. To sign an $L$-bit message $m = (m_1, \dots, m_L)$:

- **$\mathsf{KeyGen}$:** For each bit position $i = 1 \dots L$, pick two random secrets $x_i[0]$ and $x_i[1]$ ($2L$ total). The public key $\mathsf{pk}$ is their $2L$ hashes $f(x_i[b])$, which we call **slots** indexed by $(i, b)$.
- **$\mathsf{Sign}(\mathsf{sk}, m)$:** For each position $i$, reveal $x_i[m_i]$ ($L$ secrets).
- **$\mathsf{Verify}(\mathsf{pk}, m, \sigma)$:** Hash each revealed value and check it matches slot $(i, m_i)$ in $\mathsf{pk}$.

Here the message itself is $L$ bits long, not an $L$-bit hash of a longer message, because hashing arbitrary messages down to $L$ bits already requires collision resistance.

![Lamport signature scheme on a 3-bit message](/images/publications/hash-based-is-not-an-assumption/00a-lamport-scheme.svg)

A Lamport key can only sign **once**. Signing two messages that differ in at least two bits reveals both secrets at those positions, letting anyone mix and match them into a third forged message without inverting anything.

So the security goal is **one-time unforgeability**:

1. Generate $(\mathsf{sk}, \mathsf{pk})$ and give $\mathsf{pk}$ to the forger.
2. The forger chooses *any* message $m$ and receives $\sigma = \mathsf{Sign}(\mathsf{sk}, m)$.
3. The forger outputs a forgery $(m^*, \sigma^*)$.
4. The forger wins if $m^* \neq m$ and $\mathsf{Verify}(\mathsf{pk}, m^*, \sigma^*)$ accepts.

The forger picks *both* $m$ and $m^*$. Real attackers can often influence what gets signed, such as crafting a transaction or block header, so schemes must survive [chosen-message attacks](https://en.wikipedia.org/wiki/Digital_signature#Notions_of_security).

### Proof that Lamport needs only one-wayness

Because $m^* \neq m$, they differ at some bit where the forger never saw the secret for $m^*$, only its hash in $\mathsf{pk}$. To prove security formally, we use a **reduction**: any algorithm that forges Lamport can be turned into an algorithm that inverts $f$.

> **How a cryptographic reduction proves security**
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

**Why this succeeds with probability $p / (2L)$.** Step 4 succeeds with probability $1 / 2$, since $m$ uses half of the $2L$ slots. Because $\sigma$ reveals only the slots $m$ used, the planted slot stays hidden after signing: conditioned on surviving step 4, it is equally likely to be any of the $L$ unused slots, including $(j,\, m^*_j)$. So the plant hits $(j,\, m^*_j)$ with probability $1 / L$, giving $(1 / 2) \cdot (1 / L) = 1 / (2L)$ whenever the forger succeeds.

![Planting the challenge y* in a Lamport public key](/images/publications/hash-based-is-not-an-assumption/00b-lamport-reduction.svg)

Thus the inverter breaks $f$ with probability at least $p / (2L)$. Flipping that around: if $f$ is $(t, \varepsilon)$-one-way, no Lamport forger spending roughly $t$ operations wins with probability above $2L \cdot \varepsilon$. For 256-bit messages, $2L = 512 = 2^9$, costing 9 bits of security with **zero assumptions beyond one-wayness**.

One reason this worked: **planting $y^*$ was invisible to the forger**, because real public-key slots are single hashes of random inputs. That stops being automatic once Winternitz chains hashes, which we return to after the counterexample.

---

## Winternitz signatures: trading keys for hash chains

Lamport's downside is size. With 32-byte hashes, signing a 256-bit message takes 512 public-key hashes, or 16 KB, and reveals 256 secrets, or 8 KB per signature.

[Winternitz](https://en.wikipedia.org/wiki/Hash-based_cryptography) shrinks both by signing a whole **base-$w$ digit** per secret using a hash chain.

Write $f^j(x)$ for $f$ applied $j$ times, with $f^0(x) = x$. A chain starts from a random secret $x$ and ends at $\mathsf{pk} = f^{w - 1}(x)$. Take $w = 4$, giving digits $0, 1, 2, 3$:

![A single Winternitz hash chain for w = 4](/images/publications/hash-based-is-not-an-assumption/01-lamport-vs-winternitz.svg)

- To sign digit $d$, reveal position $d$: $f^d(x)$.
- To verify digit $d$, hash the revealed value $w - 1 - d$ more times and check you land on $\mathsf{pk} = f^{w - 1}(x)$.

There's a catch: **hashing forward is free.** If you sign digit $1$ by revealing $f(x)$, anyone can apply $f$ once to get $f^2(x)$ and forge digit $2$. Digit $3$ is also $\mathsf{pk}$, which is already public, so across a multi-digit message anyone could forge the all-3s message without seeing a signature at all.

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

The checksum trick works in general:

**Checksum Lemma.** *For any forged message $m^* \neq m$, at least one digit of $m^*$, message or checksum, is strictly smaller than the corresponding digit of $m$.*

**Proof.** If any message digit went down, we're done. Otherwise, every message digit stayed the same or went up, and at least one went strictly up, so $C(m^*) < C(m)$. Written in the same fixed base-$w$ width, the first digit from the left where $C(m^*)$ and $C(m)$ differ must be strictly smaller in $C(m^*)$. ∎

So, as with Lamport, forging a Winternitz signature forces the attacker to **go backwards** on at least one chain.

---

## A second way to go backwards

In Lamport, going backwards means one thing: inverting $f$. In Winternitz, there is a **second way** to go backwards without inverting the revealed value.

Stick with $w = 4$ and label the chain $v_i = f^i(x)$, so $v_0 \to v_1 \to v_2 \to v_3 = \mathsf{pk}$. Suppose the signature revealed $v_1$ for digit $1$, and the forger wants digit $0$ on this chain. It must output a value $\sigma^*$ that lands on $\mathsf{pk}$ after 3 hashes:

$$\sigma^* \xrightarrow{f} f(\sigma^*) \xrightarrow{f} f^2(\sigma^*) \xrightarrow{f} f^3(\sigma^*) = v_3 = \mathsf{pk}$$

Since this forged path ends at $v_3$, it must join the real chain *somewhere*:

- **Case 1 (inversion): it joins at $v_1$.** That means $f(\sigma^*) = v_1$: the forger inverted $f$ on $v_1$, which one-wayness blocks here because $v_1 = f(v_0)$ is a single hash of a random input. We return to higher digits $d \geq 2$ after the counterexample.
- **Case 2 (branch and merge): it joins *above* $v_1$.** The forged path misses $v_1$, lands on some $u \neq v_1$, and merges onto the real chain higher up, say at $v_2$:

![Two ways to forge digit 0 from revealed v1](/images/publications/hash-based-is-not-an-assumption/02-two-ways-backwards.svg)

Look at what Case 2 does:
- The forger **never recovers $v_0$**.
- The forger **never inverts $v_1$**.
- Instead, it finds a **second preimage** $u \neq v_1$ with $f(u) = f(v_1) = v_2$, *together with* a known preimage $\sigma^*$ of $u$.

Call the property needed to block Case 2 **merge resistance**: given a revealed $v_1$, it should be hard to find $\sigma^*$ whose path misses $v_1$, so $f(\sigma^*) \neq v_1$, yet merges into the real chain at $f(v_1)$ or higher.

Compare this with textbook second-preimage resistance. Breaking second-preimage resistance asks for *any* $u \neq v_1$ with $f(u) = f(v_1)$, whereas breaking merge resistance asks for both $u$ *and* a preimage $\sigma^*$ of $u$.

To see the gap, take a toy hash $f(x)$ that drops the last bit of $x$ and runs SHA-256 on the rest. Flipping the last bit of $v_1$ immediately gives a second preimage $u \neq v_1$ with $f(u) = f(v_1)$, breaking second-preimage resistance. Merge resistance still holds: $u$ sits at position $1$, not position $0$, so flipping a bit hands the attacker $u$ without a preimage $\sigma^*$. Finding $\sigma^*$ still requires inverting SHA-256 on $u$, and merging at $v_3$ hits the same wall.

![Second-preimage resistance versus merge resistance](/images/publications/hash-based-is-not-an-assumption/02b-2pr-vs-merge-resistance.svg)

In the other direction, collision resistance implies merge resistance, since blocking any colliding $u$ also blocks $(\sigma^*, u)$. Together with the toy hash, merge resistance is strictly weaker than collision resistance.

Lamport never faces Case 2: the public-key slot you need to open is the hash of a secret that was *never revealed*, with no further hash steps above it. In Winternitz, as soon as chains have at least two hash steps, $w \geq 3$, Case 2 opens up, and one-wayness does not rule it out.

---

## The proof: a one-way function that breaks Winternitz

To prove one-wayness is *not* enough for Winternitz, start with *any* secure one-way function $g: \{0,1\}^{256} \to \{0,1\}^{256}$. Picture $g$ as SHA-256 or Keccak-256: even if $g$ is collision-resistant and ideal, the proof still works. From $g$, we build $f$ such that:

1. $f$ is **one-way whenever $g$ is**, so Lamport built from $f$ stays secure.
2. Winternitz built from $f$ is **broken**: for every $w \geq 3$, an attacker can forge with 100% probability.

Let $f$ map 384 bits to 384 bits, so outputs feed back into $f$ along a chain. Split each 384-bit input into $(\mathsf{tag}, r)$, a 128-bit label and a 256-bit input to $g$. Fix three distinct 128-bit constants: $\mathsf{HASH}$, $\mathsf{BRIDGE}$, and $\mathsf{RAMP}$.

$$f(\mathsf{tag}, r) = \begin{cases}
(\mathsf{BRIDGE},\, r) & \text{if } \mathsf{tag} = \mathsf{RAMP} \\
(\mathsf{HASH},\, g(r)) & \text{if } \mathsf{tag} \neq \mathsf{RAMP}
\end{cases}$$

Three design choices make $f$ work:

- **Free second preimages:** In the normal lane ($\mathsf{tag} \neq \mathsf{RAMP}$), $f$ ignores the tag, so $(\mathsf{HASH}, r)$ and $(\mathsf{BRIDGE}, r)$ both hash to $(\mathsf{HASH}, g(r))$.
- **A one-step ramp:** Ignoring the tag alone only breaks second-preimage resistance, like the drop-the-last-bit toy above. Adding $\mathsf{RAMP}$ supplies the missing preimage step: anyone who knows $r$ can step backwards from $(\mathsf{BRIDGE}, r)$ to $(\mathsf{RAMP}, r)$.
- **Three tags, not two:** $\mathsf{RAMP}$ outputs $\mathsf{BRIDGE}$ rather than $\mathsf{HASH}$ so it cannot invert normal outputs. If $f(\mathsf{RAMP}, r)$ output $(\mathsf{HASH}, r)$, anyone given $(\mathsf{HASH}, z)$ could invert it by returning $(\mathsf{RAMP}, z)$, destroying one-wayness. Keeping $\mathsf{BRIDGE} \neq \mathsf{HASH}$ keeps the two lanes separate.

The top row below defines $f$, and the bottom previews Claim 2's forgery from revealed $\sigma_1$ to $\mathsf{pk}_1$.

![The HASH, BRIDGE, and RAMP counterexample](/images/publications/hash-based-is-not-an-assumption/03-hash-bridge-ramp-counterexample.svg)

### Claim 1: $f$ is one-way, so Lamport with $f$ is secure

*If $g$ is $(t, \varepsilon)$-one-way, then $f$ is $(\approx t,\, \varepsilon + 2^{-128})$-one-way.*

**Proof.** Pick a random input $(\mathsf{tag}, r)$ and compute $y = f(\mathsf{tag}, r)$.

- **Rare case ($\mathsf{tag} = \mathsf{RAMP}$):** Happens with probability $2^{-128}$. Even if the attacker wins automatically here, it adds at most $2^{-128}$ to its winning probability.
- **Normal case ($\mathsf{tag} \neq \mathsf{RAMP}$):** Here $y = (\mathsf{HASH}, g(r))$ for a uniform $r$. The attacker cannot use $\mathsf{RAMP}$ to invert $y$, because $f(\mathsf{RAMP}, \cdot)$ outputs $\mathsf{BRIDGE}$, never $\mathsf{HASH}$. So *every* preimage $(\mathsf{tag}', r')$ of $y$ must take the normal lane, giving $g(r') = g(r)$.

Given a challenge $z = g(r)$ for $g$, feed $(\mathsf{HASH}, z)$ to any inverter for $f$. It sees the normal-case distribution, and any valid preimage $(\mathsf{tag}', r')$ yields a preimage $r'$ of $z$ under $g$.

So any inverter wins the normal case with probability at most $\varepsilon$, and overall with probability at most $\varepsilon + 2^{-128}$. ∎

Combined with our Lamport bound, **Lamport built from $f$ is secure**: no forger wins with probability above $2L \cdot (\varepsilon + 2^{-128})$. For 256-bit messages, where $2L = 2^9$, that leaves ~119 bits of security even if $g$ is only 128-bit secure.

### Claim 2: Winternitz with $f$ is 100% forgeable for any $w \geq 3$

**Attack.**

1. **Choose $m$ to sign:** Set $d_1 = 1$ and every other message digit to $w - 1$. Then $C(m) = w - 2$, so every checksum digit is $0$ except the lowest, which is $w - 2$. That leaves room to raise it by 1 without a carry.
2. **Read the signature on $m$:** Look at the first chain's component $\sigma_1 = (\mathsf{tag}, r)$. Since $d_1 = 1$, $\sigma_1$ is an output of $f$, so its tag is $\mathsf{HASH}$ or $\mathsf{BRIDGE}$, **never $\mathsf{RAMP}$**. Thus $f(\sigma_1) = (\mathsf{HASH}, g(r))$.
3. **Forge $m^*$, identical to $m$ except $d_1$ drops from $1$ to $0$:**
   - On the first chain, output $\sigma_1^* = (\mathsf{RAMP}, r)$.
   - Lowering $d_1$ by 1 raises the lowest checksum digit from $w - 2$ to $w - 1$ while keeping higher checksum digits at $0$. Hash that checksum component forward once with $f$.
   - Keep all other components unchanged.

**Why it always verifies.** Position $0$ requires $w - 1$ hashes to reach $\mathsf{pk}_1$. Since $w \geq 3$, the verifier hashes $\sigma_1^*$ at least twice:

$$(\mathsf{RAMP}, r) \xrightarrow{f} (\mathsf{BRIDGE}, r) \xrightarrow{f} (\mathsf{HASH}, g(r)) = f(\sigma_1) \xrightarrow{f^{w - 3}} \mathsf{pk}_1$$

- First hash: $(\mathsf{RAMP}, r)$ lands on $(\mathsf{BRIDGE}, r)$, which has the exact same next hash as $\sigma_1$.
- Second hash: because $\mathsf{BRIDGE} \neq \mathsf{RAMP}$, $f$ takes the normal lane and outputs $(\mathsf{HASH}, g(r)) = f(\sigma_1)$, the real chain value at position $2$.
- The remaining $w - 3$ hashes walk the real chain straight to $\mathsf{pk}_1$.

The forged signature verifies with **probability 1**. ∎

On this same $f$:
- The $\mathsf{RAMP}$ trick only works if you know $r$ inside the revealed value.
- **Winternitz hands you $r$** by revealing $(\mathsf{tag}, r)$ mid-chain.
- **Lamport never reveals $r$** for any slot you need to open, so the ramp is useless.

---

## What this proves, and what it doesn't

This counterexample does *not* mean Winternitz with Keccak-256 or SHA-256 is broken. Nobody expects Keccak-256 to hide a contrived $\mathsf{RAMP}$ lane.

What a counterexample proves is a **logical gap**: *"$f$ is one-way"* is too weak to imply *"Winternitz($f$) is secure."* Claiming Winternitz is secure requires extra properties of $f$ beyond one-wayness. The ladder's rungs also separate in practice. Both [MD5](https://en.wikipedia.org/wiki/MD5#Collision_vulnerabilities) and [SHA-1](https://eprint.iacr.org/2017/190) suffered practical collision attacks while their preimage resistance stayed practically unbroken. Those collisions would not forge a Winternitz signature, which needs a targeted merge rather than a free collision, yet they show hash security is not one monolithic property.

Standard-model proofs for Winternitz, which rely on concrete properties of the hash, need two properties beyond one-wayness:

1. **Merge resistance.**
   Our $\mathsf{RAMP}$ construction shows merge resistance can fail even when one-wayness holds. Proofs usually get it from collision resistance, or from tweaked second-preimage resistance in the schemes below, because both imply merge resistance. For full 256-bit Keccak-256, Ethereum's collision-resistance assumption covers merge resistance, though 128-bit signatures lose that fallback.
2. **Undetectability.**
   In Lamport, planting $y^* = f(\text{random})$ in $\mathsf{pk}$ worked because real slots are also $f(\text{random})$. In Winternitz, a reduction must plant its challenge at position $d \geq 2$, where real chain values are $f^d(\text{random})$. Collision resistance does not prevent iterated outputs from behaving differently from single hashes, or even revealing structure after two steps. So standard-model Winternitz proofs also assume **undetectability** (or pseudorandomness): $f(\text{random})$ must be computationally indistinguishable from a uniform random value, which by induction makes $f^d(\text{random})$ indistinguishable from $f(\text{random})$ too, a distinguishing assumption outside the preimage and collision ladder.

### Modern tweaked schemes (WOTS+)

Real deployments use tweaked variants like [WOTS+](https://datatracker.ietf.org/doc/html/rfc8391#section-3.1) that mix a per-step tweak (or random bitmask) into every hash. Tweaking replaces full collision resistance with tweaked second-preimage resistance and defends against multi-key attacks. **But it does not get you back to one-wayness alone.** The same $\mathsf{RAMP}$ trick still breaks tweaked chains, even when the normal lane mixes in the tweak, because both paths merge under the same step-2 tweak. Tweaked chains still need tweaked versions of merge resistance and undetectability, and in practice proofs often drop concrete properties altogether in favor of the [Random Oracle Model](https://en.wikipedia.org/wiki/Random_oracle).

---

## Beyond Winternitz: what Ethereum's actual PQ stack adds

Winternitz is only the base building block. Real schemes hash many one-time Winternitz keys into a Merkle tree to get a reusable key. Ethereum's draft proposals build two such schemes on 4-position chains: [leanXMSS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_xmss/main.tex) for validators and [leanSPHINCS](https://github.com/leanEthereum/leanVM/blob/main/doc/lean_sphincs/main.tex) for user accounts, alongside a hash-based blob commitment, [LeanDA](https://github.com/leanEthereum/leanVM/blob/main/doc/leanvm/body/10-ethereum.tex). Because these signatures are several kilobytes each, [leanVM](https://github.com/leanEthereum/leanVM) aggregates them inside a hash-based zkVM that also certifies `LeanDA`'s blob encoding.

Ethereum's hash assumptions today already go beyond 256-bit collision resistance. State and transactions rely on 256-bit Keccak-256 collision resistance, while addresses truncate it to 160 bits for ~80-bit collision security. Consensus also models **SHA-256** as an idealized random hash in BLS ([RFC 9380](https://datatracker.ietf.org/doc/html/rfc9380#section-10.6)) and single-round KZG checks ([EIP-4844](https://eips.ethereum.org/EIPS/eip-4844) and [EIP-7594](https://eips.ethereum.org/EIPS/eip-7594)), plus public pseudorandomness in RANDAO and shuffling. The gap is not "ideal hash vs. none," but which hash is idealized, in which role, and with what margin.

Relative to today's protocol, the PQ stack introduces three main shifts, ordered in our judgment from highest uncertainty to lowest:

1. **Multi-round and recursive Fiat-Shamir inside `leanVM`.**
   Today, consensus uses Fiat-Shamir, deriving verifier challenges from a hash, only in single-round KZG checks, with no zkVM or recursion. Aggregating thousands of signatures per slot instead runs many rounds of Fiat-Shamir inside `leanVM`, while avoiding algebraic hashes like [Poseidon](https://eprint.iacr.org/2019/458). The deeper gap is **recursion**: a `leanVM` proof verifies child `leanVM` proofs inside itself. Its security proof treats Keccak as an external random black box, yet inside recursion the program runs the *real* Keccak function. `leanVM`'s own [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) lists soundness across recursion under **"What is not proved"**, noting that the model excludes programs evaluating their own Fiat-Shamir hash. All Fiat-Shamir recursive proof systems share this gap.
2. **128-bit truncated Keccak digests carrying signature security.**
   In the current draft specs, `leanXMSS` and `leanSPHINCS` truncate Keccak-256 outputs to 16 bytes (128 bits). Addresses already truncate Keccak-256 to 160 bits, yet at 128 bits collision resistance drops to ~64 bits, so 256-bit collision resistance no longer covers merge resistance. Both schemes have to assume tweaked 128-bit second-preimage-style hardness directly across every chain and tree node.
3. **Treating Keccak's internals as an ideal random permutation.**
   Today, Keccak-256 only needs collision and preimage resistance, while BLS and KZG pair elliptic-curve assumptions with an idealized SHA-256. The PQ stack moves that idealization onto Keccak's internal permutation, [`Keccak-f[1600]`](https://keccak.team/keccak.html), modeling it as an ideal random permutation, known as the Random Permutation Model. As [PQAI #1](https://blog.ethereum.org/2026/11/24/pqai-1) notes, *"The security proofs for hash-based signatures, and the Fiat–Shamir step in the SNARGs that aggregate them, treat the hash as a random oracle,"* and once Ethereum migrates, *"if it is broken, everything else is broken."* This rests on nearly two decades of public cryptanalysis of Keccak (since 2008).

Two proof obligations also remain open. All four components have Lean 4 formal proofs against classical attackers, yet **none has a proved quantum security bound** yet. Second, the signature proofs cover forging against a single key pair in isolation, while `leanVM`'s [formal statement](https://github.com/leanEthereum/leanVM/blob/main/formal/statement.tex) leaves multi-key security unstated.

The figure below places each scheme on this ladder, noting that 128-bit digests in the top tier give up the 256-bit collision resistance of the collision tier:

![The cryptographic assumption stack for Keccak](/images/publications/hash-based-is-not-an-assumption/04-assumption-ladder.svg)

### What this means for the "post-AI" and hybrid debates

A hash-based stack still has a strong case as the most **practically minimal** post-quantum option: it removes elliptic-curve pairings, discrete-log assumptions, the KZG trusted setup, and the SHA-256 random-oracle assumptions inside BLS and KZG without introducing structured lattice problems like Module-LWE or NTRU.

Still, reusing Keccak does not make the PQ stack a strict subset of what Ethereum already assumes. Hybrid designs, pairing BLS or ECDSA with a hash-based scheme so a forgery must break both, hedge those new assumptions at the cost of bandwidth, verification, and liveness complexity. The right question for Ethereum's PQ roadmap is not whether a scheme is hash-based. It is **which new assumptions the migration takes on, and how much confidence each one deserves.**
