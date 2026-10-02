import partition from 'lodash/partition'
import type {
  TechnologyContract,
  TechnologyContractAddress,
  TechnologyContractEscrow,
} from '~/components/projects/sections/ContractEntry'
import type { ContractsSectionProps } from '~/components/projects/sections/contracts/ContractsSection'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import type { Participant } from '~/components/projects/sections/permissions/Participants'
import type { PermissionsSectionProps } from '~/components/projects/sections/permissions/PermissionsSection'
import type { UsedInProject } from '~/components/projects/sections/permissions/UsedInProject'
import { configMarkdown } from './configMarkdown'
import {
  bulletList,
  heading,
  joinBlocks,
  link,
  subsection,
  warning,
} from './markdown'
import {
  formatPastUpgrade,
  formatPastUpgradeStats,
  renderDiagram,
  renderReferences,
  renderRisks,
} from './renderSectionParts'
import { renderProgramHashesSubsection } from './zkSectionBodies'

/*
 * Markdown bodies of the "Smart contracts" and "Permissions" sections. On the
 * HTML page parts of a contract entry sit behind badges, icons, tooltips and
 * dialogs (past upgrades, upgrade details); here they are all spelled out.
 */

export function renderContractsSection(
  props: Pick<
    ContractsSectionProps,
    | 'contracts'
    | 'risks'
    | 'diagram'
    | 'programHashes'
    | 'programHashesDescription'
    | 'discoUi'
  >,
  level: number,
) {
  return joinBlocks([
    hasImpactfulChanges(Object.values(props.contracts).flat())
      ? CONTRACTS_UPDATED_NOTE
      : '',
    renderDiagram(props.diagram),
    renderDiscoUi(props.discoUi),
    ...Object.entries(props.contracts).map(([chain, contracts]) =>
      subsection(
        level,
        chain,
        renderContractList(contracts, 'contracts', level + 1),
      ),
    ),
    renderRisks(
      props.risks,
      'The current deployment carries some associated risks:',
    ),
    renderProgramHashesSubsection(props, level),
  ])
}

export function renderPermissionsSection(
  {
    permissionsByChain,
    permissionedEntities,
    discoUi,
  }: Pick<
    PermissionsSectionProps,
    'permissionsByChain' | 'permissionedEntities' | 'discoUi'
  >,
  level: number,
) {
  return joinBlocks([
    renderDiscoUi(discoUi),
    renderCommitteeMembers(permissionedEntities ?? []),
    ...Object.entries(permissionsByChain).map(([chain, permissions]) =>
      subsection(
        level,
        chain,
        joinBlocks([
          subsection(
            level + 1,
            'Roles',
            renderContractList(permissions.roles, 'permissions', level + 2),
          ),
          subsection(
            level + 1,
            'Actors',
            renderContractList(permissions.actors, 'permissions', level + 2),
          ),
        ]),
      ),
    ),
  ])
}

/** The HTML banner above the section; DA pages link Disco nowhere else. */
function renderDiscoUi(discoUi: { href: string } | undefined) {
  if (!discoUi) return ''
  return `Explore these contracts and permissions in Disco, L2BEAT's contract explorer: ${discoUi.href}`
}

const CONTRACTS_UPDATED_NOTE =
  '**Note:** Contracts presented in this section had their implementations updated since the last time our team looked at this project. The information presented may be inaccurate.'

function hasImpactfulChanges(contracts: TechnologyContract[]) {
  return contracts.some((contract) => contract.impactfulChange)
}

/** Changed entries go last, under a warning, as the HTML groups them in a callout. */
function renderContractList(
  contracts: TechnologyContract[],
  kind: 'contracts' | 'permissions',
  level: number,
) {
  const sharedNames = findSharedNames(contracts)
  const render = (entry: TechnologyContract) =>
    renderContract(entry, level, sharedNames.has(entry.name))
  const [changed, unchanged] = partition(
    contracts,
    (contract) => contract.impactfulChange,
  )
  return joinBlocks([
    ...unchanged.map(render),
    changed.length > 0
      ? warning(
          `There are impactful changes to the following ${kind}, and part of the information might be outdated.`,
        )
      : '',
    ...changed.map(render),
  ])
}

function findSharedNames(contracts: TechnologyContract[]) {
  const seen = new Set<string>()
  const shared = new Set<string>()
  for (const { name } of contracts) {
    if (seen.has(name)) shared.add(name)
    seen.add(name)
  }
  return shared
}

