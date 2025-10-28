// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import type { RootState } from '../store';

interface LinksType {
  id: number;
  url: string;
  text: string;
}

const ProfileSidebar = ({user}) => {
  // const user = useSelector((state: RootState) => state.userState.user);

  
const links: LinksType[] = [
  { id: 0, url: '/profile/wallet', text: "Wallet" },
  { id: 0, url: `/profile/view/${user?.id}`, text: "Profile" },
  { id: 0, url: `/profile/transactions/`, text: "Transactions" },
  // { id: 0, url: '/profile/view/:id', text: "Men's Clothes" },
  // { id: 1, url: '/profile/edit', text: "Women's Clothes" },
  // { id: 3, url: '/profile/receipts', text: "Children's Clothes" },
  // { id: 4, url: '/profile/wallet', text: 'Jewellery' },
  // { id: 5, url: '/categories/electronics', text: 'Electronics' },
  // { id: 6, url: '/categories/snacks', text: 'Snacks' },
  // { id: 7, url: '/categories/trinkets', text: 'Trinkets' },
  // { id: 8, url: '/categories/airstrikes', text: 'Air Strikes' },
];
  return (
    <div>
      {links.map((link) => {
        const { id, url, text } = link;
        // if (
        //   (url === 'home' ||
        //     url === 'products' ||
        //     url === 'searchbar' ||
        //     url === 'profile' ||
        //     url === 'cart')  &&
        //   (!user || user.user_role === 'admin')
        // )
        //   return null;

        // if (
        //   (url === 'admin' ||
        //     url === 'admin/transactions')
        //     // &&
        //   // (!user || user.user_role !== 'admin')
        // )
        //   return null;

        // Hide "About Us" when user is logged in\
        // if (url === 'about' && user) return null;
        // if (url === 'about') return null;
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
