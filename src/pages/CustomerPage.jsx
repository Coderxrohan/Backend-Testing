import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    Avatar,
    IconButton,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import { Search, Block, Visibility } from "@mui/icons-material";

export default function UserManagement() {
    // ---------------- State ----------------
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [openProfileModal, setOpenProfileModal] = useState(false);
    const [users, setUsers] = useState([]);

    // ---------------- Effects ----------------
    useEffect(() => {
        fetch('http://localhost:5000/api/customers')
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    // ---------------- Functions ----------------
    const handleViewProfile = (user) => {
        setSelectedUser(user);
        setOpenProfileModal(true);
    };

    const handleBanUser = (userId) => {
        // API Call: POST /api/admin/users/{userId}/ban
        console.log(`User with ID ${userId} banned`);
    };

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Box sx={{ p: 4 }}>
            {/* Page Title */}
            <Typography variant="h4" gutterBottom fontWeight="bold">
                User Management
            </Typography>

            {/* Search Bar */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <IconButton color="primary">
                    <Search />
                </IconButton>
            </Box>

            {/* User Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Disputes</TableCell>
                            <TableCell>Rating</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Avatar src={user.profilePic} alt={user.name} />
                                </TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.phone}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        color={
                                            user.status === "Active"
                                                ? "success"
                                                : user.status === "Suspicious"
                                                    ? "warning"
                                                    : "error"
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{user.disputes}</TableCell>
                                <TableCell>{user.rating}</TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleViewProfile(user)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleBanUser(user.id)}
                                    >
                                        <Block />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* User Profile Modal */}
            <Dialog
                open={openProfileModal}
                onClose={() => setOpenProfileModal(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>User Profile</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Avatar
                                    src={selectedUser.profilePic}
                                    alt={selectedUser.name}
                                    sx={{ width: 64, height: 64, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="h6">{selectedUser.name}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedUser.email}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedUser.phone}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1">
                                Status:{" "}
                                <Chip
                                    label={selectedUser.status}
                                    color={
                                        selectedUser.status === "Active"
                                            ? "success"
                                            : selectedUser.status === "Suspicious"
                                                ? "warning"
                                                : "error"
                                    }
                                    size="small"
                                />
                            </Typography>

                            <Typography variant="body1">
                                Disputes: {selectedUser.disputes}
                            </Typography>
                            <Typography variant="body1">
                                Rating: {selectedUser.rating}
                            </Typography>
                            <Typography variant="body1">
                                Joined: {selectedUser.joined}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenProfileModal(false)}>Close</Button>
                    {selectedUser?.status !== "Banned" && (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleBanUser(selectedUser.id)}
                        >
                            Ban User
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

/*
===============================
  API ENDPOINTS TO IMPLEMENT
===============================

1. GET Users List:
   GET /api/admin/users
   -> Returns array of user objects with { id, name, email, phone, profilePic, status, disputes, rating, joined }

2. View User Details:
   GET /api/admin/users/{userId}
   -> Returns detailed profile data for the given user

3. Ban User:
   POST /api/admin/users/{userId}/ban
   -> Updates user status to "Banned"

4. Flag Suspicious:
   POST /api/admin/users/{userId}/flag
   -> Updates user status to "Suspicious"

5. Get Disputes:
   GET /api/admin/users/{userId}/disputes
   -> Returns list of disputes/issues for this user

*/
