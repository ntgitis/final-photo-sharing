import axios from "axios";

export const BASE_URL = "https://x8rfcd-8081.csb.app/api";

async function fetchModel(url, options = {}) {
  try {
    //bước 1: lấy token
    const token = localStorage.getItem("token");

    //bước 2: tạo url hoàn chỉnh
    const config = {
      url: `${BASE_URL}${url}`,
      method: options.method || "GET",
      data: options.data || null,
      headers: {
        ...options.headers,
      },
    };

    //bước 3: gắn token vào header
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axios(config);
    return { data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    throw error;
  }
}

export default fetchModel;
