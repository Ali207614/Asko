import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import Navigation from "./navigators";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";

function App() {
  return (

    <I18nextProvider i18n={i18n()}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
}

export default App;
