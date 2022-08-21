export const getLSData = (key) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }
  
  return JSON.parse(value);
};

export const setLSData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const deleteLSData = (key) => localStorage.removeItem(key);
