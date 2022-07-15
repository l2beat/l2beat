import chalk from 'chalk'

const usage = `Usage:
    yarn start ..................................... run analysis on all systems
    yarn start [...projects] .................. run analysis on specific systems
    yarn start discover [project] ........... run discovery on a specific system
    yarn start invert [file] ............... print addresses and their functions
    yarn start --help ..................................... display this message

Environment variables:
    ALCHEMY_API_KEY ......................... api key for https://alchemyapi.io/
    ETHERSCAN_API_KEY .................... api key for https://etherscan.io/apis

Examples:
    yarn start zkSync zkSwap ......................... analyze zkSync and zkSwap
    yarn start discover arbitrum ..................... run discovery on arbitrum
    yarn start invert dist/zkSync.json .................. print zkSync addresses
`

const colorUsage = usage
  .replace(/ \.+ /g, (x) => chalk.dim(x))
  .replace(/^ {4}.+(?= \.\.\.)/gm, (x) => chalk.yellow(x))

export function printUsage() {
  console.log(colorUsage)
}

export function exitWithUsage(message: string): never {
  console.error(chalk.red(message))
  console.log('')
  printUsage()
  console.error(chalk.red(message))
  process.exit(1)
}
