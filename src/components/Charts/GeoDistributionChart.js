// src/components/Charts/GeoDistributionChart.js
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

const Container = styled.div`
  width: 80%;
  margin: 0 auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChartTitleStyled = styled.h2`
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

function GeoDistributionChart() {
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [search, setSearch] = useState('');
    const [rawData, setRawData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGeoDistributionData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/shopify/geo-distribution`);
                const data = response.data.data || [];

                setRawData(data);

                // Apply search filter if necessary
                const filteredData = data.filter(item => {
                    const searchTerm = search.toLowerCase();
                    return (item._id || '').toLowerCase().includes(searchTerm);
                });

                if (filteredData.length === 0) {
                    setChartData(null);
                    return;
                }

                const labels = filteredData.map((item) => item._id || 'Unknown');
                const values = filteredData.map((item) => item.count);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Customer Distribution by City',
                            data: values,
                            backgroundColor: 'rgba(54,162,235,0.2)',
                            borderColor: 'rgba(54,162,235,1)',
                            borderWidth: 1,
                        },
                    ],
                });
                setError(false);
            } catch (error) {
                console.error('Error fetching geo distribution data', error);
                setChartData(null);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchGeoDistributionData();
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
                <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
                <ErrorMessage>There was an error fetching geographical distribution data.</ErrorMessage>
            </Container>
        );
    }

    if (!chartData) {
        return (
            <Container>
                <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
                <Message>No geographical distribution data available to display.</Message>
            </Container>
        );
    }

    return (
        <Container>
            <BackButton onClick={() => navigate('/')}>Back to Home</BackButton>
            <ChartTitleStyled>Geographical Distribution of Customers</ChartTitleStyled>
            <Input 
                type="text" 
                placeholder="Search by city" 
                value={search} 
                onChange={handleSearchChange} 
            />
            <Bar data={chartData} />
        </Container>
    );
}

export default GeoDistributionChart;
