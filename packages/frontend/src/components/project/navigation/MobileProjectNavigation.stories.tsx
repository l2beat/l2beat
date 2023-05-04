import { range } from 'lodash'
import React, { useEffect } from 'react'

import { ScalingDetailsSection } from '../../../pages/scaling-projects/props/getProjectDetails'
import { configureMobileProjectNavigation } from '../../../scripts/section-navigation/configureMobileProjectNavigation'
import { MOBILE_PROJECT_NAVIGATION_IDS } from './ids'
import { MobileProjectNavigation } from './MobileProjectNavigation'

export default {
  title: 'Components/Project/Navigation/MobileProjectNavigation',
}

const sections: ScalingDetailsSection[] = range(10).map(() => ({
  type: 'DescriptionSection',
  props: {
    id: 'example',
    title: 'Example',
    issueLink:
      'https://github.com/l2beat/l2beat/issues/new?title=Problem: zkSync Era project page&labels=website',
    editLink:
      'https://github.com/l2beat/l2beat/edit/master/packages/config/src/layer2s/zksync-era.ts',
    warning:
      'Withdrawals are delayed by 1d. The length of the delay can be arbitrarily set by a MultiSig.',
    description:
      'zkSync Era is a general-purpose zk-rollup platform from Matter Labs aiming at implementing nearly full EVM compatibility in its zk-friendly custom virtual machine.      It implements standard Web3 API and it preserves key EVM features such as smart contract composability while introducing some new concept such as native account abstraction.',
    isVerified: true,
  },
}))

function Template() {
  useEffect(() => {
    configureMobileProjectNavigation()
  }, [])
  return (
    <div className="max-w-sm">
      <MobileProjectNavigation sections={sections} />
    </div>
  )
}

export function ScrolledToStart() {
  return <Template />
}

export function ScrolledToMiddle() {
  useEffect(() => {
    const list = document.querySelector(
      `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
    )
    list?.scrollTo(list.scrollWidth / 2, 0)
  })
  return <Template />
}

export function ScrolledToEnd() {
  useEffect(() => {
    const list = document.querySelector(
      `#${MOBILE_PROJECT_NAVIGATION_IDS.list}`,
    )
    list?.scrollTo(list.scrollWidth, 0)
  })
  return <Template />
}
