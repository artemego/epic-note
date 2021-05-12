const LOGIN_SUCCESS = "LOGIN_SUCCESS";
const LOGOUT = "LOGOUT";
const SET_LOADING = "SET_LOADING";
const SET_REFRESHING = "SET_REFRESHING";
const SET_ERROR = "SET_ERROR";

// actionCreators

const loginSuccess = (accessToken, expiryDate) => {
  return {
    type: LOGIN_SUCCESS,
    accessToken: accessToken,
    expiryDate: expiryDate,
  };
};

const changeLoading = (payload) => {
  return {
    type: SET_LOADING,
    payload: payload,
  };
};

const logout = () => {
  return {
    type: LOGOUT,
  };
};

const setError = (payload) => {
  return {
    type: SET_ERROR,
    payload: payload,
  };
};

const changeRefreshing = (payload) => {
  return {
    type: SET_REFRESHING,
    payload: payload,
  };
};

export { loginSuccess, changeLoading, logout, setError, changeRefreshing };
