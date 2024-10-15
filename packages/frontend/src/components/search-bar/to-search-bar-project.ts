import {
  type Bridge,
  type DaLayer,
  type Layer2,
  type Layer3,
} from '@l2beat/config'

export function toSearchBarProject(
  project: Layer2 | Layer3 | Bridge | DaLayer,
) {
  return {
    id: getId(project),
    name: project.display.name,
    iconUrl: `/icons/${project.display.slug}.png`,
    href: getHref(project),
  }
}

function getId(project: Layer2 | Layer3 | Bridge | DaLayer) {
  if (project.type === 'DaLayer') {
    return `${project.id}-${project.bridges[0]!.id}`
  }
  return project.id
}

function getHref(project: Layer2 | Layer3 | Bridge | DaLayer) {
  if (project.type === 'layer2' || project.type === 'layer3') {
    return `/scaling/projects/${project.display.slug}`
  }
  if (project.type === 'bridge') {
    return `/bridges/projects/${project.display.slug}`
  }
  return `/data-availability/projects/${project.display.slug}/${project.bridges[0]!.display.slug}`
}
