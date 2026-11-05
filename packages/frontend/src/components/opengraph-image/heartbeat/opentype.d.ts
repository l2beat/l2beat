// The parts of satori's font parser (a fork of opentype.js, which ships no
// types) that the OG layouts use to measure text.
declare module '@shuding/opentype.js' {
  interface Glyph {
    leftSideBearing?: number
  }
  interface Font {
    unitsPerEm: number
    ascender: number
    descender: number
    tables: { os2: { sCapHeight: number } }
    charToGlyph(char: string): Glyph
    getAdvanceWidth(
      text: string,
      fontSize: number,
      options?: { kerning?: boolean },
    ): number
  }
  const opentype: { parse(buffer: ArrayBufferLike): Font }
  // biome-ignore lint/style/noDefaultExport: the package exports it as default
  export default opentype
}
