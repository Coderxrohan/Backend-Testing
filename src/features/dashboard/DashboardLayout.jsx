import React, { useEffect, useState } from "react";
import { Layout, Row, Col } from "antd";
import Sidebar from "../../components/sidebar/Sidebar";
import SummaryCards from "./SummaryCards";
import Customers from "./Customers";
import BookingTrends from "./BookingTrends";
import Chats from "./Chats";
import TopRoutes from "./Toproutes";
import LiveOccupancy from "./LiveOccupancy";

const { Content, Sider } = Layout;

const DashboardLayout = () => {
    const [dashboardData, setDashboardData] = useState({
        summaryCards: {},
        customers: [],
        bookingTrends: [],
        chats: {},
        topRoutes: [],
        liveOccupancy: [],
    });

    useEffect(() => {
        const sampleData = {
            summaryCards: {
                revenues: { value: "15%", change: "increase", description: "Increase compared to last week" },
                totalBooking: { value: "40,000" },
                cancellation: { value: 200, percentage: 40 },
                topMonth: { month: "November", year: "2019" },
                topYear: { year: "2023", bookings: "96K Booked so far" },
                topDriver: { name: "Maggie Johnson", company: "Oasis Organic Inc." },
            },
            customers: [
                { name: "Chris Friedkly", company: "Supermarket Villanova", avatar: "" },
                { name: "Maggie Johnson", company: "Oasis Organic Inc.", avatar: "" },
                { name: "Gael Harry", company: "New York Finest Fruits", avatar: "" },
                { name: "Jenna Sullivan", company: "Walmart", avatar: "" },
            ],
            bookingTrends: [
                { year: 2016, bookings: 10000 },
                { year: 2017, bookings: 30000 },
                { year: 2018, bookings: 50000 },
                { year: 2019, bookings: 30000 },
                { year: 2020, bookings: 20000 },
                { year: 2021, bookings: 60000 },
                { year: 2022, bookings: 80000 },
                { year: 2023, bookings: 100000 },
            ],
            chats: {
                unreadCount: 2,
                users: [
                    { name: "User 1", avatar: "" },
                    { name: "User 2", avatar: "" },
                    { name: "User 3", avatar: "" },
                    { name: "User 4", avatar: "" },
                ],
            },
            topRoutes: [
                { route: "NY", value: 120, percentage: 80 },
                { route: "MA", value: 80, percentage: 60 },
                { route: "NH", value: 70, percentage: 50 },
                { route: "OR", value: 50, percentage: 40 },
            ],
            liveOccupancy: Array(16).fill("Cab 1"),
        };

        setDashboardData(sampleData);
    }, []);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* FIX: Put Sidebar inside AntD's Sider */}


            <Layout style={{ marginLeft: 0 }}>
                <Content style={{ padding: "24px", background: "#f5f5f5" }}>
                    {/* Row 1 - Summary Cards */}
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <SummaryCards type="revenues" data={dashboardData.summaryCards.revenues} />
                        </Col>
                        <Col xs={24} md={8}>
                            <SummaryCards type="totalBooking" data={dashboardData.summaryCards.totalBooking} />
                        </Col>
                        <Col xs={24} md={8}>
                            <SummaryCards type="cancellation" data={dashboardData.summaryCards.cancellation} />
                        </Col>
                    </Row>

                    {/* Row 2 - Customers + Booking Trends */}
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} md={8}>
                            <Customers data={dashboardData.customers} />
                        </Col>
                        <Col xs={24} md={16}>
                            <BookingTrends data={dashboardData.bookingTrends} />
                        </Col>
                    </Row>

                    {/* Row 3 - Top Month, Top Year, Top Driver */}
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} md={8}>
                            <SummaryCards type="topMonth" data={dashboardData.summaryCards.topMonth} />
                        </Col>
                        <Col xs={24} md={8}>
                            <SummaryCards type="topYear" data={dashboardData.summaryCards.topYear} />
                        </Col>
                        <Col xs={24} md={8}>
                            <SummaryCards type="topDriver" data={dashboardData.summaryCards.topDriver} />
                        </Col>
                    </Row>

                    {/* Row 4 - Chats, Top Routes, Live Occupancy */}
                    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                        <Col xs={24} md={8}>
                            <Chats data={dashboardData.chats} />
                        </Col>
                        <Col xs={24} md={8}>
                            <TopRoutes data={dashboardData.topRoutes} />
                        </Col>
                        <Col xs={24} md={8}>
                            <LiveOccupancy data={dashboardData.liveOccupancy} />
                        </Col>
                    </Row>
                </Content>
            </Layout>
        </Layout>
    );
};

export default DashboardLayout;
