// src/api/deviceService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api/devices/'; // 从环境变量获取，并提供一个默认值

const api = axios.create({
  baseURL: API_BASE_URL,
});
// http://127.0.0.1:8000/api/devices/list/all/
export const getDevices = () => api.get('list/all/');
export const getDeviceDetail = (device_id) => api.get(`${device_id}/`);
export const lockDevice = (device_id) => api.post(`${device_id}/lock_device/`);
export const deleteDevice = (device_id) => api.delete(`${device_id}/delete/`);
export const getDeviceStatus = (registration_id) => api.get(`${registration_id}/status/`);