import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminTransactionage = () => {

    const [data, setData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/transaction/all`);
            setData(totalUser?.data?.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);

    console.log(data, 'data')


    return (
        <div>


            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
                </div>
            </div>


            {
                data.length > 0 ?
                    <div className="overflow-x-auto mt-10">
                        <table className="min-w-full bg-white border rounded-md">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Id</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Transaction Date</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">User Name</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Email</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Amount</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Payment Method</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((i) => (
                                    <tr key={i._id}>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?._id}</td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.userId?.name}</td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.userId?.email}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#007AFF]">{`$ ${i?.amount / 100}`}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{"Stripe"}</td>

                                        <td className="py-2 px-4 border-b">
                                            <span className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Completed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <h1 className='text-center mt-48 text-lg'>No Transaction Found</h1>

            }




        </div>
    );
};

export default AdminTransactionage;