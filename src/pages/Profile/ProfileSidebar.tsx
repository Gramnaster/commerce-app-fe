// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import type { User } from './ProfileEdit';
// import type { RootState } from '../store';

export interface LinksType {
  id: number;
  url: string;
  text: string;
}


export const getProfileLinks = (user: { id?: number } | null): LinksType[] => [
  { id: 0, url: '/profile/transactions', text: "Transactions" },
  { id: 1, url: `/profile/view/${user?.id}`, text: "Profile" },
  { id: 2, url: `/profile/wallet/`, text: "Wallet" },
  // { id: 0, url: '/profile/view/:id', text: "Men's Clothes" },
  // { id: 1, url: '/profile/edit', text: "Women's Clothes" },
  // { id: 3, url: '/profile/receipts', text: "Children's Clothes" },
  // { id: 4, url: '/profile/wallet', text: 'Jewellery' },
  // { id: 5, url: '/categories/electronics', text: 'Electronics' },
  // { id: 6, url: '/categories/snacks', text: 'Snacks' },
  // { id: 7, url: '/categories/trinkets', text: 'Trinkets' },
  // { id: 8, url: '/categories/airstrikes', text: 'Air Strikes' },
];

const ProfileSidebar = ({ user }: { user: User }) => {
  const links = getProfileLinks(user);
  return (
    <div className="h-full">
      <div className="h-[468px] border-r border-[#808080]">
        <div className="font-bold flex flex-col justify-end items-end mr-4 text-black">
          <h3 className="font-primary font-light text-[24px] mb-2">Profile</h3>
          {links.map((link) => {
            const { id, url, text } = link;
            return (
              <NavLink
                key={id}
                to={url}
                className={({ isActive }) =>
                  `m-1 rounded-2xl hover:cursor-pointer hover:underline capitalize font-secondary text-[16px] ${
                    isActive ? 'font-bold' : 'font-light'
                  }`
                }
              >
                {text}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default ProfileSidebar;
