import chalk from 'chalk'

const usage = `Usage:
    yarn start ...................................... run the server application
    yarn discover [project] ................. run discovery on a specific system
    yarn discover [project] --dry-run ..... check simulated discovery bot output
    yarn invert [file] ..................... print addresses and their functions
    yarn <start|discover> --help .......................... display this message
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
