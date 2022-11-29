import axios from "axios";

const httpRequest = axios.create({
  baseURL:
    process.env.REACT_APP_BASE_URL ||
    "https://golang-api-f3b9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpRequest.get = (url, params) => {
  return httpRequest({
    method: "get",
    url,
    params,
  });
};

httpRequest.post = (url, data, token) => {
  return httpRequest({
    method: "post",
    url,
    data,
    headers: {
      Authorization: token,
    },
  });
};

httpRequest.put = (url, data, token) => {
  return httpRequest({
    method: "put",
    url,
    data,
    headers: {
      Authorization: token,
    },
  });
};

httpRequest.delete = (url, data, token) => {
  return httpRequest({
    method: "delete",
    url,
    data,
    headers: {
      Authorization: token,
    },
  });
};

export default httpRequest;
