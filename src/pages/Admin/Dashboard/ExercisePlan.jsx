import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const ExercisePlan = () => {

    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        image: null,
        title: '',
        notes: '',
        guide: '',
        sets: '',
        duration: '',
        plan: "free",
        reps: 1
    });

    const fetchDashboardData = async () => {
        try {
            const result = await axios.get(`${config.baseUrl}/exercise/all`);
            setData(result?.data?.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAddDiet = async () => {
        const form = new FormData();
        form.append('title', formData.title);
        form.append('image', formData.image);
        form.append('notes', formData.notes);
        form.append('guide', formData.guide);
        form.append('duration', formData.duration);
        form.append('sets', formData.sets);
        form.append('plan', formData.plan);
        form.append('reps', formData.reps);

        try {
            const response = await axios.post(`${config.baseUrl}/exercise/create`, form);
            toast.success('Workout added successfully!');
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
        if (!window.confirm("Are you sure you want to delete this exercise?")) return;
        try {
            await axios.delete(`${config.baseUrl}/exercise/${id}`);
            toast.success("Workout plan deleted successfully");
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
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filtro</button>
                    <input type="text" placeholder="Cerca..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <button onClick={() => setShowModal(true)} className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Aggiungi Nuovo</button>
                </div>
            </div>

            {
                data.length > 0 ?
                    <div className="overflow-x-auto mt-10">
                        <table className="min-w-full bg-white border rounded-md">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Id</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Immagine</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Titolo</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Note</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Guida</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Serie</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Ripetizioni</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Piano</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Durata</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Creato il</th>
                                    <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((i) => (
                                    <tr key={i._id}>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?._id}</td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm"><img className='w-10 h-10 rounded-md' src={i?.image} alt="" /></td>
                                        <td className="text-[#616161] py-2 px-4 border-b text-nowrap text-sm">{i?.title}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#007AFF]">{`${i?.notes}`}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.guide}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.sets}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.reps}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.plan}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{i?.duration}</td>
                                        <td className="py-2 px-4 border-b text-nowrap text-sm text-[#616161]">{new Date(i.createdAt).toLocaleDateString()}</td>
                                        <td className="py-2 px-4 border-b flex gap-x-3">
                                            <span onClick={() => deleteDiet(i?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-red-200 text-red-700`}>Elimina</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    :
                    <h1 className='text-center mt-48 text-lg'>Nessun piano di allenamento trovato</h1>
            }
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-[400px]">
                        <h2 className="text-lg font-semibold mb-4">Aggiungi nuovo piano di allenamento</h2>
                        <div className="space-y-3">
                            <input type="text" placeholder="Titolo" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, title: e.target.value })} />
                            <input type="file" className="w-full" onChange={e => setFormData({ ...formData, image: e.target.files[0] })} />
                            <textarea type="text" placeholder="Note" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            <textarea type="number" placeholder="Guida" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, guide: e.target.value })} />
                            <input type="number" placeholder="Serie" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, sets: e.target.value })} />
                            <input type="number" placeholder="Ripetizioni" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, reps: e.target.value })} />
                            <input type="number" placeholder="Durata" className="w-full border px-3 py-2 rounded" onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                            <select
                                className="w-full border px-3 py-2 rounded mt-2"
                                value={formData.plan}
                                onChange={e => setFormData({ ...formData, plan: e.target.value })}
                            >
                                <option value="free">Gratuito</option>
                                <option value="paid">A pagamento</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Annulla</button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAddDiet}>Aggiungi</button>
                        </div>
                    </div>
                </div>
            )}

        </div>


    )
}

export default ExercisePlan
