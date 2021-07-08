import l2Data from '@l2beat/backend'
import fs from 'fs'
import path from 'path'

main()
function main() {
  mkdirp('out/api')
  save(path.join('out/api', 'aggregate.json'), l2Data.aggregate)
  for (const [project, projectData] of Object.entries(l2Data.byProject)) {
    mkdirp(path.join('out/api', project.toLowerCase()))
    save(path.join('out/api', `${project.toLowerCase()}.json`), projectData.aggregate)
    for (const [token, tokenData] of Object.entries(projectData.byToken)) {
      save(path.join('out/api', project.toLowerCase(), `${token.toLowerCase()}.json`), tokenData)
    }
  }
}

function mkdirp(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
}

function save(file: string, data: unknown) {
  fs.writeFileSync(file, JSON.stringify(data))
}
