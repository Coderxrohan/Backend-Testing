import axios from "axios";

const API_BASE = "/routes"; // no localhost:9191 here

export const getRoutes = () => axios.get(API_BASE);
export const addRoute = (route) => axios.post(API_BASE, route);
export const updateRoute = (id, route) => axios.put(`${API_BASE}/${id}`, route);
export const deleteRoute = (id) => axios.delete(`${API_BASE}/${id}`);
