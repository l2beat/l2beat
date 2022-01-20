import { array } from './array'
import { boolean } from './boolean'
import { either } from './either'
import { exactly } from './exactly'
import { integer } from './integer'
import { mapped } from './mapped'
import { number } from './number'
import { object } from './object'
import { optional } from './optional'
import { string } from './string'
import { unknown } from './unknown'

export { CastError } from './CastError'

export const as = {
  array,
  boolean,
  either,
  exactly,
  integer,
  number,
  mapped,
  object,
  optional,
  string,
  unknown,
}
