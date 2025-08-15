// src/pages/CabRouteManagement.jsx
import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Card, Table, Button, Modal, Form, Input, Select, TimePicker, InputNumber, message } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Sidebar from "../components/sidebar/Sidebar"; // adjust import path if needed
import dayjs from "dayjs";

const { Content } = Layout;
const { Option } = Select;

const CabRouteManagement = () => {
    // --- State ---
    const [cabs, setCabs] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [isCabModalOpen, setIsCabModalOpen] = useState(false);
    const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [form] = Form.useForm();

    // --- Effects ---
    useEffect(() => {
        // TODO: Replace with API calls
        // Example: fetch("/api/cabs").then(res => res.json()).then(setCabs);
        setCabs([
            { id: 1, name: "Cab 101", type: "Sedan", seats: 4 },
            { id: 2, name: "Cab 202", type: "SUV", seats: 6 },
        ]);
        setRoutes([
            { id: 1, from: "NY", to: "MA", distance: "300 km" },
            { id: 2, from: "MA", to: "NH", distance: "150 km" },
        ]);
        setSchedule([
            { id: 1, cab: "Cab 101", route: "NY - MA", frequency: "Daily", time: "09:00 AM", price: 50 },
            { id: 2, cab: "Cab 202", route: "MA - NH", frequency: "Weekly", time: "02:00 PM", price: 80 },
        ]);
    }, []);

    // --- Handlers ---
    const handleAddCab = (values) => {
        // TODO: POST /api/cabs
        setCabs([...cabs, { id: Date.now(), ...values }]);
        message.success("Cab added successfully");
        setIsCabModalOpen(false);
    };

    const handleAddRoute = (values) => {
        // TODO: POST /api/routes
        setRoutes([...routes, { id: Date.now(), ...values }]);
        message.success("Route added successfully");
        setIsRouteModalOpen(false);
    };

    const handleAddSchedule = (values) => {
        // TODO: POST /api/schedules
        setSchedule([...schedule, { id: Date.now(), ...values }]);
        message.success("Schedule added successfully");
        setIsScheduleModalOpen(false);
    };

    // --- Table Columns ---
    const cabColumns = [
        { title: "Cab Name", dataIndex: "name", key: "name" },
        { title: "Type", dataIndex: "type", key: "type" },
        { title: "Seats", dataIndex: "seats", key: "seats" },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger />
                </>
            ),
        },
    ];

    const routeColumns = [
        { title: "From", dataIndex: "from", key: "from" },
        { title: "To", dataIndex: "to", key: "to" },
        { title: "Distance", dataIndex: "distance", key: "distance" },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger />
                </>
            ),
        },
    ];

    const scheduleColumns = [
        { title: "Cab", dataIndex: "cab", key: "cab" },
        { title: "Route", dataIndex: "route", key: "route" },
        { title: "Frequency", dataIndex: "frequency", key: "frequency" },
        { title: "Time", dataIndex: "time", key: "time" },
        { title: "Price ($)", dataIndex: "price", key: "price" },
        {
            title: "Actions",
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger />
                </>
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
                <Content style={{ padding: "24px", background: "#f5f5f5" }}>
                    <Row gutter={[16, 16]}>
                        {/* Cab Management */}
                        <Col span={24}>
                            <Card
                                title="Cab Management"
                                extra={<Button icon={<PlusOutlined />} onClick={() => setIsCabModalOpen(true)}>Add Cab</Button>}
                            >
                                <Table dataSource={cabs} columns={cabColumns} rowKey="id" />
                            </Card>
                        </Col>

                        {/* Route Management */}
                        <Col span={24}>
                            <Card
                                title="Route Management"
                                extra={<Button icon={<PlusOutlined />} onClick={() => setIsRouteModalOpen(true)}>Add Route</Button>}
                            >
                                <Table dataSource={routes} columns={routeColumns} rowKey="id" />
                            </Card>
                        </Col>

                        {/* Schedule Management */}
                        <Col span={24}>
                            <Card
                                title="Schedule Management"
                                extra={<Button icon={<PlusOutlined />} onClick={() => setIsScheduleModalOpen(true)}>Add Schedule</Button>}
                            >
                                <Table dataSource={schedule} columns={scheduleColumns} rowKey="id" />
                            </Card>
                        </Col>
                    </Row>
                </Content>
            </Layout>

            {/* --- Modals --- */}
            <Modal
                title="Add Cab"
                open={isCabModalOpen}
                onCancel={() => setIsCabModalOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form form={form} layout="vertical" onFinish={handleAddCab}>
                    <Form.Item name="name" label="Cab Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Sedan">Sedan</Option>
                            <Option value="SUV">SUV</Option>
                            <Option value="Van">Van</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="seats" label="Seats" rules={[{ required: true }]}>
                        <InputNumber min={1} max={50} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add Route"
                open={isRouteModalOpen}
                onCancel={() => setIsRouteModalOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form form={form} layout="vertical" onFinish={handleAddRoute}>
                    <Form.Item name="from" label="From" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="to" label="To" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="distance" label="Distance" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Add Schedule"
                open={isScheduleModalOpen}
                onCancel={() => setIsScheduleModalOpen(false)}
                onOk={() => form.submit()}
                okText="Save"
            >
                <Form form={form} layout="vertical" onFinish={handleAddSchedule}>
                    <Form.Item name="cab" label="Cab" rules={[{ required: true }]}>
                        <Select>
                            {cabs.map(cab => <Option key={cab.id} value={cab.name}>{cab.name}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="route" label="Route" rules={[{ required: true }]}>
                        <Select>
                            {routes.map(route => <Option key={route.id} value={`${route.from} - ${route.to}`}>{route.from} - {route.to}</Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
                        <Select>
                            <Option value="Daily">Daily</Option>
                            <Option value="Weekly">Weekly</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="time" label="Time" rules={[{ required: true }]}>
                        <TimePicker format="hh:mm A" style={{ width: "100%" }} defaultValue={dayjs("09:00 AM", "hh:mm A")} />
                    </Form.Item>
                    <Form.Item name="price" label="Price ($)" rules={[{ required: true }]}>
                        <InputNumber min={0} style={{ width: "100%" }} />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

export default CabRouteManagement;
