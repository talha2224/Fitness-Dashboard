import axios from "axios";
import { useEffect, useState } from "react";
import config from "../../config";


const SendPage = () => {


    const [recieptData, setRecieptData] = useState([])

    const fetchRecieptData = async () => {
        try {
            let res = await axios.get(`${config.baseUrl}/reciept/user/${localStorage.getItem("uId")}`);
            setRecieptData(res?.data?.data[0]);
        } 
        catch (error) {
            console.error("Error fetching hotline data:", error);
        }
    };

    useEffect(() => {
        fetchRecieptData();
    }, []);

    console.log(recieptData,'recieptData')


    
    return (

        <div className="flex-1 overflow-x-auto">



        </div>
    );
};

export default SendPage;