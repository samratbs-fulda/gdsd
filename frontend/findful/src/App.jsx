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
import { AuthContext } from './services/authContext';

const App = () => {
  const { token } = theme.useToken();
  const { user } = React.useContext(AuthContext);
  return (
    <div className="app">
      <ConfigProvider
        theme={{
          // Customization possible here
          components: {
            Typography: {
              fontSizeHeading1: 40,
            }
          }
        }}
      >

      <Layout className='main-layout'>
          <Paragraph className="project-notice" type="secondary" italic={true} style={{ marginBottom: 0 }}>Fulda University of Applied Sciences Software Engineering Project, Fall 2024 For Demonstration Only</Paragraph>
        <Header><FindFulHeader /></Header>

        <Content className='route-content'>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes to moderator */}
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="MODERATOR" user={user}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Protected routes to landlord */}
            <Route path="/listing/add" element={
              <ProtectedRoute requiredRole="LANDLORD" user={user}>
                <AddListing />
              </ProtectedRoute>
            } />

            <Route path="/chat" element={<Chat />} />
            <Route path="/listing/:id" element={<ListingDetailsPage />} />
          </Routes>
        </Content>

        <Footer><FindFulFooter /></Footer>
      </Layout>
      </ConfigProvider>
    </div>
  );
};

export default App;
