import chalk from 'chalk'

export function executeHelp(): void {
  console.log(
    [
      'yarn compare-flat-sources all <stackType> ........................... Compare all projects of a given stack',
      'yarn compare-flat-sources similar <chain:project> ................... Compare project, find the most similar and diff it with powerdiff',
      'yarn compare-flat-sources project <chain:project> <chain:project> ... Compare two projects, file by file',
      'yarn compare-flat-sources help ...................................... Print this usage',
    ]
      .map((s) => chalk.yellow(s))
      .join('\n'),
  )
}
