import { Project } from '@l2beat/config'
import React from 'react'

import { L2Data } from '../../L2Data'
import { getMetaImageProps } from './getMetaImageProps'
import { MetaImage } from './MetaImage'

interface Props {
  l2Data: L2Data
  project?: Project
}

export function Meta(props: Props) {
  return <MetaImage {...getMetaImageProps(props.l2Data, props.project)} />
}
