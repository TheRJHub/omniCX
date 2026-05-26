import axios from "axios";

export const INTELICONVOAPI = axios.create({
  baseURL: import.meta.env.OMNICX_URL || "http://164.52.196.197:8099",
  headers: {
    "Content-Type": "application/json",
  },
});

INTELICONVOAPI.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem("loanagent_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // Ignore parse error
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
