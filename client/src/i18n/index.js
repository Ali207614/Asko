import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import resources from "./resources";

const languageDetector = {
  type: "languageDetector",

  async: true,
  detect: async (cb) => {
    const lan = await AsyncStorage.getItem("lan");
    cb(lan || "ru");
  },
  init: () => {},
  cacheUserLanguage: (data) => {
  },
};

const options = {
  resources,
  lng: "ru",
  compatibilityJSON: "v3",
  whitelist: ["uz", "ru", "en"],
  ns: ["main"],
  defaultNS: "main",
  interpolation: {
    escapeValue: true,
    formatSeparator: ",",
  },
  debug: false,
};

export default () => {
  i18n.use(languageDetector).use(initReactI18next).init(options);
  return i18n;
};
