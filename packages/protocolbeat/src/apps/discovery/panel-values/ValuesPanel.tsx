import { useParams } from 'react-router-dom'
import type { ApiAddressEntry, ApiProjectContract } from '../../../api/types'
import { ActionNeededState } from '../../../components/ActionNeededState'
import { AddressIcon } from '../../../components/AddressIcon'
import { ErrorState } from '../../../components/ErrorState'
import { LoadingState } from '../../../components/LoadingState'
import { IS_READONLY } from '../../../config/readonly'
import { IconShape } from '../../../icons/IconShape'
import { useConfigModels } from '../hooks/useConfigModels'
import { useModelUtils } from '../hooks/useModelUtils'
import { useProjectData } from '../hooks/useProjectData'
import { AbiDisplay } from './AbiDisplay'
import { AddressDisplay } from './AddressDisplay'
import { ContractConfigDialog } from './contract-config-dialog/ContractConfigDialog'
import { FieldDisplay } from './Field'
import { FieldTag } from './FieldTag'
import { Folder } from './Folder'
import { TemplateDialog } from './template-dialog/TemplateDialog'

export function ValuesPanel() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Cannot use component outside of project page!')
  }

  const { selected, isError, isPending } = useProjectData()

  if (isPending) {
    return <LoadingState />
  }
  if (isError) {
    return <ErrorState />
  }

  return (
    <div className="h-full w-full overflow-x-auto">
      {!selected && <ActionNeededState message="Select a contract" />}
      {selected && (
        <Display
          project={project}
          selected={selected}
          blockNumber={selected.blockNumber}
        />
      )}
    </div>
  )
}

function Display({
  project,
  blockNumber,
  selected,
}: {
  project: string
  selected: ApiProjectContract | ApiAddressEntry
  blockNumber: number
}) {
  const { configModel, templateModel, canModify } = useConfigModels()
  const templateIgnoredMethods = templateModel.ignoreMethods ?? []
  const configIgnoredMethods = configModel.ignoreMethods ?? []
  const ignoredMethods = [
    ...new Set(configIgnoredMethods.concat(templateIgnoredMethods)),
  ]
  const chain = selected.chain

  const addresses = getAddressesToCopy(selected)

  const templateDialog = addresses && canAddShape(selected) && !IS_READONLY && (
    <TemplateDialog.Root
      key={`${project}-${selected.address}`}
      project={project}
      selectedName={selected.name}
    >
      <TemplateDialog.Trigger>
        <IconShape />
      </TemplateDialog.Trigger>
      <TemplateDialog.Body
        addresses={addresses}
        project={project}
        chain={chain}
        blockNumber={blockNumber}
      />
    </TemplateDialog.Root>
  )

  const contractConfigDialog = canModify && <ContractConfigDialog />

  return (
    <>
      <div id={selected.address} className="mb-2 px-5 text-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 font-bold">
            <AddressIcon type={selected.type} />
            {selected.name ?? 'Unknown'}
            {selected.type === 'Unverified' && (
              <span className="text-aux-red"> (Unverified)</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {templateDialog}
            {contractConfigDialog}
          </div>
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
                      <Badge>+ Criteria</Badge>
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
                  <p className="text-aux-teal">{role}</p>
                ))}
              </div>
            </WithHeadline>
          </div>
        )}

        <Description />
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
        <Category />
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
            {ignoredMethods.map((method, i) => (
              <FieldDisplay
                key={i}
                field={{
                  name: method,
                  value: { type: 'empty' },
                }}
              />
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

function Badge(props: { children: React.ReactNode }) {
  return (
    <span
      className={
        'flex max-w-fit items-center justify-center gap-1 rounded-md bg-aux-yellow/10 px-1 py-0.5 text-aux-yellow text-xs'
      }
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

function Category() {
  const { configModel, templateModel, isPending } = useConfigModels()
  const category = configModel.category ?? templateModel.category

  if (isPending) {
    return (
      <WithHeadline headline="Category">
        <SkeletonLine />
      </WithHeadline>
    )
  }

  if (!category) {
    return null
  }

  return (
    <WithHeadline headline="Category">
      <div className="flex items-center gap-1">
        {configModel.category && (
          <FieldTag source="config">{configModel.category}</FieldTag>
        )}
        {templateModel.category && (
          <FieldTag source="template">{templateModel.category}</FieldTag>
        )}
      </div>
    </WithHeadline>
  )
}

function Description() {
  const { configModel, templateModel, isPending } = useConfigModels()
  const { interpolateDescription } = useModelUtils()
  const description = configModel.description ?? templateModel.description

  if (isPending) {
    return (
      <WithHeadline headline="Description">
        <SkeletonLine />
      </WithHeadline>
    )
  }

  if (!description) {
    return null
  }

  return (
    <WithHeadline headline="Description">
      <p className="font-serif text-sm italic">
        {interpolateDescription(description)}
      </p>
    </WithHeadline>
  )
}

function SkeletonLine() {
  return <div className="h-3 w-full animate-breath rounded bg-coffee-400/50" />
}
