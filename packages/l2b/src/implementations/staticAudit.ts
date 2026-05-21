import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, resolve } from 'node:path'

// Path inside the l2b package where the slither Python printer lives.
// scripts/ is shipped alongside the compiled JS (see package.json files
// field). The .py is the same script consumed by sol-audit.nvim.
const SCRIPT_PATH = join(
  __dirname,
  '..',
  '..',
  'scripts',
  'slither_attack_surface.py',
)

// slither-analyzer is expected to be installed via uv (`uv tool install
// slither-analyzer`). We need its Python interpreter so the script can
// `from slither import Slither` directly.
const SLITHER_PYTHON = join(
  homedir(),
  '.local',
  'share',
  'uv',
  'tools',
  'slither-analyzer',
  'bin',
  'python',
)

// solc-select stores per-version binaries under ~/.solc-select/artifacts.
const SOLC_SELECT_ARTIFACTS = join(homedir(), '.solc-select', 'artifacts')

function readPragma(
  filepath: string,
): { version: string; prefix: string } | null {
  const content = readFileSync(filepath, 'utf-8')
  const lines = content.split('\n', 200)
  for (const line of lines) {
    const m = line.match(
      /pragma\s+solidity\s+([\^~>=<]*)\s*(\d+\.\d+\.\d+)/,
    )
    if (m) return { prefix: (m[1] ?? '').slice(0, 1), version: m[2]! }
  }
  return null
}

function vparts(v: string): [number, number, number] {
  const m = v.match(/(\d+)\.(\d+)\.(\d+)/)!
  return [Number(m[1]), Number(m[2]), Number(m[3])]
}

function pickSolc(version: string, prefix: string): string | null {
  if (!existsSync(SOLC_SELECT_ARTIFACTS)) return null
  const [pa, pb, pc] = vparts(version)
  let best: [number, number, number] | null = null
  let bestVer: string | null = null
  for (const entry of readdirSync(SOLC_SELECT_ARTIFACTS)) {
    const m = entry.match(/^solc-(\d+\.\d+\.\d+)$/)
    if (!m) continue
    const v = m[1]!
    const [a, b, c] = vparts(v)
    const ok =
      (prefix === '' && a === pa && b === pb && c === pc) ||
      (prefix === '^' && a === pa && (b > pb || (b === pb && c >= pc))) ||
      (prefix === '~' && a === pa && b === pb && c >= pc)
    if (
      ok &&
      (!best ||
        a > best[0] ||
        (a === best[0] && b > best[1]) ||
        (a === best[0] && b === best[1] && c > best[2]))
    ) {
      best = [a, b, c]
      bestVer = v
    }
  }
  if (!bestVer) return null
  return join(SOLC_SELECT_ARTIFACTS, `solc-${bestVer}`, `solc-${bestVer}`)
}

export function staticAudit(file: string, out?: string): void {
  const absFile = resolve(file)
  if (!existsSync(absFile)) {
    console.error(`File not found: ${absFile}`)
    process.exit(1)
  }
  if (!existsSync(SLITHER_PYTHON)) {
    console.error(
      `slither-analyzer Python not found at ${SLITHER_PYTHON}.\n` +
        `install: uv tool install slither-analyzer`,
    )
    process.exit(1)
  }
  if (!existsSync(SCRIPT_PATH)) {
    console.error(`Bundled slither script missing: ${SCRIPT_PATH}`)
    process.exit(1)
  }

  const pragma = readPragma(absFile)
  const solc = pragma ? pickSolc(pragma.version, pragma.prefix) : null

  const args = [SCRIPT_PATH, absFile]
  if (solc) args.push(solc)

  let stdout: Buffer
  try {
    stdout = execFileSync(SLITHER_PYTHON, args, {
      maxBuffer: 256 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'inherit'],
    })
  } catch (err) {
    const e = err as { status?: number; message: string }
    console.error(
      `slither failed (exit ${e.status ?? '?'}): ${e.message}`,
    )
    process.exit(1)
  }

  if (out) {
    const target = resolve(out)
    writeFileSync(target, stdout)
    console.error(`wrote ${stdout.length} bytes → ${target}`)
  } else {
    process.stdout.write(stdout)
  }
}

