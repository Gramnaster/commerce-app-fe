import { toast } from 'react-toastify';
import { Navbar } from '../../components'
import Sidebar from '../../components/Sidebar'
import { NavLink, Outlet, redirect, useNavigation } from 'react-router-dom';
import { customFetch } from '../../utils';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';


export const loader = (queryClient: any, store: any) => async () => {
  const storeState = store.getState();
  const user = storeState.userState?.user;
  console.log(`profile user`, user);

  // if (!user || user.user_role !== 'admin') {
  //   toast.warn('There must be something wrong. Please refresh the page.');
  //   return redirect('/dashboard');
  // }

  // const usersQuery = {
  //   queryKey: ['users', user.id],
  //   queryFn: async () => {
  //     const response = await customFetch.get('/users', {
  //       headers: {
  //         Authorization: user.token,
  //       },
  //     });
  //     return response.data;
  //   },
  // };

  // try {
  //   const users = await queryClient.ensureQueryData(usersQuery);
  //   return { users };
  // } catch (error: any) {
  //   console.error('Failed to load users:', error);
  //   toast.error('Failed to load traders list');
  //   return { users: [] };
  // }
};

const Profile = () => {
  const user = useSelector((state: RootState) => state.userState.user);

  return (
    <div>
      <Sidebar />
        <Outlet />
      <button className="px-6 py-1 rounded text-sm font-medium hover:opacity-80 transition-opacity">
        <NavLink to={`view/${user?.id}`}>
          View
        </NavLink>
      </button>
      YAWA YAWA YAWA
    </div>
  )
}

export default Profile