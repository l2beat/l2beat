import type { RouteObject } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AddTokensPage } from './pages/tokens/AddTokensPage'
import { TokensPage } from './pages/tokens/TokensPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
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
