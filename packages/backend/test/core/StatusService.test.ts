import { expect } from 'chai'

import { StatusService } from '../../src/core/StatusService'

describe('StatusService', () => {
  class FooService {
    getStatus() {
      return { foo: 123 }
    }
  }

  class BarService {
    getStatus() {
      return { bar: 'baz' }
    }
  }

  it('returns the aggregate status', () => {
    const statusService = new StatusService({
      fooService: new FooService(),
      barService: new BarService(),
    })

    expect(statusService.getStatus()).to.deep.equal({
      fooService: { foo: 123 },
      barService: { bar: 'baz' },
    })
  })

  it('returns the list of reporters', () => {
    const statusService = new StatusService({
      fooService: new FooService(),
      barService: new BarService(),
    })

    expect(statusService.getReporters()).to.deep.equal([
      'fooService',
      'barService',
    ])
  })

  it('returns the status of a reporter', () => {
    const statusService = new StatusService({
      fooService: new FooService(),
      barService: new BarService(),
    })

    expect(statusService.getReporterStatus('fooService')).to.deep.equal({
      foo: 123,
    })
  })

  it('throws for unknown reporters', () => {
    const statusService = new StatusService({
      fooService: new FooService(),
      barService: new BarService(),
    })

    expect(() => statusService.getReporterStatus('bazService')).to.throw(
      'Unknown reporter bazService!'
    )
  })
})
