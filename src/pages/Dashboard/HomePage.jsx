import axios from "axios";
import { useEffect, useState } from "react";
import { MdArrowOutward, MdOutlineManageHistory, MdOutlineSync } from "react-icons/md";
import config from "../../config";
import { FaAngleRight, FaCopy } from "react-icons/fa";
import { IoIosCash } from "react-icons/io";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

loadStripe("pk_test_51OjJpTASyMRcymO6x2PBK1nrHChycNMNXj7HHvTRffOp5xufCj3WRSCLoep1tGp5Ilx3IWj7ck5yqrwEH8VSRKn80055Kvyelu");

const HomePage = () => {

  const [walletData, setWalletData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [recieptData, setRecieptData] = useState([]);
  const [taxData, settaxData] = useState(null);
  const [showReferModal, setShowReferModal] = useState(false);
  const [vnd, setVnd] = useState(0);
  const API_KEY = '8b6ba2ea7fc9003541618ea9';


  // SEND STATES
  const [selectRecieptModel, setSelectRecieptModel] = useState(false);
  const [selectAmoutModel, setSelectAmoutModel] = useState(false);
  const [selectDeliveryMethod, setSelectDeliveryMethod] = useState(false);
  const [recieptDetailsModel, setRecieptDetailsModel] = useState(false);
  const [confirmationModel, setConfirmationModel] = useState(false)

  const [sendData, setSendData] = useState({ amount: 0, paymentMethod: "", deliveryMode: "", reciverAccountNumber: "", reciverCountry: "", reciverCity: "", reciverAddress: "", reciverPhone: "", name: "", email: "", existingScript: false, bankName: "" })



  const fetchWalletInfo = async () => {
    let res = await axios.get(`${config.baseUrl}/wallet/user/${localStorage.getItem("uId")}`)
    const tax = await axios.get(`${config.baseUrl}/tax/single`);
    settaxData(tax?.data?.data)


    setWalletData(res?.data?.data)
  }
  const fetchProfileInfo = async () => {
    let res = await axios.get(`${config.baseUrl}/account/single/${localStorage.getItem("uId")}`)
    setProfileData(res?.data?.data)
  }
  const fetchRecieptData = async () => {
    try {
      let res = await axios.get(`${config.baseUrl}/reciept/user/${localStorage.getItem("uId")}`);
      setRecieptData(res?.data?.data);
    }
    catch (error) {
      console.error("Error fetching hotline data:", error);
    }
  };

  useEffect(() => {
    fetchWalletInfo();
    fetchProfileInfo();
    fetchRecieptData();
  }, []);

  const handleReferClick = () => {
    setShowReferModal(true);
  };

  const handleCloseModal = () => {
    setShowReferModal(false);
  };

  const handleSendMoney = async () => {
    let loader = toast.loading("Processing Request")
    try {
      console.log(sendData.amount)
      console.log((sendData.amount + (sendData.amount / 100) * taxData?.value))
      let stripeRes = await axios.post(`https://ngoc-backend.vercel.app/create-checkout-session`, { amount: (sendData.amount + (sendData.amount / 100) * taxData?.value) })
      let formData = new FormData()
      formData.append("userId", localStorage.getItem("uId"))
      formData.append("amount", sendData.amount)
      formData.append("paymentMethod", sendData.paymentMethod)
      formData.append("deliveryMode", sendData.deliveryMode)
      formData.append("reciverAccountNumber", sendData.reciverAccountNumber)
      formData.append("reciverCity", sendData.reciverCity)
      formData.append("reciverCountry", sendData.reciverCountry)
      formData.append("reciverOtherInfo", JSON.stringify({ name: sendData.name, email: sendData.email, bankName: sendData?.bankName, address: sendData.reciverAddress, phone: sendData.reciverPhone }));

      let res = await axios.post(`${config.baseUrl}/transfer/create`, formData)
      if (res.data) {
        if (res.data && sendData.paymentMethod === "card") {
          toast.dismiss(loader)
          window.location.href = stripeRes.data?.url;
        }
        toast.dismiss(loader)
        toast.success("Payment Send Sucessfully")
        setConfirmationModel(false)
      }



    }
    catch (error) {
      toast.dismiss(loader)
      console.log(error)
    }
  }

  function generateRandomCode() {
    const part1 = Math.floor(100 + Math.random() * 900); // 100 - 999
    const part2 = Math.floor(100 + Math.random() * 900); // 100 - 999
    const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    return `${part1}-${part2}${letter}`;
  }

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const response = await axios.get(
          `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
        );
        console.log(response?.data)
        const rate = response.data.conversion_rates.VND;
        console.log(typeof sendData.amount, sendData.amount, 'sendData.amount')
        // setVnd((((sendData.amount / 100) * taxData?.value) * rate).toFixed(2));
        setVnd((sendData.amount * rate).toFixed(2));
      }
      catch (error) {
        console.error("Error fetching exchange rate", error);
      }
    };

    fetchRate();
  }, [sendData]);



  return (


    <div className="flex-1 overflow-x-auto flex items-start gap-x-10 flex-wrap">

      <div className="md:mt-0 mt-3 flex-1 border-r">

        <div className="bg-[#E3FAFF] rounded-tr-2xl rounded-tl-2xl md:w-[26.5rem] w-[100%]">
          <p className="text-lg text-[#324B50] p-3">My wallets</p>

          <div className="bg-[#324B50] rounded-xl p-5">

            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-[1.5rem] font-semibold text-white">$ {walletData?.accumulated?.toFixed(2)}</h1>
                <p className="text-[#ABABAB]">accumulated</p>
              </div>
              <div>
                <h1 className="text-[1.5rem] font-semibold text-white">$ {walletData?.cashOut?.toFixed(2)}</h1>
                <p className="text-[#ABABAB]">For cash out</p>
              </div>
            </div>

            <div className="flex justify-between items-center mt-[1rem]">
              <Link to={"/dashboard/wallet"}><button className="text-white bg-[#3D8977] px-4 py-1 rounded-md text-sm">Wallet History</button></Link>
              <MdOutlineSync onClick={fetchWalletInfo} className="text-white text-[1.5rem] cursor-pointer" />
            </div>

          </div>

        </div>

        <div onClick={handleReferClick} className="mt-5 bg-[#F6F6F6] md:w-[26.5rem] w-[100%] px-5 py-2 rounded-md flex justify-between items-center cursor-pointer">
          <p>Reffer Your Friend</p>
          <FaAngleRight className="text-[#D1D1D1]" />
        </div>

        {/* <div className="mt-5 ml-1">
          <p className="font-medium">Pera Padala Promo</p>
          <p className="text-sm">Send 6 get 1 free service fee</p>
          <div className="bg-[#E3FAFF] md:w-[26.5rem] w-[100%] rounded-full px-2 py-3 mt-1 flex items-center gap-x-3">
            <div className="bg-[#9FE7F5] w-7 h-7 rounded-full justify-center items-center flex"><HiSpeakerphone /></div>
            <p className="text-xs">Pera Padala promo has ended. Thank you for joining!</p>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-xl font-semibold">Check this out</h1>
          <img src={Ads} alt="" className="mt-3" />
        </div> */}

      </div>

      <div className="mt-3 flex-1">


        <h1 className="text-xl font-semibold">Our Services</h1>

        <div className="flex items-center gap-x-3 my-3 bg-[#FBFBFB] rounded-full text-sm py-3 px-3 w-fit shadow-xl border">
          <IoIosCash />
          <p>Money Remittance</p>
        </div>

        <div onClick={() => { setSelectRecieptModel(true) }} className="mt-5 rounded-2xl bg-[#E3FAFF] p-3 w-[20rem] cursor-pointer">
          <h1 className="text-xl font-medium">Send Money</h1>
          <p className="text-sm text-[#5895A8AA] mt-3">Send money to the philliphines anytime anywhere</p>
          <div className="mt-[2rem] flex justify-between items-center text-[2rem]">
            <BiMoneyWithdraw />
            <MdArrowOutward />
          </div>
        </div>

        <div className="mt-5">

          <h1 className="text-xl font-semibold">More Features</h1>

          <div className="flex items-center gap-x-3 flex-wrap">

            <Link to={"/dashboard/wallet"}>
              <div className="mt-3 rounded-2xl bg-[#FF3A2F] p-3">
                <h1 className="text-xl font-medium">Transaction history</h1>
                <div className="mt-[1rem] flex justify-between items-center text-[2rem]">
                  <MdOutlineManageHistory />
                  <MdArrowOutward />
                </div>
              </div>
            </Link>


          </div>

        </div>

        {/* <div className="mt-5">

          <h1 className="text-xl font-semibold">Know us more</h1>

          <iframe className="mt-5 rounded-2xl md:w-[26.5rem] w-[100%] " src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>

        </div> */}


      </div>




      {/* Refer Modal */}
      {showReferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[20rem] rounded-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCloseModal} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">Refer your friends</h2>
            {profileData && profileData.qrCodeLink && (<img src={profileData.qrCodeLink} alt="QR Code" className="mx-auto mb-4" />)}
            {profileData && profileData.qrCode && (
              <div className="text-center">
                <p className="text-gray-600">{profileData.qrCode}</p>

                <div className="flex justify-center items-center gap-x-3 text-sm text-[#324B50] mt-4">
                  <FaCopy />
                  <p>Copy Code</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* SEND STAGES */}

      {selectRecieptModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[20rem] rounded-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectRecieptModel(false)} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="mb-4">Who are you sending to ?</h2>
            <div onClick={() => { setSelectRecieptModel(false); setSelectAmoutModel(true) }} className="flex items-center justify-center gap-x-3 bg-[#E3FAFF] text-sm py-2 rounded-md cursor-pointer">
              <FaUserTie />
              <p>Send to a new receiver</p>
            </div>
            <h2 className="my-4">Recent Receiver</h2>
            <div className="mt-3">
              {
                recieptData?.map((i) => {
                  let reciverOtherInfo = {};

                  try {
                    reciverOtherInfo = JSON.parse(i?.reciverOtherInfo);
                  }
                  catch (error) {
                    reciverOtherInfo = { name: "Unknown", email: "" };
                  }

                  return (
                    <div key={i?._id}>
                      <div onClick={() => { setSendData({ ...sendData, existingScript: true, name: JSON.parse(i?.reciverOtherInfo).name, email: JSON.parse(i?.reciverOtherInfo).email, reciverAccountNumber: i?.reciverAccountNumber, reciverCity: i?.reciverCity, reciverCountry: i?.reciverCountry }); setSelectRecieptModel(false); setSelectAmoutModel(true) }} className="border text-sm p-2 rounded-md cursor-pointer mb-2">
                        <p>Name: {reciverOtherInfo.name}</p>
                        <p className="mt-1">Email: {reciverOtherInfo.email}</p>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      )}

      {selectAmoutModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[25rem] rounded-lg relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectAmoutModel(false)} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="mb-4">Enter Amount In USD</h2>
            <h2 className="">You Send</h2>
            <input onChange={(e) => { setSendData({ ...sendData, amount: e.target.value }) }} type="number" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border my-2 px-3 outline-none" placeholder="Enter Amount In USD" />
            <h2 className="">They Recieve</h2>
            <input disabled type="number" value={sendData.amount} name="" id="" className="w-[100%] h-[2.5rem] rounded-md border my-2 px-3 disabled:" placeholder="Enter Amount In USD" />
            <div className="bg-[#E3FAFF] text-sm p-2 rounded-md">
              <p>Summary</p>
              <div className="flex justify-between items-center my-2">
                <p className=" text-sm">Fees</p>
                <p className=" text-sm">{((sendData.amount / 100) * taxData?.value).toFixed(2)} USD</p>
              </div>
              <div className="flex justify-between items-center my-2">
                <p className=" text-sm">Total Amount</p>
                {sendData.amount} USD + ${((sendData.amount / 100) * taxData?.value).toFixed(2)} fees
              </div>
              <div className="flex justify-between items-center my-2">
                <p className=" text-sm">Total Amount Received IN VND</p>
                <p className=" text-sm">{vnd}</p>
              </div>
            </div>
            <button onClick={() => { setSelectAmoutModel(false); setSelectDeliveryMethod(true) }} className="bg-[#E3FAFF] text-sm p-2 rounded-md my-2 w-[100%]">Continue</button>
          </div>
        </div>
      )}

      {selectDeliveryMethod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[25rem] rounded-lg relative">


            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setSelectDeliveryMethod(false)} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            <h2 className="mb-4">Select Delivery Method</h2>

            <button onClick={() => { setSendData({ ...sendData, deliveryMode: "Bank Deposit" }) }} className={`w-[100%] px-3 py-2 mb-2 rounded-md ${sendData?.deliveryMode == "Bank Deposit" ? "bg-[#E3FAFF]" : "border"}`}>Bank Deposit</button>
            <button onClick={() => { setSendData({ ...sendData, deliveryMode: "Home Delivery" }) }} className={`w-[100%] px-3 py-2 mb-2 rounded-md ${sendData?.deliveryMode == "Home Delivery" ? "bg-[#E3FAFF]" : "border"}`}>Home Delivery</button>
            <button onClick={() => { setSendData({ ...sendData, deliveryMode: "Cash Pickup" }) }} className={`w-[100%] px-3 py-2 mb-2 rounded-md ${sendData?.deliveryMode == "Cash Pickup" ? "bg-[#E3FAFF]" : "border"}`}>Cash Pickup</button>
            <button onClick={() => { setSendData({ ...sendData, deliveryMode: "Mobile Money" }) }} className={`w-[100%] px-3 py-2 mb-2 rounded-md ${sendData?.deliveryMode == "Mobile Money" ? "bg-[#E3FAFF]" : "border"}`}>Mobile Money</button>
            <button onClick={() => { setSendData({ ...sendData, deliveryMode: "Debit Card Deposit" }) }} className={`w-[100%] px-3 py-2 mb-2 rounded-md ${sendData?.deliveryMode == "Debit Card Deposit" ? "bg-[#E3FAFF]" : "border"}`}>Debit Card Deposit</button>


            <button onClick={() => { setRecieptDetailsModel(true); setSelectDeliveryMethod(false) }} className="bg-[#E3FAFF] text-sm p-2 rounded-md my-2 w-[100%]">Continue</button>
          </div>
        </div>
      )}


      {recieptDetailsModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 w-[25rem] rounded-lg relative">


            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setRecieptDetailsModel(false)} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            <h2 className="mb-4">Receiver Details</h2>


            {
              sendData?.existingScript ?
                <div>

                  <input defaultValue={sendData?.name} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Name" />
                  <input defaultValue={sendData?.email} disabled type="email" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Email" />
                  <input defaultValue={sendData?.reciverCountry} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Country" />
                  <input defaultValue={sendData?.reciverCity} disabled type="text" name="" id="" className=" cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver City" />
                  <input defaultValue={sendData?.reciverAccountNumber} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Account Number" />
                </div>
                :

                <div>
                  <input onChange={(e) => { setSendData({ ...sendData, name: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Name" />
                  <input onChange={(e) => { setSendData({ ...sendData, email: e.target.value }) }} type="email" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Email" />
                  <input onChange={(e) => { setSendData({ ...sendData, reciverCountry: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Country" />
                  <input onChange={(e) => { setSendData({ ...sendData, reciverCity: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver City" />
                  {sendData?.deliveryMode == "Bank Deposit" && <input onChange={(e) => { setSendData({ ...sendData, bankName: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Bank Name" />}
                  {sendData?.deliveryMode == "Home Delivery" && <input onChange={(e) => { setSendData({ ...sendData, reciverAddress: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Receiver Address" />}
                  {sendData?.deliveryMode == "Home Delivery" && <input onChange={(e) => { setSendData({ ...sendData, reciverPhone: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Receiver Phone Number" />}

                  <input onChange={(e) => { setSendData({ ...sendData, reciverAccountNumber: e.target.value }) }} type="text" name="" id="" className="w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Account Number" />
                </div>
            }



            <button onClick={() => { setSendData({ ...sendData, paymentMethod: "card" }); setRecieptDetailsModel(false); setConfirmationModel(!confirmationModel) }} className="bg-[#E3FAFF] text-sm p-2 rounded-md my-2 w-[100%]">Pay Via Card</button>


            <p className="text-center">Or</p>

            <button onClick={() => { setSendData({ ...sendData, paymentMethod: "zelle" }); setRecieptDetailsModel(false); setConfirmationModel(!confirmationModel) }} className="bg-[#E3FAFF] text-sm p-2 rounded-md my-2 w-[100%]">Zelle to Zelle</button>
            <p className="mb-1">Zelle Phone: 7202264972</p>
            <p className="mb-1">Payablle To: Ngoc Anh Services</p>
            <p className="mb-1">Code: {generateRandomCode()}</p>
            <p className="mb-1 text-sm text-red-600">Message or Memo: Please include this code in the message or memo field when send with Zelle</p>



          </div>
        </div>
      )}

      {confirmationModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 max-h-[89vh] overflow-y-auto w-[25rem] rounded-lg relative">


            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setConfirmationModel(false)} >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>


            <h2 className="mb-4">Summary</h2>


            {
              sendData?.existingScript ?
                <div>

                  <input defaultValue={sendData?.name} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Name" />
                  <input defaultValue={sendData?.email} disabled type="email" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Email" />
                  <input defaultValue={sendData?.reciverCountry} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Country" />
                  <input defaultValue={sendData?.reciverCity} disabled type="text" name="" id="" className=" cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver City" />
                  <input defaultValue={sendData?.reciverAccountNumber} disabled type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Account Number" />
                </div>
                :

                <div>
                  <input defaultValue={sendData?.name} onChange={(e) => { setSendData({ ...sendData, name: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Name" />
                  <input defaultValue={sendData?.email} onChange={(e) => { setSendData({ ...sendData, email: e.target.value }) }} type="email" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Email" />
                  <input defaultValue={sendData?.reciverCountry} onChange={(e) => { setSendData({ ...sendData, reciverCountry: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Country" />
                  <input defaultValue={sendData?.reciverCity} onChange={(e) => { setSendData({ ...sendData, reciverCity: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver City" />
                  {sendData?.deliveryMode == "Bank Deposit" && <input defaultValue={sendData?.bankName} onChange={(e) => { setSendData({ ...sendData, bankName: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Bank Name" />}
                  {sendData?.deliveryMode == "Home Delivery" && <input defaultValue={sendData?.reciverAddress} onChange={(e) => { setSendData({ ...sendData, reciverAddress: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Receiver Address" />}
                  {sendData?.deliveryMode == "Home Delivery" && <input defaultValue={sendData?.reciverPhone} onChange={(e) => { setSendData({ ...sendData, reciverPhone: e.target.value }) }} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Receiver Phone Number" />}
                  <input onChange={(e) => { setSendData({ ...sendData, reciverAccountNumber: e.target.value }) }} defaultValue={sendData?.reciverAccountNumber} type="text" name="" id="" className="cursor-not-allowed w-[100%] h-[2.5rem] rounded-md border mt-2 px-3 outline-none" placeholder="Enter Receiver Account Number" />
                </div>
            }

            <div className="bg-[#E3FAFF] text-sm p-2 rounded-md mt-2">
              <p>Summary</p>
              <div className="flex justify-between items-center my-2">
                <p>Fees</p>
                {
                  sendData.paymentMethod !== "card" ? (<p>{((sendData.amount / 100) * taxData?.value).toFixed(2)} USD</p>)
                    :
                    (<p>{((sendData.amount / 100) * 4).toFixed(2)} USD</p>)
                }
              </div>
              {
                sendData.paymentMethod !== "card" ?
                  <div className="flex justify-between items-center my-2">
                    <p>Total Amount</p>
                    {sendData.amount} USD + ${((sendData.amount / 100) * taxData?.value).toFixed(2)} fees
                  </div>
                  :
                  <div className="flex justify-between items-center my-2">
                    <p>Total Amount</p>
                    {sendData.amount} USD + ${((sendData.amount / 100) * 4).toFixed(2)} fees
                  </div>
              }
              <div className="flex justify-between items-center my-2">
                <p className=" text-sm">Total Amount Received IN VND</p>
                <p className=" text-sm">{vnd}</p>
              </div>
            </div>
            <button onClick={handleSendMoney} className="bg-[#E3FAFF] text-sm p-2 rounded-md my-2 w-[100%]">Pay Now</button>
            {
              sendData.paymentMethod !== "card" && (
                <div>
                  <p className="mb-1 text-sm">Zelle instruction: Please send “ total amount with fees”  to this zelle after you done with the transaction. <br />  Zelle phone : 7202264972 <br />  Payable to : Ngoc Anh Services</p>
                  <p className="mb-1 text-sm">Code: {generateRandomCode()}</p>
                  <p className="mb-1 text-sm text-red-600">Message or Memo: Please include this code in the message or memo field when send with Zelle. Your money will not be sent before Zelle is received.</p>
                </div>
              )
            }



          </div>
        </div>
      )}


    </div>
  );
};

export default HomePage;