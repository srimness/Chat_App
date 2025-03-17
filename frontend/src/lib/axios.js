import axios from "axios";

//axios is used to fetch apis from backend.. 

export const axiosIn = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:3000/api": "/api",
    withCredentials: true,

});