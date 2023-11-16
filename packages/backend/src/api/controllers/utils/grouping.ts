import { Dictionary, groupBy, mapValues } from 'lodash'

type ObjectValues<T> = T[keyof T]
type GroupingFunction<T> = (item: T) => ObjectValues<T>

/**
 * Group objects by two levels
 */
export function nestedGroupBy<T>(
  items: T[],
  firstLevel: GroupingFunction<T>,
  secondLevel: GroupingFunction<T>,
) {
  return mapValues(
    mapValues(groupBy(items, firstLevel), (firstGroupingResult) =>
      groupBy(firstGroupingResult, secondLevel),
    ),
  )
}

/**
 * Group array of objects by key and omit that
 * key from the resulting objects to prevent data duplication
 */
export function groupByAndOmit<T, K extends keyof T>(
  collection: T[],
  key: K,
): Dictionary<Omit<T, K>[]> {
  return mapValues(
    groupBy(collection, (item) => item[key]),
    (items) =>
      items.map((item) => {
        const { [key]: _, ...rest } = item
        return rest
      }),
  )
}
