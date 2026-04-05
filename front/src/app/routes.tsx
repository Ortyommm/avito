import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AdsListPage } from '@/pages/AdsListPage'
import { AdDetailsPage } from '@/pages/AdDetailsPage'
import { AdEditPage } from '@/pages/AdEditPage'
import { AppLayout } from './layouts/AppLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/ads" replace />,
      },
      {
        path: 'ads',
        element: <AdsListPage />,
      },
      {
        path: 'ads/:id',
        children: [
          {
            index: true,
            element: <AdDetailsPage />,
          },
          {
            path: 'edit',
            element: <AdEditPage />,
          },
        ],
      },
    ],
  },
])
