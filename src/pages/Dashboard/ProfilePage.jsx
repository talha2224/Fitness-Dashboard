import { useEffect, useState } from 'react';
import config from '../../config';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const [profileData, setProfileData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedData, setEditedData] = useState({});

    const fetchProfileInfo = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/account/single/${localStorage.getItem("uId")}`);
            setProfileData(res?.data?.data);
            setEditedData(res?.data?.data);
        } catch (error) {
            console.error("Error fetching profile info:", error);
        }
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
    };

    const handleInputChange = (e) => {
        console.log([e.target.name], e.target.value)
        setEditedData({ ...editedData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            toast.loading('Updating profile...', { id: 'updateProfile' });
            console.log(editedData, 'editedData')
            await axios.put(`${config.baseUrl}/account/update/profile/${profileData._id}`, editedData);
            toast.success('Profile updated successfully!', { id: 'updateProfile' });
            fetchProfileInfo();
            setShowEditModal(false);
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Failed to update profile.', { id: 'updateProfile' });
            console.error("Error updating profile:", error);
        }
    };


    useEffect(() => {
        fetchProfileInfo();
    }, []);

    return (
        <div className='flex-1 overflow-x-auto'>

            <div className=''>
                <div className='flex justify-between items-center mb-6'>
                    <div>
                        <h2 className='text-2xl font-semibold mb-1'>My Account</h2>
                        <p className='text-[#949EA0]'>You can edit your account</p>
                    </div>
                    <div className='flex gap-2'>
                        <button className='bg-red-100 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-200'><Link to={"/"}>Delete Account</Link></button>
                        <button onClick={handleEditClick} className='bg-orange-100 text-orange-600 px-4 py-2 rounded-md text-sm hover:bg-orange-200'>Edit profile</button>
                    </div>
                </div>

                {
                    profileData && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Customer ID</p>
                                <p className=''>{profileData._id}</p>
                            </div>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Full Name</p>
                                <p className=''>{profileData.firstName} {profileData.middleName} {profileData.lastName}</p>
                            </div>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Address Information</p>
                                <p className=''>{profileData.address}, {profileData.city}, {profileData.state}</p>
                            </div>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Date of Birth</p>
                                <p className=''>{profileData.dob}</p>
                            </div>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Email Address</p>
                                <p className=''>{profileData.email}</p>
                            </div>
                            <div>
                                <p className='text-sm text-[#FE8E3C]'>Contact Number</p>
                                <p className=''>{profileData.phone}</p>
                            </div>
                        </div>
                    )
                }
            </div>



            {/* Edit Modal */}
            {
                showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg relative w-full max-w-md">
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className=" mb-4">Edit Account</h2>
                            <input type="text" name="firstName" placeholder="First Name" value={editedData.firstName} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="middleName" placeholder="Middle Name" value={editedData.middleName || ''} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="lastName" placeholder="Last Name" value={editedData.lastName} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="phone" placeholder="Contact Number" value={editedData.phone} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="date" name="dob" value={editedData.dob} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="email" name="email" placeholder="Email Address" value={editedData.email} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="address" placeholder="Address" value={editedData.address} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="zipCode" placeholder="Zip Code" value={editedData.zipCode} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="state" placeholder="State" value={editedData.state} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <input type="text" name="city" placeholder="City" value={editedData.city} onChange={handleInputChange} className="border p-2 rounded mb-2 w-full" />
                            <button onClick={handleSave} className="bg-blue-500 text-white p-2 rounded w-full">Save</button>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ProfilePage;