import axios  from "axios"; // AxiosInstance 타입 추가

const axiosInstance = () => {

  const instance = axios.create({
    baseURL: import.meta.env.VITE_BASEURL_BACK,
    timeout: 10000,
    withCredentials: true,
  });

  return instance;
};

export default axiosInstance;