/** A contract or a permissioned role/actor, as the HTML contract entry shows it. */
function renderContract(
  entry: TechnologyContract,
  level: number,
  isNameShared: boolean,
) {
  const upgradeableBy = entry.upgradeableBy ?? []
  return joinBlocks([
    heading(level, contractTitle(entry, isNameShared)),
    `Addresses: ${[...entry.addresses, ...entry.admins].map(renderContractAddress).join(', ')}`,
    renderContractPastUpgrades(entry.pastUpgrades),
    configMarkdown(entry.description, level + 1),
    entry.escrow ? renderEscrowTokens(entry.escrow) : '',
    upgradeableBy.length > 0
      ? `Can be upgraded by: ${upgradeableBy.map((actor) => `${actor.name} with ${actor.delay} delay`).join(', ')}`
      : '',
    entry.upgradeDelay ? `Upgrade delay: ${entry.upgradeDelay}` : '',
    entry.participants ? renderParticipants(entry.participants) : '',
    renderUsedInProjects(entry.usedInProjects ?? []),
    renderUpgradeConsiderations(entry.upgradeConsiderations, level),
    renderReferences(entry.references),
  ])
}

/**
 * The badges next to the HTML name go into the heading. Entries sharing a name
 * are told apart on the HTML page by the address next to it, so the heading
 * carries it too.
 */
function contractTitle(entry: TechnologyContract, isNameShared: boolean) {
  const firstAddress = entry.addresses[0]?.address
  const qualifiers = [
    isNameShared && firstAddress && shortenAddress(firstAddress),
    (entry.groupCount ?? 1) > 1 && `${entry.groupCount} instances`,
    entry.escrow && (entry.escrow.isCustom ? 'custom escrow' : 'escrow'),
    entry.impactfulChange && 'impactful change',
  ].filter(Boolean)
  return qualifiers.length > 0
    ? `${entry.name} (${qualifiers.join(', ')})`
    : entry.name
}

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`
}

/** Unnamed addresses carry a shortened address as their name, which adds nothing next to the full one. */
function renderContractAddress(address: TechnologyContractAddress) {
  const notes = [
    !address.name.includes('…') && address.name,
    address.verificationStatus === 'unverified' && 'unverified',
    address.verificationStatus === 'became-verified' &&
      'recently verified, under review',
  ].filter(Boolean)
  const suffix = notes.length > 0 ? ` (${notes.join(', ')})` : ''
  return `${link(address.address, address.href)}${suffix}`
}

function renderParticipants(participants: Participant[]) {
  const list = participants
    .map((participant) =>
      renderContractAddress({ ...participant, verificationStatus: 'verified' }),
    )
    .join(', ')
  return `Participants (${participants.length}): ${list}`
}

function renderEscrowTokens(escrow: TechnologyContractEscrow) {
  return escrow.tokens === '*'
    ? 'All supported tokens in this escrow are included in the value secured calculation.'
    : `The following tokens are included in the value secured calculation: ${escrow.tokens.join(', ')}`
}

/**
 * Same split as the HTML entry: an implementation shared by a project that
 * also shares the proxy is listed under the proxy only.
 */
function renderUsedInProjects(projects: UsedInProject[]) {
  const proxies = projects.filter((p) => p.type === 'proxy')
  const proxyIds = new Set(proxies.map((p) => p.id))
  const implementations = projects.filter(
    (p) => p.type === 'implementation' && !proxyIds.has(p.id),
  )
  const permissions = projects.filter((p) => p.type === 'permission')
  return joinBlocks(
    (
      [
        ['Proxy used in', proxies],
        ['Implementation used in', implementations],
        ['Used in', permissions],
      ] as const
    ).map(([label, used]) =>
      used.length > 0
        ? `${label}: ${used.map((project) => renderUsedInProject(project)).join(', ')}`
        : '',
    ),
  )
}

/** Project URLs are site paths; the fragment points at the entry on that page, as on the HTML page. */
function renderUsedInProject(project: UsedInProject) {
  const url = `${project.url}#${project.targetName}`
  return link(project.name, url)
}

/** Behind a "View past upgrades" dialog on the HTML page, newest first. */
function renderContractPastUpgrades(
  pastUpgrades: PastUpgradesData | undefined,
) {
  if (!pastUpgrades || pastUpgrades.upgrades.length === 0) return ''
  return joinBlocks([
    `**Past upgrades** (${formatPastUpgradeStats(pastUpgrades.stats).join(', ')})`,
    bulletList(pastUpgrades.upgrades.map(formatPastUpgrade)),
  ])
}

/** Collapsed behind "Show upgrade details" on the HTML page. */
function renderUpgradeConsiderations(text: string | undefined, level: number) {
  if (!text) return ''
  return joinBlocks(['**Upgrade details**', configMarkdown(text, level + 1)])
}

type PermissionedEntity = NonNullable<
  PermissionsSectionProps['permissionedEntities']
>[number]

/** Known DA committee members, which the HTML page lists above the permissions. */
function renderCommitteeMembers(members: PermissionedEntity[]) {
  if (members.length === 0) return ''
  return joinBlocks([
    'The DA committee has the following members:',
    bulletList(
      members.map((member) => {
        const key = member.key ? ` (key: ${member.key})` : ''
        return `${link(member.name, member.href)}${key}`
      }),
    ),
  ])
}
