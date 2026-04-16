import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

export const fetchSeats = async (showId) => {
  const response = await api.get(`/seats/${showId}`);
  return response.data;
};

export const getMovies = async () => {
  const response = await api.get("/movies");
  return response.data;
};

export const getTheatres = async () => {
  const response = await api.get("/theatres");
  return response.data;
};

export const createBooking = async (payload) => {
  const response = await api.post("/booking/create", payload);
  return response.data;
};

export const cancelBooking = async (bookingId) => {
  const response = await api.post(`/booking/cancel/${bookingId}`);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export default api;
