// src/components/Dashboard.js
import React from 'react';
import styled from 'styled-components';
import SalesOverTimeChart from './Charts/SalesOverTimeChart';
import SalesGrowthRateChart from './Charts/SalesGrowthRateChart';
import NewCustomersChart from './Charts/NewCustomersChart';
import RepeatCustomersChart from './Charts/RepeatCustomersChart';
import GeographicalDistributionChart from './Charts/GeographicalDistributionChart';
import CustomerLifetimeValueChart from './Charts/CustomerLifetimeValueChart';

const DashboardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
  background-color: #f4f4f4; /* Example background color */
`;

function Dashboard() {
    return (
        <DashboardContainer>
            <SalesOverTimeChart />
            <SalesGrowthRateChart />
            <NewCustomersChart />
            <RepeatCustomersChart />
            <GeographicalDistributionChart />
            <CustomerLifetimeValueChart />
        </DashboardContainer>
    );
}

export default Dashboard;
