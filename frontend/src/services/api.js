import axios from "axios";
import { getStoredUser } from "../utils/helpers";

const api = axios.create({
  baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {
  const storedUser = getStoredUser();
  if (storedUser?.token) {
    config.headers.Authorization = `Bearer ${storedUser.token}`;
  }
  return config;
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

export const adminLoginUser = async (credentials) => {
  const response = await api.post("/auth/admin/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const createMovie = async (payload) => {
  const response = await api.post("/admin/movies", payload);
  return response.data;
};

export const updateMovie = async (movieId, payload) => {
  const response = await api.put(`/admin/movies/${movieId}`, payload);
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const response = await api.delete(`/admin/movies/${movieId}`);
  return response.data;
};

export const createTheatre = async (payload) => {
  const response = await api.post("/admin/theatres", payload);
  return response.data;
};

export const updateTheatre = async (theatreId, payload) => {
  const response = await api.put(`/admin/theatres/${theatreId}`, payload);
  return response.data;
};

export const deleteTheatre = async (theatreId) => {
  const response = await api.delete(`/admin/theatres/${theatreId}`);
  return response.data;
};

export default api;
