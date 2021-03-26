const NOTES_URL = "http://localhost:3000/notes";
// const GET_PAGES = "pages";

// клиент, который будет посылать наши запросы
async function client(
  endpoint,
  paramString,
  data = null,
  method = "POST",
  accessToken
) {
  if (!endpoint) endpoint = "";
  const authString = `Bearer ${accessToken}`;
  const stringData = data ? JSON.stringify(data) : null;
  const config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      authorization: authString,
    },
    body: stringData,
    credentials: "include",
  };

  return fetch(`${NOTES_URL}/${endpoint}`, config).then(async (response) => {
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

function getPages(accessToken) {
  console.log("getting pages");
  return client(null, null, null, "GET", accessToken);
}

function getPage(accessToken, pageId) {
  console.log("getting page");
  return client(pageId, null, null, "GET", accessToken);
}

export { getPages, getPage };
