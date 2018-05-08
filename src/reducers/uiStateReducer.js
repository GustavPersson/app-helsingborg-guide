// @flow

const defaultState: UIState = {
  currentGuideGroup: null,
  currentGuides: [],
  currentContentObject: null,
};

export default function uiStateReducer(state: UIState = defaultState, action: Action): UIState {
  switch (action.type) {
    case "SELECT_CURRENT_GUIDEGROUP":
      return { ...state, currentGuideGroup: action.guideGroup, currentGuides: action.guides };
    default:
      return state;
  }
}
