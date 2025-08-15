import React from 'react';
import { Box, Typography } from '@mui/material';

export default function NotificationsPage() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Notifications
            </Typography>
            <Typography>View and manage notifications here.</Typography>
        </Box>
    );
}
