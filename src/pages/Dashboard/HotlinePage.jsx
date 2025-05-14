import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";
import { FaAngleRight } from "react-icons/fa";

const HotlinePage = () => {
    const [hotlineData, setHotlineData] = useState(null);
    const [branchesData, setBranchesData] = useState([]);
    const [phLandlineData, setPhLandlineData] = useState([]);
    const [phCustomerServiceData, setPhCustomerServiceData] = useState([]);
    const [showBranchesModal, setShowBranchesModal] = useState(false);
    const [showPhLandlineModal, setShowPhLandlineModal] = useState(false);
    const [showPhCustomerServiceModal, setShowPhCustomerServiceModal] = useState(false);

    const fetchHotLineData = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/hotline/get`);
            setHotlineData(res?.data?.data[0]);
        } catch (error) {
            console.error("Error fetching hotline data:", error);
        }
    };

    useEffect(() => {
        fetchHotLineData();
    }, []);

    useEffect(() => {
        if (hotlineData) {
            setBranchesData(hotlineData.branches);
            setPhLandlineData(hotlineData.Ph_Landline);
            setPhCustomerServiceData(hotlineData.Ph_Customer_Service);
        }
    }, [hotlineData]);

    return (
        <div className='flex-1 overflow-x-auto'>
            <div>
                <h2 className='text-2xl mb-2'>Hotline</h2>
                <p className='text-gray-600 mb-6'>Sed ut perspiciatis unde omnis iste</p>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <p className='text-sm text-gray-600'>Our Email Address</p>
                        <div className='bg-gray-100 rounded-lg p-3 flex items-center justify-between'>
                            <p>{hotlineData?.email}</p>
                            <FaAngleRight className='text-gray-400' />
                        </div>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>PH Landline</p>
                        <div className='bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer' onClick={() => setShowPhLandlineModal(true)}>
                            <p className=''>{phLandlineData.length > 0 ? phLandlineData[0] : 'No Data'}</p>
                            <FaAngleRight className='text-gray-400' />
                        </div>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>Branches</p>
                        <div className='bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer' onClick={() => setShowBranchesModal(true)}>
                            <p  >Our branches</p>
                            <FaAngleRight className='text-gray-400' />
                        </div>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>US Customer Services (24/7)</p>
                        <div className='bg-gray-100 rounded-lg p-3 flex items-center justify-between'>
                            <p  >Customer services</p>
                            <FaAngleRight className='text-gray-400' />
                        </div>
                    </div>
                    <div>
                        <p className='text-sm text-gray-600'>PH Customer Services (24/7)</p>
                        <div className='bg-gray-100 rounded-lg p-3 flex items-center justify-between cursor-pointer' onClick={() => setShowPhCustomerServiceModal(true)}>
                            <p  >PH customer services</p>
                            <FaAngleRight className='text-gray-400' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Branches Modal */}
            {showBranchesModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 w-[25rem] rounded-lg relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowBranchesModal(false)}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold mb-4">Branches</h2>
                        {branchesData.map((branch, index) => (
                            <div key={index} className='bg-gray-100 rounded-lg p-3 flex items-center justify-between mt-2'>
                                <p>{branch}</p>
                                <FaAngleRight className='text-gray-400' />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PH Landline Modal */}
            {showPhLandlineModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 w-[22rem] rounded-lg relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowPhLandlineModal(false)}>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold mb-4">PH Landline</h2>
                        {phLandlineData.map((number, index) => (
                            <div key={index} className='bg-gray-100 rounded-lg p-3 flex items-center justify-between mt-2'>
                                <p>{number}</p>
                                <FaAngleRight className='text-gray-400' />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PH Customer Service Modal */}
            {showPhCustomerServiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white w-[22rem] p-6 rounded-lg relative">
                        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"onClick={() => setShowPhCustomerServiceModal(false)}>
                            <svg className="h-6 w-6" fill="none"viewBox="0 0 24 24"stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                        <h2 className="text-lg font-semibold mb-4">PH Customer Services (24/7)</h2>
                        {phCustomerServiceData.map((number, index) => (
                            <div key={index} className='bg-gray-100 rounded-lg p-3 flex items-center justify-between mt-2'>
                                <p>{number}</p>
                                <FaAngleRight className='text-gray-400' />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default HotlinePage;