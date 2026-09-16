# @l2beat/test-utils

Test-only helpers shared by every package that runs on vitest. It has no
runtime dependencies on the rest of the monorepo, so any package can depend on
it without creating a cycle.

## `mockObject`

Builds a stand-in for an interface out of `vi.fn()`. Function members of the
overrides become vitest mocks, so call assertions typecheck without casts;
reading a member that was not provided throws instead of returning `undefined`.

```ts
import { mockObject } from '@l2beat/test-utils'

const repository = mockObject<Repository>({ getAll: async () => [] })

await service.run(repository)

expect(repository.getAll).toHaveBeenCalledExactlyOnceWith()
expect(repository.save).toThrow() // never mocked
```

## Matchers

`toThrowWithMessage(ErrorClass, message)` and `toEqualUnsorted(items)` are the
two assertions this repo needs that vitest has no matcher for. Register them by
listing the setup entry in the package's vitest config, and name the package in
`types` so that its `declare module 'vitest'` augmentation is loaded even in
files that import nothing from it:

```ts
// vitest.config.ts
setupFiles: ['@l2beat/test-utils/setup']
```

```jsonc
// tsconfig.json
"types": ["node", "@l2beat/test-utils"]
```
