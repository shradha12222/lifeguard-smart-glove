import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const getLiveHealthData = async () => {
  const response = await API.get("/api/blynk/live");
  return response.data;
};

export const getPatientHistory = async () => {
  const response = await API.get(
    "/api/health/history/LG-001"
  );
  return response.data;
};

export default API;