# 2. InMemoryCache: keys, late fallbacks and sweeps

Status: accepted, 2026-11-21
Code: `packages/shared-pure/src/tools/InMemoryCache.ts`

## Keys are length-prefixed

`getKey` writes each part as `<length>:<part>`, so no combination of parts
encodes to the same string as a different combination. A missing part
(`null` or `undefined`) becomes `-`, which is not a digit and so can never be
read as a length prefix.

A length prefix only delimits a part that really is a string. Key parts often
come from HTTP query parameters, which TypeScript cannot check: Express turns
`?tab[]=a&tab[]=b` into an array. `getKey` throws on any part that is not a
string instead of folding it into a key that could collide.

## A late fallback does not overwrite a newer one

A fallback that outlives `promiseTimeout` can settle after a newer fallback
for the same key. Its data is older, so `store` drops it when the cache already
holds an entry written at or after the late fallback started. It is still
stored when nothing newer made it in, for example because the newer fallback
failed.

## One sweep per second

Timestamps are whole seconds, so a second sweep in the same second cannot find
anything the first did not. `sweep` returns early when `now` equals the time of
the last sweep.
