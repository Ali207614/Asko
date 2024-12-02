import AsyncStorage from "@react-native-async-storage/async-storage";
import { main } from "../../store/slices";

const { setLanguage } = main.actions;

export const setLang = (data) => async (dispatch) => {
  try {
    await AsyncStorage.setItem("lan", data);
    dispatch(setLanguage(data));
  } catch (e) {
    throw new Error(e);
  }
};
