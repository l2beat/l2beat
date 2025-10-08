import type { RouteObject } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/search/SearchPage'
import { AddTokensPage } from './pages/tokens/add-tokens/AddTokensPage'
import { TokensPage } from './pages/tokens/TokensPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '/search/:search',
    element: <SearchPage />,
  },
  {
    path: '/tokens/new',
    element: <AddTokensPage />,
  },
  {
    path: '/tokens/:id',
    element: <TokensPage />,
  },
  {
    path: '/not-found',
    element: <NotFoundPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
