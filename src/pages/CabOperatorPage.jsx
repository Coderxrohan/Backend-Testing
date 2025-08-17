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
        fetch('http://localhost:5000/api/cabs')
            .then(res => res.json())
            .then(setCabs);
        fetch('http://localhost:5000/api/routes')
            .then(res => res.json())
            .then(setRoutes);
        fetch('http://localhost:5000/api/schedules')
            .then(res => res.json())
            .then(setSchedule);
    }, []);

    // --- Handlers ---
    const handleAddCab = async (values) => {
        const res = await fetch('http://localhost:5000/api/cabs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        const newCab = await res.json();
        setCabs([...cabs, newCab]);
        message.success('Cab added successfully');
        setIsCabModalOpen(false);
    };

    const handleDeleteCab = async (id) => {
        await fetch(`http://localhost:5000/api/cabs/${id}`, { method: 'DELETE' });
        setCabs(cabs.filter(cab => cab.id !== id));
        message.success('Cab deleted successfully');
    };

    const handleAddRoute = async (values) => {
        const res = await fetch('http://localhost:5000/api/routes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        const newRoute = await res.json();
        setRoutes([...routes, newRoute]);
        message.success('Route added successfully');
        setIsRouteModalOpen(false);
    };

    const handleDeleteRoute = async (id) => {
        await fetch(`http://localhost:5000/api/routes/${id}`, { method: 'DELETE' });
        setRoutes(routes.filter(route => route.id !== id));
        message.success('Route deleted successfully');
    };

    const handleAddSchedule = async (values) => {
        const res = await fetch('http://localhost:5000/api/schedules', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values)
        });
        const newSchedule = await res.json();
        setSchedule([...schedule, newSchedule]);
        message.success('Schedule added successfully');
        setIsScheduleModalOpen(false);
    };

    const handleDeleteSchedule = async (id) => {
        await fetch(`http://localhost:5000/api/schedules/${id}`, { method: 'DELETE' });
        setSchedule(schedule.filter(sch => sch.id !== id));
        message.success('Schedule deleted successfully');
    };

    // --- Table Columns ---
    const cabColumns = [
        { title: 'Cab Name', dataIndex: 'name', key: 'name' },
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Seats', dataIndex: 'seats', key: 'seats' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteCab(record.id)} />
                </>
            ),
        },
    ];

    const routeColumns = [
        { title: 'From', dataIndex: 'from', key: 'from' },
        { title: 'To', dataIndex: 'to', key: 'to' },
        { title: 'Distance', dataIndex: 'distance', key: 'distance' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteRoute(record.id)} />
                </>
            ),
        },
    ];

    const scheduleColumns = [
        { title: 'Cab', dataIndex: 'cab', key: 'cab' },
        { title: 'Route', dataIndex: 'route', key: 'route' },
        { title: 'Frequency', dataIndex: 'frequency', key: 'frequency' },
        { title: 'Time', dataIndex: 'time', key: 'time' },
        { title: 'Price ($)', dataIndex: 'price', key: 'price' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button icon={<EditOutlined />} style={{ marginRight: 8 }} />
                    <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteSchedule(record.id)} />
                </>
            ),
        },
    ];

    return (
        <Layout>
            <Sidebar />
            <Content style={{ padding: 24 }}>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Card title="Cab Management" extra={<Button onClick={() => setIsCabModalOpen(true)}>+ Add Cab</Button>}>
                            <Table dataSource={cabs} columns={cabColumns} rowKey="id" pagination={false} locale={{ emptyText: 'No data' }} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Route Management" extra={<Button onClick={() => setIsRouteModalOpen(true)}>+ Add Route</Button>}>
                            <Table dataSource={routes} columns={routeColumns} rowKey="id" pagination={false} locale={{ emptyText: 'No data' }} />
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title="Schedule Management" extra={<Button onClick={() => setIsScheduleModalOpen(true)}>+ Add Schedule</Button>}>
                            <Table dataSource={schedule} columns={scheduleColumns} rowKey="id" pagination={false} locale={{ emptyText: 'No data' }} />
                        </Card>
                    </Col>
                </Row>
            </Content>

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
