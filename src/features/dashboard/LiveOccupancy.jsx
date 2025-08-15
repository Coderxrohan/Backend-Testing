import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';

const LiveOccupancy = ({ data = [] }) => {
    return (
        <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#009688' }}>
                Live Occupancy
            </Typography>
            <Grid container spacing={1}>
                {data.map((cab, idx) => (
                    <Grid size={3} key={idx}>
                        <Box
                            sx={{
                                bgcolor: '#e0f2f1',
                                borderRadius: 2,
                                textAlign: 'center',
                                p: 1,
                                fontWeight: 500,
                                color: '#004d40',
                                fontSize: '0.75rem'
                            }}
                        >
                            {cab}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default LiveOccupancy;