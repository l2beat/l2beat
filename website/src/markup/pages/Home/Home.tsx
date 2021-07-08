import { Project } from '@l2beat/config'
import { Page } from '../../common/Page'
import { slug } from '../../utils/slug'

interface Props {
  projects: Project[]
}

export function Home({ projects }: Props) {
  return (
    <Page title="L2BEAT – The state of the layer two ecosystem">
      <div>
        <h1>Home</h1>
        <p>Sweet home!</p>
        <ol>
          {projects.map((project, i) => (
            <li key={i}>
              <a href={`/project/${slug(project.name)}`}>{project.name}</a>
            </li>
          ))}
        </ol>
      </div>
    </Page>
  )
}
