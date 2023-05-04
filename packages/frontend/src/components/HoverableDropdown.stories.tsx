import { range } from 'lodash'
import React, { useEffect } from 'react'

import { configureHoverableDropdown } from '../scripts/configureHoverableDropdown'
import { HoverableDropdown as HoverableDropdownComponent } from './HoverableDropdown'

export default {
  title: 'Components/HoverableDropdown',
}

export const HoverableDropdown = () => {
  useEffect(() => {
    configureHoverableDropdown()
    const hoverableDropdownToggle = document.querySelector(
      '.HoverableDropdownToggle',
    )
    hoverableDropdownToggle?.dispatchEvent(new MouseEvent('mouseenter'))
    document.body.replaceWith(document.body.cloneNode(true))
  }, [])

  return (
    <div className="p-4">
      <HoverableDropdownComponent title="Example dropdown">
        {range(4).map((i) => {
          return <div key={i}>Example dropdown item {i}</div>
        })}
      </HoverableDropdownComponent>
    </div>
  )
}
