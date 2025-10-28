import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getProject } from '../../../api/api'
import type { ApiAddressEntry, ApiProjectContract } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { AddressIcon } from '../../../components/AddressIcon'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { findSelected } from '../../../utils/findSelected'
import { usePanelStore } from '../store/panel-store'
import { AbiDisplay } from './AbiDisplay'
import { AddressDisplay } from './AddressDisplay'
import { FieldDisplay } from './Field'
import { Folder } from './Folder'
import { TemplateDialog } from './template-dialog/TemplateDialog'

export function ValuesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const response = useQuery({
    queryKey: ['projects', project],
    queryFn: () => getProject(project),
  })
  const selectedAddress = usePanelStore((state) => state.selected)

  if (response.isPending) {
    return <LoadingState />
  }
  if (response.isError) {
    return <ErrorState />
  }

  const selected = findSelected(response.data.entries, selectedAddress)

  return (
    <div className="h-full w-full overflow-x-auto">
      {!selected && <ActionNeededState message="Select a contract" />}
      {selected && (
        <Display selected={selected} blockNumber={selected.blockNumber} />
      )}
    </div>
  )
}

function Display({
  selected,
  blockNumber,
}: {
  selected: ApiProjectContract | ApiAddressEntry
  blockNumber: number
}) {
  const chain = selected.chain

  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }
  const addresses = getAddressesToCopy(selected)

  const dialog = addresses && canAddShape(selected) && !IS_READONLY && (
    <TemplateDialog.Root
      key={`${project}-${selected.address}`}
      project={project}
      selectedName={selected.name}
    >
      <TemplateDialog.Trigger>Add shape</TemplateDialog.Trigger>
      <TemplateDialog.Body
        addresses={addresses}
        project={project}
        chain={chain}
        blockNumber={blockNumber}
      />
    </TemplateDialog.Root>
  )

  return (
    <>
      <div id={selected.address} className="mb-2 px-5 text-lg">
        <div className="flex flex-wrap items-center">
          <div className="flex items-center gap-1 font-bold">
            <AddressIcon type={selected.type} />
            {selected.name ?? 'Unknown'}
            {selected.type === 'Unverified' && (
              <span className="text-aux-red"> (Unverified)</span>
            )}
          </div>
          {dialog}
        </div>
        <WithHeadline headline="Address">
          <AddressDisplay
            simplified
            value={{
              type: 'address',
              address: selected.address,
              addressType: selected.type,
            }}
          />
        </WithHeadline>
        {'proxyType' in selected && selected.proxyType && (
          <WithHeadline headline="Proxy Type">
            <p className="text-aux-cyan">{selected.proxyType}</p>
          </WithHeadline>
        )}
        {'template' in selected && selected.template && (
          <>
            <WithHeadline headline="Template">
              <div className="flex flex-col gap-0.5 text-aux-orange">
                <span className="inline font-bold">{selected.template.id}</span>
              </div>
            </WithHeadline>
            {selected.template.shape && (
              <WithHeadline headline="Shape">
                <div className="flex flex-col gap-0.5 text-aux-orange">
                  <span className="flex items-center gap-1">
                    {selected.template.shape.name}
                    {selected.template.shape.hasCriteria && (
                      <Badge className="bg-aux-yellow/10 px-1 py-0.5 text-aux-yellow">
                        + Criteria
                      </Badge>
                    )}
                  </span>
                </div>
              </WithHeadline>
            )}
          </>
        )}

        {selected.roles.length > 0 && (
          <div className="font-mono text-xs">
            <WithHeadline headline="Roles">
              <div className="flex gap-1">
                {selected.roles.map((role) => (
                  <p className="text-aux-teal ">{role}</p>
                ))}
              </div>
            </WithHeadline>
          </div>
        )}

        {selected.description && (
          <WithHeadline headline="Description">
            <p className="font-serif text-sm italic">{selected.description}</p>
          </WithHeadline>
        )}
        {selected.isReachable && (
          <WithHeadline headline="Reachable">
            <p className="text-aux-teal">Yes</p>
          </WithHeadline>
        )}
        {!selected.isReachable && (
          <WithHeadline headline="Reachable">
            <p className="text-coffee-200/40">No</p>
          </WithHeadline>
        )}
      </div>
      {'implementationNames' in selected && selected.implementationNames && (
        <Folder title="Implementation names" collapsed={true}>
          <div className="overflow-x-auto bg-coffee-900 px-5 py-2 font-mono text-sm">
            {Object.entries(selected.implementationNames).map(
              ([key, value]) => (
                <div key={key} className="mb-1 flex items-center gap-2">
                  <span className="text-coffee-400">{key}:</span>
                  <span className="text-aux-cyan">{value}</span>
                </div>
              ),
            )}
          </div>
        </Folder>
      )}

      {selected.referencedBy.length > 0 && (
        <Folder title="Referenced by">
          <ol className="overflow-x-auto bg-coffee-900 py-0.5 pl-5">
            {selected.referencedBy.map((value) => (
              <li key={value.address}>
                <AddressDisplay value={value} />
                <div className="mt-1 mb-2 ml-4 text-xs">
                  {value.fieldNames.map((fieldName, i) => (
                    <span
                      key={i}
                      className="mr-2 inline-block rounded bg-coffee-800 px-1.5 py-0.5"
                    >
                      {fieldName}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Folder>
      )}
      {'fields' in selected && selected.fields.length > 0 && (
        <Folder title="Fields">
          <ol>
            {selected.fields.map((field, i) => (
              <FieldDisplay key={i} field={field} />
            ))}
          </ol>
        </Folder>
      )}
      {'abis' in selected && selected.abis.length > 0 && (
        <Folder title="ABI" collapsed>
          <AbiDisplay abis={selected.abis} />
        </Folder>
      )}
    </>
  )
}

function getAddressesToCopy(selected: ApiProjectContract | ApiAddressEntry) {
  const addresses = findAddressToCopy(selected)

  if (!addresses) {
    return
  }
  // biome-ignore lint/style/noNonNullAssertion: it's there
  return addresses.map((a) => a.split(':')[1]!)
}

function findAddressToCopy(
  selected: ApiProjectContract | ApiAddressEntry,
): string[] {
  const hasFields = 'fields' in selected && selected.fields.length > 0

  if (!hasFields) {
    return [selected.address]
  }

  const implementations = selected.fields.find(
    (field) => field.name === '$implementation',
  )

  if (!implementations) {
    return [selected.address]
  }

  if (implementations.value.type === 'address') {
    return [implementations.value.address]
  }

  if (implementations.value.type === 'array') {
    // diamonds
    return implementations.value.values
      .filter((v) => v.type === 'address')
      .map((v) => v.address)
  }

  return [selected.address]
}

function canAddShape(selected: ApiProjectContract | ApiAddressEntry) {
  if (
    selected.type === 'Unverified' &&
    'proxyType' in selected &&
    selected.proxyType !== 'immutable'
  ) {
    return true
  }

  return (
    selected.type !== 'Unverified' &&
    selected.type !== 'Unknown' &&
    selected.type !== 'EOA'
  )
}

function Badge(props: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={`flex max-w-fit items-center justify-center gap-1 rounded-md px-2 py-0.5 text-xs ${props.className}`}
    >
      {props.children}
    </span>
  )
}

function WithHeadline(props: { headline: string; children: React.ReactNode }) {
  return (
    <div className="mb-1 flex flex-col overflow-x-auto font-mono text-xs">
      <span className="text-coffee-400">{props.headline}</span>
      {props.children}
    </div>
  )
}
