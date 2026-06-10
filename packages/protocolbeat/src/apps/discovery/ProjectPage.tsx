import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Title } from '../../components/Title'
import { findSelected } from '../../utils/findSelected'
import { useProjectQueryOptions } from './hooks/projectQuery'
import { MultiView } from './multi-view/MultiView'
import { usePanelStore } from './store/panel-store'

export function ProjectPage() {
  const { project } = useParams()
  if (!project) {
    throw new Error('Missing project!')
  }
  const response = useQuery(useProjectQueryOptions(project))
  const select = usePanelStore((state) => state.select)
  const selectedAddress = usePanelStore((state) => state.selected)
  useEffect(() => {
    if (response.data) {
      const currentlySelectedStillExists = findSelected(
        response.data.entries,
        selectedAddress,
      )
      if (!currentlySelectedStillExists) {
        const first = response.data.entries[0]?.initialContracts[0]?.address
        select(first)
      }
    }
  }, [response.data, select, selectedAddress])

  return (
    <>
      <Title title={`DiscoUI - ${project}`} />
      <MultiView project={project} />
    </>
  )
}
