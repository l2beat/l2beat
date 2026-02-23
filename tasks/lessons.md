# Lessons

- When a user asks for an internal mode variant, default to extending shared components and shared APIs first; only create internal duplicate trees if explicitly requested.
- Before adding parallel `internal/*` file structures, validate whether mode-aware context/props can satisfy the requirement with minimal code surface.
