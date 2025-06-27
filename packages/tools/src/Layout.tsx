import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router'
import { ArrowIcon } from './common/ArrowIcon'

export function Layout() {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-full w-full flex-col md:flex-row">
      <div className="w-full p-4 md:max-w-[200px]">
        <ul>
          <li className="mb-4 flex items-center justify-between">
            <p className="font-bold">tools.l2beat.com</p>

            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <ArrowIcon className="rotate-180" /> : <ArrowIcon />}
            </button>
          </li>
          {isOpen && (
            <>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/decoder"
                >
                  /decoder
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/decoder-new"
                >
                  /decoder-new
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/simulator"
                >
                  /simulator
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/discolupe"
                >
                  /discolupe
                </NavLink>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/logo-generator"
                >
                  /logo-generator
                </NavLink>
              </li>
              <li>
                <Link
                  className="font-mono underline"
                  to="https://disco.l2beat.com/ui"
                >
                  /disco-ui
                </Link>
              </li>
              <li>
                <Link
                  className="font-mono underline"
                  to="https://disco.l2beat.com/diff"
                >
                  /diffovery
                </Link>
              </li>
              <li>
                <Link
                  className="font-mono underline"
                  to="https://uops.l2beat.com/"
                >
                  /uops-analyzer
                </Link>
              </li>
              <li>
                <NavLink
                  className={({ isActive }) =>
                    clsx('font-mono underline', isActive && 'text-orange-500')
                  }
                  to="/monitor"
                >
                  /monitor
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
      <div className="h-full flex-1">
        <Outlet />
      </div>
    </div>
  )
}
