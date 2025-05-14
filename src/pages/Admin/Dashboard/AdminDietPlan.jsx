import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminDietPlan = () => {

    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        image: null,
        ingredients: '',
        calories: '',
        protein: '',
        carb: '',
        fat: '',
        shift: '',
        timings: ''
    });

    const fetchDashboardData = async () => {
        try {
            const result = await axios.get(`${config.baseUrl}/diet/all`);
            setData(result?.data?.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddDiet = async () => {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('image', formData.image);
        form.append('ingredients', formData.ingredients);
        form.append('calorie', formData.calories);
        form.append('protein', formData.protein);
        form.append('carb', formData.carb);
        form.append('fat', formData.fat);
        form.append('shift', formData.shift);
        form.append('timings', formData.timings);

        try {
            const response = await axios.post(`${config.baseUrl}/diet/create`, form);
            toast.success('Diet added successfully!');
            fetchDashboardData(); // refresh list
            setShowModal(false);  // close modal
            setFormData({  // clear form
                title: '',
                image: null,
                ingredients: '',
                calories: '',
                protein: '',
                carb: '',
                fat: '',
                shift: '',
                timings: ''
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add diet');
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const deleteDiet = async (id) => {
        if (!window.confirm("Are you sure you want to delete this diet plan?")) return;
        try {
            await axios.delete(`${config.baseUrl}/diet/${id}`);
            toast.success("Diet plan deleted successfully");
            fetchDashboardData(); // Refresh data
        } catch (error) {
            toast.error("Failed to delete diet plan");
            console.error("Delete Error:", error);
        }
    };


    return (

        <div>


            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setShowModal(true)} className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Add New</button>
                </div>
            </div>


            {
                data.length > 0 ?
                    <div className="overflow-x-auto mt-10">
                        <table className="min-w-full bg-white border rounded-md">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Id</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Image</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Title</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Ingredients</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Calories</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Protein</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Carb</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Fat</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Shift</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Timings</th>

                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Created At</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((i) => (
                                    <tr key={i._id}>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?._id}</td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm"><img className='w-10 h-10 rounded-md' src={i?.image} alt="" /></td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.title}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#007AFF]">{`${i?.ingredients}`}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.calories}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.protein}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.carb}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.fat}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.shift}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.timings}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b flex gap-x-3">
                                            <span onClick={() => deleteDiet(i?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-red-200 text-red-700`}>Delete</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <h1 className='text-center mt-48 text-lg'>No Diet Plan Found</h1>

            }


            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Add New Diet Plan</h2>
                        <div className="space-y-3">
                            <input type="text" placeholder="Title" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input type="file" className="w-full" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                            <input type="text" placeholder="Ingredients" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, ingredients: e.target.value })} />
                            <input type="number" placeholder="Calories" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, calories: e.target.value })} />
                            <input type="number" placeholder="Protein" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, protein: e.target.value })} />
                            <input type="number" placeholder="Carb" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, carb: e.target.value })} />
                            <input type="number" placeholder="Fat" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, fat: e.target.value })} />
                            <input type="text" placeholder="Shift" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, shift: e.target.value })} />
                            <input type="text" placeholder="Timings" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, timings: e.target.value })} />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddDiet}>Add</button>
                        </div>
                    </div>
                </div>
            )}




        </div>

    )
}

export default AdminDietPlan
