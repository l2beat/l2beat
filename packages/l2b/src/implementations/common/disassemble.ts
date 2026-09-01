import {
  type Bytes,
  disasmEVM,
  formatEVMOpcodes,
  type Instruction,
} from '@l2beat/shared-pure'
import chalk from 'chalk'

export function formatOpcodeDiff(
  gotBytecode: Bytes,
  wantBytecode: Bytes,
): string {
  const got = disasmEVM(gotBytecode)
  const want = disasmEVM(wantBytecode)
  const diffIndexes = findDiffIndexes(got, want)
  const firstDiffIndex = diffIndexes[0] ?? 0
  const gotInstruction = got[firstDiffIndex]
  const wantInstruction = want[firstDiffIndex]
  const gotOffset = formatOptionalOffset(gotInstruction)
  const wantOffset = formatOptionalOffset(wantInstruction)

  return [
    chalk.bold.red(
      `Opcode mismatch: ${diffIndexes.length} differing instruction(s), first at #${firstDiffIndex}`,
    ),
    `${chalk.red('got')} offset ${chalk.red(gotOffset)}, ${chalk.green('want')} offset ${chalk.green(wantOffset)}`,
    '',
    formatInstructionDiff(got, want, diffIndexes),
  ].join('\n')
}

function findDiffIndexes(got: Instruction[], want: Instruction[]): number[] {
  const result = []
  const length = Math.max(got.length, want.length)
  for (let i = 0; i < length; i++) {
    if (!instructionsEqualOptional(got[i], want[i])) {
      result.push(i)
    }
  }

  return result
}

function instructionsEqual(got: Instruction, want: Instruction): boolean {
  if (got.opcode !== want.opcode) {
    return false
  }
  if (got.pushData !== want.pushData) {
    return false
  }
  return true
}

function formatInstructionDiff(
  got: Instruction[],
  want: Instruction[],
  diffIndexes: number[],
): string {
  const contextSize = 4
  const hunks = getDiffHunks(
    diffIndexes,
    Math.max(got.length, want.length),
    contextSize,
  )
  const rows = []

  for (const [index, hunk] of hunks.entries()) {
    if (index > 0) {
      rows.push(chalk.dim('...'))
    }
    rows.push(formatInstructionDiffHunk(got, want, hunk))
  }

  return rows.join('\n')
}

function getDiffHunks(
  diffIndexes: number[],
  instructionCount: number,
  contextSize: number,
): [number, number][] {
  const hunks: [number, number][] = []
  for (const index of diffIndexes) {
    const start = Math.max(0, index - contextSize)
    const end = Math.min(instructionCount, index + contextSize + 1)
    const previous = hunks.at(-1)
    if (previous && start <= previous[1]) {
      previous[1] = Math.max(previous[1], end)
    } else {
      hunks.push([start, end])
    }
  }
  return hunks
}

function formatInstructionDiffHunk(
  got: Instruction[],
  want: Instruction[],
  hunk: [number, number],
): string {
  const [start, end] = hunk
  const gotTexts = []
  const wantTexts = []

  for (let i = start; i < end; i++) {
    gotTexts.push(formatInstructionSide(got[i]))
    wantTexts.push(formatInstructionSide(want[i]))
  }

  const gotWidth = Math.max('got'.length, ...gotTexts.map((x) => x.length))
  const rows = [
    `       ${chalk.red('got'.padEnd(gotWidth))}  ${chalk.green('want')}`,
  ]

  for (let i = start; i < end; i++) {
    const index = i - start
    const same = instructionsEqualOptional(got[i], want[i])
    const marker = same ? ' ' : '>'
    const gotText = gotTexts[index]
    const wantText = wantTexts[index]
    const separator = same ? '  ' : chalk.bold.yellow('| ')
    const gotCell = gotText.padEnd(gotWidth)
    const row = `${marker} ${gotCell}${separator}${wantText}`

    if (same) {
      rows.push(chalk.dim(row))
    } else {
      rows.push(
        chalk.bold(
          `${chalk.yellow(marker)} ${chalk.red(gotCell)}${separator}${chalk.green(wantText)}`,
        ),
      )
    }
  }

  return rows.join('\n')
}

function instructionsEqualOptional(
  got: Instruction | undefined,
  want: Instruction | undefined,
): boolean {
  if (!got || !want) {
    return false
  }
  return instructionsEqual(got, want)
}

function formatInstructionSide(instruction: Instruction | undefined): string {
  if (!instruction) {
    return '<end of bytecode>'
  }
  return formatEVMOpcodes([instruction])
}

function formatOptionalOffset(instruction: Instruction | undefined): string {
  if (!instruction) {
    return '<end>'
  }
  return `0x${instruction.offset.toString(16)}`
}
