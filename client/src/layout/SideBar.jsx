
import React, { useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { toggleAddNewAdminPopup, toggleSettingPopup } from "../store/slices/popUpSlice";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import { resetAuthSlice } from "../store/slices/authSlice";
import { logout } from "../store/slices/authSlice";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector((state) => state.popup);

  const { loading, error, message, isAuthenticated, user } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  return (
    <>
      {/* Mobile Menu Toggle Button (only visible when sidebar is closed) */}
      {!isSideBarOpen && (
        <button
          onClick={() => setIsSideBarOpen(true)}
          className="fixed z-20 p-3 text-white bg-black rounded-md md:hidden top-6 right-3"
          aria-label="Open menu"
        >
          <FaBars className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-30 transition-all duration-300 md:relative  md:left-0 flex w-64 bg-black relative text-white flex-col h-screen overflow-y-auto`}
        style={{ position: "fixed" }}
      >
        {/* Logo Section */}
        <div className="px-6 py-4 my-8">
          <img 
            src={logo_with_title} 
            alt="logo" 
            className="w-full max-w-[180px]" 
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-6 space-y-2 overflow-y-auto py-4">
          <button
            onClick={() => {
              setSelectedComponent("Dashboard");
              setIsSideBarOpen(false);
            }}
            className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
          >
            <img src={dashboardIcon} alt="dashboard" className="w-5 h-5" /> 
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => {
              setSelectedComponent("Books");
              setIsSideBarOpen(false);
            }}
            className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
          >
            <img src={bookIcon} alt="books" className="w-5 h-5" /> 
            <span>Books</span>
          </button>

          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                onClick={() => {
                  setSelectedComponent("Catalog");
                  setIsSideBarOpen(false);
                }}
                className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
              >
                <img src={catalogIcon} alt="catalog" className="w-5 h-5" /> 
                <span>Catalog</span>
              </button>

              <button
                onClick={() => {
                  setSelectedComponent("Users");
                  setIsSideBarOpen(false);
                }}
                className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
              >
                <img src={usersIcon} alt="users" className="w-5 h-5" /> 
                <span>Users</span>
              </button>

              <button
                onClick={() => {
                  dispatch(toggleAddNewAdminPopup());
                  setIsSideBarOpen(false);
                }}
                className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
              >
                <RiAdminFill className="w-5 h-5" /> 
                <span>Add New Admin</span>
              </button>
            </>
          )}

          {isAuthenticated && user?.role === "User" && (
            <button
              onClick={() => {
                setSelectedComponent("My Borrowed Books");
                setIsSideBarOpen(false);
              }}
              className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
            >
              <img src={catalogIcon} alt="my-borrowed-books" className="w-5 h-5" /> 
              <span>My Borrowed Books</span>
            </button>
          )}

          <button
            onClick={() => {
              dispatch(toggleSettingPopup());
              setIsSideBarOpen(false);
            }}
            className="w-full py-3 md:py-2 font-medium bg-transparent rounded-md hover:bg-gray-800 transition-colors cursor-pointer flex items-center space-x-2 text-sm md:text-base"
          >
            <img src={settingIcon} alt="setting" className="w-5 h-5" /> 
            <span>Update Credentials</span>
          </button>
        </nav>

        {/* Logout Section */}
        <div className="px-6 py-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 md:py-2 font-medium text-white  rounded-md  transition-colors cursor-pointer flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            <img src={logoutIcon} alt="logout" className="w-5 h-5" /> 
            <span>Log Out</span>
          </button>
        </div>

        {/* Close Button (mobile only) */}
        {/* <button
          onClick={() => setIsSideBarOpen(false)}
          className="absolute top-0 right-0 p-4 md:hidden"
          aria-label="Close menu"
        >
          <img src={closeIcon} alt="close" className="w-5 h-5" />
        </button> */}
      </aside>

      {/* Popups */}
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;