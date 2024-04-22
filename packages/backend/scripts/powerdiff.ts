import { powerdiff } from './powerdiffCore'

main()

function main() {
  console.log('>>>> Powerdiff <<<<\n')
  console.log(
    'Usage: yarn powerdiff <dir-path1> <dir-path2> [optional path to difft]\n',
  )

  const path1 = process.argv[2]
  const path2 = process.argv[3]
  const difftasticPath = process.argv[4] ?? 'difft'
  powerdiff(path1, path2, difftasticPath)
}
