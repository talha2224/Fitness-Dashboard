
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import LoaderGif from './assets/loader.gif';
// import ProfilePage from './pages/Dashboard/ProfilePage';
// import HotlinePage from './pages/Dashboard/HotlinePage';
// import SendPage from './pages/Dashboard/SendPage';
// import SettingsPage from './pages/Dashboard/SettingsPage';
// import LandingPage from './pages/LandingPage';
// import WalletHistoryPage from './pages/Dashboard/WalletHistoryPage';
// const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
// const Layout = lazy(() => import('./components/dashboard/Layout'));
// const HomePage = lazy(() => import('./pages/Dashboard/HomePage'));
// import VerifyPage from './pages/Auth/VerifyPage';

import LoginPage from './pages/Auth/LoginPage';
import AdminHomePage from './pages/Admin/Dashboard/AdminHomePage';
import AdminTransactionage from './pages/Admin/Dashboard/AdminTransactionage';
import AdminUserPage from './pages/Admin/Dashboard/AdminUserPage';
import AdminDietPlan from './pages/Admin/Dashboard/AdminDietPlan';
import ExercisePlan from './pages/Admin/Dashboard/ExercisePlan';
const AdminLayout = lazy(() => import('./components/admin/Layout'));


function SuspenseWithDelay({ children, fallback, delay = 0, minDisplayTime = 2000 }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), minDisplayTime);
    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  return isLoading ? (
    <div className="flex justify-center items-center w-screen h-screen">
      <img src={LoaderGif} alt="Loading..." className="h-[6rem]" />
    </div>
  ) : (
    <Suspense fallback={fallback}>{children}</Suspense>
  );
}

function App() {

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <SuspenseWithDelay fallback={<div className="flex justify-center items-center w-screen h-screen"><img src={LoaderGif} alt="HopOn Dashboard- Loader" className="h-[6rem]" /></div>} minDisplayTime={2000}>

          <Routes>

            <Route path="/admin/dashboard/" element={<AdminLayout />}>
              <Route path="home" element={<AdminHomePage />} />
              <Route path="user" element={<AdminUserPage />} />
              <Route path="transaction" element={<AdminTransactionage />} />
              <Route path="diet" element={<AdminDietPlan />} />
              <Route path="exercise" element={<ExercisePlan />} />
            </Route>


            <Route path='/' element={<LoginPage />} />

            {/* <Route path='/login' element={<LoginPage />} /> */}
            {/* <Route path='/register' element={<RegisterPage />} />
            <Route path='/verify' element={<VerifyPage />} /> */}


            {/* <Route path="/dashboard/" element={<Layout />}>
              <Route path="home" element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="hotline" element={<HotlinePage />} />
              <Route path="send" element={<SendPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="wallet" element={<WalletHistoryPage />} />
            </Route> */}


          </Routes>
        </SuspenseWithDelay>
      </BrowserRouter>
    </>
  );
}

export default App;
