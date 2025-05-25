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


    return (
        <div>

            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filtro</button>
                    <input type="text" placeholder="Cerca..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Ordina</button>
                </div>
            </div>

            {
                data.length > 0 ?
                    <div className="overflow-x-auto mt-10">
                        <table className="min-w-full bg-white border rounded-md">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">ID Transazione</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Data Transazione</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Nome Utente</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Email</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Importo</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Metodo di Pagamento</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Stato</th>
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
                                            <span className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Completato</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <h1 className='text-center mt-48 text-lg'>Nessuna transazione trovata</h1>
            }
        </div>

    );
};

export default AdminTransactionage;