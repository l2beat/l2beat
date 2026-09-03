import {
  boolean,
  command,
  flag,
  number,
  option,
  optional,
  positional,
  restPositionals,
  string,
  subcommands,
} from 'cmd-ts'
import { runBackfill } from '../implementations/ossification/backfill'
import { runCurve } from '../implementations/ossification/curve'
import { runFetchEvents } from '../implementations/ossification/fetchEvents'
import { runLint } from '../implementations/ossification/lint'
import { runSmoke } from '../implementations/ossification/smoke'

const projects = {
  project: positional({ type: string, displayName: 'project' }),
  projects: restPositionals({ type: string, displayName: 'project' }),
}

const Lint = command({
  name: 'lint',
  description:
    'Perimeter worklist, severity-history audit, historical-ledger closure and onchain timestamp audit for projects opted into the ossification factor.',
  args: {
    ...projects,
    noTimestamps: flag({
      type: boolean,
      long: 'no-timestamps',
      description: 'skip the onchain timestamp audit (offline runs)',
    }),
  },
  handler: async (args) => {
    const ok = await runLint(
      [args.project, ...args.projects],
      !args.noTimestamps,
    )
    // advisory rows are for a human to weigh; a wrong timestamp anchor is not
    process.exit(ok ? 0 : 1)
  },
})

const Backfill = command({
  name: 'backfill',
  description:
    'Lists contracts that once existed in a project’s discovery but are absent today — candidates for historicalContracts in ossification.json — from the full git history.',
  args: {
    ...projects,
    json: flag({ type: boolean, long: 'json' }),
  },
  handler: (args) => runBackfill([args.project, ...args.projects], args.json),
})

const FetchEvents = command({
  name: 'fetch-events',
  description:
    'Prints the complete onchain log history of a contract event as ready-to-review criticalEvents entries, for changes that predate discovery coverage.',
  args: {
    target: positional({ type: string, displayName: 'chain:address' }),
    event: positional({ type: string, displayName: 'eventSigOrTopic0' }),
    from: option({ type: optional(number), long: 'from' }),
    to: option({ type: optional(number), long: 'to' }),
    type: option({
      type: string,
      long: 'type',
      defaultValue: () => 'state',
      description: 'state | code',
    }),
    historical: flag({ type: boolean, long: 'historical' }),
    reason: option({ type: optional(string), long: 'reason' }),
  },
  handler: (args) => runFetchEvents(args),
})

const Curve = command({
  name: 'curve',
  description:
    'Projects the checked-out sibling ossification-dataset curve release into the runtime age knots in @l2beat/shared.',
  args: {
    check: flag({
      type: boolean,
      long: 'check',
      description: 'fail if the committed knots do not match the dataset',
    }),
  },
  handler: (args) => runCurve(args.check),
})

const Smoke = command({
  name: 'smoke',
  description:
    'Prints the ossification factor of every opted-in project (or the given ones) from the built config, without TVS.',
  args: {
    projects: restPositionals({ type: string, displayName: 'project' }),
    perimeter: flag({
      type: boolean,
      long: 'perimeter',
      description: 'also list the critical contracts',
    }),
  },
  handler: (args) => runSmoke(args.projects, args.perimeter),
})

export const Ossification = subcommands({
  name: 'ossification',
  description: 'Research tooling for the ossification factor.',
  cmds: {
    lint: Lint,
    backfill: Backfill,
    'fetch-events': FetchEvents,
    curve: Curve,
    smoke: Smoke,
  },
})
