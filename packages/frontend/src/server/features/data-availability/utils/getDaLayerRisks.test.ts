import type { ProjectCustomDa, ProjectDaLayer } from '@l2beat/config'
import { expect } from 'earl'
import { getDaLayerRisks } from './getDaLayerRisks'

describe(getDaLayerRisks.name, () => {
  it('returns the original risks when economicSecurity does not exist', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        fraudDetection: { value: 'test', sentiment: 'good' },
        // no economicSecurity property
      },
    } as ProjectDaLayer

    const result = getDaLayerRisks(mockDaLayer)

    expect(result).toEqual({
      daLayer: { value: 'test', sentiment: 'good' },
      fraudDetection: { value: 'test', sentiment: 'good' },
      economicSecurity: undefined,
    })
  })

  it('returns the original economicSecurity value when adjustSecurityRisk is false', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'good' },
          adjustSecurityRisk: false,
        },
      },
    } as ProjectDaLayer

    const result = getDaLayerRisks(mockDaLayer)

    expect(result).toEqual({
      daLayer: { value: 'test', sentiment: 'good' },
      economicSecurity: { value: 'test', sentiment: 'good' },
    })
  })

  it('throws an assertion error when adjustSecurityRisk is true but totalValueSecured and economicSecurity are not provided', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'good' },
          adjustSecurityRisk: true,
        },
      },
    } as ProjectDaLayer

    expect(() => getDaLayerRisks(mockDaLayer)).toThrow()
  })

  it('throws an assertion error when adjustSecurityRisk is true but only totalValueSecured is provided', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'good' },
          adjustSecurityRisk: true,
        },
      },
    } as ProjectDaLayer

    expect(() => getDaLayerRisks(mockDaLayer, 1000)).toThrow()
  })

  it('throws an assertion error when adjustSecurityRisk is true but only economicSecurity is provided', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'good' },
          adjustSecurityRisk: true,
        },
      },
    } as ProjectDaLayer

    expect(() => getDaLayerRisks(mockDaLayer, undefined, 500)).toThrow()
  })

  it('calculates adjusted economicSecurity when adjustSecurityRisk is true and both params are provided', () => {
    const mockDaLayer = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'neutral' },
          adjustSecurityRisk: true,
        },
      },
    } as ProjectDaLayer

    // Testing good sentiment case (ES > TVS)
    const result1 = getDaLayerRisks(mockDaLayer, 1000, 1500)
    expect(result1.economicSecurity?.sentiment).toEqual('good')

    // Testing warning sentiment case (ES > TVS/3)
    const result2 = getDaLayerRisks(mockDaLayer, 1000, 500)
    expect(result2.economicSecurity?.sentiment).toEqual('warning')

    // Testing bad sentiment case (ES < TVS/3)
    const result3 = getDaLayerRisks(mockDaLayer, 1000, 300)
    expect(result3.economicSecurity?.sentiment).toEqual('bad')
  })

  it('works with ProjectCustomDa type', () => {
    const mockCustomDa = {
      risks: {
        daLayer: { value: 'test', sentiment: 'good' },
        economicSecurity: {
          value: { value: 'test', sentiment: 'good' },
          adjustSecurityRisk: false,
        },
        // Custom DA has both DaLayerRisks and DaBridgeRisks properties
        daBridge: { value: 'test', sentiment: 'good' },
      },
    } as ProjectCustomDa

    const result = getDaLayerRisks(mockCustomDa)
    expect(result.economicSecurity?.sentiment).toEqual('good')
  })
})
