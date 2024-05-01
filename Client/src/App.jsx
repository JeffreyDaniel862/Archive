import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import About from './pages/About'
import Dashboard from './pages/Dashboard'

function App() {
  const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: 'sign-up', element: <SignUp /> },
    { path: 'sign-in', element: <SignIn /> },
    { path: 'about', element: <About /> },
    { path: 'dashboard', element: <Dashboard /> }
  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
