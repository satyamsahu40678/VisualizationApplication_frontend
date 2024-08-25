// src/components/Charts/CustomerLifetimeValueChart.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
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

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TitleStyled = styled.h2`
  text-align: center;
  color: #333;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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

const Message = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
`;

function CustomerLifetimeValueChart() {
  const [chartData, setChartData] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerLifetimeValue = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/customer-lifetime-value`, {
          params: { limit: 10, search }
        });
        const data = response.data || [];

        if (data.length === 0) {
          setChartData({
            labels: [],
            datasets: [
              {
                label: 'Total Spent',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#ffffff',
                pointHoverRadius: 7,
                tension: 0.1,
              },
            ],
          });
        } else {
          const labels = data.map((item) => `${item.firstName} ${item.lastName}`);
          const values = data.map((item) => item.totalSpent);

          setChartData({
            labels,
            datasets: [
              {
                label: 'Total Spent',
                data: values,
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderWidth: 2,
                pointRadius: 5,
                pointBorderColor: 'rgba(75,192,192,1)',
                pointBackgroundColor: '#ffffff',
                pointHoverRadius: 7,
                tension: 0.1,
              },
            ],
          });
        }
      } catch (error) {
        console.error('Error fetching customer lifetime value data', error);
        setError('Error fetching data. Please try again later.');
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerLifetimeValue();
  }, [search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  if (loading) {
    return <Message>Loading chart data...</Message>;
  }

  if (error) {
    return (
      <Container>
        <Message>{error}</Message>
      </Container>
    );
  }

  return (
    <Container>
      <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
      <TitleStyled>Customer Lifetime Value</TitleStyled>
      <Input 
        type="text" 
        placeholder="Search by name or email" 
        value={search} 
        onChange={handleSearchChange} 
      />
      {chartData && <Line data={chartData} />}
    </Container>
  );
}

export default CustomerLifetimeValueChart;
