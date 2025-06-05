import { GET_SETTINGS_SUCCESS, GET_SETTINGS_FAIL } from "./actionTypes"

const INIT_STATE = {
  settings: [],
  error: {},
}

const settings = (state = INIT_STATE, action) => {
  switch (action.type) {
    case GET_SETTINGS_SUCCESS:
      return {
        ...state,
        settings: action.payload,
      }

    case GET_SETTINGS_FAIL:
      return {
        ...state,
        error: action.payload,
      }

    default:
      return state
  }
}

export default settings
