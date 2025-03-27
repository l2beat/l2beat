import type { Manifest } from '../../common/Manifest'
import { FontStyles } from './FontStyles'
import { fonts } from './fonts'

export interface HeadProps {
  manifest: Manifest
  title: string
  description: string
}

export function Head(props: HeadProps) {
  return (
    <>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <FontStyles fonts={fonts} manifest={props.manifest} />
    </>
  )
}
