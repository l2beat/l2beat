import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'fs'
import os from 'os'
import path from 'path'

/**
 * Formats deployed Solidity files with the dataset's forge fmt configuration
 * (`<dataset>/foundry.toml`), so that both sides of a diff follow one style.
 * Results are cached by the sha256 of the raw content. When forge is missing
 * the raw content is returned and a warning is logged once; identity does not
 * depend on formatting, only the displayed diff gets noisier.
 */
export class Formatter {
  private warned = false
  private available: boolean | undefined
  private readonly memory = new Map<string, string>()

  constructor(
    private readonly datasetRoot: string,
    private readonly cacheDir: string,
    private readonly log: (message: string) => void,
    private readonly forge = 'forge',
  ) {
    mkdirSync(cacheDir, { recursive: true })
  }

  /** Formats many files at once; returns formatted content per input path. */
  formatFiles(files: string[]): Map<string, string> {
    const result = new Map<string, string>()
    const pending: { file: string; hash: string; raw: string }[] = []
    for (const file of files) {
      const raw = readFileSync(file, 'utf8')
      const hash = sha256(raw)
      const cached = this.memory.get(hash) ?? this.readCache(hash)
      if (cached !== undefined) {
        result.set(file, cached)
        continue
      }
      pending.push({ file, hash, raw })
    }
    if (pending.length === 0) return result

    if (!this.isAvailable()) {
      for (const p of pending) {
        result.set(p.file, p.raw)
      }
      return result
    }

    const configFile = path.join(this.datasetRoot, 'foundry.toml')
    const tmp = mkdtempSync(path.join(os.tmpdir(), 'audit-diff-fmt-'))
    try {
      copyFileSync(configFile, path.join(tmp, 'foundry.toml'))
      const inputs = pending.map((p, i) => {
        const target = path.join(tmp, `${i}.sol`)
        writeFileSync(target, p.raw)
        return target
      })
      for (const chunk of chunked(inputs, 200)) {
        try {
          execFileSync(
            this.forge,
            ['fmt', '--root', tmp, '--color', 'never', ...chunk],
            { stdio: ['ignore', 'ignore', 'pipe'] },
          )
        } catch (e) {
          // forge exits non-zero when any file fails to parse; other files in
          // the chunk are still formatted in place.
          const message = e instanceof Error ? e.message : String(e)
          this.log(`forge fmt reported errors: ${firstLine(message)}`)
        }
      }
      pending.forEach((p, i) => {
        const input = inputs[i]
        const formatted = input ? readFileSync(input, 'utf8') : p.raw
        this.memory.set(p.hash, formatted)
        this.writeCache(p.hash, formatted)
        result.set(p.file, formatted)
      })
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
    return result
  }

  private isAvailable(): boolean {
    if (this.available !== undefined) return this.available
    const configFile = path.join(this.datasetRoot, 'foundry.toml')
    if (!existsSync(configFile)) {
      this.warnOnce(
        `no foundry.toml in ${this.datasetRoot}; deployed sources are not formatted`,
      )
      this.available = false
      return false
    }
    try {
      execFileSync(this.forge, ['--version'], { stdio: 'ignore' })
      this.available = true
    } catch {
      this.warnOnce(
        `${this.forge} not found; deployed sources are not formatted (diffs may show style changes)`,
      )
      this.available = false
    }
    return this.available
  }

  private warnOnce(message: string) {
    if (this.warned) return
    this.warned = true
    this.log(message)
  }

  private cachePath(hash: string) {
    return path.join(this.cacheDir, `${hash}.sol`)
  }

  private readCache(hash: string): string | undefined {
    const file = this.cachePath(hash)
    return existsSync(file) ? readFileSync(file, 'utf8') : undefined
  }

  private writeCache(hash: string, content: string) {
    writeFileSync(this.cachePath(hash), content)
  }
}

export function sha256(text: string): string {
  return createHash('sha256').update(text).digest('hex')
}

function chunked<T>(items: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size))
  return out
}

function firstLine(text: string): string {
  return text.split('\n').find((l) => l.trim() !== '') ?? text
}
