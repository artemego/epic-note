const { REACT_APP_SERVER_URL } = process.env;

const USER_URL = `${REACT_APP_SERVER_URL}/auth`;

const INFO = "info";

async function client(endpoint, method = "POST", accessToken) {
  if (!endpoint) endpoint = "";
  const authString = `Bearer ${accessToken}`;
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: authString,
    },
    credentials: "include",
  };

  return fetch(`${USER_URL}/${endpoint}`, config).then(async (response) => {
    try {
      if (response.status === 204) {
        return;
      }
      const data = await response.json();
      console.log(data);
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

function getUserInfo(accessToken) {
  console.log("getting user info");
  return client(INFO, "GET", accessToken);
}

export { getUserInfo };
