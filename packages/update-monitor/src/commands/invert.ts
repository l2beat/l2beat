import { readFile } from 'fs/promises'

import { invertAndPrint } from '../inversion'
import { ProjectParameters } from '../types'
import { exitWithUsage } from './usage'

export async function invert(args: string[]) {
  if (args.length !== 1) {
    exitWithUsage('Invalid number of arguments')
  }
  let parsed: ProjectParameters
  try {
    const data = await readFile(args[0], 'utf-8')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    parsed = JSON.parse(data)
  } catch {
    exitWithUsage(`Cannot read file ${args[0]}`)
  }

  invertAndPrint(parsed)
}
