import type { ProjectPermissionedAccount } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import { command, flag, option, optional, positional, string } from 'cmd-ts'

export const ShowPermissions = command({
  name: 'show-permissions',
  description:
    'Print the resolved trust map for a project: every actor the permissions resolver surfaced, with the bullet list of capabilities each one has. Use after `l2b model-permissions` to verify that only end actors (EOAs, multisigs, DAOs) appear and that the capability text matches the project description. Contract actors with no participants are flagged as suspects: most likely an intermediary that escaped the auto-rule and needs `canActIndependently: false` on its template.',
  args: {
    project: positional({
      type: string,
      displayName: 'project',
      description: 'project to inspect',
    }),
    chain: option({
      type: optional(string),
      long: 'chain',
      short: 'c',
      description: 'restrict output to a single chain (e.g. "ethereum")',
    }),
    short: flag({
      long: 'short',
      short: 's',
      description:
        "drop per-actor capability descriptions and print just the actor list (name, type, participant count). Useful when you only care about 'are the actors right?' and not 'what can each one do?'.",
    }),
  },
  handler: ({ project, chain, short }) => {
    const discovery = new ProjectDiscovery(project)
    const allPerms = discovery.getDiscoveredPermissions()

    const chainEntries = chain
      ? Object.entries(allPerms).filter(([c]) => c === chain)
      : Object.entries(allPerms)

    if (chainEntries.length === 0) {
      console.log(
        chain
          ? `No permissions data for project ${project} on chain ${chain}.`
          : `No permissions data for project ${project}. Run \`l2b model-permissions ${project}\` first.`,
      )
      return
    }

    const suspects: { chain: string; name: string; address: string }[] = []

    for (const [chainName, projectPerms] of chainEntries) {
      if (projectPerms === undefined || projectPerms === null) continue
      const actors = projectPerms.actors ?? []
      const roles = projectPerms.roles ?? []

      console.log(
        `\n=== ${chainName} (${actors.length} actor${actors.length === 1 ? '' : 's'}, ${roles.length} role${roles.length === 1 ? '' : 's'}) ===\n`,
      )

      for (const actor of actors) {
        const accountTypes = [
          ...new Set(
            actor.accounts.map((a: ProjectPermissionedAccount) => a.type),
          ),
        ].join(',')
        const participantCount = actor.participants?.length ?? 0
        const isContract = actor.accounts.some(
          (a: ProjectPermissionedAccount) => a.type === 'Contract',
        )
        const isLikelyMultisig = participantCount > 0
        const isSuspect = isContract && !isLikelyMultisig

        const flag = isSuspect
          ? '  [SUSPECT — Contract with no participants]'
          : ''
        const partInfo =
          participantCount > 0 ? `, ${participantCount} participants` : ''

        console.log(`- ${actor.name} (${accountTypes}${partInfo})${flag}`)
        for (const acc of actor.accounts) {
          console.log(`    ${acc.address.toString()}`)
        }

        if (!short && actor.description.trim() !== '') {
          for (const line of actor.description.split('\n')) {
            console.log(line === '' ? '' : `    ${line}`)
          }
        }

        if (!short) console.log('')

        if (isSuspect) {
          suspects.push({
            chain: chainName,
            name: actor.name,
            address: actor.accounts[0]?.address.toString() ?? '?',
          })
        }
      }

      if (!short && roles.length > 0) {
        console.log('--- roles ---\n')
        for (const role of roles) {
          console.log(`- ${role.name}`)
          for (const acc of role.accounts) {
            console.log(`    ${acc.address.toString()} (${acc.type})`)
          }
          if (role.description.trim() !== '') {
            for (const line of role.description.split('\n')) {
              console.log(line === '' ? '' : `    ${line}`)
            }
          }
          console.log('')
        }
      }
    }

    if (suspects.length > 0) {
      console.log(
        `\n${suspects.length} suspect actor${suspects.length === 1 ? '' : 's'} flagged:`,
      )
      for (const s of suspects) {
        console.log(`  - ${s.chain}: ${s.name} (${s.address})`)
      }
      console.log(
        `\nEach is a Contract that does not look like a multisig — likely an intermediary that escaped the auto-rule. Add \`canActIndependently: false\` to the corresponding template, then re-run \`l2b model-permissions\` and check again.`,
      )
    }
  },
})
