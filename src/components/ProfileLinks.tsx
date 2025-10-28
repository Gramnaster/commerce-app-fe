import { NavLink } from 'react-router-dom';

import { getProfileLinks } from '../pages/Profile/ProfileSidebar';

import type { User } from '../pages/Profile/ProfileEdit';

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

interface ProfileLinksProps {
  user: User;
  onLogout?: () => void;
}

const ProfileLinks = ({ user, onLogout }: ProfileLinksProps) => {
  // const user = useSelector((state: RootState) => state.userState.user);

  const links = getProfileLinks(user);
  return (
    <div>
      {links.map((link) => {
        const { id, url, text } = link;
        return (
          <li key={id} className="li font-secondary text-black">
            <NavLink to={url} className="capitalize">
              {text}
            </NavLink>
          </li>
        );
      })}
      {onLogout && (
        <li className="li font-secondary text-black mt-2">
          <button
            className="btn border-none shadow-none outline-none text-base bg-secondary text-white w-[110px] h-[33px]"
            onClick={onLogout}
          >
            Logout
          </button>
        </li>
      )}
    </div>
  );
};

export default ProfileLinks;
