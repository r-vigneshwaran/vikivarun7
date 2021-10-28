import { actionTypes } from '../constants';

const { SET_USER_DATA, SET_USER_ROLE } = actionTypes;

export const setUser = (payload) => ({ type: SET_USER_DATA, payload });

export const setUserRole = (payload) => ({ type: SET_USER_ROLE, payload });
