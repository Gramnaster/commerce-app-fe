// import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
// import type { RootState } from '../store';

interface LinksType {
  id: number;
  url: string;
  text: string;
}



const links: LinksType[] = [
  { id: 0, url: '/categories/mens', text: "Men's Clothes" },
  { id: 1, url: '/categories/women', text: "Women's Clothes" },
  { id: 3, url: '/categories/children', text: "Children's Clothes" },
  { id: 4, url: '/categories/jewel', text: 'Jewellery' },
  { id: 5, url: '/categories/electronics', text: 'Electronics' },
  { id: 6, url: '/categories/snacks', text: 'Snacks' },
  { id: 7, url: '/categories/trinkets', text: 'Trinkets' },
  { id: 8, url: '/categories/airstrikes', text: 'Air Strikes' },
];

const NavLinks = () => {
  // const user = useSelector((state: RootState) => state.userState.user);
  return (
    <>
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
          <li key={id} className="li font-secondary">
            <NavLink to={url} className="capitalize">
              {text}
            </NavLink>
          </li>
        );
      })}
    </>
  );
};
export default NavLinks;
