import React from 'react';
import { Box, Typography } from '@mui/material';

export default function BookingPage() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Booking
            </Typography>
            <Typography>Manage and monitor bookings here.</Typography>
        </Box>
    );
}
