import React from 'react'
import { Folder } from '../panel-values/Folder'
import { PermissionsDisplay } from './PermissionsDisplay'

interface Props {
  selected: any
  abis: any[]
}

export function ValuesPanelExtensions({ selected, abis }: Props) {
  if (!('abis' in selected) || !selected.abis.length) {
    return null
  }

  return (
    <Folder title="Permissions" collapsed>
      <PermissionsDisplay abis={selected.abis} />
    </Folder>
  )
}