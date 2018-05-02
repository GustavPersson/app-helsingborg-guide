// @flow

import initialState from "./initialState";

export default function pointpropertiesReducer(
  state: PointProperty = initialState.uiState.currentPointProperties,
  action: Action,
): PointProperty {
  switch (action.type) {
    case "FETCH_POINTPROPERTIES_REQUEST":
      return { ...state, isFetching: true };
    case "FETCH_POINTPROPERTIES_SUCCESS": {
      // Filter out the data we need
      const items = [];
      const { guideID } = action;
      action.pointProperties.forEach((element) => {
        const item = {
          id: element.id,
          guideID,
          name: element.name,
          icon: element.icon,
        };
        items.push(item);
      });
      return { ...state, items, isFetching: false };
    }
    case "FETCH_POINTPROPERTIES_FAILURE":
      return { ...state, isFetching: false };
    default:
      return state;
  }
}
