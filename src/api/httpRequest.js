import axios from "axios";

const httpRequest = axios.create({
  baseURL: process.env.BASE_URL || "https://golang-api-f3b9.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

httpRequest.get = (url, params) => {
  const token = localStorage.getItem("token");
  return httpRequest({
    method: "GET",
    url,
    params,
    headers: {
      Authorization: token,
    },
  });
};

httpRequest.post = (url, data) => {
  const token = localStorage.getItem("token");
  return httpRequest({
    method: "post",
    url,
    data,
    headers: {
      Authorization: token,
    },
  }).then((res) => res.data);
};

httpRequest.put = (url, data) => {
  const token = localStorage.getItem("token");
  return httpRequest({
    method: "put",
    url,
    data,
    headers: {
      Authorization: token,
    },
  }).then((res) => res.data);
};

httpRequest.delete = (url, data) => {
  const token = localStorage.getItem("token");
  return httpRequest({
    method: "delete",
    url,
    data,
    headers: {
      Authorization: token,
    },
  }).then((res) => res.data);
};

export default httpRequest;
