import type { ProjectPermissionedAccount } from '@l2beat/config'
import { ProjectDiscovery } from '@l2beat/config/build/discovery/ProjectDiscovery'
import {
  type ChainSpecificAddress,
  pluralize,
  unique,
} from '@l2beat/shared-pure'
import { command, flag, option, optional, positional, string } from 'cmd-ts'

export const ShowPermissions = command({
  name: 'show-permissions',
  description:
    'Print resolved actors and capabilities for a project, flagging suspicious actors.',
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
        'drop capability descriptions, print only actor list (name, type, participant count)',
    }),
  },
  handler: ({ project, chain, short }) => {
    const discovery = new ProjectDiscovery(project)
    const allPerms = discovery.getDiscoveredPermissions()

    const workPermissions = chain
      ? Object.entries(allPerms).filter(([c]) => c === chain)
      : Object.entries(allPerms)

    if (workPermissions.length === 0) {
      console.log(
        chain
          ? `No permissions data for project ${project} on chain ${chain}.`
          : `No permissions data for project ${project}. Run \`l2b model-permissions ${project}\` first.`,
      )
      return
    }

    const suspects: {
      chain: string
      name: string
      address: ChainSpecificAddress | undefined
    }[] = []

    for (const [chain, projectPerms] of workPermissions) {
      const actors = projectPerms.actors ?? []
      const roles = projectPerms.roles ?? []

      console.log(
        `\n=== ${chain} (${countOf(actors.length, 'actor')}, ${countOf(roles.length, 'role')}) ===\n`,
      )

      for (const actor of actors) {
        const accountTypes = unique(
          actor.accounts.map((a: ProjectPermissionedAccount) => a.type),
        ).join(',')

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
          participantCount > 0
            ? `, ${countOf(participantCount, 'participant')}`
            : ''

        console.log(`- ${actor.name} (${accountTypes}${partInfo})${flag}`)
        for (const acc of actor.accounts) {
          console.log(`    ${acc.address}`)
        }

        if (!short) {
          if (actor.description.trim() !== '') {
            for (const line of actor.description.trim().split('\n')) {
              console.log(line === '' ? '' : `    ${line}`)
            }
          }

          console.log('')
        }

        if (isSuspect) {
          suspects.push({
            chain,
            name: actor.name,
            address: actor.accounts[0]?.address,
          })
        }
      }

      if (!short && roles.length > 0) {
        console.log('--- roles ---\n')
        for (const role of roles) {
          console.log(`- ${role.name}`)
          for (const acc of role.accounts) {
            console.log(`    ${acc.address} (${acc.type})`)
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
        console.log(`  - ${s.chain}: ${s.name} (${s.address ?? '?'})`)
      }
      console.log(
        '\nEach is a Contract that does not look like a multisig — likely an intermediary that escaped the auto-rule. Add `canActIndependently: false` to the corresponding template, then re-run `l2b model-permissions` and check again.',
      )
    }
  },
})

function countOf(count: number, of: string): string {
  return `${count} ${pluralize(count, of)}`
}
