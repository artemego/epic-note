import { getUserInfo } from "./userApi";

const AUTH_URL = "http://localhost:3000/auth";
const REGISTER = "register";
const REGISTER_GUEST = "register-guest";
const LOGIN = "login";
const LOGOUT = "logout";
const REFRESH_TOKEN = "refresh-token";

async function client(endpoint, data = null, method = "POST") {
  const stringData = data ? JSON.stringify(data) : null;
  const config = {
    method: method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: stringData,
    credentials: "include",
  };

  // Todo: catch error
  return fetch(`${AUTH_URL}/${endpoint}`, config).then(async (response) => {
    try {
      if (response.status === 204) {
        return;
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    } catch (err) {
      Promise.reject(err);
    }
  });
}

async function login({ email, password }) {
  const loginRes = await client(LOGIN, { email, password });
  const { info } = await handleUserResponse(loginRes);
  return { ...loginRes, info };
}

async function register({ email, password }) {
  const registerRes = await client(REGISTER, { email, password });
  const { info } = await handleUserResponse(registerRes);
  return { ...registerRes, info };
}

async function registerGuest() {
  const registerRes = await client(REGISTER_GUEST);
  const { info } = await handleUserResponse(registerRes);
  return { ...registerRes, info };
}

async function refreshToken() {
  const response = await client(REFRESH_TOKEN);
  // console.log(response);
  // если user существует, то не вызываем - уже есть о нем инфа
  const { info } = await handleUserResponse(response);
  return { ...response, info };
}

async function logout() {
  await client(LOGOUT);
}

// коллбэк, который вызывается после того как придет информация о пользователе
async function handleUserResponse(response) {
  if (!response) return;
  const { accessToken } = response;
  // api call from user api
  const userInfo = await getUserInfo(accessToken);
  return userInfo;
}

export { login, register, logout, refreshToken, registerGuest };
