import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

const api = axios.create({
  baseURL: API_BASE_URL
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

export const addTheatre = async (payload) => {
  const response = await api.post("/admin/addTheatre", payload);
  return response.data;
};

export const addScreen = async (payload) => {
  const response = await api.post("/admin/addScreen", payload);
  return response.data;
};

export const addSeat = async (payload) => {
  const response = await api.post("/admin/addSeat", payload);
  return response.data;
};

export const addShow = async (payload) => {
  const response = await api.post("/admin/addShow", payload);
  return response.data;
};

export const setSeatMaintenance = async (seatId, value) => {
  const response = await api.post(`/admin/seat/${seatId}/maintenance`, null, {
    params: { value }
  });
  return response.data;
};

export const addMovie = async (payload) => {
  const response = await api.post("/admin/addMovie", payload);
  return response.data;
};

export const uploadThumbnail = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/admin/uploadThumbnail", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const getAdminScreens = async (theatreId) => {
  const response = await api.get("/admin/screens", {
    params: theatreId ? { theatreId } : undefined
  });
  return response.data;
};

export const deleteMovie = async (movieId) => {
  const response = await api.delete(`/admin/deleteMovie/${movieId}`);
  return response.data;
};

export default api;
