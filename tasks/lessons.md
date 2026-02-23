# Lessons

- When a user asks for an internal mode variant, default to extending shared components and shared APIs first; only create internal duplicate trees if explicitly requested.
- Before adding parallel `internal/*` file structures, validate whether mode-aware context/props can satisfy the requirement with minimal code surface.
- When user feedback asks to remove mode-specific interfaces, collapse to one canonical data contract first (shared input/output types) and treat mode only as routing/visibility concern.
- Keep selection contracts canonical: model selected interop chains only as `{ from: string[]; to: string[] }` and enforce pair-vs-multi differences in UI behavior, not in API/input shape.
- For interop multi-chain queries, enforce directional semantics at the DB query layer (`srcChain IN from`, `dstChain IN to`) instead of union querying plus post-filtering.
- Do not keep alias fields in context when shapes are identical; if API payload equals UI selection, expose one canonical field and consume it directly.
