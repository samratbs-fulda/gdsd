import { Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout, theme } from 'antd';
const { Header, Content, Footer } = Layout;
import Homepage from "./pages/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import React from "react";
import Chat from "./pages/Chat/Chat";
import "./App.css";
import ListingDetailsPage from "./pages/ListingDetailsPage/ListingDetailsPage";
import FindFulHeader from "./components/header/FindFulHeader";
import FindFulFooter from "./components/footer/FindFulFooter";
import AddListing from "./pages/AddListing/AddListing";
import ProfileEditPage from "./pages/ProfileEditPage"; 


const App = () => {
  const { token } = theme.useToken();
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          // Customization possible here
        }}
      >
      </ConfigProvider>
      <Layout className='main-layout'>
        <Header><FindFulHeader /></Header>

        <Content className='route-content'>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes to moderator */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="MODERATOR">
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes to landlord */}
            <Route path="/listing/add" element={
              <ProtectedRoute requiredRole="LANDLORD">
                <AddListing />
              </ProtectedRoute>
            } />

            <Route path="/chat" element={<Chat />} />
            <Route path="/listing/:id" element={<ListingDetailsPage />} />
            <Route path="/profile/:id" element={<ProfileEditPage />} />

          </Routes>
        </Content>

        <Footer><FindFulFooter /></Footer>
      </Layout>
    </div>
  );
};

export default App;
