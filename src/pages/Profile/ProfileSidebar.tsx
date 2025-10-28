// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import type { User } from './ProfileEdit';
// import type { RootState } from '../store';

export interface LinksType {
  id: number;
  url: string;
  text: string;
}


export const getProfileLinks = (user: User | null): LinksType[] => [
  { id: 0, url: '/profile/wallet', text: "Wallet" },
  { id: 1, url: `/profile/view/${user?.id}`, text: "Profile" },
  { id: 2, url: `/profile/transactions/`, text: "Transactions" },
  // { id: 0, url: '/profile/view/:id', text: "Men's Clothes" },
  // { id: 1, url: '/profile/edit', text: "Women's Clothes" },
  // { id: 3, url: '/profile/receipts', text: "Children's Clothes" },
  // { id: 4, url: '/profile/wallet', text: 'Jewellery' },
  // { id: 5, url: '/categories/electronics', text: 'Electronics' },
  // { id: 6, url: '/categories/snacks', text: 'Snacks' },
  // { id: 7, url: '/categories/trinkets', text: 'Trinkets' },
  // { id: 8, url: '/categories/airstrikes', text: 'Air Strikes' },
];

const ProfileSidebar = ({user}: {user: User}) => {
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
    </div>
  );
};
export default ProfileSidebar;
