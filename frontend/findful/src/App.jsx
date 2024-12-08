import { Routes, Route } from "react-router-dom";
import { ConfigProvider, Layout, theme } from 'antd';
const { Header, Content, Footer } = Layout;
import Homepage from "./pages/Homepage";
import Dashboard from "./pages/dashboard/Dashboard";
import React from "react";
import Chat from "./pages/Chat/Chat";
import "./App.css";
import ListingDetailsPage from "./pages/ListingDetailsPage";
import FindFulHeader from "./components/header/FindFulHeader";
import FindFulFooter from "./components/footer/FindFulFooter";

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
            <Route path="/" element={<Homepage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/listing/:listingid" element={<ListingDetailsPage />} />
          </Routes>
        </Content>

        <Footer><FindFulFooter /></Footer>
      </Layout>
    </div>
  );
};

export default App;
