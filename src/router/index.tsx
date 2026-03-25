import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { ROUTES } from '@constants/routes.constants'

const LoginPage               = lazy(() => import('@pages/LoginPage/LoginPage'))
const ClientesPage            = lazy(() => import('@pages/ClientesPage/ClientesPage'))
const ClienteDetailPage       = lazy(() => import('@pages/ClienteDetailPage/ClienteDetailPage'))
const InteractionDetailPage   = lazy(() => import('@pages/InteractionDetailPage/InteractionDetailPage'))

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
      { path: ROUTES.DASHBOARD,            element: <Suspense><ClientesPage /></Suspense> },
      { path: ROUTES.CLIENT_DETAIL,        element: <Suspense><ClienteDetailPage /></Suspense> },
      { path: ROUTES.INTERACTION_DETAIL,   element: <Suspense><InteractionDetailPage /></Suspense> },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
])
