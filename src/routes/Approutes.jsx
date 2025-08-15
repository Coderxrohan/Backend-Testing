import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';

// Page components
import DashboardLayout from '../features/dashboard/DashboardLayout';
import CabOperatorsPage from '../pages/CabOperatorPage';
import VendorsPage from '../pages/VendorPage';
import CustomersPage from '../pages/CustomerPage';
import ReportsPage from '../pages/ReportsPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Layout with Sidebar */}
            <Route path="/" element={<MainLayout />}>
                <Route index element={<DashboardLayout />} /> {/* Default route */}
                <Route path="dashboard" element={<DashboardLayout />} />
                <Route path="cab-operators" element={<CabOperatorsPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="customers" element={<CustomersPage />} />

                <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* Catch all - redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
