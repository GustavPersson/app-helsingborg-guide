import { _API_BASE } from "./endpoints";

export default () => {
  function getGuideTypes() {
    return fetch(`${_API_BASE}/guidetype`)
      .then(response => response.json())
      .then((guideTypes) => {
        console.log(guideTypes);
        return guideTypes;
      });
  }

  return { getGuideTypes };
};
