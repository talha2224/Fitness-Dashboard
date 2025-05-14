import { useEffect, useState } from 'react';
import { HiDotsVertical } from "react-icons/hi";
import { BsCheckCircleFill, BsXCircleFill, BsFlagFill } from 'react-icons/bs';
import axios from 'axios';
import config from '../../config';


const WalletHistoryPage = () => {
    const [walletData, setWalletData] = useState([]);

    const fetchWalletInfo = async () => {
        let res = await axios.get(`${config.baseUrl}/transaction/history/user/${localStorage.getItem("uId")}`)
        setWalletData(res?.data?.data)
    }
    useEffect(() => {
        fetchWalletInfo();
    }, []);

    return (
        <div className='flex-1 overflow-x-auto'>
            <div className='flex justify-between items-center mb-6 flex-wrap'>
                <div className='flex items-center mt-2'>
                    <h2 className='text-xl text-[#049F30] mr-2'>Transaction Hisotry</h2>
                    <span className='text-sm text-[#049F30]'>{walletData?.length} Found</span>
                </div>
            </div>

            <div className='overflow-x-auto'>
                <table className='w-full text-left'>
                    <thead className='bg-[#EBF2ED]'>
                        <tr>
                        <th className='py-2 px-4 text-[#049F30] font-medium'>Amount</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>Delivery Mode</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>Receiver Name</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>Receiver Email</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>Country</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>City</th>
                            <th className='py-2 px-4 text-[#049F30] font-medium'>Created At</th>
                        </tr>
                    </thead>
                    <tbody className='bg-white'>
                        {walletData.map((item, index) => {
                            let receiverInfo = {};
                            try {
                                receiverInfo = JSON.parse(item.transferRequestId.reciverOtherInfo || '{}');
                            } catch (error) {
                                receiverInfo = { name: "Unknown", email: "N/A" };
                            }

                            return (
                                <tr key={index} className='border-b'>
                                    <td className='py-2 px-4 text-nowrap'>${item.amount}</td>
                                    <td className='py-2 px-4 text-nowrap'>{item.transferRequestId.deliveryMode}</td>
                                    <td className='py-2 px-4 text-nowrap'>{receiverInfo.name || "Unknown"}</td>
                                    <td className='py-2 px-4 text-nowrap'>{receiverInfo.email || "N/A"}</td>
                                    <td className='py-2 px-4 text-nowrap'>{item.transferRequestId.reciverCountry}</td>
                                    <td className='py-2 px-4 text-nowrap'>{item.transferRequestId.reciverCity}</td>
                                    <td className='py-2 px-4 text-nowrap'>{new Date(item.createdAt).toLocaleString()}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default WalletHistoryPage;