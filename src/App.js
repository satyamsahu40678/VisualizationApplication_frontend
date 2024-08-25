// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalesGrowthRateChart from './components/Charts/SalesGrowthRateChart';
import SalesOverTimeChart from './components/Charts/SalesOverTimeChart';
import GeoDistributionChart from './components/Charts/GeoDistributionChart';
import NewCustomersChart from './components/Charts/NewCustomersChart';
import RepeatCustomersChart from './components/Charts/RepeatCustomersChart';
import CustomerLifetimeValueChart from './components/Charts/CustomerLifetimeValueChart';
import WelcomePage from './components/WelcomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/sales-growth-rate" element={<SalesGrowthRateChart />} />
        <Route path="/sales-over-time" element={<SalesOverTimeChart />} />
        <Route path="/geo-distribution" element={<GeoDistributionChart />} />
        <Route path="/new-customers" element={<NewCustomersChart />} />
        <Route path="/repeate-customers" element={<RepeatCustomersChart />} />
        <Route path="/customer-lifetime-value" element={<CustomerLifetimeValueChart />} />
      </Routes>
    </Router>
  );
}

export default App;
