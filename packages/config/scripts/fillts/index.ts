import { exec } from 'child_process'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const args = process.argv.slice(2)
if (args.length !== 2) {
  console.error(
    'Usage in packages/config/ dir: pnpm fill-ts <input_file> <output_file>',
  )
  console.error(
    'Also make sure to have address: field one line before and chain: field two lines after sinceTimestamp: in your file, lol',
  )
  process.exit(1)
}

const inputFile = path.resolve(args[0])
const outputFile = path.resolve(args[1])

function getRpcUrl(chain: string): string {
  const envVar = `${chain.toUpperCase()}_RPC_URL`
  const rpcUrl = process.env[envVar]
  if (!rpcUrl) {
    throw new Error(`RPC URL for chain ${chain} not found in .env file`)
  }
  return rpcUrl
}

function getDeploymentTimestamp(
  address: string,
  rpcUrl: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(
      `l2b deployment-timestamp -u ${rpcUrl} ${address}`,
      (error, stdout, stderr) => {
        if (error) {
          reject(`Error: ${error.message}`)
          return
        }
        if (stderr) {
          reject(`Error: ${stderr}`)
          return
        }
        resolve(stdout.trim())
      },
    )
  })
}

async function processFile() {
  if (!fs.existsSync(inputFile)) {
    console.error(`Input file not found: ${inputFile}`)
    process.exit(1)
  }

  const fileContent = fs.readFileSync(inputFile, 'utf-8')
  const lines = fileContent.split('\n')
  const updatedLines = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (line.includes('sinceTimestamp: UnixTime()')) {
      const addressMatch = lines[i - 1].match(
        /address: EthereumAddress\('(.+?)'\)/,
      )
      const chainMatch = lines[i + 2].match(/chain: '(.+?)'/)

      if (addressMatch && chainMatch) {
        const address = addressMatch[1]
        const chain = chainMatch[1]
        try {
          const rpcUrl = getRpcUrl(chain)
          const timestamp = await getDeploymentTimestamp(address, rpcUrl)
          const updatedLine = line.replace(
            'UnixTime()',
            `UnixTime(${timestamp})`,
          )
          updatedLines.push(updatedLine)
          console.log(
            `Updated timestamp for address ${address} on chain ${chain}`,
          )
        } catch (error) {
          console.error(
            `Error processing address ${address} for chain ${chain}: ${error}`,
          )
          updatedLines.push(line)
        }
      } else {
        updatedLines.push(line)
      }
    } else {
      updatedLines.push(line)
    }
  }

  fs.writeFileSync(outputFile, updatedLines.join('\n'))
  console.log(`Updated file saved as ${outputFile}`)
}

processFile().catch(console.error)
