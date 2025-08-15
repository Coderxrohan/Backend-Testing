// src/pages/CabVendorManagementPage.jsx
import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    TextField,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const CabVendorManagementPage = () => {
    const [vendors, setVendors] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [vendorForm, setVendorForm] = useState({
        name: "",
        contact: "",
        address: "",
        kycStatus: "Pending",
    });
    const [driverAllocation, setDriverAllocation] = useState({
        vendorId: "",
        driverName: "",
        vehicleNumber: "",
    });
    const [vendorMetrics, setVendorMetrics] = useState({});

    useEffect(() => {
        // Mock data until API is ready
        setVendors([
            { id: 1, name: "City Cab Services", contact: "9876543210", address: "Pune", kycStatus: "Verified" },
            { id: 2, name: "Urban Taxi", contact: "9123456780", address: "Mumbai", kycStatus: "Pending" },
        ]);
        setVendorMetrics({
            1: { cancellationRate: "2%", punctuality: "95%", rating: 4.7 },
            2: { cancellationRate: "5%", punctuality: "89%", rating: 4.3 },
        });
    }, []);

    const handleOpenForm = (vendor = null) => {
        setEditingVendor(vendor ? vendor.id : null);
        setVendorForm(
            vendor || { name: "", contact: "", address: "", kycStatus: "Pending" }
        );
        setOpenForm(true);
    };

    const handleSaveVendor = () => {
        if (editingVendor) {
            setVendors(vendors.map(v => v.id === editingVendor ? vendorForm : v));
        } else {
            setVendors([...vendors, { ...vendorForm, id: Date.now() }]);
        }
        setOpenForm(false);
    };

    const handleDeleteVendor = (id) => {
        setVendors(vendors.filter(v => v.id !== id));
    };

    const handleAllocateDriver = () => {
        alert(`Allocated ${driverAllocation.driverName} to Vendor ID: ${driverAllocation.vendorId}`);
        setDriverAllocation({ vendorId: "", driverName: "", vehicleNumber: "" });
    };

    return (
        <Box sx={{ p: 3, backgroundColor: "#f9fafb", minHeight: "100vh" }}>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: "#111827" }}>
                Cab Vendor Management
            </Typography>

            {/* Add Vendor Button */}
            <Button
                variant="contained"
                sx={{
                    backgroundColor: '#009688',
                    "&:hover": { backgroundColor: '#009688' },
                    borderRadius: "8px",
                    mb: 2
                }}
                onClick={() => handleOpenForm()}
            >
                + Add Vendor
            </Button>

            {/* Vendors Table */}
            <Paper sx={{ mb: 4, p: 2, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Vendor List</Typography>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Vendor Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>KYC Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vendors.map((vendor) => (
                            <TableRow key={vendor.id} hover>
                                <TableCell>{vendor.name}</TableCell>
                                <TableCell>{vendor.contact}</TableCell>
                                <TableCell>{vendor.address}</TableCell>
                                <TableCell>{vendor.kycStatus}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenForm(vendor)}><Edit color="primary" /></IconButton>
                                    <IconButton onClick={() => handleDeleteVendor(vendor.id)}><Delete color="error" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Driver Allocation */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Driver Allocation</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <FormControl fullWidth>
                            <InputLabel>Vendor</InputLabel>
                            <Select
                                value={driverAllocation.vendorId}
                                onChange={(e) => setDriverAllocation({ ...driverAllocation, vendorId: e.target.value })}
                            >
                                {vendors.map(v => <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Driver Name"
                            value={driverAllocation.driverName}
                            onChange={(e) => setDriverAllocation({ ...driverAllocation, driverName: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            label="Vehicle Number"
                            value={driverAllocation.vehicleNumber}
                            onChange={(e) => setDriverAllocation({ ...driverAllocation, vehicleNumber: e.target.value })}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#009688',
                                "&:hover": { backgroundColor: '#009688' },
                                borderRadius: "8px"
                            }}
                            onClick={handleAllocateDriver}
                        >
                            Allocate Driver
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Vendor Performance Metrics */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>Vendor Performance Metrics</Typography>
            <Grid container spacing={2}>
                {vendors.map(vendor => (
                    <Grid item xs={4} key={vendor.id}>
                        <Card sx={{ borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <CardContent>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {vendor.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Cancellation Rate: {vendorMetrics[vendor.id]?.cancellationRate || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Punctuality: {vendorMetrics[vendor.id]?.punctuality || "N/A"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    User Ratings: {vendorMetrics[vendor.id]?.rating || "N/A"}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Vendor Form Dialog */}
            <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editingVendor ? "Edit Vendor" : "Add Vendor"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Vendor Name"
                        sx={{ mb: 2, mt: 1 }}
                        value={vendorForm.name}
                        onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Contact"
                        sx={{ mb: 2 }}
                        value={vendorForm.contact}
                        onChange={(e) => setVendorForm({ ...vendorForm, contact: e.target.value })}
                    />
                    <TextField
                        fullWidth
                        label="Address"
                        sx={{ mb: 2 }}
                        value={vendorForm.address}
                        onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                    />
                    <FormControl fullWidth>
                        <InputLabel>KYC Status</InputLabel>
                        <Select
                            value={vendorForm.kycStatus}
                            onChange={(e) => setVendorForm({ ...vendorForm, kycStatus: e.target.value })}
                        >
                            <MenuItem value="Pending">Pending</MenuItem>
                            <MenuItem value="Verified">Verified</MenuItem>
                            <MenuItem value="Rejected">Rejected</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenForm(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#009688',
                            "&:hover": { backgroundColor: '#009688' }
                        }}
                        onClick={handleSaveVendor}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CabVendorManagementPage;
