import { readFileSync } from 'fs'
import path from 'path'

export function loadFont(font: string) {
  return readFileSync(path.join(process.cwd(), 'src/fonts', `${font}.ttf`))
}
