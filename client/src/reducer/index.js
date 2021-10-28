import { actionTypes } from '../constants';

const { SET_USER_DATA, SET_USER_ROLE } = actionTypes;

const initialState = {
  user: '',
  userRole: { admin: false }
};

export default function friends(state = initialState, { type, payload }) {
  switch (type) {
    case SET_USER_DATA:
      return { ...state, user: payload };
    case SET_USER_ROLE:
      return { ...state, userRole: { admin: payload } };
    default:
      return state;
  }
}
