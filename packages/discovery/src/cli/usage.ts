import chalk from 'chalk'

const usage = `Usage:
    yarn start ...................................... run the server application
    yarn discover [chain] [project] ................. run discovery on a specific system
    yarn discover [chain] [project] --dry-run ..... check simulated discovery bot output
    yarn discover [chain] [project] --dev ..... run on the same block number as in .json
    yarn invert [chain] [project] ..................... print addresses and their functions
    yarn invert [chain] [project] --mermaid .................... print mermaid graph markup
    yarn <start|discover> --help .......................... display this message

    supported chains:
      - ethereum
`
const colorUsage = usage
  .replace(/ \.+ /g, (x) => chalk.dim(x))
  .replace(/^ {4}.+(?= \.\.\.)/gm, (x) => chalk.yellow(x))

export function printUsage() {
  console.log(colorUsage)
}

export function exitWithUsage(message: string): never {
  console.error(chalk.red(`Error: ${message}`))
  console.log('')
  printUsage()
  console.error(chalk.red(`Error: ${message}`))
  process.exit(1)
}
