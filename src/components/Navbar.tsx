import { Link, Navigate, NavLink, useNavigate } from 'react-router-dom';
import NavLinks from './NavLinks';
import { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { logoutUser } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import {
  IconCart,
  IconHamburger,
  IconLineWhite,
  IconProfile,
  IconSearch,
  IconThemeDark,
  IconThemeLight,
  MainLogoDark,
} from '../assets/images';

const Navbar = () => {
  const [theme, setTheme] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userState.user);

  const handleLogout = () => {
    navigate('/');
    // dispatch()
    dispatch(logoutUser());

    console.log('logout function here');
  };

  const handleTheme = () => {
    setTheme(!theme);
  };

  return (
    <>
      <nav className="bg-primary px-10 max-h-[75px]">
        <div className="navbar align-headers">
          <div className="navbar-start">
            <NavLink
              to="/"
              className="hidden lg:flex btn text-2xl bg-transparent border-none shadow-none text-secondary items-center"
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
          <div className="navbar-center hidden lg:flex">
            <label className="input">
              <input
                type="search"
                required
                placeholder="Search Categories or Products"
              />
              <img src={IconSearch} className='h-[15px] w-[15px]'/>
            </label>
          </div>
          <div className="navbar-end">
            <div className="flex gap-x-y justify-center items-center ">
              {/* {user ? (
                <div className="flex gap-x-2 sm:gap-x-8 items-center">
                  <p className="text-xs sm:text-sm">Hello, {user.first_name}</p>
                  <button className="btn btn-xs" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              ) : (
                <button className="btn btn-primary h-[33px]">
                  <Link
                    to="/login"
                    className="link link-hover text-cs sm:text-sm"
                  >
                    Login
                  </Link>
                </button>
              )} */}

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
              {/* <button className="btn text-base bg-secondary text-white w-[128px] h-[33px]" onClick={handleLogout}>
                Sign Up
              </button> */}
              <button className="btn bg-transparent h-[30px] border-none shadow-none outline-none">
                <img src={IconCart} alt="cart-icon" />
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
        <div className='navbar align-elements'>
          <ul className="menu menu-horizontal">
            <NavLinks />
          </ul>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
