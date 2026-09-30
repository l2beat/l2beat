import { createContext, useContext } from 'react'

/**
 * Level of the nearest heading enclosing the content, so markdown rendered
 * inside it can place its own headings below. 0 means page level.
 */
const ParentHeadingLevelContext = createContext(0)

export const ParentHeadingLevelProvider = ParentHeadingLevelContext.Provider

export function useParentHeadingLevel() {
  return useContext(ParentHeadingLevelContext)
}
