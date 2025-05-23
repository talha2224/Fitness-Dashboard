import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import toast from 'react-hot-toast';


const AdminUserPage = () => {

    const [data, setData] = useState([]);
    const [allDiet, setAllDiet] = useState([])
    const [allWorkout, setAllWorkout] = useState([])
    const [currentView, setCurrentView] = useState("table");

    const [showAssignMealModal, setshowAssignMealModal] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedMeals, setSelectedMeals] = useState([]);
    const [existingAssignMeal, setExistingAssignMeal] = useState([])

    const [showAssignWorkoutModal, setshowAssignWorkoutModal] = useState(false)
    const [selectedWorkout, setSelectedWorkout] = useState([]);
    const [existingAssignWorkout, setExistingAssignWorkout] = useState([])

    const fetchDashboardData = async () => {
        try {
            const totalUser = await axios.get(`${config.baseUrl}/account/all`);
            const workout = await axios.get(`${config.baseUrl}/exercise/all`);
            const diet = await axios.get(`${config.baseUrl}/diet/all`);
            setData(totalUser?.data?.data);
            setAllDiet(diet?.data?.data);
            setAllWorkout(workout?.data?.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handleAccountSuspend = async (userId) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.delete(`${config.baseUrl}/account/${userId}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Account Suspended")
                fetchDashboardData()
            }


        }
        catch (error) {

        }
    }
    const handleReactivateAccount = async (userId) => {
        let loader = toast.loading("Processing Request")
        try {
            const res = await axios.patch(`${config.baseUrl}/account/reactivate/${userId}`);
            if (res?.data) {
                toast.dismiss(loader)
                toast.success("Account Reactivated")
                fetchDashboardData()
            }
        }
        catch (error) {

        }
    }
    const assignMeal = async () => {
        try {
            if (selectedMeals.length === 0) return toast.error("Select at least one meal");
            const loader = toast.loading("Assigning meal...");
            let res = await axios.post(`${config.baseUrl}/assign/meal`, {
                uid: selectedUserId,
                mealId: selectedMeals,
            });
            if (res) {
                toast.dismiss(loader);
                toast.success("Meal assigned successfully");
                setshowAssignMealModal(false);
            }
        } catch (err) {
            toast.dismiss(loader);
            toast.error("Failed to assign meal");
        }
    }
    const existingUserMeal = async (uid) => {
        try {
            let result = await axios.get(`${config.baseUrl}/assign/meal/${uid}`);
            setExistingAssignMeal(result?.data?.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    const existingUserWorkout = async (uid) => {
        try {
            let result = await axios.get(`${config.baseUrl}/assign/workout/${uid}`);
            setExistingAssignWorkout(result?.data?.data)
        }
        catch (error) {
            console.log(error)
        }
    }
    const assignWorkout = async () => {
        try {
            if (selectedWorkout.length === 0) return toast.error("Select at least one meal");
            const loader = toast.loading("Assigning workout...");
            let res = await axios.post(`${config.baseUrl}/assign/workout`, {
                uid: selectedUserId,
                workoutId: selectedWorkout,
            });
            if (res) {
                toast.dismiss(loader);
                toast.success("Workout assigned successfully");
                setshowAssignWorkoutModal(false);
            }
        } catch (err) {
            toast.dismiss(loader);
            toast.error("Failed to assign meal");
        }
    }

    useEffect(() => {
        fetchDashboardData();
    }, []);


    return (
        <div>

            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-md">
                <div className="flex items-center space-x-2">
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Filter</button>
                    <input type="text" placeholder="Search..." className="rounded-md bg-[#F9F9F9] px-3 w-[15rem] py-2 outline-none border" />
                </div>
                <div className="flex items-center space-x-2">
                    <div className='flex items-center gap-x-3 bg-[#FBFBFB] rounded-full p-2'>
                        <button onClick={() => setCurrentView("table")} className={`${currentView === "table" ? "bg-white border" : "text-[#616161]"} py-1 px-6 rounded-full text-sm`}>Table</button>
                    </div>
                    <button className="bg-[#F2F2F2] rounded-md px-5 py-2 text-sm">Sort</button>
                </div>
            </div>

            <div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-md">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Username</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Contact Info</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Registration Date</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Account Type</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Subscription Plan</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Status</th>
                                <th className="py-2 px-4 border-b text-left font-normal text-sm text-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((user) => (
                                <tr key={user._id}>
                                    <td className="text-[#616161] py-2 px-4 border-b text-nowrap">{`${user.name}`}</td>
                                    <td className="text-[#616161] py-2 px-4 border-b text-nowrap">{user.email}</td>
                                    <td className="text-[#616161] py-2 px-4 border-b text-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="text-[#616161] py-2 px-4 border-b text-nowrap">User</td>
                                    <td className="text-[#616161] py-2 px-4 border-b text-nowrap">{user.plan}</td>
                                    <td className="py-2 px-4 border-b">
                                        <span className={`px-2 py-1 rounded-md text-xs text-nowrap ${user.accountBlocked ? 'bg-red-200 text-red-700' : 'bg-[#DCEDFF] text-[#007AFF]'}`}>{user.accountBlocked ? 'Suspended' : 'Active'}</span>
                                    </td>
                                    <td className="py-2 px-4 border-b flex items-center gap-x-3">
                                        {
                                            !user.accountBlocked ? <span onClick={() => handleAccountSuspend(user?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-red-200 text-red-700`}>Suspend Account</span> :
                                                <span onClick={() => handleReactivateAccount(user?._id)} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Reactivate Account</span>
                                        }
                                        <span onClick={() => { setSelectedUserId(user?._id); existingUserWorkout(user?._id); setshowAssignWorkoutModal(!showAssignMealModal) }} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Assign Workout</span>
                                        <span onClick={() => { setSelectedUserId(user?._id); existingUserMeal(user?._id); setshowAssignMealModal(!showAssignMealModal) }} className={`px-2 py-1 cursor-pointer text-nowrap rounded-md text-xs bg-[#DCEDFF] text-[#007AFF]`}>Assign Diet</span>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>


            {/* ADD MODAL HERE  */}
            {showAssignMealModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-[400px] relative">
                        <h2 className="text-lg font-semibold mb-4">Assign Meal</h2>

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            <h3 className="font-medium text-sm text-gray-600 mb-2">Already Assigned:</h3>
                            {existingAssignMeal.length > 0 ? (
                                <ul className="mb-4">
                                    {existingAssignMeal.map((meal) => (
                                        <li key={meal._id} className="flex items-center gap-x-2 text-sm text-gray-700 mt-1">
                                            <img src={meal.mealId.image} alt="meal" className="w-8 h-8 object-cover rounded-md" />
                                            {meal.mealId.title}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">No meals assigned yet.</p>
                            )}

                            <h3 className="font-medium text-sm text-gray-600 mb-2">Assign New Meals:</h3>
                            {allDiet.map((meal) => (
                                <div key={meal._id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedMeals.includes(meal._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedMeals((prev) => [...prev, meal._id]);
                                            } else {
                                                setSelectedMeals((prev) => prev.filter((id) => id !== meal._id));
                                            }
                                        }}
                                    />
                                    <img src={meal.image} alt="meal" className="w-10 h-10 object-cover rounded-md" />
                                    <span>{meal.title}</span>
                                </div>
                            ))}
                        </div>


                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => setshowAssignMealModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={assignMeal} className="px-4 py-2 bg-blue-600 text-white rounded">Assign</button>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setshowAssignMealModal(false)}
                            className="absolute top-2 right-2 text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {showAssignWorkoutModal && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-[400px] relative">
                        <h2 className="text-lg font-semibold mb-4">Assign Workout</h2>

                        <div className="max-h-[300px] overflow-y-auto space-y-2">
                            <h3 className="font-medium text-sm text-gray-600 mb-2">Already Assigned:</h3>
                            {existingAssignWorkout.length > 0 ? (
                                <ul className="mb-4">
                                    {existingAssignWorkout.map((meal) => (
                                        <li key={meal._id} className="flex items-center gap-x-2 text-sm text-gray-700 mt-1">
                                            <img src={meal.workoutId.image} alt="meal" className="w-8 h-8 object-cover rounded-md" />
                                            {meal.workoutId.title}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500 mb-4">No workout assigned yet.</p>
                            )}

                            <h3 className="font-medium text-sm text-gray-600 mb-2">Assign New Workout:</h3>
                            {allWorkout.map((meal) => (
                                <div key={meal._id} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedWorkout.includes(meal._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedWorkout((prev) => [...prev, meal._id]);
                                            } else {
                                                setSelectedWorkout((prev) => prev.filter((id) => id !== meal._id));
                                            }
                                        }}
                                    />
                                    <img src={meal.image} alt="meal" className="w-10 h-10 object-cover rounded-md" />
                                    <span>{meal.title}</span>
                                </div>
                            ))}
                        </div>


                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => setshowAssignWorkoutModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={assignWorkout} className="px-4 py-2 bg-blue-600 text-white rounded">Assign</button>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setshowAssignWorkoutModal(false)}
                            className="absolute top-2 right-2 text-xl"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}




        </div>
    );
};

export default AdminUserPage;