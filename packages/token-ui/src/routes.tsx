import type { RouteObject } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { AddTokensPage } from './pages/tokens/AddTokensPage'

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
    path: '*',
    element: <NotFoundPage />,
  },
]
