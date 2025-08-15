import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, LinearProgress, Box } from '@mui/material';

const TopRoutes = ({ data }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#009688' }}>
                Top Routes
            </Typography>
            <List>
                {data.map((route, idx) => (
                    <ListItem key={idx} disableGutters sx={{ flexDirection: 'column', alignItems: 'flex-start', mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {route.route}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {route.value}K
                            </Typography>
                        </Box>
                        <LinearProgress
                            variant="determinate"
                            value={route.percentage || (route.value / 120) * 100}
                            sx={{
                                width: '100%',
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: '#fff3e0',
                                '& .MuiLinearProgress-bar': { backgroundColor: '#009688' },
                            }}
                        />
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
};

export default TopRoutes;