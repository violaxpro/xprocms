import axios from "axios";
import { showToast } from "./utils";

//pass new generated access token here
const token = JSON.parse(window.localStorage.getItem('authUser'))?.token;

//apply base url for axios
export const API_URL = "https://api.xprogroup.com.au/api/admin";
// export const API_URL = "http://localhost:8001/api/admin";

const axiosApi = axios.create({
  baseURL: API_URL,
});

axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;

axiosApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status == 401) {
      localStorage.removeItem('authUser')
      window.location.href = `${window.location.origin}/login`
    }
    if (![400].includes(error.response.status)) {
      showToast(`Developer Message: ${error.response.data.message}`, 'error')
    }
    return Promise.reject(error)
  }
);

export async function get(url, config = {}) {
  return await axiosApi.get(url, { ...config }).then(response => response.data);
}

export async function post(url, data, config = {}) {
  return axiosApi
    .post(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function postFormData(url, data, config = { headers: { "Content-Type": "multipart/form-data" } }) {
  return axiosApi
    .post(url, data, { ...config })
    .then(response => response.data);
}

export async function put(url, data, config = {}) {
  return axiosApi
    .put(url, { ...data }, { ...config })
    .then(response => response.data);
}

export async function del(url, config = {}) {
  return await axiosApi
    .delete(url, { ...config })
    .then(response => response.data);
}
