// NOTE(radomski): Hashing function based on MurmurHash. I don't know if it
// passes smhasher so it's not cryptographically secure. If you need anything
// even semi-strong use sha2.
// Based on: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
export function cyrb64(str: string, seed = 0) {
  let h1 = 0xdeadbeef ^ seed
  let h2 = 0x41c6ce57 ^ seed

  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i)
    h1 = Math.imul(h1 ^ ch, 2654435761)
    h2 = Math.imul(h2 ^ ch, 1597334677)
  }

  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507)
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507)
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909)

  h2 = h2 >>> 0
  h1 = h1 >>> 0

  return h2.toString(36).padStart(7, '0') + h1.toString(36).padStart(7, '0')
}
