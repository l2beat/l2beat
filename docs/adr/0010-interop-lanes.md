# 10. Interop lanes

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/InteropLane.ts`

Every interop aggregate is keyed by a lane: a project's bridge type between
two chains. `interopLaneKey` must be a deterministic identity, so it never
includes a magnitude or a timestamp.
