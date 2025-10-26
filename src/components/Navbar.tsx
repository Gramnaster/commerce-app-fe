import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom';
import NavLinks from './NavLinks';
import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logoutUser } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconCart,
  IconHamburger,
  IconProfile,
  IconSearch,
  IconThemeDark,
  IconThemeLight,
  MainLogoDark,
  MainLogoLight,
} from '../assets/images';
import CartModal from './CartModal';

const themes = {
  light: 'light',
  dark: 'dark',
};

const getThemeFromLocalStorage = () => {
  return localStorage.getItem('theme') || themes.light;
};

const Navbar = () => {
  // Always sync with the real data-theme attribute
  const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') || themes.light;
  const [theme, setTheme] = useState(getThemeFromLocalStorage);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userState.user);
  const numItemsInCart = useSelector((state: RootState) => state.cartState.numItemsInCart);

  const handleLogout = () => {
    navigate('/');
    dispatch(logoutUser());

    console.log('logout function here');
  };

  const handleTheme = () => {
  const { light, dark } = themes;
  const newTheme = theme === light ? dark : light;
  setTheme(newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <nav>
        <section className="w-full bg-primary">
          <div className="navbar align-headers flex items-center max-w-full px-10 max-h-[75px] mx-auto">
            <div className="navbar-start flex-1 items-right">
              <NavLink
                to="/"
                className="hidden lg:flex btn bg-transparent border-none shadow-none text-secondary items-center"
              >
                <img
                  src={MainLogoDark}
                  alt="Logo"
                  className="w-[110px] h-[50px]"
                />
              </NavLink>
              {/* Dropdown Menu */}
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost lg:hidden">
                  <img src={IconHamburger} alt="Hamburger" />
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box"
                >
                  <NavLinks />
                </ul>
              </div>
            </div>
            <div className="navbar-center hidden lg:flex flex-6 justify-center">
              <label className="input flex items-center w-full max-w-4xl max-h-[32px]">
                <input
                  type="search"
                  required
                  placeholder="Search Categories or Products"
                  className="flex-1 text-base text-black placeholder:text-gray-500 rounded-l-md rounded-tr-none rounded-br-none"
                />
              </label>
              <button className="btn bg-accent text-base max-h-[32px] rounded-l-md rounded-tl-none rounded-bl-none">
                Search
                <img src={IconSearch} className="h-[15px] w-[15px]" />
              </button>
            </div>
            <div className="navbar-end flex-3 flex justify-end">
              <div className="flex gap-x-y justify-center items-center px-1 gap-[20px]">
                {user ? (
                  <div className="flex gap-x-2 sm:gap-x-8 items-center">
                    <button
                      className="btn border-none shadow-none outline-none text-base bg-secondary text-white w-[110px] h-[33px]"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="btn border-none shadow-none outline-none text-base bg-secondary text-white w-[110px] h-[33px]">
                      <Link to="/login">
                        {/* <img src={IconProfile} alt="user-icon" /> */}
                        Login
                      </Link>
                    </label>
                    <label className="btn border-none shadow-none outline-none text-base bg-secondary text-white w-[110px] h-[33px]">
                      <Link to="/signup">
                        {/* <img src={IconProfile} alt="user-icon" /> */}
                        Sign Up
                      </Link>
                    </label>
                  </>
                )}

                {/* <button className="btn text-base bg-secondary text-white w-[128px] h-[33px]" onClick={handleLogout}>
                  Sign Up
                </button> */}
                <button 
                  className="btn bg-transparent h-[30px] border-none shadow-none outline-none btn-circle"
                  onClick={() => setIsCartOpen(true)}
                >
                  <div className="indicator">
                    <img src={IconCart} alt="cart-icon" />
                    {numItemsInCart > 0 && (
                      <span className="badge badge-xs badge-error indicator-item text-xs">
                        {numItemsInCart}
                      </span>
                    )}
                  </div>
                </button>
                <label className="swap swap-rotate">
                  <input type="checkbox" onChange={handleTheme} />
                  {/* Moon Icon */}
                  <img
                    src={IconThemeDark}
                    alt="theme-icon"
                    className="swap-on h-[28px] w-[28px]"
                  />
                  {/* Sun Icon */}
                  <img
                    src={IconThemeLight}
                    alt="theme-icon"
                    className="swap-off h-[28px] w-[28px]"
                  />
                </label>
                {/* <button className="btn bg-transparent h-[30px]">
                  <img src={IconTheme} alt="theme-icon"/>
                </button> */}
              </div>
            </div>
          </div>
        </section>
        <section className="navbar align-elements flex flex-col items-center justify-center max-h-[235px] mx-auto px-10 pt-[70px] bg-base-100">
          {/* <ul className="menu menu-horizontal">
            <NavLinks />
          </ul> */}
          <div className="h-[150px] mb-[70px]">
            <NavLink
              to="/"
              className="hidden lg:flex btn bg-transparent border-none shadow-none text-secondary items-center"
            >
              <img
                src={getCurrentTheme() === themes.dark ? MainLogoDark : MainLogoLight}
                alt="Main-Logo"
                className="w-[253px] h-[115px] ml-10"
              />
            </NavLink>
          </div>
          <div className="flex flex-row text-base-content gap-[40px] mb-2">
            <NavLinks />
          </div>
        </section>
      </nav>
      
      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
export default Navbar;
