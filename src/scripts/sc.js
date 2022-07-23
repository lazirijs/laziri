const set = (key, value, type) => {
  if (type == "session") {
    return sessionStorage.setItem(key, value);
  } else {
    return localStorage.setItem(key, value);
  }
};

const setJson = (key, value, type) => {
  if (type == "session") {
    return sessionStorage.setItem(key, JSON.stringify(value));
  } else {
    return localStorage.setItem(key, JSON.stringify(value));
  }
};

const get = (key, type) => {
  if (type == "session") {
    return sessionStorage.getItem(key);
  } else {
    return localStorage.getItem(key);
  }
};

const getJson = (key, type) => {
  if (type == "session") {
    return JSON.parse(sessionStorage.getItem(key));
  } else {
    return JSON.parse(localStorage.getItem(key));
  }
};

const remove = (key, type) => {
  if (type == "session") {
    sessionStorage.removeItem(key);
  } else {
    localStorage.removeItem(key);
  }
};

const clear = (type) => {
  if (type == "session") {
    sessionStorage.clear();
  } else if (type == "local") {
    localStorage.clear();
  } else {
    localStorage.clear();
    sessionStorage.clear();
  }
};

const notice = async () => {
  try {
    let ntc = await new Promise((resolve, reject) => {
      Notification.requestPermission(resolve, reject);
    });
    return ntc;
  } catch (err) {
    return err;
  }
};

export { set, setJson, get, getJson, remove, clear, notice };
