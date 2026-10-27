import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { Title } from '../../components/Title'
import { IS_READONLY } from '../../config/readonly'
import { findSelected } from '../../utils/findSelected'
import { AgentContextReporter } from './agent/AgentContextReporter'
import { useProjectQueryOptions } from './hooks/projectQuery'
import { MultiView } from './multi-view/MultiView'
import { usePanelStore } from './store/panel-store'

export function ProjectPage() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }

  return (
    <>
      <Title title={`DiscoUI - ${project}`} />
      <SelectFirstWhenMissing project={project} />
      <MultiView project={project} />
      {!IS_READONLY && <AgentContextReporter project={project} />}
    </>
  )
}

// Subscribes to the selection on its own, so a click does not rerender the
// whole page.
function SelectFirstWhenMissing(props: { project: string }) {
  const response = useQuery(useProjectQueryOptions(props.project))
  const select = usePanelStore((state) => state.select)
  const selectedAddresses = usePanelStore((state) => state.selected)
  useEffect(() => {
    if (response.data) {
      // The selection as it is now: an effect earlier in the same commit, like
      // an agent step, may have replaced the one this render saw.
      const current = usePanelStore.getState().selected
      const currentlySelectedStillExists = findSelected(
        response.data.entries,
        current[0],
      )
      if (!currentlySelectedStillExists) {
        const first = response.data.entries[0]?.initialContracts[0]?.address
        select(first ? [first] : [])
      }
    }
  }, [response.data, select, selectedAddresses])
  return null
}
