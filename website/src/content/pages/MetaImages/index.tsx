import { MetaImage } from './MetaImage'
import { getMetaImageProps } from './getMetaImageProps'
import { Project } from '@l2beat/config'
import { L2Data } from '../../L2Data'

interface Props {
  l2Data: L2Data
  project?: Project
}

export function Meta(props: Props) {
  return <MetaImage {...getMetaImageProps(props.l2Data, props.project)} />
}
