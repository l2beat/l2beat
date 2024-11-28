import { Page } from '../components/Page'

interface Props {
  projects: {
    id: string
    name: string
    currentTps: number
    maxTps: number
  }[]
}

export function ActivityPage(props: Props) {
  return (
    <Page title="Activity - Demo">
      <table>
        <thead>
          <tr>
            <td>#</td>
            <td>Name</td>
            <td>TPS</td>
            <td>Max TPS</td>
          </tr>
        </thead>
        <tbody>
          {props.projects.map((project, i) => (
            <tr key={project.id}>
              <td>{i + 1}</td>
              <td>{project.name}</td>
              <td>{project.currentTps}</td>
              <td>{project.maxTps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Page>
  )
}
