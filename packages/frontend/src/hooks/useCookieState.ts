import { useEffect, useState } from 'react'
import type { KnownCookieName, KnownCookieValue } from '~/consts/cookies'
import { getCookie, setCookie } from '~/utils/cookies/client'

type CookieEvent<Name extends KnownCookieName = KnownCookieName> = {
  name: Name
  value: KnownCookieValue<Name>
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
    const listener = (event: Event) => {
      if (!(event instanceof CustomEvent)) return

      const cookieEvent = event as CustomEvent<CookieEvent<Name>>
      if (cookieEvent.detail.name === name) {
        setState(cookieEvent.detail.value)
      }
    }

    document.addEventListener('cookie', listener)

    return () => {
      document.removeEventListener('cookie', listener)
    }
  }, [name])

  return [
    state,
    (state) => {
      document.dispatchEvent(
        new CustomEvent('cookie', {
          detail: {
            name,
            value: state,
          },
        }),
      )
      setCookie(name, state)
    },
  ]
}
