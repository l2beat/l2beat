import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { DatasetEntry, PrJudgement } from '../types.js'
import { buildJudgePrompt, type JudgeEngine, judgePr } from './Judge.js'

/**
 * Verdicts cached on disk keyed by (engine, model, prompt) so a re-run against
 * an unchanged dataset replays the same verdicts without calling the model.
 */
export class CachedJudge {
  constructor(
    private readonly engine: JudgeEngine,
    private readonly cacheDir: string,
  ) {
    mkdirSync(cacheDir, { recursive: true })
  }

  async judge(entry: DatasetEntry): Promise<PrJudgement> {
    const key = createHash('sha256')
      .update(`${this.engine.name}\0${this.engine.model ?? ''}\0`)
      .update(buildJudgePrompt(entry))
      .digest('hex')
    const path = join(this.cacheDir, `${key}.json`)
    if (existsSync(path)) {
      const cached = JSON.parse(readFileSync(path, 'utf8')) as PrJudgement
      return { ...cached, cached: true }
    }
    const judgement = await judgePr(this.engine, entry)
    writeFileSync(path, JSON.stringify(judgement, null, 2))
    return judgement
  }
}
