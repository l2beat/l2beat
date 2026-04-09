import { readFileSync, writeFileSync } from 'node:fs'
import Graphviz from 'graphviz-wasm'
import sharp from 'sharp'

await Graphviz.loadWASM()
const dot = readFileSync('/tmp/aave-v4-arch.dot', 'utf8')
const svg = Graphviz.layout(dot, 'svg', 'dot')
writeFileSync('/tmp/aave-v4-arch.svg', svg)

// Render to PNG. Target ~1600x900 (16:9) but let sharp size from the SVG aspect.
const png = await sharp(Buffer.from(svg), { density: 200 })
  .resize({ width: 1600, withoutEnlargement: false })
  .png()
  .toBuffer()
writeFileSync('/tmp/aave-v4-arch.png', png)

const meta = await sharp(png).metadata()
console.log(`PNG: ${meta.width}x${meta.height} (ratio ${(meta.width / meta.height).toFixed(2)})`)
