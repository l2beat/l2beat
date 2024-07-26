'use client'

import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { type KnownCookieName, type KnownCookieValue } from '~/consts/cookies'
import { getCookie, setCookie } from '~/utils/cookies/client'

/**
 * Use state that is persisted in a cookie.
 * @param name known cookie name
 * @returns array containing the current value and a function to update it
 */
export function useCookieState<Name extends KnownCookieName>(
  name: Name,
): [KnownCookieValue<Name>, Dispatch<SetStateAction<KnownCookieValue<Name>>>] {
  const [state, setState] = useState<KnownCookieValue<Name>>(
    getCookie<Name>(name),
  )

  useEffect(() => {
    setCookie(name, state)
  })

  return [state, setState]
}
