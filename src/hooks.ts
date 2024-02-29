import { useState, useEffect } from "react";

const useLocalStorageState = <T>(key: string, initialValue: T) => {
  if (typeof localStorage === "undefined") {
    console.error("LocalStorage is not available. State will not persist.");
  }

  const getStoredValue = () => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch (error) {
      console.error("Error parsing stored value from localStorage:", error);
      return initialValue;
    }
  };

  const [value, setValue] = useState<T>(getStoredValue);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error storing value to localStorage:", error);
    }
  }, [key, value]);

  const updateValue = (newValue: T | ((prevState: T) => T)) => {
    setValue((prevValue) => {
      const updatedValue =
        typeof newValue === "function"
          ? (newValue as (prevState: T) => T)(prevValue)
          : newValue;
      localStorage.setItem(key, JSON.stringify(updatedValue));
      return updatedValue;
    });
  };

  return [value, updateValue] as const;
};

export default useLocalStorageState;
