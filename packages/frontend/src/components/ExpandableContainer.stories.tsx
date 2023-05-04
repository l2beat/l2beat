import { range } from 'lodash'
import React, { useEffect } from 'react'

import { configureExpandableContainer } from '../scripts/configureExpandableContainer'
import { ExpandableContainer as ExpandableContainerComponent } from './ExpandableContainer'

export default {
  title: 'Components/ExpandableContainer',
}

function Template({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => configureExpandableContainer(), [])
  return (
    <div className="mx-auto max-w-[50%]">
      <ExpandableContainerComponent className={className}>
        {children}
      </ExpandableContainerComponent>
    </div>
  )
}

export function Collapsed() {
  return (
    <Template>
      {range(4).map(() => {
        return (
          <div className="my-2">
            Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit
            sit enim ullamco qui anim ex id aliquip deserunt quis. Voluptate
            occaecat anim elit magna officia sunt. Proident irure commodo culpa
            officia nisi labore veniam esse irure minim pariatur culpa. Culpa
            exercitation amet deserunt dolor veniam dolor.
          </div>
        )
      })}
    </Template>
  )
}

export function Expanded() {
  useEffect(() => {
    document.querySelector<HTMLElement>('.ExpandableContainerButton')?.click()
  })
  return (
    <Template>
      {range(4).map(() => {
        return (
          <div className="my-2">
            Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit
            sit enim ullamco qui anim ex id aliquip deserunt quis. Voluptate
            occaecat anim elit magna officia sunt. Proident irure commodo culpa
            officia nisi labore veniam esse irure minim pariatur culpa. Culpa
            exercitation amet deserunt dolor veniam dolor.
          </div>
        )
      })}
    </Template>
  )
}

export function WithCustomMaxHeight() {
  return (
    <Template className="max-h-20">
      {range(4).map(() => {
        return (
          <div className="my-2">
            Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit
            sit enim ullamco qui anim ex id aliquip deserunt quis. Voluptate
            occaecat anim elit magna officia sunt. Proident irure commodo culpa
            officia nisi labore veniam esse irure minim pariatur culpa. Culpa
            exercitation amet deserunt dolor veniam dolor.
          </div>
        )
      })}
    </Template>
  )
}

export function WithoutButton() {
  return (
    <Template>
      <div className="my-2">
        Sit Lorem est ad ut est do consectetur. Ipsum mollit pariatur sit sit
        enim ullamco qui anim ex id aliquip deserunt quis. Voluptate occaecat
        anim elit magna officia sunt.
      </div>
    </Template>
  )
}
