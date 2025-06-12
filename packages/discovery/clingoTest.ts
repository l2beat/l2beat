import { readFileSync } from 'fs'
import { parse } from './src/discovery/modelling/handClingoParser'

const input = readFileSync(
  '../config/src/projects/_clingo/modelPermissions.lp',
  'utf8',
)
const result = parse(input)
