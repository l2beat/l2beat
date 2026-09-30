import { expect } from 'earl'
import { getProjectUrl } from './getProjectUrl'

// Method: pass projects carrying only the fields that decide the page kind and
// compare the path with the route that serves that kind of page.
describe(getProjectUrl.name, () => {
  it('links an interop-only protocol to its interop page', () => {
    expect(getProjectUrl({ slug: 'ccip', interopConfig: {} }, [])).toEqual(
      '/interop/protocols/ccip',
    )
  })

  it('links a scaling project with a canonical bridge to its scaling page, which carries the bridge data', () => {
    expect(
      getProjectUrl({ slug: 'gnosis', scalingInfo: {}, interopConfig: {} }, []),
    ).toEqual('/layer2s/projects/gnosis')
  })
})
