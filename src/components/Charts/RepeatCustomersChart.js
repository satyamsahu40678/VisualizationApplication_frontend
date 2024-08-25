// src/components/Charts/RepeatCustomersChart.js
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
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

function RepeatCustomersChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [rawData, setRawData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepeatCustomersData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/repeat-customers`);
        const data = response.data || [];

        if (data.length === 0) {
          setChartData(null);
          setError(false);
        } else {
          // Assuming we might have more data in the future
          const filteredData = data.filter(item => 
            item.someField.toLowerCase().includes(search.toLowerCase()) // Example field for filtering
          );

          if (filteredData.length === 0) {
            setChartData(null);
          } else {
            setChartData({
              labels: ['Repeat Customers'],
              datasets: [
                {
                  label: 'Count',
                  data: [filteredData[0].count], // Only one value in the array
                  backgroundColor: 'rgba(54,162,235,0.6)',
                  borderColor: 'rgba(54,162,235,1)',
                  borderWidth: 1,
                },
              ],
            });
          }
          setRawData(data); // Save raw data for filtering
          setError(false);
        }
      } catch (error) {
        console.error('Error fetching repeat customers data', error);
        setChartData(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRepeatCustomersData();
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  if (loading) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        <NoDataMessage>Loading chart data...</NoDataMessage>
        <BlankChart>
          <p>Loading...</p>
        </BlankChart>
      </ChartContainer>
    );
  }

  if (error) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        <NoDataMessage>There was an error fetching repeat customers data.</NoDataMessage>
        <BlankChart>
          <p>No Data</p>
        </BlankChart>
      </ChartContainer>
    );
  }

  if (!chartData) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        <NoDataMessage>No repeat customers data available to display.</NoDataMessage>
        <BlankChart>
          <p>No Data</p>
        </BlankChart>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
      <ChartTitle>Repeat Customers</ChartTitle>
      <Input 
        type="text" 
        placeholder="Search by criteria" 
        value={search} 
        onChange={handleSearchChange} 
      />
      <Bar data={chartData} />
    </ChartContainer>
  );
}

export default RepeatCustomersChart;
