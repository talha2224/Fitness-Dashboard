import AvatarIcon from '../../assets/dashboard/avatar.jpg';
import { GiHamburgerMenu } from 'react-icons/gi';
import { useSidebar } from '../../context/SidebarContext';
import { IoMdNotificationsOutline } from 'react-icons/io';
import axios from 'axios';
import config from '../../config';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

    const { isNavOpen, toggleNav } = useSidebar();
    const [data, setData] = useState(null)
    const [currentDate, setCurrentDate] = useState('');


    const fetchProfileInfo = async ()=>{
        let res = await axios.get(`${config.baseUrl}/account/single/${localStorage.getItem("uId")}`)
        setData(res?.data?.data)
    }
    const updateCurrentDate = () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
        setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    useEffect(()=>{
        fetchProfileInfo();
        updateCurrentDate();
        const intervalId = setInterval(updateCurrentDate, 60000); 
        return () => clearInterval(intervalId);
    },[])


    return (

        <div className='w-[100%] flex justify-between items-center p-5 px-3  bg-white border-b border-b-[#E8E8E8]'>

            <div className='flex items-center gap-x-4'>
                <GiHamburgerMenu className='lg:hidden block cursor-pointer' onClick={() => toggleNav(!isNavOpen)} />
                <div className='text-[#324B50] md:block hidden'>
                    <h1 className='text-xl font-medium'>Welcome Back {data?.firstName}</h1>
                    <h1 className='text-sm text-[#949EA0] mt-2'>{currentDate}</h1>
                </div>
            </div>


            <Link to={"/dashboard/profile"} className='flex items-center gap-x-3 sm:gap-x-4'>
                <div className='w-8 h-8 rounded-full flex justify-center items-center bg-[#FE8E3C] border border-[#324B50] text-white'>
                    <p>{data?.firstName?.split("")[0]}</p>
                </div>
            </Link>

        </div>

    )
}

export default Header