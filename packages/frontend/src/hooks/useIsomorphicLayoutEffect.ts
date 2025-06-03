import { useEffect, useLayoutEffect } from 'React'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect
