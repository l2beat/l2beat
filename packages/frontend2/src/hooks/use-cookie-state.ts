'use client'

import { useEffect, useState } from 'react'
import { type KnownCookieName, type KnownCookieValue } from '~/consts/cookies'
import { getCookie, setCookie } from '~/utils/cookies/client'

type CookieEventDetails = {
  name: KnownCookieName
  value: KnownCookieValue<KnownCookieName>
}

/**
 * Use state that is persisted in a cookie.
 * @param name known cookie name
 * @returns array containing the current value and a function to update it
 */
export function useCookieState<Name extends KnownCookieName>(
  name: Name,
): [KnownCookieValue<Name>, (value: KnownCookieValue<Name>) => void] {
  const [state, setState] = useState<KnownCookieValue<Name>>(
    getCookie<Name>(name),
  )

  useEffect(() => {
    setCookie(name, state)
  }, [name, state])

  useEffect(() => {
    function handleCookieChange(event: Event) {
      if (event instanceof CustomEvent) {
        const cookieEvent = event as CustomEvent<CookieEventDetails>
        const { name: changedName, value } = cookieEvent.detail
        if (changedName === name) {
          setState(value)
        }
      }
    }

    window.addEventListener('cookieChange', handleCookieChange)

    return () => {
      window.removeEventListener('cookieChange', handleCookieChange)
    }
  }, [name])

  return [
    state,
    (value) => {
      window.dispatchEvent(
        new CustomEvent<CookieEventDetails>('cookieChange', {
          detail: { name, value },
        }),
      )
    },
  ]
}
