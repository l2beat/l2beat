import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getGovernance, getProject, updateGovernance } from '../../../api/api'
import type {
  GovernanceConfig,
  GovernanceDuration,
  GovernanceDurationUnit,
  GovernanceVoteExecution,
} from '../../../api/types'
import { IS_READONLY } from '../../../config/readonly'
import { formatDelay } from '../../../defidisco/scoringShared'
import { addressesEqual } from './addressUtils'

interface ReviewGovernanceEditorProps {
  project: string
}

const FRAMEWORK_PRESETS = [
  'Aragon',
  'Snapshot',
  'Compound Governor Bravo',
  'OpenZeppelin Governor',
  'Custom',
]

const VOTING_PROCESS_MAX = 150

const GOVERNANCE_DURATION_UNITS: GovernanceDurationUnit[] = [
  'seconds',
  'blocks',
  'minutes',
  'hours',
  'days',
]

// Mirror of governanceCompiler.unitToSecondsFactor — keep in sync.
function unitToSecondsFactor(unit: GovernanceDurationUnit | undefined): number {
  switch (unit) {
    case 'blocks':
      return 12
    case 'minutes':
      return 60
    case 'hours':
      return 3600
    case 'days':
      return 86400
    default:
      return 1
  }
}

const DEFAULT_GOVERNANCE: GovernanceConfig = {
  framework: '',
  voteExecution: 'onchain',
  votingUnit: '',
  proposalRequirements: '',
  votingProcess: '',
  proposalPeriod: { kind: 'none' },
  executionDelay: { kind: 'none' },
}

interface ContractInfo {
  address: string
  name: string
}

interface NumericField {
  name: string
  value: string
}

