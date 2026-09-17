# Crop attestations from a Safe

The set of projects the garden shows is published to [EAS] as a single
attestation. The attester is a **Safe**, so publishing is a multisig
transaction: `l2b` builds calldata, the Safe owners execute it, and `l2b`
records what happened. No command here holds a key or sends a transaction.

[EAS]: https://attest.org

```
  l2b crops-attest          Safe UI              l2b crops-record       git
  ───────────────────  →  ─────────────────  →  ──────────────────  →  ──────
  plan + calldata         owners execute        ledger from the        commit
  (read-only)             the transaction       tx hash
```

| command | writes | what it does |
| --- | --- | --- |
| `l2b crops-attest` | `crops-attest.md` | Writes the calldata that attests the current set, and revokes what differs. |
| `l2b crops-record --tx <hash>` | the ledger | Fetches what that transaction attested and records it. |
| `l2b crops-verify` | nothing | Checks the committed ledger against the chain. Gates CI. |

The ledger is `packages/config/src/crops/attestationData.json`. It is a cache
of onchain state, committed so the API needs no RPC call.

## What gets attested

**The projects the garden shows**, which is not the same as the projects that
have been reviewed: a single red crop keeps a project off `/garden`, and it is
left out of the attestation too. The rule is `qualifiesForGarden` in
`@l2beat/config`, called by the site, by crops-api and by `crops-attest`
alike, so what is attested onchain cannot drift from what the page shows.

A project whose evaluation changes from red to amber therefore joins the next
revision on its own, with no change here.

## Configuration

Everything about where these commands write lives in
[`crops.config.json`](./crops.config.json): the network, the attesting Safe,
the EAS and schema registry addresses per network, the schema, and the default
rpc. Edit that file; [`easConfig.ts`](./easConfig.ts) only gives it types.

`--network`, `--safe` and `--rpc-url` override it per run, and
`L2B_CROPS_SAFE` / `L2B_RPC_URL` are read from the environment.

> The schema string appears in the config file and once more in `easConfig.ts`,
> because viem derives the payload's TypeScript types from a literal and a
> value read from JSON is only `string`. The module refuses to load if the two
> disagree, so they cannot quietly drift.

> **Anonymity.** While the attestations live on a testnet, nothing onchain may
> tie them to L2BEAT — `l2b` refuses to build calldata whose payload names us
> (see [`anonymity.ts`](./anonymity.ts)). That guard reads the payload only; it
> cannot check the Safe. **A Safe's owners are public onchain**, so use a Safe
> whose owners are throwaway addresses with no history that links them to us.

## Step 1 — build the calldata

```bash
cd packages/l2b
pnpm dev crops-attest
```

It prints the plan and writes **one file**, `crops-attest.md` (`--out` to
change the path; gitignored): the numbered steps, then each call as `to` /
`value` / `data` with its calldata decoded field by field. That file is what
you work from. Everything standing — the rest of this page — stays here, so
the generated file is short enough to read in full before signing.

**Every run publishes.** The plan is always an attestation of the set config
names right now, at the next revision, whether or not that set has changed
since the last one. What varies is the revocation beside it: a live
attestation naming a *different* set is revoked in the same batch, and one
that already names exactly this set is left where it is. Executing a run that
changed nothing therefore leaves two live attestations saying the same thing —
harmless, but `crops-verify` will report it as a `prune`.

If `attestationData.json` has uncommitted changes the command says so and
carries on. It usually means a previous `crops-record` was never committed, so
the plan is being built on a ledger the chain may not match — worth a look
before signing anything.

### What the calls are

In the order they must execute:

1. **`register`** on the SchemaRegistry — only if the network does not have the
   schema yet. Sepolia already does.
2. **`multiRevoke`** on EAS — retires the live attestations that name a
   different set. Absent when there are none.
3. **`multiAttest`** on EAS — publishes the new revision. Its `refUID` points at
   the newest attestation it supersedes, revoked or not, so the history is
   walkable onchain.

All three are non-payable, so **`value` is always 0** and no call is ever a
delegatecall.

## Step 2 — execute from the Safe

In the Safe UI: **New transaction → Transaction Builder**. Labels move around
between Safe releases, but for each call in the file: enter the `to` address,
turn on **Custom data** (the ABI field can stay empty), set the ETH value to
`0`, and paste `data` into **Data (hex encoded)**. Add each call to the batch,
keeping the file's order, then create it, sign and execute.

