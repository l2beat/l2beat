# 6. Manual token relations

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/types/TokenRelation.ts`

The design is in
[token_relations.md](../mdbook/specs/l2b_specs/token_db/token_relations.md#manually-added-relations):
why a manual relation carries the `manual` plugin sentinel, and how the
planner stamps the evidence. Two points the spec leaves out:

- `ManualRelationBridge` is display-only, like all relation evidence. No read
  path derives roles or identity from it.
- `ManualRelationEvidence` uses nullable fields, not optional ones. It is
  stored verbatim as JSON, and JSON has `null` but no `undefined`.
