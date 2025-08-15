import React from 'react';
import { Paper, Typography, Box, LinearProgress, Avatar } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const SummaryCards = ({ type, data }) => {
    const renderCard = () => {
        switch (type) {
            case 'revenues':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Revenues</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Typography variant="h4" sx={{ mr: 1, fontWeight: 700 }}>
                                {data?.value || '15%'}
                            </Typography>
                            <ArrowUpwardIcon sx={{ color: '#009688' }} />
                        </Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {data?.description || 'Increase compared to last week'}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, color: '#009688', fontWeight: 500, cursor: 'pointer' }}>
                            Revenues report →
                        </Typography>
                    </Paper>
                );

            case 'totalBooking':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Booking</Typography>
                        <Typography variant="h4" sx={{ mt: 2, fontWeight: 700 }}>
                            {data?.value || '40,000'}
                        </Typography>
                    </Paper>
                );

            case 'cancellation':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Cancellation</Typography>
                        <Box sx={{ mt: 2 }}>
                            <LinearProgress
                                variant="determinate"
                                value={data?.percentage || 40}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#fff3e0',
                                    '& .MuiLinearProgress-bar': { backgroundColor: '#009688' }
                                }}
                            />
                        </Box>
                        <Typography variant="h5" sx={{ mt: 1, fontWeight: 700 }}>
                            {data?.value || 200}
                        </Typography>
                    </Paper>
                );

            case 'topMonth':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Top month</Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 700, color: '#009688' }}>
                            {data?.month || 'November'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#009688' }}>
                            {data?.year || '2019'}
                        </Typography>
                    </Paper>
                );

            case 'topYear':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>Top year</Typography>
                        <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
                            {data?.year || '2023'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                            {data?.bookings || '96K Booked so far'}
                        </Typography>
                    </Paper>
                );

            case 'topDriver':
                return (
                    <Paper sx={{ p: 2, borderRadius: 3 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>Top Driver</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#009688', mr: 2 }}>
                                {data?.name?.charAt(0) || 'M'}
                            </Avatar>
                            <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {data?.name || 'Maggie Johnson'}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {data?.company || 'Oasis Organic Inc.'}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                );

            default:
                return null;
        }
    };

    return renderCard();
};
export default SummaryCards;