One transaction hash covers the whole batch. Sending the calls as separate
transactions is fine too — record each hash.

## Step 3 — record the transaction

```bash
pnpm dev crops-record --tx 0x<hash>
```

The hash is all it needs. It reads the receipt, takes the attestation uids out
of the EAS `Attested` and `Revoked` events, fetches each attestation from EAS,
prints what it says — revision, reviewedAt, the projects named — and rewrites
the ledger from that.

It takes nothing on faith from step 1: a transaction the owners reordered,
split, or batched with something else still records correctly, and rerunning
on the same hash changes nothing. It errors rather than guessing if the
transaction reverted, emitted no EAS event, or attested from an address that
is not the configured Safe.

## Step 4 — verify and commit

`crops-record` writes the ledger with `JSON.stringify`, which is not biome's
formatting, so format it first or the next diff looks like a change it is not.
From the repo root:

```bash
pnpm --filter @l2beat/config format:fix
pnpm build:dependencies:l2b
cd packages/l2b && pnpm dev crops-verify
```

`crops-verify` passes when exactly one attestation is live, it names what
config names, and the ledger says what the chain says. Then commit
`attestationData.json`. It does not ask what `crops-attest` would send — that
command always sends something.

## Reviewing calldata before signing

Every owner should check the hex independently rather than trusting whoever
generated it. Two ways.

**Decode it.** The payload is the schema
`string[] projectIds,uint64 reviewedAt,uint32 revision`. Check that the project
list is the set you expect, the revision is one higher than the live one, and
`refUID` names the attestation being replaced. The generated file shows all of
this already; `cast` checks it independently:

```bash
cast calldata-decode 'multiAttest((bytes32,(address,uint64,bool,bytes32,bytes,uint256)[])[])' 0x44adc90e...
```

**Reproduce it.** The payload carries a timestamp, so two runs do not produce
the same bytes by default. Take `reviewedAt` from the file, then:

```bash
pnpm dev crops-attest --reviewed-at <that value> --out mine.md
```

and diff the two. They are identical when the set and the chain state agree.

## Migrating off the old EOA attester

**EAS lets only the original attester revoke an attestation.** A Safe therefore
cannot revoke anything the old EOA attested — the call would revert with
`AccessDenied`.

`crops-attest` detects this and puts such calls under **From the old attester**
in the generated file, with the address that must send them, keeping them out
of the Safe's batch. That call is an ordinary transaction from the old EOA:
paste `to`, `value 0` and `data` into any wallet holding that key. No script is
needed for it.

Order does not matter — the Safe can attest the new revision first — but until
the EOA revokes, two attestations are live and `crops-verify` fails with a
`prune` plan. Record both transactions when they are done.

## Reference

Contracts and the schema are in [`crops.config.json`](./crops.config.json).
Selectors, to recognise a call at a glance:

| selector | function |
| --- | --- |
| `0x44adc90e` | `multiAttest((bytes32,(address,uint64,bool,bytes32,bytes,uint256)[])[])` |
| `0x4cb7e9e5` | `multiRevoke((bytes32,(bytes32,uint256)[])[])` |
| `0x60d7a278` | `register(string,address,bool)` |

Attestations are made with no recipient (`address(0)` — the subject is a
protocol, not an account) and no expiry; revocation is the only way one stops
being valid.

## Moving to mainnet

Set `network` and the mainnet `safe` in `crops.config.json`, and run the flow
again. The ledger keeps history per network: switching starts an empty ledger
and the old one stays in git. The Sepolia attestations are not revoked by the
switch — revoke them from the Sepolia Safe first if you want them retired.

## Troubleshooting

**`No Safe configured`** — set `safe` in `crops.config.json`, or pass `--safe`.

**`chain is not available on free plan`** — the rpc does not serve this
network. Change `rpcUrl` in the config file or pass `--rpc-url`.

**`emitted no EAS Attested or Revoked event`** — wrong hash, wrong network, or
the Safe transaction was created but never executed. A queued Safe transaction
has no hash on chain yet.

**`crops-verify` reports a `prune` plan** — more than one attestation is live.
Either a run was interrupted, or the old EOA has not revoked yet.
