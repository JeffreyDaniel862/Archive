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
import EditPost, { postLoader } from './pages/EditPost'
import PostPage from './pages/PostPage'
import UserProfile from './pages/Profile'

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <RootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home /> },
        { path: ':id', element: <UserProfile /> },
        { path: 'sign-up', element: <SignUp />, action: signupAction },
        { path: 'sign-in', element: <SignIn />, action: signinAction },
        { path: 'about', element: <About /> },
        { path: 'dashboard', element: <Dashboard />, action: userAction },
        { path: 'create-post', element: <CreatePost />, action: postAction },
        { path: 'update-post/:id', element: <EditPost />, loader: postLoader, action: postAction },
        { path: 'post-view/:slug', element: <PostPage />, loader: postLoader }
      ]
    },
  ]);
  return (
    <RouterProvider router={router} />
  )
}

export default App
