import clsx from 'clsx'
import { useState } from 'react'
import {
  type AddressUsageSummary,
  summarizeAddressUsage,
  type UsagePlace,
  type UsageRelation,
} from './addressUsage'
import { ProjectLink } from './ProjectLink'
import { useAddressUsage } from './useAddressUsage'

const COLLAPSED_PLACE_COUNT = 12

const RELATION_STYLE: Record<UsageRelation, string> = {
  discovers: 'border-aux-cyan/60 text-aux-cyan',
  references: 'border-aux-orange/60 text-aux-orange',
  'consumes-module': 'border-coffee-500 text-coffee-300',
}

const RELATION_DESCRIPTION: Record<UsageRelation, string> = {
  discovers: 'discovers it',
  references: 'references it through a shared module',
  'consumes-module': 'uses the shared module it belongs to',
}

export function UsageDisplay(props: {
  address: string
  openedProject: string
  sourceProject: string
}) {
  const usage = useAddressUsage()

  if (usage.isPending) {
    return (
      <div className="h-3 w-full animate-breath rounded-sm bg-coffee-400/50" />
    )
  }
  if (usage.isError) {
    return <p className="text-aux-red">Could not load where it is used</p>
  }

  const summary = summarizeAddressUsage(
    usage.data,
    props.address,
    props.openedProject,
    props.sourceProject,
  )
  return (
    <div className="flex flex-col gap-1">
      <UsageHeadline summary={summary} openedProject={props.openedProject} />
      {summary.status !== 'standalone' && (
        <PlaceList
          key={props.address}
          places={summary.places}
          address={props.address}
        />
      )}
    </div>
  )
}

function UsageHeadline(props: {
  summary: AddressUsageSummary
  openedProject: string
}) {
  const { summary } = props

  if (summary.status === 'standalone') {
    return (
      <p className="text-coffee-300">
        Standalone, only{' '}
        <span className="font-bold">{props.openedProject}</span> discovers it
      </p>
    )
  }
  if (summary.status === 'duplicated') {
    return (
      <p className="text-aux-yellow">
        Also discovered in {countProjects(summary.places.length)}, a potential
        shared module
      </p>
    )
  }
  return (
    <p className="text-aux-orange">
      {summary.entrypoint === undefined
        ? 'Part of shared module '
        : 'Entrypoint of shared module '}
      <ProjectLink
        project={summary.module}
        className="font-bold hover:underline"
      >
        {summary.module}
      </ProjectLink>
      {summary.entrypoint?.name !== undefined &&
        ` (${summary.entrypoint.name})`}
      , used by {countProjects(summary.places.length)}
    </p>
  )
}

function PlaceList(props: { places: UsagePlace[]; address: string }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded
    ? props.places
    : props.places.slice(0, COLLAPSED_PLACE_COUNT)
  const hiddenCount = props.places.length - visible.length

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((place) => (
        <ProjectLink
          key={place.project}
          project={place.project}
          selectAddress={props.address}
          title={describePlace(place)}
          className={clsx(
            'rounded-sm border px-1.5 py-0.5 hover:underline',
            RELATION_STYLE[place.relation],
          )}
        >
          {place.project}
        </ProjectLink>
      ))}
      {hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="px-1.5 py-0.5 text-coffee-400 hover:text-coffee-200"
        >
          +{hiddenCount} more
        </button>
      )}
    </div>
  )
}

function describePlace(place: UsagePlace): string {
  const description = `${place.project} ${RELATION_DESCRIPTION[place.relation]}`
  return place.name === undefined
    ? description
    : `${description} as ${place.name}`
}

function countProjects(count: number): string {
  return count === 1 ? '1 other project' : `${count} other projects`
}
