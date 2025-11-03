import { Link, NavLink, useNavigate, useMatch } from 'react-router-dom';
import NavLinks from './NavLinks';
import { useEffect, useState } from 'react';
import type { RootState } from '../store';
import { logoutUser } from '../features/user/userSlice';
import { clearCart } from '../features/cart/cartSlice';
import { toggleTheme } from '../features/theme/themeSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconCart,
  IconHamburger,
  IconProfile,
  IconThemeDark,
  IconThemeLight,
  MainLogoDark,
  MainLogoLight,
} from '../assets/images';
import CartModal from './CartModal';
import ProfileLinks from './ProfileLinks';
import ProductSearchDropdown from './ProductSearchDropdown';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userState.user);
  const theme = useSelector((state: RootState) => state.themeState.theme);
  const numItemsInCart = useSelector(
    (state: RootState) => state.cartState.numItemsInCart
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Check if we're on the cart page
  const isCartPage = useMatch('/cart');

  const handleLogout = () => {
    // Clear cart and close modal
    dispatch(clearCart());
    setIsCartOpen(false);
    dispatch(logoutUser());
    navigate('/');
  };

  const handleTheme = () => {
    dispatch(toggleTheme());
  };

  // Sync theme with DOM on mount and when theme changes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <nav>
        <section className="w-full bg-primary">
          <div className="navbar align-headers flex items-center max-w-full px-10 max-h-[75px] mx-auto">
            <div className="navbar-start items-center">
              {/* <NavLink
                to="/"
                className="hidden lg:flex btn bg-transparent border-none shadow-none text-secondary items-center"
              >
                <img
                  src={theme === 'dark' ? MainLogoDark : MainLogoLight}
                  alt="Logo"
                  className="w-[110px] h-[50px]"
                />
              </NavLink> */}
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
            {/* WIP - SEARCH BAR */}
            <div className="navbar-center hidden lg:flex flex-1 justify-center px-4">
              <ProductSearchDropdown placeholder="Search Categories or Products" />
            </div>
            <div className="navbar-end flex justify-end">
              {!isCartPage && user && (
                <button
                  className="btn bg-transparent h-[30px] border-none shadow-none outline-none btn-circle mr-3"
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
              )}
              <div className="flex gap-x-y justify-center items-center px-1 gap-[20px]">
                {user ? (
                  <div className="flex gap-x-2 sm:gap-x-8 items-center">
                    <div className="dropdown">
                      <label
                        tabIndex={0}
                        className="btn bg-transparent h-[30px] border-none shadow-none outline-none btn-circle"
                      >
                        <img src={IconProfile} alt="user-icon" />
                      </label>
                      <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box"
                      >
                        <ProfileLinks user={user} onLogout={handleLogout} />
                      </ul>
                    </div>
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
                <label className="swap swap-rotate">
                  <input
                    type="checkbox"
                    onChange={handleTheme}
                    checked={theme === 'dark'}
                  />
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
                src={theme === 'dark' ? MainLogoDark : MainLogoLight}
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

      {/* Cart Modal - Only show if not on cart page */}
      {!isCartPage && (
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      )}
    </>
  );
};
export default Navbar;
