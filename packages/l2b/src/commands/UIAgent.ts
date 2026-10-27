import {
  array,
  command,
  flag,
  multioption,
  option,
  optional,
  positional,
  restPositionals,
  string,
  subcommands,
} from 'cmd-ts'
import { readFileSync } from 'fs'
import { callTool, fail } from '../implementations/discovery-ui/agent/client'
import { SELECTOR_HELP } from '../implementations/discovery-ui/agent/selectors'
import type { AgentStepRequest } from '../implementations/discovery-ui/agent/steps'
import {
  type AgentViewRequest,
  COLORS,
} from '../implementations/discovery-ui/agent/views'

const dryRunFlag = flag({
  long: 'dry-run',
  description: 'report what the view would do without changing the graph',
})

const url = option({
  type: string,
  long: 'url',
  defaultValue: () => process.env.DISCOUI_URL ?? 'http://localhost:2021',
  defaultValueIsSerializable: true,
  description: 'where DiscoUI runs',
})

const project = option({
  type: optional(string),
  long: 'project',
  description: 'defaults to the project open in DiscoUI',
})

const Context = command({
  name: 'context',
  description:
    'What the researcher looks at in DiscoUI: project, selected contracts, open panels, the code they selected, the agent step on screen and a summary of the graph. `state` lists the graph contract by contract.',
  args: { url },
  handler: async (args) => {
    await callTool(args.url, 'context', {})
  },
})

const State = command({
  name: 'state',
  description:
    'The graph in the open tab: which contracts are visible, in which groups, and which are hidden, plus any pending agent view.',
  args: { url },
  handler: async (args) => {
    await callTool(args.url, 'state', {})
  },
})

const Find = command({
  name: 'find',
  description: `Lists the contracts selectors match, to check them before a view. Selectors:\n  ${SELECTOR_HELP.join('\n  ')}`,
  args: {
    url,
    project,
    selectors: restPositionals({ type: string, displayName: 'selector' }),
  },
  handler: async (args) => {
    await callTool(args.url, 'find', {
      project: args.project,
      selectors: args.selectors,
    })
  },
})

const Show = command({
  name: 'show',
  description:
    'Points at contracts in every open DiscoUI tab: draws the paths, selects a contract and opens its code at a snippet. Contracts are names (Bridge), chain:Name (arb1:L2Timelock) or chain:0x addresses.',
  args: {
    url,
    project,
    note: option({
      type: string,
      long: 'note',
      description: 'one to three sentences shown with the graph',
    }),
    path: multioption({
      type: array(string),
      long: 'path',
      description:
        'comma separated contracts, holder first; connects neighbours, repeatable',
    }),
    node: multioption({
      type: array(string),
      long: 'node',
      description: 'a contract to show on its own, repeatable',
    }),
    select: option({
      type: optional(string),
      long: 'select',
      description: 'contract to select, defaults to --code or the first shown',
    }),
    code: option({
      type: optional(string),
      long: 'code',
      description: 'contract whose code to open, needs --find',
    }),
    find: option({
      type: optional(string),
      long: 'find',
      description: 'exact snippet of that code to highlight, keep it unique',
    }),
  },
  handler: async (args) => {
    if ((args.code === undefined) !== (args.find === undefined)) {
      fail('--code and --find go together')
    }
    const step: AgentStepRequest = {
      note: args.note,
      paths: args.path.map((p) => p.split(',').map((ref) => ref.trim())),
      nodes: args.node,
      select: args.select,
      code:
        args.code !== undefined && args.find !== undefined
          ? { ref: args.code, find: args.find }
          : undefined,
    }
    await callTool(args.url, 'show', { project: args.project, steps: [step] })
  },
})

const Tour = command({
  name: 'tour',
  description:
    'Walks the researcher through several steps, each like show, read as JSON from a file or stdin with "-". Three to six steps read best. Every key but note is optional; contracts are written as in show; paths is a list of paths, each a list of contracts holder first. Example: {"steps": [{"note": "The admin upgrades the bridge", "paths": [["Council", "ProxyAdmin", "Bridge"]], "nodes": ["Escrow"], "select": "Bridge", "code": {"ref": "ProxyAdmin", "find": "function upgrade("}}]}',
  args: {
    url,
    project,
    file: positional({ type: string, displayName: 'file' }),
  },
  handler: async (args) => {
    const tour = readJsonObject(args.file)
    await callTool(args.url, 'show', {
      ...tour,
      project: args.project ?? tour.project,
    })
  },
})

