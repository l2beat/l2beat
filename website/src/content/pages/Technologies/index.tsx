import { TechnologiesPage } from './TechnologiesPage'
import { getTechnologiesPageProps } from './getTechnologiesPageProps'

export function Technologies() {
  return <TechnologiesPage {...getTechnologiesPageProps()} />
}
