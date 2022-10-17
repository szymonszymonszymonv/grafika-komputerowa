import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, Route, createBrowserRouter } from 'react-router-dom'
import App from './pages/App'
import 'styles/index.css'
import Gk1 from './pages/Gk-1'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/gk-1",
        element: <Gk1 />
      },
      {
        path: "/gk-2",
        element: <Gk1 />
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

postMessage({ payload: 'removeLoading' }, '*')
