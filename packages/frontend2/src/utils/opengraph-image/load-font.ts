import { readFile } from 'fs/promises'
import path from 'path'

export function loadFont(font: string) {
  return readFile(path.join(process.cwd(), 'src/fonts', `${font}.ttf`))
}
