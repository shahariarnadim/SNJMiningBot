const getTelegramWebApp = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.Telegram?.WebApp || null;
};

const initTelegramWebApp = () => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  try {
    webApp.ready();
    webApp.expand();

    return webApp;
  } catch (error) {
    console.error(
      "Telegram WebApp initialization failed:",
      error
    );

    return null;
  }
};

const getTelegramUser = () => {
  const webApp = getTelegramWebApp();

  if (!webApp?.initDataUnsafe?.user) {
    return null;
  }

  return webApp.initDataUnsafe.user;
};

const getTelegramInitData = () => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return "";
  }

  return webApp.initData || "";
};

const getTelegramTheme = () => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return null;
  }

  return {
    colorScheme: webApp.colorScheme || "dark",
    themeParams: webApp.themeParams || {},
  };
};

const closeTelegramWebApp = () => {
  const webApp = getTelegramWebApp();

  if (!webApp) {
    return;
  }

  webApp.close();
};

const telegramWebApp = {
  getTelegramWebApp,
  initTelegramWebApp,
  getTelegramUser,
  getTelegramInitData,
  getTelegramTheme,
  closeTelegramWebApp,
};

export default telegramWebApp;
