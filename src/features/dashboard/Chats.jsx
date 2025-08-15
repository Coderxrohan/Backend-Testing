import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Box, Avatar } from '@mui/material';

const Chats = ({ data = {} }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#009688' }}>
                Chats
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                {data?.unreadCount || 0} unread messages
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                {data?.users?.map((user, idx) => (
                    <Avatar
                        key={idx}
                        src={user.avatar}
                        sx={{ width: 32, height: 32, bgcolor: '#009688' }}
                    >
                        {user.name?.charAt(0)}
                    </Avatar>
                )) || []}
            </Box>
            <Typography variant="body2" sx={{ color: '#009688', cursor: 'pointer' }}>
                All messages →
            </Typography>
        </Paper>
    );
};

export default Chats;