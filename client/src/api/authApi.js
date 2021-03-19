const AUTH_URL = "http://localhost:3000/auth";
const REGISTER = "register";
const LOGIN = "login";
const LOGOUT = "logout";
const REFRESH_TOKEN = "refresh-token";

// TODO: создать два вида конфига: с куки, с ХЭДЕРОМ AUTHENTICATION И BEARER ТОКЕНОМ

// клиент, который будет посылать наши запросы
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

function login({ email, password }) {
  return client(LOGIN, { email, password }).then(handleUserResponse);
}

function register({ email, password }) {
  return client(REGISTER, { email, password }).then(handleUserResponse);
}

// здесь может быть проверить, есть ли информация о пользователе прежде чем вызывать handleUserResponse
async function refreshToken() {
  const response = await client(REFRESH_TOKEN);
  // console.log(response);
  // если user существует, то не вызываем - уже есть о нем инфа
  handleUserResponse(response);
  return response;
}

async function logout() {
  await client(LOGOUT);
}

// коллбэк, который вызывается после того как придет информация о пользователе
function handleUserResponse(response) {
  // Todo: здесь надо будет записывать информацию о пользователе в UserContext
  if (!response) return;
  // const {accessToken, expiresIn} = response;
  console.log(response);
  return response;
}

export { login, register, logout, refreshToken };
