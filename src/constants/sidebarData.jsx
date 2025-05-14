import { IoCall } from "react-icons/io5";
import { MdDashboard, MdDinnerDining, MdOutlineSyncAlt } from 'react-icons/md';
import { RiBodyScanFill, RiFilePaperLine } from "react-icons/ri";
import { HiOutlineNewspaper } from "react-icons/hi2";
import { LuUser } from "react-icons/lu";

export const navData = [
    {
        id: 1,
        link: "home",
        name: "Home",
        icon: <MdDashboard />
    },
    {
        id: 7,
        link: "hotline",
        name: "HotLine",
        icon: <IoCall   />
    }
];

export const adminNav = [
    {
        id: 1,
        link: "home",
        name: "Home",
        icon: <MdDashboard className='text-[#FFCC00]' />
    },
    {
        id: 7,
        link: "user",
        name: "User Managements",
        icon: <LuUser className="text-[#FF2D55]" />
    },
    {
        id: 4,
        link: "transaction",
        name: "Transaction",
        icon: <MdOutlineSyncAlt className="text-[#34C759]" />
    },
    {
        id: 5,
        link: "diet",
        name: "Diet Plan",
        icon: <MdDinnerDining className="text-[#46e3ff]" />
    },
    {
        id: 5,
        link: "exercise",
        name: "Workout Plan",
        icon: <RiBodyScanFill className="text-[#673cff]" />
    },

]