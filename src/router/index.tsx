import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { ROUTES } from '@constants/routes.constants'

const LoginPage    = lazy(() => import('@pages/LoginPage/LoginPage'))
const ClientesPage = lazy(() => import('@pages/ClientesPage/ClientesPage'))

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: ROUTES.LOGIN, element: <Suspense><LoginPage /></Suspense> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: ROUTES.DASHBOARD, element: <Suspense><ClientesPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
])