export function ReviewGovernanceEditor({
  project,
}: ReviewGovernanceEditorProps) {
  const queryClient = useQueryClient()

  const { data: projectData } = useQuery({
    queryKey: ['project', project],
    queryFn: () => getProject(project),
  })

  const { data: governance = null, isLoading } = useQuery({
    queryKey: ['governance', project],
    queryFn: () => getGovernance(project),
  })

  const mutation = useMutation({
    mutationFn: (next: GovernanceConfig | null) =>
      updateGovernance(project, next),
    onMutate: async (next) => {
      await queryClient.cancelQueries({ queryKey: ['governance', project] })
      queryClient.setQueryData(['governance', project], next)
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', project] })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governance', project] })
    },
  })

  const availableContracts = useMemo<ContractInfo[]>(() => {
    if (!projectData?.entries) return []
    const contracts: ContractInfo[] = []
    projectData.entries.forEach((entry) => {
      entry.initialContracts.forEach((c) => {
        contracts.push({
          address: c.address,
          name: c.name || 'Unknown Contract',
        })
      })
      entry.discoveredContracts.forEach((c) => {
        if (
          !contracts.some((existing) =>
            addressesEqual(existing.address, c.address),
          )
        ) {
          contracts.push({
            address: c.address,
            name: c.name || 'Unknown Contract',
          })
        }
      })
    })
    return contracts
  }, [projectData])

  const getNumericFields = (contractAddr: string): NumericField[] => {
    if (!projectData?.entries) return []
    for (const entry of projectData.entries) {
      const allContracts = [
        ...entry.initialContracts,
        ...entry.discoveredContracts,
      ]
      const contract = allContracts.find((c) =>
        addressesEqual(c.address, contractAddr),
      )
      if (contract?.fields) {
        return contract.fields
          .filter((field) => field.value?.type === 'number')
          .map((field) => ({
            name: field.name,
            value: field.value?.type === 'number' ? field.value.value : '',
          }))
      }
    }
    return []
  }

  const resolveFieldRefSeconds = (
    contractAddress: string,
    fieldName: string,
    unit: GovernanceDurationUnit | undefined,
  ): { seconds: number; isResolved: boolean; error?: string } => {
    if (!projectData?.entries) {
      return { seconds: 0, isResolved: false, error: 'Project data not loaded' }
    }
    for (const entry of projectData.entries) {
      const allContracts = [
        ...entry.initialContracts,
        ...entry.discoveredContracts,
      ]
      const contract = allContracts.find((c) =>
        addressesEqual(c.address, contractAddress),
      )
      if (contract?.fields) {
        const field = contract.fields.find((f) => f.name === fieldName)
        if (field?.value?.type === 'number') {
          const raw = Number.parseInt(field.value.value, 10)
          if (!Number.isNaN(raw)) {
            return {
              seconds: raw * unitToSecondsFactor(unit),
              isResolved: true,
            }
          }
        }
      }
    }
    return { seconds: 0, isResolved: false, error: 'Could not resolve field' }
  }

  const getContractName = (address: string): string => {
    const info = availableContracts.find((c) =>
      addressesEqual(c.address, address),
    )
    return info?.name ?? address.slice(0, 10) + '...'
  }

  const isOnchain = governance?.voteExecution === 'onchain'

  const applyGovernance = (
    updater: (prev: GovernanceConfig) => GovernanceConfig,
  ) => {
    mutation.mutate(updater(governance ?? DEFAULT_GOVERNANCE))
  }

  const removeGovernance = () => {
    mutation.mutate(null)
  }

  if (isLoading) {
    return <div className="text-coffee-200 text-xs">Loading governance…</div>
  }

  if (!governance) {
    return (
      <div className="flex flex-col items-start gap-3 rounded border border-coffee-700 bg-coffee-800 p-4">
        <h3 className="font-bold text-autumn-300">Governance</h3>
        <p className="text-coffee-200 text-xs">
          Describe this protocol's governance system (framework, voting unit,
          proposal period, execution delay). When the vote execution is
          on-chain, the period and delay can reference numeric fields from
          discovered contracts so they stay in sync with reality.
        </p>
        {!IS_READONLY && (
          <button
            onClick={() => mutation.mutate({ ...DEFAULT_GOVERNANCE })}
            className="rounded bg-autumn-300 px-3 py-1 text-xs font-medium text-coffee-900 hover:bg-autumn-200"
          >
            Enable governance section
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-autumn-300">Governance</h3>
        {!IS_READONLY && (
          <button
            onClick={removeGovernance}
            className="rounded bg-coffee-700 px-2 py-1 text-coffee-200 text-xs hover:bg-coffee-600"
          >
            Remove section
          </button>
        )}
      </div>

      {/* Framework */}
      <FieldRow label="Framework">
        <input
          type="text"
          list="governance-framework-presets"
          value={governance.framework}
          disabled={IS_READONLY}
          placeholder="e.g. Compound Governor Bravo"
          onChange={(e) =>
            applyGovernance((prev) => ({ ...prev, framework: e.target.value }))
          }
          className="w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-coffee-100 text-xs focus:border-autumn-300 focus:outline-none disabled:opacity-60"
        />
        <datalist id="governance-framework-presets">
          {FRAMEWORK_PRESETS.map((p) => (
            <option key={p} value={p} />
          ))}
        </datalist>
      </FieldRow>

      {/* Vote execution */}
      <FieldRow label="Vote Execution">
        <div className="flex gap-2">
          {(['onchain', 'offchain'] as GovernanceVoteExecution[]).map(
            (mode) => (
              <button
                key={mode}
                disabled={IS_READONLY}
                onClick={() =>
                  applyGovernance((prev) => ({ ...prev, voteExecution: mode }))
                }
                className={`rounded px-3 py-1 text-xs font-medium ${
                  governance.voteExecution === mode
                    ? 'bg-autumn-300 text-coffee-900'
                    : 'bg-coffee-700 text-coffee-200 hover:bg-coffee-600'
                } disabled:opacity-60`}
              >
                {mode === 'onchain' ? 'On-chain' : 'Off-chain'}
              </button>
            ),
          )}
        </div>
      </FieldRow>

      {/* Voting unit */}
      <FieldRow label="Voting Unit">
        <input
          type="text"
          value={governance.votingUnit}
          disabled={IS_READONLY}
          placeholder="e.g. COMP token, veCRV, 1p1v"
          onChange={(e) =>
            applyGovernance((prev) => ({ ...prev, votingUnit: e.target.value }))
          }
          className="w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-coffee-100 text-xs focus:border-autumn-300 focus:outline-none disabled:opacity-60"
        />
      </FieldRow>

      {/* Proposal requirements */}
      <FieldRow label="Proposal Requirements">
        <textarea
          value={governance.proposalRequirements}
          disabled={IS_READONLY}
          rows={3}
          placeholder="Who can make a proposal? e.g. 100k COMP delegated, or any address after approval"
          onChange={(e) =>
            applyGovernance((prev) => ({
              ...prev,
              proposalRequirements: e.target.value,
            }))
          }
          className="w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-coffee-100 text-xs focus:border-autumn-300 focus:outline-none disabled:opacity-60"
        />
      </FieldRow>

      {/* Voting process */}
      <FieldRow
        label={`Voting Process (${(governance.votingProcess ?? '').length}/${VOTING_PROCESS_MAX})`}
      >
        <textarea
          value={governance.votingProcess ?? ''}
          disabled={IS_READONLY}
          rows={2}
          maxLength={VOTING_PROCESS_MAX}
          placeholder="1-2 sentences describing the voting process (e.g. quorum, voting mechanism, timelock)"
          onChange={(e) =>
            applyGovernance((prev) => ({
              ...prev,
              votingProcess: e.target.value.slice(0, VOTING_PROCESS_MAX),
            }))
          }
          className="w-full rounded border border-coffee-600 bg-coffee-800 px-2 py-1 text-coffee-100 text-xs focus:border-autumn-300 focus:outline-none disabled:opacity-60"
        />
      </FieldRow>

      {/* Proposal period */}
      <FieldRow label="Proposal Period">
        <DurationPicker
          value={governance.proposalPeriod}
          onChange={(next) =>
            applyGovernance((prev) => ({ ...prev, proposalPeriod: next }))
          }
          allowFieldRef={isOnchain}
          availableContracts={availableContracts}
          getNumericFields={getNumericFields}
          resolveFieldRefSeconds={resolveFieldRefSeconds}
          getContractName={getContractName}
        />
      </FieldRow>

      {/* Execution delay */}
      <FieldRow label="Execution Delay">
        <DurationPicker
          value={governance.executionDelay}
          onChange={(next) =>
            applyGovernance((prev) => ({ ...prev, executionDelay: next }))
          }
          allowFieldRef={isOnchain}
          availableContracts={availableContracts}
          getNumericFields={getNumericFields}
          resolveFieldRefSeconds={resolveFieldRefSeconds}
          getContractName={getContractName}
        />
      </FieldRow>
    </div>
  )
}

function FieldRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-coffee-300 text-xs">{label}</label>
      {children}
    </div>
  )
}

