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
