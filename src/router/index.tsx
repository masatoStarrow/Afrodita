import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { ROUTES } from '@constants/routes.constants'

const LoginPage     = lazy(() => import('@pages/LoginPage/LoginPage'))
const DashboardPage = lazy(() => import('@pages/DashboardPage/DashboardPage'))

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
      { path: ROUTES.DASHBOARD, element: <Suspense><DashboardPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
])
