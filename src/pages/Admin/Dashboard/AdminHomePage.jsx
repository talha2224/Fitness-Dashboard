import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { FaUsers, FaUserSlash } from 'react-icons/fa';
import { FaChartLine } from 'react-icons/fa6';
import { GrTransaction } from 'react-icons/gr';
import { FaDeleteLeft } from 'react-icons/fa6';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import Map from '../../../assets/dashboard/worldmap.svg'
import { BsSoundwave } from 'react-icons/bs';

const AdminHomePage = () => {

    const [data, setData] = useState({ totalUser: [], totalTransaction: [], declineTransactions: [], unverifiedAccount: [], });
    const [transactionData, setTransactionData] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [lastMonthEarnings, setLastMonthEarnings] = useState(0);
    const [countryData, setCountryData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/account/all`);
            const totalTransaction = await axios.get(`${config.baseUrl}/transfer/all`);
            const declineTransactions = totalTransaction?.data?.data?.filter((i) => i.decline);
            const unverifiedAccount = totalUser?.data?.data?.filter((i) => !i?.accountVerified);
            setData({
                totalTransaction: totalTransaction?.data?.data,
                totalUser: totalUser?.data?.data,
                declineTransactions,
                unverifiedAccount,
            });
            processTransactionData(totalTransaction?.data?.data);
            processCountryData(totalTransaction?.data?.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const processTransactionData = (transactions) => {
        if (!transactions) return;

        const monthlyTransactions = {};
        let currentMonthEarnings = 0;
        let prevMonthEarnings = 0;
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        transactions.forEach((transaction) => {
            const transactionDate = new Date(transaction.createdAt);
            const year = transactionDate.getFullYear();
            const month = transactionDate.getMonth();

            if (year === currentYear) {
                if (month === currentMonth) {
                    currentMonthEarnings += transaction.amount;
                } else if (month === currentMonth - 1) {
                    prevMonthEarnings += transaction.amount;
                }

                const monthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(transactionDate);
                if (!monthlyTransactions[monthName]) {
                    monthlyTransactions[monthName] = {
                        month: monthName,
                        amount: 0,
                    };
                }
                monthlyTransactions[monthName].amount += transaction.amount;
            }
        });

        setTotalEarnings(currentMonthEarnings);
        setLastMonthEarnings(prevMonthEarnings);
        setTransactionData(Object.values(monthlyTransactions));
    };

    const processCountryData = (transactions) => {
        if (!transactions) return;

        const countryCounts = {};
        transactions.forEach((transaction) => {
            const country = transaction.reciverCountry;
            countryCounts[country] = (countryCounts[country] || 0) + 1;
        });

        const countryArray = Object.entries(countryCounts).map(([country, count]) => ({
            country,
            count,
        }));

        countryArray.sort((a, b) => b.count - a.count); // Sort by count in descending order
        setCountryData(countryArray);
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div>

            <div className="flex justify-between items-center gap-x-4 overflow-x-auto">

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#34C759] flex items-center gap-x-4 text-white px-5">
                    <FaUsers className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Total User</p>
                        <p className="text-white text-2xl font-medium">{data?.totalUser?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#FFCC00] flex items-center gap-x-4 text-white px-5">
                    <GrTransaction className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Total Transacations</p>
                        <p className="text-white text-2xl font-medium">{data?.totalTransaction?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#FF3B30] flex items-center gap-x-4 text-white px-5">
                    <FaDeleteLeft className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Decline Transacations</p>
                        <p className="text-white text-2xl font-medium">{data?.declineTransactions?.length}</p>
                    </div>
                </div>

                <div className="min-w-[20rem] h-[5rem] rounded-xl border bg-[#5856D6] flex items-center gap-x-4 text-white px-5">
                    <FaUserSlash className="text-[1.8rem]" />
                    <div>
                        <p className="text-[#F3F3F3]">Unverified Account</p>
                        <p className="text-white text-2xl font-medium">{data?.unverifiedAccount?.length}</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminHomePage;