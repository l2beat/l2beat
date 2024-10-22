import { execSync } from 'child_process'
import { readdirSync } from 'fs'
import { UnixTime } from '@l2beat/shared-pure'

function main() {
  const files = readdirSync(
    `${__dirname}/../../config/src/projects/other/da-beat/blockchain/celestia`,
  )
  const projectFiles = files.filter(
    (f) => f.endsWith('.ts') && !f.startsWith('index'),
  )
  const timestamps = new Map<string, number>()
  for (const projectFile of projectFiles) {
    // const file = readFileSync(
    //   `${__dirname}/../../config/src/projects/other/da-beat/blockchain/celestia/${projectFile}`,
    //   'utf-8',
    // )
    // const regex = /CELESTIA_BLOBSTREAM\(\{\n  chain: '\w+',\n/.exec(file)
    // if (!regex) {
    //   continue
    // }
    console.log(projectFile)

    const date = execSync(
      `TZ=UTC0 git log --follow --format=%cd --date='format-local:%Y-%m-%dT%H:%M:%SZ' ${__dirname}/../../config/src/projects/other/da-beat/blockchain/celestia/${projectFile} | tail -1`,
    )

    const dateString = date.toString().trim()
    const unixTimestamp = UnixTime.fromDate(new Date(dateString)).toNumber()
    timestamps.set(projectFile, unixTimestamp)
    // const [text] = regex
    // const offset = regex.index + text.length
    // const changedContent =
    //   file.slice(0, offset) +
    //   `createdAt: new UnixTime(${unixTimestamp}), // ${dateString}\n` +
    //   file.slice(offset + 1)
    // writeFileSync(
    //   `${__dirname}/../../config/src/projects/other/da-beat/blockchain/celestia/${projectFile}`,
    //   changedContent,
    // )
  }
  console.log(timestamps)
}

main()
