import { Type, command, option, positional, string } from 'cmd-ts'
import {
  DIFFING_MODES,
  DiffingMode,
  powerdiff,
} from '../implementations/powerdiff'
import { Directory } from './types'

export const DiffingModeType: Type<string, DiffingMode> = {
  async from(str): Promise<DiffingMode> {
    return new Promise((resolve, reject) => {
      if (!DIFFING_MODES.includes(str as DiffingMode)) {
        reject(new Error(`Diffing modes are: ${DIFFING_MODES.join(', ')}`))
      }
      resolve(str as DiffingMode)
    })
  },
}

export const Powerdiff = command({
  name: 'powerdiff',
  description:
    'Compare two directories recursively using difftastic and serve the result',
  version: '1.0.0',
  args: {
    leftPath: positional({ type: Directory, displayName: 'leftPath' }),
    rightPath: positional({ type: Directory, displayName: 'rightPath' }),
    difftasticPath: option({
      type: string,
      long: 'difftastic-path',
      defaultValue: () => 'difft',
    }),
    mode: option({
      type: DiffingModeType,
      long: 'mode',
      short: 'm',
      defaultValue: () => 'together' as const,
    }),
  },
  handler: ({ leftPath, rightPath, difftasticPath, mode }) => {
    powerdiff(leftPath, rightPath, difftasticPath, mode)
  },
})
