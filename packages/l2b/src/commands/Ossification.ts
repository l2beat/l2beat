import { loadOssificationInput } from '@l2beat/config/build/ossification/getOssification'
import { measureOssification } from '@l2beat/config/build/ossification/measureOssification'
import { formatJson, UnixTime } from '@l2beat/shared-pure'
import { boolean, command, flag, positional, string } from 'cmd-ts'

export const Ossification = command({
  name: 'ossification',
  description:
    'Prints the ossification input derived from discovery for a project, and the measurement made from it. Rebuild packages/config first.',
  args: {
    project: positional({ type: string, displayName: 'project' }),
    input: flag({
      type: boolean,
      long: 'input',
      description: 'print the derived perimeter and events instead',
    }),
  },
  handler: (args) => {
    const input = loadOssificationInput(args.project, UnixTime.now())
    if (input === undefined) {
      console.log(`${args.project} has no critical perimeter`)
      return
    }
    const output = args.input ? input : measureOssification(input)
    console.log(formatJson(output))
  },
})
