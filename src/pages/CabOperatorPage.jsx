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
    const [cabForm] = Form.useForm();
    const [routeForm] = Form.useForm();
    const [scheduleForm] = Form.useForm();

    // Utility function to refresh all data
    const refreshAllData = async () => {
        try {
            const [cabsRes, routesRes, schedulesRes] = await Promise.all([
                fetch('http://localhost:5000/api/cabs'),
                fetch('http://localhost:5000/api/routes'),
                fetch('http://localhost:5000/api/schedules')
            ]);
            
            const [cabsData, routesData, schedulesData] = await Promise.all([
                cabsRes.json(),
                routesRes.json(),
                schedulesRes.json()
            ]);
            
            setCabs(cabsData);
            setRoutes(routesData);
            setSchedule(schedulesData);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

    // --- Effects ---
    useEffect(() => {
        refreshAllData();
    }, []);

    // --- Handlers ---
    const handleAddCab = async (values) => {
        try {
            const res = await fetch('http://localhost:5000/api/cabs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            });
            
            if (res.ok) {
                const newCab = await res.json();
                console.log('New cab added:', newCab);
                
                // Refresh all data to ensure consistency
                await refreshAllData();
                
                message.success('Cab added successfully');
                setIsCabModalOpen(false);
                cabForm.resetFields();
            } else {
                const error = await res.json();
                message.error('Failed to add cab: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding cab:', error);
            message.error('Error adding cab: ' + error.message);
        }
    };

    const handleDeleteCab = async (id) => {
        try {
            console.log('Deleting cab with ID:', id); // Debug log
            const res = await fetch(`http://localhost:5000/api/cabs/${id}`, { 
                method: 'DELETE' 
            });
            
            if (res.ok) {
                const result = await res.json();
                console.log('Delete result:', result);
                
                // Refresh all data to reflect cascade deletions
                await refreshAllData();
                
                message.success(`Cab deleted successfully along with ${result.deletedSchedules?.length || 0} related schedules and ${result.deletedRoutes?.length || 0} related routes`);
            } else {
                const error = await res.json();
                message.error('Failed to delete cab: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting cab:', error);
            message.error('Error deleting cab');
        }
    };

    const handleAddRoute = async (values) => {
        try {
            console.log('Adding route with values:', values); // Debug log
            
            // Map frontend fields to backend fields
            const routeData = {
                origin: values.from,
                destination: values.to,
                distance_km: parseFloat(values.distance),
                eta_min: 30, // default value
                base_fare: 10, // default value
                active: true,
                cab_operator_id: 1 // default value, should be dynamic in real app
            };
            
            console.log('Route data to send:', routeData); // Debug log
            
            const res = await fetch('http://localhost:5000/api/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(routeData)
            });
            
            if (res.ok) {
                const newRoute = await res.json();
                console.log('New route received:', newRoute); // Debug log
                
                // Refresh all data to ensure consistency
                await refreshAllData();
                
                message.success('Route added successfully');
                setIsRouteModalOpen(false);
                routeForm.resetFields();
            } else {
                const error = await res.json();
                console.error('Error adding route:', error);
                message.error('Failed to add route: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding route:', error);
            message.error('Error adding route: ' + error.message);
        }
    };

    const handleDeleteRoute = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/routes/${id}`, { method: 'DELETE' });
            
            if (res.ok) {
                const result = await res.json();
                console.log('Route delete result:', result);
                
                // Refresh all data to reflect cascade deletions
                await refreshAllData();
                
                message.success(`Route deleted successfully along with ${result.deletedSchedules?.length || 0} related schedules`);
            } else {
                const error = await res.json();
                message.error('Failed to delete route: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting route:', error);
            message.error('Error deleting route');
        }
    };

    const handleAddSchedule = async (values) => {
        try {
            // Find the cab and route IDs based on the selected names
            const selectedCab = cabs.find(cab => cab.name === values.cab);
            const selectedRouteText = values.route; // "Origin - Destination"
            const selectedRoute = routes.find(route => `${route.from} - ${route.to}` === selectedRouteText);
            
            if (!selectedCab || !selectedRoute) {
                message.error('Please select valid cab and route');
                return;
            }
            
            const scheduleData = {
                cab_id: selectedCab.id,
                route_id: selectedRoute.id,
                frequency: values.frequency,
                time: values.time.format('HH:mm:ss'),
                price: parseFloat(values.price)
            };
            
            const res = await fetch('http://localhost:5000/api/schedules', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scheduleData)
            });
            
            if (res.ok) {
                const newSchedule = await res.json();
                console.log('New schedule added:', newSchedule);
                
                // Refresh all data to ensure consistency
                await refreshAllData();
                
                message.success('Schedule added successfully');
                setIsScheduleModalOpen(false);
                scheduleForm.resetFields();
            } else {
                const error = await res.json();
                message.error('Failed to add schedule: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding schedule:', error);
            message.error('Error adding schedule: ' + error.message);
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/schedules/${id}`, { method: 'DELETE' });
            
            if (res.ok) {
                // Refresh all data to ensure consistency
                await refreshAllData();
                message.success('Schedule deleted successfully');
            } else {
                const error = await res.json();
                message.error('Failed to delete schedule: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error deleting schedule:', error);
            message.error('Error deleting schedule');
        }
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
                onCancel={() => {
                    setIsCabModalOpen(false);
                    cabForm.resetFields();
                }}
                onOk={() => cabForm.submit()}
                okText="Save"
            >
                <Form form={cabForm} layout="vertical" onFinish={handleAddCab}>
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
                onCancel={() => {
                    setIsRouteModalOpen(false);
                    routeForm.resetFields();
                }}
                onOk={() => routeForm.submit()}
                okText="Save"
            >
                <Form form={routeForm} layout="vertical" onFinish={handleAddRoute}>
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
                onCancel={() => {
                    setIsScheduleModalOpen(false);
                    scheduleForm.resetFields();
                }}
                onOk={() => scheduleForm.submit()}
                okText="Save"
            >
                <Form form={scheduleForm} layout="vertical" onFinish={handleAddSchedule}>
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
