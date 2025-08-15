import React from 'react';
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssessmentIcon from '@mui/icons-material/Assessment';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
        { text: 'Vendors', icon: <LocalTaxiIcon />, path: '/vendors' },
        { text: 'Cab Operators', icon: <LocalTaxiIcon />, path: '/cab-operators' },
        { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
        { text: 'Booking', icon: <EventNoteIcon />, path: '/booking' },
        { text: 'All reports', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'Notification', icon: <NotificationsIcon />, path: '/notifications' }
    ];

    const handleNavigate = (path) => {
        if (path === '/logout') {
            // Remove localStorage usage and use state management instead
            // localStorage.removeItem('token');
            navigate('/login');
        } else {
            navigate(path);
        }
    };

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#f7f6f3',
                    borderRight: 'none',
                    paddingTop: 2
                }
            }}
        >
            {/* Search bar */}
            <Box sx={{ px: 1.5, mb: 2 }}>
                <input
                    type="text"
                    placeholder="Search"
                    style={{
                        width: 'calc(100% - 4px)',
                        padding: '8px 12px',
                        borderRadius: 8,
                        border: '1px solid #ddd',
                        outline: 'none',
                        boxSizing: 'border-box'
                    }}
                />
            </Box>

            {/* Menu */}
            <List>
                {menuItems.map((item) => (
                    <ListItemButton
                        key={item.text}
                        onClick={() => handleNavigate(item.path)}
                        sx={{
                            borderRadius: 2,
                            mx: 1,
                            mb: 0.5,
                            '&.Mui-selected': { bgcolor: '#e0f2f1' },
                            '&:hover': { bgcolor: '#f1f1f1' }
                        }}
                    >
                        <ListItemIcon sx={{ color: '#555' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: '#333' }} />
                    </ListItemButton>
                ))}
            </List>

            <Divider sx={{ mt: 'auto' }} />

            {/* Footer section */}
            <Box sx={{ mt: 'auto', p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box
                        component="img"
                        src="/api/placeholder/40/40"
                        alt="Admin"
                        sx={{ borderRadius: '50%', mr: 1 }}
                    />
                    <Box>
                        <Typography variant="body2" fontWeight={600}>
                            Gustavo Xavier
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#009688' }}>
                            Admin
                        </Typography>
                    </Box>
                </Box>

                <ListItemButton
                    onClick={() => handleNavigate('/settings')}
                    sx={{ borderRadius: 2, mb: 1 }}
                >
                    <ListItemIcon sx={{ color: '#555' }}>
                        <SettingsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" />
                </ListItemButton>

                <ListItemButton
                    onClick={() => handleNavigate('/logout')}
                    sx={{ borderRadius: 2 }}
                >
                    <ListItemIcon sx={{ color: 'red' }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Log out" sx={{ color: 'red' }} />
                </ListItemButton>
            </Box>
        </Drawer>
    );
}