const AUTH_URL = "http://localhost:3000/auth";
const REGISTER = "register";
const LOGIN = "login";
const LOGOUT = "logout";
const REFRESH_TOKEN = "refresh-token";

// клиент, который будет посылать наши запросы
async function client(endpoint, data = null, method = "POST") {
  const stringData = data ? JSON.stringify(data) : null;
  const config = {
    method: method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: stringData,
    credentials: "include",
  };