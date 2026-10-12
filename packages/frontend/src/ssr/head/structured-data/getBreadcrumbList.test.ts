import { expect } from 'earl'
import { env } from '~/env'
import { getBreadcrumbList } from './getBreadcrumbList'

// Method: build the trail of a DeFi project page with DeFi pages on and off
// and compare the crumb names.
describe(getBreadcrumbList.name, () => {
  const originalDefiEnabled = env.CLIENT_SIDE_DEFI_ENABLED

  after(() => {
    env.CLIENT_SIDE_DEFI_ENABLED = originalDefiEnabled
  })

  it('places a DeFi project under the DeFi section', () => {
    env.CLIENT_SIDE_DEFI_ENABLED = true

    expect(crumbNames('/defi/projects/uniswapv3', 'Uniswap V3')).toEqual([
      'Home',
      'DeFi',
      'Uniswap V3',
    ])
  })

  it('omits the DeFi section while its summary page is disabled', () => {
    env.CLIENT_SIDE_DEFI_ENABLED = false

    expect(crumbNames('/defi/projects/uniswapv3', 'Uniswap V3')).toEqual([
      'Home',
      'Uniswap V3',
    ])
  })
})

function crumbNames(path: string, name: string) {
  const list = getBreadcrumbList(path, name)
  const items = list?.itemListElement as { name: string }[]
  return items.map((crumb) => crumb.name)
}
