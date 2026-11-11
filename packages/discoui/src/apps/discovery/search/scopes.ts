export type SearchScope =
  | 'all'
  | 'contracts'
  | 'fields'
  | 'projects'
  | 'code'
  | 'commands'

interface ScopeInfo {
  label: string
  prefix: string | undefined
  placeholder: string
}

export const SCOPE_INFO: Record<SearchScope, ScopeInfo> = {
  all: {
    label: 'All',
    prefix: undefined,
    placeholder: 'Search contracts, fields, projects and commands',
  },
  contracts: {
    label: 'Contracts',
    prefix: undefined,
    placeholder: 'Name, address, template or implementation',
  },
  fields: { label: 'Fields', prefix: '#', placeholder: 'Field name' },
  projects: {
    label: 'Projects',
    prefix: '@',
    placeholder: 'Project, contract name or address',
  },
  code: { label: 'Code', prefix: '%', placeholder: 'Text in source code' },
  commands: { label: 'Commands', prefix: '>', placeholder: 'Command' },
}

export function getSearchScopes(readonly: boolean): SearchScope[] {
  const scopes: SearchScope[] = ['all', 'contracts', 'fields', 'projects']
  if (!readonly) scopes.push('code')
  scopes.push('commands')
  return scopes
}

export function scopeForPrefix(
  scopes: SearchScope[],
  character: string,
): SearchScope | undefined {
  return scopes.find((scope) => SCOPE_INFO[scope].prefix === character)
}

export function cycleScope(
  scopes: SearchScope[],
  scope: SearchScope,
  step: 1 | -1,
): SearchScope {
  const index = scopes.indexOf(scope)
  const next = scopes[(index + step + scopes.length) % scopes.length]
  if (next === undefined) {
    throw new Error('Scope index out of range')
  }
  return next
}
