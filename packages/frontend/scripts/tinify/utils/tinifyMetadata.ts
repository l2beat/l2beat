import { v } from '@l2beat/validate'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { hashPng } from './hashPng'

const metadataFile = path.join(__dirname, '../metadata.json')
const Metadata = v.record(v.string(), v.string())
const metadata = getTinifiyMetadata()

export function getTinifiyMetadata() {
  const file = readFileSync(metadataFile, 'utf8')
  return Metadata.parse(JSON.parse(file))
}

export function saveToTinifyMetadata(filePath: string, file: Buffer) {
  metadata[path.relative(process.cwd(), filePath)] = hashPng(file)

  writeFileSync(metadataFile, JSON.stringify(metadata, null, 2) + '\n')
}

export function checkIfWasTinified(filePath: string, file: Buffer) {
  return metadata[path.relative(process.cwd(), filePath)] === hashPng(file)
}
