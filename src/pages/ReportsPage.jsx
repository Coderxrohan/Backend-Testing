import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function ReportsPage() {
    const [reports, setReports] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/reports')
            .then(res => res.json())
            .then(data => setReports(data));
    }, []);
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Reports
            </Typography>
            <Typography>View reports and analytics here.</Typography>
            {/* Render reports table here if needed */}
        </Box>
    );
}
