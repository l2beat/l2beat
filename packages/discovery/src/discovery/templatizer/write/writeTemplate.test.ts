import { expect } from 'earl'
import { mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { getHashForMatchingFromSources } from '../../../flatten/utils'
import { TemplateService } from '../../analysis/TemplateService'
import type { PerContractSource } from '../../source/SourceCodeService'
import type { ContractFacts } from '../facts'
import { bundle, contractSources } from '../test/sources'
import { addShape, chooseTemplateId, writeNewTemplate } from './writeTemplate'

describe(writeNewTemplate.name, () => {
  const PROXY = 'eth:0x1111111111111111111111111111111111111111'
  const IMPL_A = 'eth:0x2222222222222222222222222222222222222222'
  const IMPL_B = 'eth:0x3333333333333333333333333333333333333333'
  const TEXT = '{\n  "$schema": "x",\n  "fields": {}\n}\n'
  let root: string
  let templateService: TemplateService

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'templatizer-write-'))
    templateService = new TemplateService(root)
  })
  afterEach(() => rmSync(root, { recursive: true, force: true }))

  function target(bundles: PerContractSource[], name = 'Foo') {
    const sources = contractSources(bundles)
    const shapeHash = getHashForMatchingFromSources(bundles)
    if (shapeHash === undefined) throw new Error('no shape')
    const facts = {
      project: 'proj',
      chain: 'ethereum',
      address: bundles[0]?.address,
      blockNumber: 123,
      name,
      shapeHash,
    } as ContractFacts
    return { facts, sources }
  }

  function shapes(templateId: string) {
    return JSON.parse(
      readFileSync(join(root, '_templates', templateId, 'shapes.json'), 'utf8'),
    )
  }

  it('writes a single-bundle contract under <project>/<name> and matches it', () => {
    const shape = target([bundle('Foo', PROXY)])
    const templateId = chooseTemplateId(templateService, shape.facts)

    writeNewTemplate(templateService, templateId, TEXT, shape)

    expect(templateId).toEqual('proj/Foo')
    expect(templateService.readTemplateFile(templateId)).toEqual(TEXT)
    expect(shapes(templateId)).toEqual({
      'Foo.sol': {
        hash: shape.facts.shapeHash.toString(),
        address: PROXY,
        chain: 'ethereum',
        blockNumber: 123,
      },
    })
    expect(
      templateService.findMatchingTemplates(shape.sources, shape.facts.address),
    ).toEqual(['proj/Foo'])
  })

  it('records the implementation behind a proxy, which is what V1 matches on', () => {
    const shape = target([bundle('Proxy', PROXY), bundle('Foo', IMPL_A)])

    writeNewTemplate(templateService, 'proj/Foo', TEXT, shape)

    expect(shapes('proj/Foo')['Foo.sol'].address).toEqual(IMPL_A)
    expect(
      templateService.findMatchingTemplates(shape.sources, shape.facts.address),
    ).toEqual(['proj/Foo'])
  })

  it('records every implementation of a two-implementation proxy under the combined hash', () => {
    const shape = target([
      bundle('Proxy', PROXY),
      bundle('AdminLogic', IMPL_A),
      bundle('Foo', IMPL_B),
    ])

    writeNewTemplate(templateService, 'proj/Foo', TEXT, shape)

    expect(shapes('proj/Foo')['Foo.sol'].address).toEqual([IMPL_A, IMPL_B])
    expect(
      templateService.findMatchingTemplates(shape.sources, shape.facts.address),
    ).toEqual(['proj/Foo'])
  })

  it('suffixes the id with the hash when the name is taken by another shape', () => {
    const first = target([bundle('Foo', PROXY, 'uint a;')])
    writeNewTemplate(
      templateService,
      chooseTemplateId(templateService, first.facts),
      TEXT,
      first,
    )

    const second = target([bundle('Foo', IMPL_A, 'uint b;')])
    const templateId = chooseTemplateId(templateService, second.facts)
    writeNewTemplate(templateService, templateId, TEXT, second)

    const short = second.facts.shapeHash.toString().slice(2, 10)
    expect(templateId).toEqual(`proj/Foo-${short}`)
    expect(
      templateService.findMatchingTemplates(
        second.sources,
        second.facts.address,
      ),
    ).toEqual([templateId])
  })

  it('adds a new shape to an existing template under a hash-suffixed key when the name is taken', () => {
    const old = target([bundle('Foo', PROXY, 'uint a;')])
    writeNewTemplate(templateService, 'proj/Foo', TEXT, old)

    const next = target([bundle('Foo', IMPL_A, 'uint b;')])
    addShape(templateService, 'proj/Foo', next)

    const short = next.facts.shapeHash.toString().slice(2, 10)
    expect(Object.keys(shapes('proj/Foo'))).toEqual(['Foo.sol', `Foo_${short}`])
    expect(
      templateService.findMatchingTemplates(next.sources, next.facts.address),
    ).toEqual(['proj/Foo'])
  })
})
