// src/components/Charts/SalesGrowthRateChart.js
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

const LoadingMessage = styled.p`
  text-align: center;
  color: #666;
  font-size: 1.2rem;
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: #ff6f61;
  font-size: 1.2rem;
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

function SalesGrowthRateChart() {
    const [chartData, setChartData] = useState(null);
    const [search, setSearch] = useState('');
    const [rawData, setRawData] = useState([]);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGrowthRateData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/sales-growth-rate`);
                const data = response.data || [];
                setRawData(data);

                // Apply search filter if necessary
                const filteredData = data.filter(item => {
                    const searchTerm = search.toLowerCase();
                    return (`${item.month}/${item.year}`).toLowerCase().includes(searchTerm);
                });

                if (filteredData.length === 0) {
                    setChartData(null);
                    return;
                }

                const labels = filteredData.map((item) => `${item.month}/${item.year}`);
                const values = filteredData.map((item) => parseFloat(item.growthRate.replace('%', '')) || 0);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Sales Growth Rate Over Time',
                            data: values,
                            borderColor: 'rgba(153,102,255,1)',
                            fill: false,
                        },
                    ],
                });
            } catch (error) {
                console.error('Error fetching growth rate data', error);
                setError(true);
            }
        };

        fetchGrowthRateData();
    }, [search]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    if (error) {
        return (
            <ChartContainer>
                <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
                <ErrorMessage>There was an error fetching the growth rate data.</ErrorMessage>
            </ChartContainer>
        );
    }

    if (!chartData) {
        return <LoadingMessage>Loading chart data...</LoadingMessage>;
    }

    return (
        <ChartContainer>
            <BackButton onClick={() => navigate('/')} aria-label="Back to Home">Back to Home</BackButton>
            <ChartTitle>Sales Growth Rate Over Time</ChartTitle>
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

export default SalesGrowthRateChart;
