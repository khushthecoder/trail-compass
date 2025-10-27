import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "TRAIL_COMPASS_PINS_V1";

// TODO: Load the saved pins
export async function loadPins() {
  try {
    const jsonValue = await AsyncStorage.getItem(KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
}

// TODO: Save the pins locally
export async function savePins(pins) {
  try {
    const jsonValue = JSON.stringify(pins);
    await AsyncStorage.setItem(KEY, jsonValue);
  } catch (e) {
  }
}