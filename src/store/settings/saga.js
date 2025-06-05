import { call, put, takeEvery } from "redux-saga/effects"

// Crypto Redux States
import { GET_SETTINGS } from "./actionTypes"
import { getSettingsSuccess, getSettingsFail } from "./actions"

//Include Both Helper File with needed methods
import { getSettings } from "helpers/fakebackend_helper"
import api from "helpers/api"

function* fetchSettings() {
  try {
    const response = yield call(() => api.settings())
    yield put(getSettingsSuccess(response.data))
  } catch (error) {
    yield put(getSettingsFail(error))
  }
}

function* tasksSaga() {
  yield takeEvery(GET_SETTINGS, fetchSettings)
}

export default tasksSaga
