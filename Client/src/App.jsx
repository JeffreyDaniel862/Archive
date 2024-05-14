import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SignUp, { signupAction } from './pages/SignUp'
import SignIn, { signinAction } from './pages/SignIn'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import RootLayout from './pages/RootLayout'
import { userAction } from './components/Profile'
function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'sign-up', element: <SignUp />, action: signupAction },
        { path: 'sign-in', element: <SignIn />, action: signinAction },
        { path: 'about', element: <About /> },
        { path: 'dashboard', element: <Dashboard />, action: userAction }
      ]
    },

  ])
  return (
    <RouterProvider router={router} />
  )
}

export default App
