// src/components/Charts/NewCustomersChart.js
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
    PointElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register necessary components
ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
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

const Message = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
`;

const ErrorMessage = styled(Message)`
  color: #ff6f61;
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

function NewCustomersChart() {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [rawData, setRawData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNewCustomersData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/new-customers`);
        const data = response.data || [];
        const filteredData = data.filter(item => {
          const searchTerm = search.toLowerCase();
          return (`${item._id.month}/${item._id.year}`).includes(searchTerm);
        });

        if (filteredData.length === 0) {
          setChartData(null);
          return;
        }

        const labels = filteredData.map((item) => `${item._id.month}/${item._id.year}`);
        const values = filteredData.map((item) => item.count);

        setChartData({
          labels,
          datasets: [
            {
              label: 'New Customers',
              data: values,
              fill: false,
              backgroundColor: 'rgba(255,159,64,0.6)',
              borderColor: 'rgba(255,159,64,1)',
            },
          ],
        });
        setRawData(data); // Save raw data for filtering
        setError(false);
      } catch (error) {
        console.error('Error fetching new customers data', error);
        setChartData(null);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNewCustomersData();
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  if (loading) {
    return <Message>Loading chart data...</Message>;
  }

  if (error) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        <ErrorMessage>There was an error fetching new customers data.</ErrorMessage>
      </ChartContainer>
    );
  }

  if (!chartData) {
    return (
      <ChartContainer>
        <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
        <Message>No new customers data available to display.</Message>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
      <ChartTitle>New Customers Over Time</ChartTitle>
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

export default NewCustomersChart;
