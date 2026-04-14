import { Brain, Database, Download } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { RulesEditor } from '~/components/RulesEditor'
import { LogProvider } from '~/hooks/useLog'
import { cn } from '~/utils/cn'
import { FactsPage } from './pages/FactsPage'
import { ImportPage } from './pages/ImportPage'
import { TRPCReactProvider } from './react-query/trpc'

const navItems = [
  { to: '/', label: 'Facts', icon: Database },
  { to: '/import', label: 'Import', icon: Download },
]

function Navbar() {
  const { pathname } = useLocation()
  return (
    <nav className="flex h-12 shrink-0 items-center justify-between bg-navbar px-4 text-navbar-foreground">
      <div className="flex items-center gap-2">
        <Brain className="size-5" />
        <span className="font-semibold text-sm">token-knowledge</span>
      </div>
      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors',
              pathname === item.to
                ? 'bg-white/15 text-white'
                : 'text-navbar-foreground/70 hover:bg-white/10 hover:text-white',
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}

function Layout() {
  const [asideWidth, setAsideWidth] = useState(680)
  const dragging = useRef(false)

  const onMouseDown = useCallback(() => {
    dragging.current = true
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      setAsideWidth(Math.max(200, window.innerWidth - e.clientX))
    }
    const onMouseUp = () => {
      dragging.current = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <main className="min-w-0 flex-1 overflow-auto p-5">
          <Routes>
            <Route path="/" element={<FactsPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </main>
        <div
          onMouseDown={onMouseDown}
          className="w-1 shrink-0 cursor-col-resize bg-border transition-colors hover:bg-ring"
        />
        <aside
          className="flex shrink-0 flex-col overflow-hidden p-4"
          style={{ width: asideWidth }}
        >
          <RulesEditor />
        </aside>
      </div>
    </div>
  )
}

export function App() {
  return (
    <TRPCReactProvider>
      <LogProvider>
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      </LogProvider>
    </TRPCReactProvider>
  )
}
