import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home'
import SignUp, { signupAction } from './pages/SignUp'
import SignIn, { signinAction } from './pages/SignIn'
import About from './pages/About'
import Dashboard from './pages/Dashboard'
import RootLayout from './pages/RootLayout'
import { userAction } from './components/Profile'
import { postAction } from './components/PostForm'
import CreatePost from './pages/CreatePost'
import ErrorPage from './pages/Error'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: 'sign-up', element: <SignUp />, action: signupAction },
        { path: 'sign-in', element: <SignIn />, action: signinAction },
        { path: 'about', element: <About /> },
        { path: 'dashboard', element: <Dashboard />, action: userAction },
        { path: 'create-post', element: <CreatePost />, action: postAction },
        
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
