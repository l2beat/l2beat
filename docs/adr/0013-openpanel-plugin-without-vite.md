# 13. OpenPanel plugin without a Vite dependency

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/tools/openPanelPlugin.ts`

shared-pure must not depend on Vite. `openPanelPlugin` declares the small
subset of Vite's `Plugin` and `HtmlTagDescriptor` types it needs. They are
structurally compatible with Vite's own, so apps can pass the plugin straight
into `plugins: []`.
