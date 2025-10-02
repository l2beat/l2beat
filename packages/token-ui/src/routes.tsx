import type { RouteObject } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { NotFoundPage } from './pages/NotFoundPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]
