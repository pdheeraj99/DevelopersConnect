import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from './constants';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get('/api/auth');

    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('/api/users', body, config);
      // res.data we are getting an object with token inside { token: 'random' }
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      // err.response.data returns { msg: 'random mesage' }
      // json object if in the backend we are sending json data
      // string if we are sending string from backend
      dispatch(setAlert(err.response.data.msg, 'danger'));
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// login User
export const login =
  ({ email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post('/api/auth', body, config);
      // res.data we are getting an object with token inside { token: 'random' }
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      // err.response.data returns { msg: 'random mesage' }
      // json object if in the backend we are sending json data
      // string if we are sending string from backend
      dispatch(setAlert(err.response.data.msg, 'danger'));
      dispatch({
        type: LOGIN_FAIL,
      });
    }
  };

// logout User
export const logout = () => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
};
