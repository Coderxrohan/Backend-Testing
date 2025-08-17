import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function DashboardPage() {
    const [topRevenue, setTopRevenue] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/revenue')
            .then(res => res.json())
            .then(data => setTopRevenue(data));
    }, []);
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>
            <Typography>View top revenue and analytics here.</Typography>
            {/* Render topRevenue table here if needed */}
        </Box>
    );
}
