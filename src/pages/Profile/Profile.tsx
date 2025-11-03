// import { toast } from 'react-toastify';
// import { Navbar } from '../../components'
// import Sidebar from '../../components/Sidebar'
import { Outlet, redirect } from 'react-router-dom';
// import { customFetch } from '../../utils';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import ProfileSidebar from './ProfileSidebar';
import { IconLineDark, IconLineWhite } from '../../assets/images';


export const loader = (store: any) => async () => {
  const user = store.getState().userState.user;
  if (!user) {
    // toast.warn('You must be logged in to checkout');
    return redirect('/login');
  }
  return null;
  // const storeState = store.getState();
  // const user = storeState.userState?.user;
  // console.log(`profile user`, user);

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
    <>
      <div className="flex justify-center align-middle flex-col my-[85px]">
        <h2 className="font-primary text-base-content text-2xl text-center">
          USER PROFILE
        </h2>
        <div className="relative h-[11px] w-[67px] mx-auto">
          <img
            src={IconLineWhite}
            className="block dark:hidden h-[11px] w-[67px] mx-auto"
          />
          <img
            src={IconLineDark}
            className="hidden dark:block h-[11px] w-[67px] mx-auto"
          />
        </div>
      </div>
      <div className="align-headers grid grid-cols-[0.25fr_1fr] gap-0">
        <ProfileSidebar user={user} />
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Profile