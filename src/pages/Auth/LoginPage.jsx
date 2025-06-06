import React, { useState } from 'react';
import AuthImage from '../../assets/auth/auth.png';
import Logo from '../../assets/logo.svg';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../config';
import toast from 'react-hot-toast';
import axios from 'axios';


const LoginPage = () => {
    const nav = useNavigate()
    const [formData, setFormData] = useState({ email: '', password: '', });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        let loader = toast.loading("Processing")
        try {
            const response = await axios.post(`${config.baseUrl}/account/login`, formData);
            if (response?.data) {
                toast.dismiss(loader)
                localStorage.setItem("uId", response?.data?.data?._id)
                toast.success('Login successful!');
                if (formData.email === "admin@asteam.com") {
                    setTimeout(() => { nav("/admin/dashboard/user") }, 2000);
                }
            }
        }
        catch (error) {
            toast.dismiss(loader)
            if (error.response) {
                if (error?.response?.data?.msg == "Account not verified Otp Has Been Sent To Your Email") {
                    toast.error(error?.response?.data?.msg || 'Login failed. Please try again.');
                    localStorage.setItem("uEmail", formData?.email)
                    setTimeout(() => { nav("/verify") }, 2000);
                }
                else {
                    toast.error(error?.response?.data?.msg || 'Login failed. Please try again.');
                }
            }
            else if (error.request) {
                toast.error('No response received from the server. Please try again.');
            }
            else {
                toast.error('An error occurred. Please try again.');
            }
        }
    };
    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <div className='flex-1 hidden md:flex flex-col h-[100%] bg-[#F3FDFF]'>
                <div className="flex-shrink-0 flex items-center gap-x-2 p-5">
                    <span className="text-xl">As Team</span>
                </div>
                <img src={AuthImage} alt="" />
            </div>

            <div className='flex-1 flex justify-center items-center flex-col h-[100%] overflow-y-auto pt-0'>
                <div className='w-full max-w-md p-6'>
                    <h2 className="text-2xl mb-4 text-[#324B50]">Accedi al tuo account</h2>
                    <p className='text-sm text-[#324B50]'>Inserisci la tua email e password per effettuare il login</p>
                    <form className="">
                        <input required={true} type="email" name="email" placeholder="Indirizzo email" className="w-[100%] mt-2 border p-2 rounded outline-none block" onChange={handleChange} />
                        <input required={true} type="password" name="password" placeholder="Password" className="w-[100%] mt-2 border p-2 rounded outline-none block" onChange={handleChange} />
                    </form>
                    <button className="w-full bg-[#9FE7F5] p-2 rounded mt-4" onClick={handleLogin}>Accedi</button>
                </div>
            </div>
        </div>

    );
};

export default LoginPage;