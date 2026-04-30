import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPreview } from '../../../api/api'
import type {
  AddressFieldValue,
  ApiPreviewContract,
  ApiPreviewCounterpartyRiskScenario,
  ApiPreviewExpandedPermissionChain,
  ApiPreviewMissingSource,
  ApiPreviewPermissionPath,
  ApiPreviewPermissions,
  ApiPreviewResponse,
  UpgradeabilityActor,
} from '../../../api/types'
import { Checkbox } from '../../../components/Checkbox'
import { LoadingState } from '../../../components/LoadingState'
import { AddressDisplay } from '../panel-values/AddressDisplay'
import { usePanelStore } from '../store/panel-store'

export function PreviewPanel() {
  const { project } = useParams()
  const selectedAddress = usePanelStore((state) => state.selected)
  const [showOnlySelected, setShowOnlySelected] = useState(false)

  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const previewResponse = useQuery({
    queryKey: ['projects', project, 'preview'],
    queryFn: () => getPreview(project),
  })
  const response = previewResponse.data
  if (response === undefined) {
    return <LoadingState />
  }

  return (
    <div className="flex h-full w-full flex-col text-sm">
      <div className="sticky top-0 z-10">
        <OptionsPanel
          showOnlySelected={showOnlySelected}
          setShowOnlySelected={setShowOnlySelected}
        />
      </div>
      <div className="overflow-auto">
        <RiskSummary response={response} />
        <PermissionsPreview
          permissionsPerChain={response.permissionsPerChain}
          selectedAddress={selectedAddress}
          showOnlySelected={showOnlySelected}
        />
        <ContractsPreview
          contractsPerChain={response.contractsPerChain}
          selectedAddress={selectedAddress}
          showOnlySelected={showOnlySelected}
        />
      </div>
    </div>
  )
}

const TARGET_TOKEN_LABELS: Record<string, string> = {
  'eth:0xa1290d69c65a6fe4df752f95823fae25cb99e5a7': 'RSETH (Ethereum)',
  'eth:0x85d456b2dff1fd8245387c0bfb64dfb700e98ef3':
    'RSETH_OFTAdapter (Ethereum)',
  'unichain:0xc3eacf0612346366db554c991d7858716db09f58': 'RSETH_OFT (Unichain)',
}

function RiskSummary(props: {
  response: ApiPreviewResponse
}) {
  const grouped = groupPathsByTarget(props.response.permissionPathsPerChain ?? [])
  const directChains = (props.response.expandedPermissionChains ?? []).filter(
    (x) => x.depth === 1,
  )
  const indirectChains = (props.response.expandedPermissionChains ?? []).filter(
    (x) => x.depth > 1,
  )
  const scenarios = props.response.counterpartyRiskScenarios ?? []
  const sourceCoverage = props.response.sourceCoverage

  return (
    <div className="border-b border-b-coffee-600 p-2">
      <h2 className="font-bold text-2xl text-blue-600">Risk summary</h2>
      <div className="mt-1 text-xs text-coffee-200">
        Comprehensive permission and counterparty-risk analysis for rsETH and OFTs.
      </div>

      {!sourceCoverage.complete && <SourceCoverageBlock missing={sourceCoverage.missing} />}
      <div className="mt-2 flex flex-col gap-3">
        <DirectPathsBlock grouped={grouped} />
        <ExpandedChainsBlock title="Direct token control chains" chains={directChains} />
        <ExpandedChainsBlock
          title="Indirect dependency and upstream chains"
          chains={indirectChains}
        />
        <ScenariosBlock scenarios={scenarios} />
      </div>
    </div>
  )
}