interface DurationPickerProps {
  value: GovernanceDuration
  onChange: (next: GovernanceDuration) => void
  allowFieldRef: boolean
  availableContracts: ContractInfo[]
  getNumericFields: (contractAddr: string) => NumericField[]
  resolveFieldRefSeconds: (
    contractAddress: string,
    fieldName: string,
    unit: GovernanceDurationUnit | undefined,
  ) => { seconds: number; isResolved: boolean; error?: string }
  getContractName: (address: string) => string
}

function DurationPicker({
  value,
  onChange,
  allowFieldRef,
  availableContracts,
  getNumericFields,
  resolveFieldRefSeconds,
  getContractName,
}: DurationPickerProps) {
  const kind = value.kind
  // When fieldRef is disallowed but the current value is fieldRef, silently preserve it in UI —
  // show it read-only with a hint, so toggling back to on-chain restores the picker.
  const showFieldRefDisabled = !allowFieldRef && kind === 'fieldRef'

  return (
    <div className="rounded border border-coffee-600 bg-coffee-800 p-2">
      <div className="mb-2 flex gap-2">
        {allowFieldRef && (
          <ModeButton
            active={kind === 'fieldRef'}
            onClick={() =>
              onChange(
                kind === 'fieldRef'
                  ? value
                  : {
                      kind: 'fieldRef',
                      ref: { contractAddress: '', fieldName: '' },
                    },
              )
            }
          >
            Contract field
          </ModeButton>
        )}
        <ModeButton
          active={kind === 'fixed'}
          onClick={() =>
            onChange(kind === 'fixed' ? value : { kind: 'fixed', value: '' })
          }
        >
          Fixed text
        </ModeButton>
        <ModeButton
          active={kind === 'none'}
          onClick={() => onChange({ kind: 'none' })}
        >
          None
        </ModeButton>
      </div>

      {value.kind === 'fieldRef' && !showFieldRefDisabled && (
        <FieldRefEditor
          value={value}
          onChange={onChange}
          availableContracts={availableContracts}
          getNumericFields={getNumericFields}
          resolveFieldRefSeconds={resolveFieldRefSeconds}
          getContractName={getContractName}
        />
      )}

      {showFieldRefDisabled && (
        <p className="text-coffee-400 text-xs">
          Contract field refs are only active for on-chain vote execution.
          Current value preserved but inactive.
        </p>
      )}

      {kind === 'fixed' && (
        <input
          type="text"
          value={value.value}
          disabled={IS_READONLY}
          placeholder='e.g. "3 days" or "~48 hours (configurable)"'
          onChange={(e) => onChange({ kind: 'fixed', value: e.target.value })}
          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs focus:border-autumn-300 focus:outline-none disabled:opacity-60"
        />
      )}

      {kind === 'none' && (
        <p className="text-coffee-400 text-xs">Not applicable.</p>
      )}
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      disabled={IS_READONLY}
      onClick={onClick}
      className={`rounded px-2 py-0.5 text-xs font-medium ${
        active
          ? 'bg-autumn-300 text-coffee-900'
          : 'bg-coffee-700 text-coffee-200 hover:bg-coffee-600'
      } disabled:opacity-60`}
    >
      {children}
    </button>
  )
}

