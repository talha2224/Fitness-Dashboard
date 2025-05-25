import React, { useEffect, useRef, useState } from 'react';
import { navData } from '../../../constants/sidebarData';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoLogOut } from 'react-icons/io5';
import { useSidebar } from '../../../context/SidebarContext';
import Logo from '../../../assets/logo.svg'

const Sidebar = () => {

  const location = useLocation().pathname.split("/")[2];
  const { isNavOpen, toggleNav } = useSidebar();
  const sidebarRef = useRef(null);
  const nav = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleNav();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleNav]);






  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`lg:block hidden w-[15rem] h-[100vh] bg-[#ffff] relative border-r border-r-[#D8D8D880]`}>

        <div className="flex-shrink-0 flex items-center gap-x-2 p-5">
          <img src={Logo} alt="" className='h-10' />
          <span className="text-xl">As Team</span>
        </div>

        <div className='mt-10'>
          {navData?.map((i) => (
            <Link to={`/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#F5F6F6]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer ${location == i.link ? "text-[#324B50]" : "text-[#8F8F8F]"}`}>
              <div>{i.icon}</div>
              <p className='text-sm'>{i.name}</p>
            </Link>
          ))}
        </div>

        <div className='absolute bottom-5 w-[80%] flex justify-between items-center mx-5 '>
          <div onClick={() => nav("/")} className='flex items-center gap-x-2 cursor-pointer'>
            <IoLogOut className='text-[#F8835C] cursor-pointer text-xl' />
            <p className='text-xs text-[#F8835C]'>Logout</p>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {
        isNavOpen && (
          <div className={`lg:hidden block w-[14rem] z-50 h-[100vh] bg-[#0F0F0F] fixed top-0 left-0 transition-all duration-300 ease-in-out ${isNavOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`} ref={sidebarRef}>

            <div className="flex-shrink-0 flex items-center gap-x-2 p-5">
              <img src={Logo} alt="" className='h-10' />
              <span className="text-xl">As Team</span>
            </div>

            <div className='mt-10'>
              {navData?.map((i) => (
                <Link to={`/dashboard/${i.link}`} key={i.id} className={`flex ${location == i.link && "bg-[#F5F6F6]"} px-5 p-2  items-center gap-x-3 mb-2 cursor-pointer ${location == i.link ? "text-[#324B50]" : "text-[#8F8F8F]"}`}>
                  <div>{i.icon}</div>
                  <p className='text-sm'>{i.name}</p>
                </Link>
              ))}
            </div>


            <div className='absolute bottom-5 w-[80%] flex justify-between items-center mx-5 '>
              <div onClick={() => nav("/")} className='flex items-center gap-x-2 cursor-pointer'>
                <IoLogOut className='text-[#F8835C] cursor-pointer text-xl' />
                <p className='text-xs text-[#F8835C]'>Logout</p>
              </div>
            </div>

          </div>
        )}
    </>
  );
};

export default Sidebar;
