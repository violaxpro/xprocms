import { GET_SETTINGS, GET_SETTINGS_FAIL, GET_SETTINGS_SUCCESS } from "./actionTypes"

export const getSettings = () => ({
  type: GET_SETTINGS,
})

export const getSettingsSuccess = tasks => ({
  type: GET_SETTINGS_SUCCESS,
  payload: tasks,
})

export const getSettingsFail = error => ({
  type: GET_SETTINGS_FAIL,
  payload: error,
})