const View = command({
  name: 'view',
  description: `Changes the graph in the open tab: hides and shows contracts, groups and colors them and arranges groups in lanes. The researcher sees it as a pending view to Keep, Save as a layout or Discard; views sent before they decide stack. Use flags, or JSON from a file or stdin with "-": {"title", "note"?, "hide"?, "show"?, "only"?, "groups"?: [{"name", "color"?, "contracts"}], "colors"?: [{"color", "contracts"}], "arrange"?: "keep" | "lanes", "select"?}. Every contract list takes selectors:\n  ${SELECTOR_HELP.join('\n  ')}\nColors: ${COLORS.join(', ')}.`,
  args: {
    url,
    project,
    file: positional({ type: optional(string), displayName: 'file' }),
    title: option({
      type: optional(string),
      long: 'title',
      description: 'what the view shows, in a few words',
    }),
    note: option({ type: optional(string), long: 'note' }),
    hide: multioption({
      type: array(string),
      long: 'hide',
      description: 'hide these, and what is only reachable through them',
    }),
    show: multioption({
      type: array(string),
      long: 'show',
      description: 'unhide these',
    }),
    only: multioption({
      type: array(string),
      long: 'only',
      description: 'hide everything else, keeping what connects these',
    }),
    group: multioption({
      type: array(string),
      long: 'group',
      description: '"Name=selector,selector" into a named group, repeatable',
    }),
    color: multioption({
      type: array(string),
      long: 'color',
      description: '"red=selector,selector", repeatable',
    }),
    arrange: option({
      type: optional(string),
      long: 'arrange',
      description: 'keep positions, or lanes: one column per group',
    }),
    select: option({
      type: optional(string),
      long: 'select',
      description: 'the contract the panels show once the view is applied',
    }),
    dryRun: dryRunFlag,
  },
  handler: async (args) => {
    const spec =
      args.file !== undefined ? readJsonObject(args.file) : viewFromFlags(args)
    await callTool(args.url, 'view', {
      ...spec,
      project: args.project ?? spec.project,
      dryRun: args.dryRun || spec.dryRun === true,
    })
  },
})

const ControlMap = command({
  name: 'control-map',
  description:
    'Shows who can upgrade what as a view: one lane per fastest way to upgrade, with its holders, its delay and every contract it reaches. Red: no delay, orange: under a week, green: a week or more, teal: not upgradeable.',
  args: {
    url,
    project,
    hide: multioption({
      type: array(string),
      long: 'hide',
      description: 'leave these out of the map, repeatable selectors',
    }),
    dryRun: dryRunFlag,
  },
  handler: async (args) => {
    await callTool(args.url, 'control_map', {
      project: args.project,
      hide: args.hide,
      dryRun: args.dryRun,
    })
  },
})

const Discard = command({
  name: 'discard',
  description:
    'Reverts the pending agent view in the open tab to the graph from before it.',
  args: { url },
  handler: async (args) => {
    await callTool(args.url, 'discard', {})
  },
})

const Permissions = command({
  name: 'permissions',
  description:
    'Lists who can act on a contract: through which contracts, with what delay, the multisigs behind each holder and a ready --path for show. When nothing is modelled on the contract itself, follows its $admin and owner to the nearest contract that has permissions.',
  args: {
    url,
    project,
    contract: positional({ type: string, displayName: 'contract' }),
  },
  handler: async (args) => {
    await callTool(args.url, 'permissions', {
      project: args.project,
      contract: args.contract,
    })
  },
})

const Clear = command({
  name: 'clear',
  description: 'Removes what show and tour put in DiscoUI.',
  args: { url },
  handler: async (args) => {
    await callTool(args.url, 'clear', {})
  },
})

export const UIAgent = subcommands({
  name: 'ui-agent',
  description:
    'Lets an agent read what the researcher looks at in DiscoUI, point at contracts, paths and code there and change the graph with views.',
  cmds: {
    context: Context,
    state: State,
    find: Find,
    permissions: Permissions,
    show: Show,
    tour: Tour,
    view: View,
    'control-map': ControlMap,
    discard: Discard,
    clear: Clear,
  },
})

function viewFromFlags(args: {
  title?: string
  note?: string
  hide: string[]
  show: string[]
  only: string[]
  group: string[]
  color: string[]
  arrange?: string
  select?: string
}): AgentViewRequest {
  return {
    title: args.title ?? fail('A view needs --title'),
    note: args.note,
    hide: args.hide,
    show: args.show,
    only: args.only.length > 0 ? args.only : undefined,
    groups: args.group.map((g) => {
      const { key, values } = splitAssignment(g, '--group')
      return { name: key, contracts: values }
    }),
    colors: args.color.map((c) => {
      const { key, values } = splitAssignment(c, '--color')
      return { color: key, contracts: values }
    }),
    arrange: args.arrange,
    select: args.select,
  }
}

function splitAssignment(text: string, flag: string) {
  const separator = text.indexOf('=')
  if (separator === -1) {
    fail(`${flag} takes "name=selector,selector", got: ${text}`)
  }
  return {
    key: text.slice(0, separator).trim(),
    values: text
      .slice(separator + 1)
      .split(',')
      .map((value) => value.trim())
      .filter((value) => value.length > 0),
  }
}

function readJsonObject(file: string): Record<string, unknown> {
  const text = readFileSync(file === '-' ? 0 : file, 'utf8')
  let json: unknown
  try {
    json = JSON.parse(text)
  } catch {
    return fail(`Not JSON: ${file}`)
  }
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return fail(`Not a JSON object: ${file}`)
  }
  return json as Record<string, unknown>
}
