import { l2Data } from '../data'
export function getProjects() {
  return Object.keys(l2Data.l2s).map((slug) => slug.toLowerCase())
}
