import path from 'path'

export function sanitizePath(file: string) {
  if (file.startsWith('https://')) {
    file = file.slice('https://'.length)
  } else if (file.startsWith('http://')) {
    file = file.slice('http://'.length)
  }
  return path.resolve('/', file)
}
