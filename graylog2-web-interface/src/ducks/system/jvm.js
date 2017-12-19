import URLUtils from 'util/URLUtils';
import ApiRoutes from 'routing/ApiRoutes';
import fetch from 'logic/rest/FetchProvider';
import { combineState } from 'ducks/ducksHelpers';

const JVM_INFO_REQUEST = 'graylog/jvm/JVM_INFO_REQUEST';
const JVM_INFO_SUCCESS = 'graylog/jvm/JVM_INFO_SUCCESS';
const JVM_INFO_FAILURE = 'graylog/jvm/JVM_INFO_FAILURE';

export const loadJvmInfo = () => (dispatch) => {
  dispatch({
    type: JVM_INFO_REQUEST,
  });
  const url = URLUtils.qualifyUrl(ApiRoutes.SystemApiController.jvm().url);
  return fetch('GET', url)
    .then(
      response =>
        dispatch({
          type: JVM_INFO_SUCCESS,
          response: response,
        }),
      error =>
        dispatch({
          type: JVM_INFO_FAILURE,
          error: error,
        }),
    );
};

const initialState = {
  frontend: {
    isLoading: true,
    error: undefined,
  },
  jvmInfo: undefined,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case JVM_INFO_REQUEST:
      return combineState(state, { frontend: { isLoading: true } });
    case JVM_INFO_SUCCESS:
      return combineState(state, {
        frontend: { isLoading: false },
        jvmInfo: action.response,
      });
    case JVM_INFO_FAILURE:
      return combineState(state, {
        frontend: { isLoading: false, error: action.error.message },
      });
    default:
      return state;
  }
}