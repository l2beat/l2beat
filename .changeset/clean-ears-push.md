---
'@l2beat/discovery': minor
---

`ConstructorArgsHandler` now derives constructor arguments from block explorer's response instead of raw deploy transaction's data. If it fails to do so, it will fallback to the old behavior using heuristic and try to decode constructor arguments by reading end of the deployment data.
