import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  Error,
  Home,
  Login,
  Signup,
  Profile,
  Cart,
  Products,
  ProductView,
  Dashboard,
  ProfileView,
  ProfileEdit,
} from './pages/index.ts';
import { store } from './store.ts';

import { action as loginAction } from './pages/Login/Login';
import { action as registerAction } from './pages/Signup/Signup';

import { loader as productsLoader } from './pages/Products/Products.tsx';
import { loader as productViewAction } from './pages/Products/ProductView.tsx';

import { loader as profileLoader } from './pages/Profile/Profile.tsx';
import { loader as profileViewAction } from './pages/Profile/ProfileView.tsx';
import { loader as profileEditAction } from './pages/Profile/ProfileEdit.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

// Routes that need authentication before you can access it
const router = createBrowserRouter([
  {
    // localhost:3000/
    path: '/',
    element: <Home />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'products',
        element: <Products />,
        loader: productsLoader(queryClient, store),
        children: [
          {
            path: 'products/:id',
            element: <ProductView />,
            loader: productViewAction(queryClient, store),
          },
        ],
      },
      {
        path: 'profile',
        element: <Profile />,
        loader: profileLoader(queryClient, store),
        children: [
          {
            index: true,
            element: <Profile />,
          },
          {
            path: 'view/:id',
            element: <ProfileView />,
            loader: profileViewAction(queryClient, store),
          },
          {
            path: 'edit/:id',
            element: <ProfileEdit />,
            loader: profileEditAction(queryClient, store),
          },
          {
            path: 'transactions',
            // element: <ProfileReceipts />
          },
        ],
      },
      {
        path: 'cart',
        element: <Cart />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/signup',
    element: <Signup />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: '*',
    element: <Error />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
