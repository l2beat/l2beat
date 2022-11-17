import { defaults, types } from 'pg'

export function configureUtc() {
  defaults.parseInputDatesAsUTC = true

  types.setTypeParser(1114, (str: string) => {
    const utcStr = `${str}Z`
    return new Date(utcStr)
  })
}
