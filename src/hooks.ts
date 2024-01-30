import { useState } from "react";

const useLocalStorageState = <T>(key: string, initialValue: T) => {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState(initial);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue];
};

export default useLocalStorageState;
