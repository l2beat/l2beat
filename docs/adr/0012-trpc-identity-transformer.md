# 12. tRPC identity transformer

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/tools/trpcTransformer.ts`

Without a transformer, tRPC types outputs through `Serialize<T>`, which turns
required `T | undefined` fields into optional ones. `trpcTransformer` passes
values through unchanged. The transport still sends JSON, so the wire format
is the same, but router output types keep their declared shape.
