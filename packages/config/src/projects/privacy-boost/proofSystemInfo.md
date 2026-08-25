Privacy Boost proves every state transition with **Groth16 over BN254**. The circuits are written
in Go against the [gnark](https://github.com/Consensys/gnark) R1CS frontend. There is no recursion and no proof
aggregation.

There are three circuit families:

- **Epoch** — a batch of private N-in/M-out transfers plus fee notes; spends (nullifies) inputs and
  appends outputs.
- **Deposit epoch** — mints commitments for confirmed deposit requests and appends them to the note
  tree.
- **Forced withdrawal** — the permissionless exit path, a single-signer manual exit spending up to
  eight notes to an EOA.

Circuit shape (batch size, max inputs and outputs per transfer, tree depths, max roots per proof)
is fixed at compile time, and every distinct shape is a distinct circuit with a distinct trusted
setup and verifying key. Privacy Boost has 18 registered shapes: fourteen epoch shapes, three
deposit shapes and one forced withdrawal shape.
