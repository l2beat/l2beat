import { readFileSync } from 'fs'
import { exit } from 'process'

const prDb = readFileSync('/tmp/compare/pr/db.sqlite')
const prCommit = readFileSync('/tmp/compare/pr/commit', 'utf-8')
const mainDb = readFileSync('/tmp/compare/main/db.sqlite')
const mainCommit = readFileSync('/tmp/compare/main/commit', 'utf-8')

const prSize = prDb.length
const mainSize = mainDb.length

if (prSize === mainSize) {
  console.log('No changes detected')
  exit()
}

const html = `
<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <title>Diff</title>
</head>

<body>
  <h1>Diff</h1>
  <h2>Main commit ${mainCommit}</h2>
  <p>Main size ${mainSize}</p>
  <h2>PR commit ${prCommit}</h2>
  <p>PR size ${prSize}</p>
</body>

</html>
`

console.log(html)
