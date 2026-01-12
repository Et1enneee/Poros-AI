import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerDetail from './pages/CustomerDetail';
import InvestmentAdvice from './pages/InvestmentAdvice';
import CustomerManagement from './pages/CustomerManagement';
import AIAdviceDetail from './pages/AIAdviceDetail';
import AdviceHistory from './pages/AdviceHistory';
import { CommunicationManagement } from './pages/CommunicationManagement';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerManagement />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/advice" element={<InvestmentAdvice />} />
          <Route path="/advice-detail/:id" element={<AIAdviceDetail />} />
          <Route path="/advice-history" element={<AdviceHistory />} />
          <Route path="/communications" element={<CommunicationManagement />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
