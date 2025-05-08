import React from 'react';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import SignupPage from './pages/Signup.jsx';

const router = createBrowserRouter([
  {
    path:"/signup",
    element: <SignupPage/>
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
