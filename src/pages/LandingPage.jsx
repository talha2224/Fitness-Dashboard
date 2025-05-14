import React from 'react'
import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom';
import App from '../assets/app.svg'
import Content from '../assets/content.svg'
import Users from '../assets/users.png'


const LandingPage = () => {


    return (


        <div className='w-screen h-screen bg-[#F3FDFF] flex flex-col'>

            <Navbar />

            <div className='flex-1 w-[100%] flex items-center gap-x-10 md:justify-between justify-center md:flex-row flex-col  px-4 sm:px-6 lg:px-8'>

                <div className='flex-1'>
                    <h1 className='text-[3rem] text-[#324B50] font-medium'>Seamless Box Pick-ups, Transactions, and Tracking at Your Fingertips</h1>
                    <p className='mt-3 text-[#324B50]'>Effortlessly Schedule, Scan, Send, and Track Your Balikbayan Boxes and Remittances</p>
                    <Link to="/register"><button className="bg-[#9FE7F5] px-7 py-2 rounded-md text-sm font-medium mt-4">Get Started</button></Link>
                    <img src={App} alt="" className='mt-7' />
                </div>

                <div className='flex-1 h-[100%]'>

                    <div className='flex justify-end items-end'>
                        <img src={Users} alt="" className='h-[3rem] mt-10' />
                    </div>
                    <img src={Content} alt="" className='h-[70%]' />


                </div>


            </div>




        </div>



    )


}

export default LandingPage