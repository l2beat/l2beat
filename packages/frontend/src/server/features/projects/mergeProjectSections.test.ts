import { expect } from 'earl'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'
import { mergeProjectSections } from './mergeProjectSections'

describe(mergeProjectSections.name, () => {
  const section = (id: string, title = id) =>
    ({
      type: 'MarkdownSection',
      props: { id, title, content: '' },
    }) as unknown as ProjectDetailsSection
  const summary = (sections: ProjectDetailsSection[]) =>
    sections.map((s) => `${s.props.id}:${s.props.title}`)

  it('keeps the base sections and adds the new ones after the anchor', () => {
    const merged = mergeProjectSections(
      [section('a'), section('permissions', 'base'), section('z')],
      [section('permissions', 'other'), section('new')],
      { insertAfterId: 'a' },
    )

    expect(summary(merged)).toEqual([
      'a:a',
      'new:new',
      'permissions:base',
      'z:z',
    ])
  })

  it('drops as told', () => {
    const merged = mergeProjectSections(
      [section('risk-summary')],
      [section('tvs'), section('flows')],
      { insertAfterId: 'risk-summary', drop: ['tvs'] },
    )

    expect(summary(merged)).toEqual([
      'risk-summary:risk-summary',
      'flows:flows',
    ])
  })
})
