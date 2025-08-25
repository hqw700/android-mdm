// src/api/deviceService.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api/devices/'; // 替换成你的后端地址

const api = axios.create({
  baseURL: API_BASE_URL,
});
// http://127.0.0.1:8000/api/devices/list/all/
export const getDevices = () => api.get('list/all/');
export const getDeviceDetail = (device_id) => api.get(`${device_id}/`);
export const lockDevice = (device_id) => api.post(`${device_id}/lock_device/`);