function SourceCoverageBlock(props: { missing: ApiPreviewMissingSource[] }) {
  return (
    <div className="mt-2 rounded border border-rose-500 p-2">
      <div className="font-bold text-rose-200">
        Analysis blocked (strict source mode): flattened source coverage incomplete.
      </div>
      <div className="mt-1 text-sm text-coffee-200">
        Missing flattened sources for {props.missing.length} contracts.
      </div>
      <ul className="mt-1 list-disc pl-5 text-xs">
        {props.missing.slice(0, 25).map((m) => (
          <li key={m.address}>
            {m.chain}: {m.name} ({m.address})
          </li>
        ))}
      </ul>
      {props.missing.length > 25 && (
        <div className="text-xs text-coffee-300">
          ...and {props.missing.length - 25} more.
        </div>
      )}
    </div>
  )
}

function DirectPathsBlock(props: {
  grouped: { target: string; label: string; paths: ApiPreviewPermissionPath[] }[]
}) {
  if (props.grouped.length === 0) {
    return (
      <div className="rounded border border-coffee-500 p-2 text-sm text-coffee-200">
        No direct permission paths found for target tokens.
      </div>
    )
  }

  return (
    <>
      {props.grouped.map((group) => (
        <div key={group.target} className="rounded border border-coffee-500 p-2">
          <div className="font-bold">{group.label}</div>
          <ul className="mt-1 list-disc pl-5">
            {sortPermissionPaths(group.paths).map((path, i) => {
              const display = toDisplayPath(path.actor, path.via)
              return (
                <li key={`${path.permission}-${path.actor.address}-${i}`}>
                  <span className="font-semibold">{path.permission}</span> by{' '}
                  <AddressDisplay value={display.primary} />
                  {display.viaShort.length > 0 && (
                    <>
                      {' '}
                      via{' '}
                      {display.viaShort.map((address, idx) => (
                        <span key={`${address.address}-${idx}`}>
                          {idx > 0 && ' -> '}
                          <AddressDisplay value={address} />
                        </span>
                      ))}
                    </>
                  )}
                  {path.via.length > 0 && (
                    <span className="text-xs text-coffee-300">
                      {' '}
                      (
                      {path.via
                        .map((step) =>
                          step.delay !== undefined
                            ? formatDelay(step.delay)
                            : step.condition ?? '',
                        )
                        .filter((x) => x.length > 0)
                        .join(', ')}
                      )
                    </span>
                  )}
                  {path.description ? <> - {path.description}</> : null}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}

function ExpandedChainsBlock(props: {
  title: string
  chains: ApiPreviewExpandedPermissionChain[]
}) {
  return (
    <div className="rounded border border-coffee-500 p-2">
      <div className="font-bold">{props.title}</div>
      {props.chains.length === 0 ? (
        <div className="mt-1 text-sm text-coffee-200">No chains in this category.</div>
      ) : (
        <ul className="mt-1 list-disc pl-5">
          {props.chains.map((chain, i) => (
            <li key={`${chain.actor.address}-${chain.target.address}-${i}`}>
              <span className="font-semibold">{chain.permission}</span> depth {chain.depth}:{' '}
              <AddressDisplay value={chain.actor} /> {'->'}{' '}
              <AddressDisplay value={chain.target} />
              {chain.via.length > 0 && (
                <>
                  {' '}
                  via{' '}
                  {chain.via.map((v, idx) => (
                    <span key={`${v.address.address}-${idx}`}>
                      {idx > 0 && ' -> '}
                      <AddressDisplay value={v.address} />
                    </span>
                  ))}
                </>
              )}
              {chain.capabilities.length > 0 && (
                <>
                  {' '}
                  | capabilities: {chain.capabilities.join('; ')}
                </>
              )}
              {chain.systems.length > 0 && <> | systems: {chain.systems.join(', ')}</>}
              {chain.description ? <> | {chain.description}</> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ScenariosBlock(props: { scenarios: ApiPreviewCounterpartyRiskScenario[] }) {
  return (
    <div className="rounded border border-coffee-500 p-2">
      <div className="font-bold">Counterparty risk scenarios</div>
      {props.scenarios.length === 0 ? (
        <div className="mt-1 text-sm text-coffee-200">No scenarios synthesized.</div>
      ) : (
        <ul className="mt-1 list-disc pl-5">
          {props.scenarios.map((scenario, i) => (
            <li key={`${scenario.system}-${i}`}>
              <span className="font-semibold">{scenario.system}</span>: {scenario.title} | impact:{' '}
              {scenario.impact}
              {scenario.chainRefs.length > 0 && (
                <div className="text-xs text-coffee-300">
                  examples: {scenario.chainRefs.slice(0, 3).join(' | ')}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function OptionsPanel(props: {
  showOnlySelected: boolean
  setShowOnlySelected: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <div className="flex items-center justify-end gap-1 bg-coffee-600 p-0 px-2 text-right">
      <div
        className="flex cursor-pointer select-none items-center justify-center gap-1"
        onClick={() => props.setShowOnlySelected(!props.showOnlySelected)}
      >
        <Checkbox checked={props.showOnlySelected} />
        Show only selected address
      </div>
    </div>
  )
}

function PermissionsPreview(props: {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermissions }[]
  selectedAddress: string | undefined
  showOnlySelected: boolean
}) {
  return props.permissionsPerChain
    .filter(({ permissions }) =>
      applyShowOnlySelectedFilter(
        [
          ...permissions.roles.flatMap((p) => p.addresses),
          ...permissions.actors.flatMap((p) => p.addresses),
        ],
        props.selectedAddress,
        props.showOnlySelected,
      ),
    )
    .map(({ chain, permissions }) => (
      <div key={chain} className="border-b border-b-coffee-600 pb-2">
        <SectionHeader title={`Roles on ${chain}:`} />
        {permissions.roles.map((permission, idx) => {
          const isSelected = includesAddress(
            permission.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={permission.name}
              addresses={permission.addresses}
              multisigParticipants={permission.multisigParticipants}
              description={permission.description}
              isHighlighted={isSelected}
            />
          )
        })}
        <SectionHeader title={`Actors on ${chain}:`} />
        {permissions.actors.map((permission, idx) => {
          const isSelected = includesAddress(
            permission.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={permission.name}
              addresses={permission.addresses}
              multisigParticipants={permission.multisigParticipants}
              description={permission.description}
              isHighlighted={isSelected}
            />
          )
        })}
      </div>
    ))
}

function ContractsPreview(props: {
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
  selectedAddress: string | undefined
  showOnlySelected: boolean
}) {
  return props.contractsPerChain
    .filter(({ contracts }) =>
      applyShowOnlySelectedFilter(
        contracts.flatMap((c) => c.addresses),
        props.selectedAddress,
        props.showOnlySelected,
      ),
    )
    .map(({ chain, contracts }) => (
      <div key={chain} className="border-b border-b-coffee-600 pb-2">
        <SectionHeader title={`Contracts on ${chain}:`} />
        {contracts.map((contract, idx) => {
          const isSelected = includesAddress(
            contract.addresses,
            props.selectedAddress,
          )
          if (props.showOnlySelected && !isSelected) {
            return null
          }
          return (
            <PreviewItem
              key={idx}
              name={contract.name}
              addresses={contract.addresses}
              description={contract.description}
              isHighlighted={isSelected}
              upgradableBy={contract.upgradableBy}
            />
          )
        })}
      </div>
    ))
}

function PreviewItem(props: {
  name: string
  addresses: AddressFieldValue[]
  multisigParticipants?: AddressFieldValue[]
  description: string
  isHighlighted: boolean
  upgradableBy?: UpgradeabilityActor[]
}) {
  return (
    <div
      className={clsx(
        'mb-1 flex flex-col gap-2 border-l-4 p-2 pl-1',
        props.isHighlighted ? 'border-autumn-300' : 'border-transparent',
      )}
    >
      <h3 className="font-bold">{props.name}</h3>
      <ul className="list-disc pl-5 italic">
        {props.addresses.map((address, idx) => (
          <li key={idx}>
            <AddressDisplay value={address} />
          </li>
        ))}
      </ul>
      {props.multisigParticipants && (
        <div>
          <div className="p-2">Participants:</div>
          <ul className="list-disc pl-5 italic">
            {props.multisigParticipants.map((address, idx) => (
              <li key={idx}>
                <AddressDisplay value={address} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {props.description.split('\n').map((a, idx) => (
        <div key={idx} className="ml-2 whitespace-pre-wrap">
          {a}
        </div>
      ))}
      {props.upgradableBy && (
        <div className="ml-2 italic">
          <b>Can be upgraded by:</b>{' '}
          {props.upgradableBy.map((actor, idx) => (
            <span key={idx}>
              {idx > 0 && ', '}
              {actor.name} with {actor.delay} delay
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionHeader(props: { title: string }) {
  return <h2 className="p-2 font-bold text-2xl text-blue-600">{props.title}</h2>
}

function includesAddress(addresses: AddressFieldValue[], address?: string) {
  return addresses.map((address) => address.address).includes(address ?? '')
}

function applyShowOnlySelectedFilter(
  addresses: AddressFieldValue[],
  selectedAddress: string | undefined,
  showOnlySelected: boolean,
) {
  return !showOnlySelected || includesAddress(addresses, selectedAddress)
}

function groupPathsByTarget(
  permissionPathsPerChain: { chain: string; paths: ApiPreviewPermissionPath[] }[],
) {
  const grouped = new Map<
    string,
    { target: string; label: string; paths: ApiPreviewPermissionPath[] }
  >()

  for (const { paths } of permissionPathsPerChain) {
    for (const path of paths) {
      const target = path.target.address.toLowerCase()
      const label = TARGET_TOKEN_LABELS[target]
      if (!label) {
        continue
      }
      const current = grouped.get(target) ?? { target, label, paths: [] }
      current.paths.push(path)
      grouped.set(target, current)
    }
  }

  return [...grouped.values()]
}

function formatDelay(delaySeconds: number): string {
  if (delaySeconds === 0) return '0s'
  const days = Math.floor(delaySeconds / 86400)
  const hours = Math.floor((delaySeconds % 86400) / 3600)
  if (days > 0) {
    return hours > 0 ? `${days}d ${hours}h` : `${days}d`
  }
  const minutes = Math.floor(delaySeconds / 60)
  if (minutes > 0) return `${minutes}m`
  return `${delaySeconds}s`
}

function toDisplayPath(
  actor: AddressFieldValue,
  via: ApiPreviewPermissionPath['via'],
): { primary: AddressFieldValue; viaShort: AddressFieldValue[] } {
  const firstVia = via[0]
  if (!firstVia) {
    return { primary: actor, viaShort: [] }
  }

  const primary = firstVia.address
  const tail = via.slice(1).map((step) => step.address)
  const viaShort = [actor, ...tail].filter(
    (item, index, list) => {
      if (index === 0) return true
      const previous = list[index - 1]
      return previous
        ? item.address.toLowerCase() !== previous.address.toLowerCase()
        : true
    },
  )

  return { primary, viaShort }
}

function sortPermissionPaths(paths: ApiPreviewPermissionPath[]) {
  return [...paths].sort((a, b) => {
    const aDisplay = toDisplayPath(a.actor, a.via)
    const bDisplay = toDisplayPath(b.actor, b.via)
    const aUpgrade = a.permission === 'upgrade' ? 0 : 1
    const bUpgrade = b.permission === 'upgrade' ? 0 : 1
    if (aUpgrade !== bUpgrade) return aUpgrade - bUpgrade
    const aProxy = (aDisplay.primary.name ?? '').toLowerCase().includes('proxyadmin')
      ? 0
      : 1
    const bProxy = (bDisplay.primary.name ?? '').toLowerCase().includes('proxyadmin')
      ? 0
      : 1
    if (aProxy !== bProxy) return aProxy - bProxy
    return (aDisplay.primary.name ?? aDisplay.primary.address).localeCompare(
      bDisplay.primary.name ?? bDisplay.primary.address,
    )
  })
}
