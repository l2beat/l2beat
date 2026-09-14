# Synthetic projects

Hand-written projects in the same shape discovery writes (`discovered.json` next to a `.flat/` folder
with one flattened source file per contract), small enough to follow every derived tuple by hand.
They are offered in the web start panel and by `pnpm run run <name>` alongside the real projects in
`packages/config/src/projects`.

## playground

Three contracts and three externally owned accounts.

| Address | What | Values |
| --- | --- | --- |
| `0x1111…` Playground | `setScore(next)` calls `gate.authorize(msg.sender)` and then writes `score`. Its own `owner` and `guardian` are stored but nothing reads them. | `owner` = `0xaaaa…`, `guardian` = `0xbbbb…`, `gate` = `0x2222…` |
| `0x2222…` OwnerGate | `authorize(caller)` requires `caller == owner`. | `owner` = `0xcccc…` |
| `0x3333…` ClosedGate | `authorize` always reverts. | |

So who can change `score` is not written in Playground: it depends on which gate the deployed
state points at. With `gate` = OwnerGate only `0xcccc…` gets through, an address Playground itself
never mentions. Point `gate` at `0x3333…` (ClosedGate) in `discovered.json` and rerun, and nobody can.

## pg-01 … pg-15: the fixture family

Each `pg-*` folder is one case of "who can change `score` in Playground (`0x1111…`)?", with the answer
a person worked out in `expected.json` (`can`, `cannot`, `unknown`, the residual kinds that must be
reported, and `indirect`: who can change the storage the guards read). `pnpm semantic` runs every case
through all stages and compares. The cases are described in PLAN2.md; in short:

| Case | Playground | Deployed state | Expected |
| --- | --- | --- | --- |
| pg-01 | `gate.authorize(msg.sender); score = next;` | gate = OwnerGate (owner `0xcccc…`) | can = {cccc}, everyone else cannot |
| pg-02 | same code | gate = ClosedGate | nobody can |
| pg-03 | `if (checked) gate.authorize(msg.sender);` + owner-only `setChecked` | checked = true | as pg-01; indirect: the owner `0xaaaa…` via `checked` |
| pg-04 | same code | `checked` not recorded | can = {cccc} (passes either way), everyone else unknown (`depends-on`) |
| pg-05 | `if (msg.sender == owner) {} else { gate.authorize(msg.sender); }` | owner `0xaaaa…`, gate = OwnerGate | can = {aaaa, cccc} |
| pg-06 | `for (…) gates[i].authorize(msg.sender);` | gates = [OwnerGate, OpenGate] | can = {cccc} (the guards conjoin) |
| pg-07 | `relay.check(msg.sender)`; Relay: `gate.authorize(who)` | relay = Relay, its gate = OwnerGate | can = {cccc}: the identity travels through the arguments |
| pg-08 | `try gate.authorize(msg.sender) {} catch {}` | gate = OwnerGate | can = anyone: a caught failure guards nothing |
| pg-09 | `address(gate).call(…)` with the success flag dropped | gate = OwnerGate | can = anyone |
| pg-10 | `score = next; revert(…)` | | nobody can: the write never persists |
| pg-11 | pg-01 behind an EIP-1967 proxy (`Playground/Proxy.p.sol` + `Playground/Playground.sol`) | `$implementation` = 0x5555…, `$admin` = 0xdddd… | can = {cccc}; the gate sees the proxy as msg.sender |
| pg-12 | `modifier onlyAuthorized { _authorize(); _; }`, helper calls the gate | gate = OwnerGate | as pg-01 |
| pg-13 | Vault/Sentinel, everything renamed; nested ifs that revert on failure, `if (!halted) … else revert` | halted = false, sentinel = Sentinel (warden cccc) | can = {cccc} for `level` |
| pg-14 | `if (fast) { assembly {…revert…} } else { gate.authorize(msg.sender); }` with `fast` a parameter | gate = OwnerGate | can = {cccc}, everyone else unknown (`opaque`, `depends-on`) |
| pg-15 | a cut-down OpenZeppelin AccessControl: `setScore` needs `SCORER_ROLE`, `grantRole` needs the role's admin role | `accessControl` recorded by discovery: SCORER_ROLE members bbbb, cccc; DEFAULT_ADMIN_ROLE member aaaa | can = {bbbb, cccc}; indirect: aaaa via `_roles` |

The universe of actors is every discovered address, contracts included; `"all-others"` in
`expected.json` means all of them not named in the other sets.
