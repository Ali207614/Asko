import * as React from "react";

const _navigator = React.createRef();

function navigate(routeName, params) {
  if (!!_navigator) _navigator.current.navigate(routeName, params);
  else {
    console.warn("_navigator not found in NavigationService");
  }
}

function reset(routeName, index, params) {
  if (!!_navigator)
    _navigator.current.reset({
      index,
      routes: [
        {
          name: routeName,
          params,
        },
      ],
    });
  else {
    console.warn("_navigator not found in NavigationService");
  }
}

function goBack(arg) {
  if (!!_navigator) _navigator.current.goBack(arg);
  else {
    console.warn("_navigator not found in NavigationService");
  }
}

function setParams(obj) {
  if (!!_navigator) _navigator.current.setParams(obj);
  else {
    console.warn("_navigator not found in NavigationService");
  }
}

export default {
  navigate,
  goBack,
  _navigator,
  reset,
  setParams,
};
