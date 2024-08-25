// src/components/Charts/SalesOverTimeChart.js
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const ChartContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitle = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
`;

const NoDataMessage = styled.p`
  text-align: center;
  color: #ff6f61;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const BlankChart = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
`;

const BackButton = styled.button`
  display: block;
  margin: 1rem auto;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

function SalesOverTimeChart() {
  const [chartData, setChartData] = useState(null);
  const [search, setSearch] = useState('');
  const [rawData, setRawData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/sales-over-time`);
        const data = response.data || [];
        setRawData(data);

        // Apply search filter if necessary
        const filteredData = data.filter(item => {
          const searchTerm = search.toLowerCase();
          return (`${item._id.month}/${item._id.year}`).toLowerCase().includes(searchTerm);
        });

        if (filteredData.length === 0) {
          setChartData(null);
          return;
        }

        const labels = filteredData.map((item) => `${item._id.month}/${item._id.year}`);
        const values = filteredData.map((item) => item.totalSales);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Total Sales Over Time',
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              borderWidth: 2,
              pointRadius: 5,
              pointBorderColor: 'rgba(75,192,192,1)',
              pointBackgroundColor: '#ffffff',
              pointHoverRadius: 7,
              tension: 0.1, // For smooth curves
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching sales data', error);
        setError(true);
      }
    };

    fetchSalesData();
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  if (error) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
        <NoDataMessage>There was an error fetching the sales data.</NoDataMessage>
      </ChartContainer>
    );
  }

  if (chartData === null) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
        <NoDataMessage>No sales data available to display.</NoDataMessage>
        <BlankChart>
          <p>No Data</p>
        </BlankChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
      <ChartTitle>Sales Over Time</ChartTitle>
      <Input 
        type="text" 
        placeholder="Search by month/year" 
        value={search} 
        onChange={handleSearchChange} 
      />
      <Line data={chartData} />
    </ChartContainer>
  );
}

export default SalesOverTimeChart;
