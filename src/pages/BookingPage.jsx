import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

export default function BookingPage() {
    const [bookings, setBookings] = useState([]);
    useEffect(() => {
        fetch('http://localhost:5000/api/reports')
            .then(res => res.json())
            .then(data => setBookings(data));
    }, []);
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Booking
            </Typography>
            <Typography>Manage and monitor bookings here.</Typography>
            {/* Render bookings table here if needed */}
        </Box>
    );
}
