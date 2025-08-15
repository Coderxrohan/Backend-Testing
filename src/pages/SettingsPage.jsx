import React from 'react';
import { Box, Typography } from '@mui/material';

export default function SettingsPage() {
    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>
                Settings
            </Typography>
            <Typography>Update application settings here.</Typography>
        </Box>
    );
}
