// pnpm qf <command>
//
//   levels                          the ladder: every level with its question
//   examples                        the synthetic examples
//   run <example> [level]           run one example at one level (default: the top level); prints row counts
//   rows <example> <level> <rel>    print the rows of a relation from that run
//   explain <example> <level> <atom>  why does this tuple hold? Soufflé's proof down to the facts
//   test [--update] [example]       compare every expected/<example>/<relation>.tsv with a fresh run
//   expect <example> <relation>     record the current rows of a relation as the expectation (review them!)

import { join } from 'path'
import { listExamples } from './examples'
import { listLevels, maxLevel, programFor } from './levels'
import { levelDir, rowsOf, runExample } from './run'
import { explainAtom, formatAtom } from './souffle'
import { runTests, writeExpected } from './test'

function usage(): never {
  console.error(
    [
      'usage:',
      '  qf levels',
      '  qf examples',
      '  qf run <example> [level]',
      '  qf rows <example> <level> <relation>',
      '  qf explain <example> <level> <relation> <col>...   (or one quoted atom)',
      '  qf test [--update] [example]',
      '  qf expect <example> <relation>',
    ].join('\n'),
  )
  process.exit(2)
}

function pad(s: string, n: number): string {
  return s.length >= n ? s : s + ' '.repeat(n - s.length)
}

async function main(argv: string[]): Promise<void> {
  const [cmd, ...rest] = argv
  switch (cmd) {
    case 'levels': {
      for (const l of listLevels())
        console.log(`${l.n}  ${pad(l.title, 18)} ${l.question}   [${l.file}]`)
      return
    }
    case 'examples': {
      for (const e of listExamples())
        console.log(
          `${pad(e.id, 14)} ${e.lines} lines  ${e.description.split('\n')[0] ?? ''}`,
        )
      return
    }
    case 'run': {
      const [id, levelText] = rest
      if (!id) usage()
      const level = levelText === undefined ? maxLevel() : Number(levelText)
      const result = await runExample(id, level)
      const m = result.meta
      console.log(
        `${m.example} at level ${m.level}: solc ${m.solc}, compile ${m.timings.compileMs.toFixed(0)} ms, souffle ${m.timings.souffleMs.toFixed(0)} ms → ${result.dir}`,
      )
      console.log('facts:')
      for (const [k, v] of Object.entries(m.factCounts))
        console.log(`  ${pad(k, 16)} ${v}`)
      if (Object.keys(m.counts).length > 0) {
        console.log('derived:')
        for (const rel of result.program.relations.filter((r) => r.isOutput))
          console.log(
            `  ${pad(rel.name, 16)} ${pad(String(m.counts[rel.name] ?? 0), 6)} ${rel.file}`,
          )
      }
      return
    }
    case 'rows': {
      const [id, levelText, relation] = rest
      if (!id || !levelText || !relation) usage()
      for (const row of rowsOf(id, Number(levelText), relation))
        console.log(row.join('\t'))
      return
    }
    case 'explain': {
      const [id, levelText, ...atomParts] = rest
      if (!id || !levelText || atomParts.length === 0) usage()
      const level = Number(levelText)
      const program = programFor(level)
      let atom = atomParts.join(' ')
      if (atomParts.length > 1 && /^\w+$/.test(atomParts[0] ?? '')) {
        const [relation = '', ...cols] = atomParts
        const info = program.relations.find((r) => r.name === relation)
        if (!info) throw new Error(`unknown relation ${relation}`)
        atom = formatAtom(relation, cols, info.columns)
      }
      const dir = levelDir(id, level)
      const { proof, ms } = explainAtom({
        programPath: join(dir, 'program.dl'),
        factsDir: join(dir, '..', 'facts'),
        atom,
      })
      const print = (n: typeof proof, depth: number): void => {
        const tag =
          n.kind === 'derived' ? `${n.ruleNumber ?? ''} ` : `[${n.kind}] `
        console.log(`${'  '.repeat(depth)}${tag}${n.text}`)
        for (const c of n.children) print(c, depth + 1)
      }
      print(proof, 0)
      console.log(`(${ms.toFixed(0)} ms)`)
      return
    }
    case 'test': {
      const update = rest.includes('--update')
      const only = rest.find((a) => !a.startsWith('--'))
      const outcomes = await runTests({ update, only })
      let failed = 0
      for (const o of outcomes) {
        console.log(
          `${o.ok ? 'ok  ' : 'FAIL'} ${o.example}/${o.relation}${update ? ' (updated)' : ''}`,
        )
        for (const r of o.missing) console.log(`     missing:    ${r}`)
        for (const r of o.unexpected) console.log(`     unexpected: ${r}`)
        if (!o.ok) failed++
      }
      console.log(
        `${outcomes.length - failed}/${outcomes.length} relations as expected`,
      )
      if (failed > 0 && !update) process.exit(1)
      return
    }
    case 'expect': {
      const [id, relation] = rest
      if (!id || !relation) usage()
      const level = maxLevel()
      await runExample(id, level)
      const rows = rowsOf(id, level, relation)
      writeExpected(id, relation, rows)
      console.log(`wrote ${rows.length} rows to expected/${id}/${relation}.tsv`)
      return
    }
    default:
      usage()
  }
}

// `qf rows ... | head` closes the pipe early; that is not an error.
process.stdout.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EPIPE') process.exit(0)
  throw e
})

main(process.argv.slice(2)).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
