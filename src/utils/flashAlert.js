const FLASH_ALERT_KEY = "kosflow-flash-alert";

const setFlashAlert = (alert) => {
  if (!alert) return;
  sessionStorage.setItem(FLASH_ALERT_KEY, JSON.stringify(alert));
};

const consumeFlashAlert = () => {
  const raw = sessionStorage.getItem(FLASH_ALERT_KEY);
  if (!raw) return null;

  sessionStorage.removeItem(FLASH_ALERT_KEY);

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const clearFlashAlert = () => {
  sessionStorage.removeItem(FLASH_ALERT_KEY);
};

export { FLASH_ALERT_KEY, setFlashAlert, consumeFlashAlert, clearFlashAlert };
