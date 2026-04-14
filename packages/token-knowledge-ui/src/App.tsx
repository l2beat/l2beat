import { Brain, Coins, Download } from 'lucide-react'
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom'
import { RulesEditor } from '~/components/RulesEditor'
import { cn } from '~/utils/cn'
import { ImportPage } from './pages/ImportPage'
import { TokensPage } from './pages/TokensPage'
import { TRPCReactProvider } from './react-query/trpc'

const navItems = [
  { to: '/', label: 'Tokens', icon: Coins },
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
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <main className="flex-1 overflow-auto border-r p-5">
          <Routes>
            <Route path="/" element={<TokensPage />} />
            <Route path="/import" element={<ImportPage />} />
          </Routes>
        </main>
        <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden p-4">
          <RulesEditor />
        </aside>
      </div>
    </div>
  )
}

export function App() {
  return (
    <TRPCReactProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </TRPCReactProvider>
  )
}
