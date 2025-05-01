import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { z } from 'zod'
import { hashPng } from './hashPng'

const metadataFile = path.join(__dirname, '../metadata.json')
const Metadata = z.record(z.string(), z.string())
const metadata = getMetadata()

export function getMetadata() {
  const file = readFileSync(metadataFile, 'utf8')
  return Metadata.parse(JSON.parse(file))
}

export function saveToMetadata(filePath: string, file: Buffer) {
  metadata[path.relative(process.cwd(), filePath)] = hashPng(file)

  writeFileSync(metadataFile, JSON.stringify(metadata, null, 2) + '\n')
}

export function checkIfWasTinified(filePath: string, file: Buffer) {
  return metadata[path.relative(process.cwd(), filePath)] === hashPng(file)
}
