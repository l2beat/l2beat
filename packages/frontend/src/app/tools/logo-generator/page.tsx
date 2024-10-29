import { bridges, layer2s, layer3s } from '@l2beat/config'
import { LogoGenerator } from './components/logo-generator'

export default function Page() {
  const projects = [...layer2s, ...layer3s, ...bridges]

  return (
    <LogoGenerator
      projects={projects.map((l2) => ({
        name: l2.display.name,
        type: l2.type,
        slug: l2.display.slug,
        isUpcoming: l2.isUpcoming,
        isArchived: l2.isArchived,
      }))}
    />
  )
}