function FieldRefEditor({
  value,
  onChange,
  availableContracts,
  getNumericFields,
  resolveFieldRefSeconds,
  getContractName,
}: {
  value: Extract<GovernanceDuration, { kind: 'fieldRef' }>
  onChange: (next: GovernanceDuration) => void
  availableContracts: ContractInfo[]
  getNumericFields: (contractAddr: string) => NumericField[]
  resolveFieldRefSeconds: (
    contractAddress: string,
    fieldName: string,
    unit: GovernanceDurationUnit | undefined,
  ) => { seconds: number; isResolved: boolean; error?: string }
  getContractName: (address: string) => string
}) {
  const { contractAddress, fieldName, unit } = value.ref
  const fields = contractAddress ? getNumericFields(contractAddress) : []
  const resolved =
    contractAddress && fieldName
      ? resolveFieldRefSeconds(contractAddress, fieldName, unit)
      : null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-coffee-400 text-[10px] uppercase">
          Contract
        </label>
        <select
          value={contractAddress}
          disabled={IS_READONLY}
          onChange={(e) =>
            onChange({
              kind: 'fieldRef',
              ref: {
                contractAddress: e.target.value,
                fieldName: '',
                unit,
              },
            })
          }
          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
        >
          <option value="">Select a contract...</option>
          {availableContracts.map((c) => (
            <option key={c.address} value={c.address}>
              {c.name} ({c.address.slice(0, 10)}...)
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-coffee-400 text-[10px] uppercase">
          Numeric Field
        </label>
        <select
          value={fieldName}
          disabled={IS_READONLY || !contractAddress}
          onChange={(e) =>
            onChange({
              kind: 'fieldRef',
              ref: { contractAddress, fieldName: e.target.value, unit },
            })
          }
          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs disabled:opacity-50"
        >
          <option value="">Select a field...</option>
          {fields.map((f) => (
            <option key={f.name} value={f.name}>
              {f.name} (value: {f.value})
            </option>
          ))}
        </select>
        {contractAddress && fields.length === 0 && (
          <p className="text-coffee-400 text-xs">
            No numeric fields found in this contract.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-coffee-400 text-[10px] uppercase">Unit</label>
        <select
          value={unit ?? 'seconds'}
          disabled={IS_READONLY}
          onChange={(e) =>
            onChange({
              kind: 'fieldRef',
              ref: {
                contractAddress,
                fieldName,
                unit: e.target.value as GovernanceDurationUnit,
              },
            })
          }
          className="w-full rounded border border-coffee-600 bg-coffee-700 px-2 py-1 text-coffee-100 text-xs"
        >
          {GOVERNANCE_DURATION_UNITS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <p className="text-coffee-400 text-[10px]">
          Raw on-chain value's unit. 'blocks' assumes 12s Ethereum block time.
        </p>
      </div>

      {resolved && (
        <div className="rounded border border-coffee-700 bg-coffee-900 px-2 py-1 text-xs">
          {resolved.isResolved ? (
            <span className="text-aux-green">
              Resolved: <strong>{formatDelay(resolved.seconds)}</strong> from{' '}
              <span className="font-mono text-coffee-300">{fieldName}</span> on{' '}
              {getContractName(contractAddress)}
            </span>
          ) : (
            <span className="text-aux-red">Error: {resolved.error}</span>
          )}
        </div>
      )}
    </div>
  )
}
