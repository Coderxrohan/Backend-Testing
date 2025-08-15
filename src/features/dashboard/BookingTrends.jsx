import React from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BookingTrends = ({ data = [] }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#009688' }}>
                Booking Trends
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="bookings" stroke="#009688" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </Paper>
    );
};

export default BookingTrends;