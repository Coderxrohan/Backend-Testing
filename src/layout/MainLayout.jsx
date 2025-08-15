import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from '../components/sidebar/Sidebar';

export default function MainLayout() {
    return (
        <Box display="flex">
            <Sidebar />
            <Box component="main" flexGrow={1} p={3}>
                <Outlet /> {/* This is where child pages will render */}
            </Box>
        </Box>
    );
}
