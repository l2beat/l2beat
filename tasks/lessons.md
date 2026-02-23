# Lessons

- When a user asks for an internal mode variant, default to extending shared components and shared APIs first; only create internal duplicate trees if explicitly requested.
- Before adding parallel `internal/*` file structures, validate whether mode-aware context/props can satisfy the requirement with minimal code surface.
- When user feedback asks to remove mode-specific interfaces, collapse to one canonical data contract first (shared input/output types) and treat mode only as routing/visibility concern.
