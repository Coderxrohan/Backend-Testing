import React from 'react';
import { Paper, Typography, Avatar, List, ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material';

const Customers = ({ data = [] }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#009688' }}>
                    Customers
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                    Sort by Newest ▼
                </Typography>
            </Box>
            <List>
                {data.map((cust, idx) => (
                    <ListItem key={idx} disableGutters>
                        <ListItemAvatar>
                            <Avatar src={cust.avatar} sx={{ bgcolor: '#009688' }}>
                                {cust.name.charAt(0)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={cust.name} secondary={cust.company} />
                    </ListItem>
                ))}
            </List>
            <Typography variant="body2" sx={{ color: '#009688', cursor: 'pointer', mt: 2 }}>
                All customers →
            </Typography>
        </Paper>
    );
};

export default Customers;