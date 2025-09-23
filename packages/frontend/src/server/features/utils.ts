// This is a temporary function used to extract the first DA from
// a list of DAs that the project is using. Currently our frontend
// assumes there's only one DA assigned to a project, which is no
// longer the case. This function needs to be removed and frontend
// modified to show all DAs the project has assigned.
export function temporarilyExtractFirstElement<T>(
  value: T | T[] | undefined,
): T | undefined {
  return Array.isArray(value) ? value[0] : value
}
