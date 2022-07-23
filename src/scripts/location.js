import geohash from "ngeohash";

const state = async () => {
  try {
    let stt = await navigator.permissions.query({ name: "geolocation" });
    return stt.state;
  } catch (err) {
    return err;
  }
};

const ask = async (lat, lng) => {
  if (lat && lng) {
    return {
      err: false,
      lat: lat,
      lng: lng,
      accuracy: 1,
      query: geohash.encode(lat, lng),
    };
  } else {
    try {
      const crd = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        });
      });
      const { latitude, longitude, accuracy } = crd.coords;

      return {
        err: false,
        lat: latitude,
        lng: longitude,
        accuracy: accuracy,
        query: geohash.encode(latitude, longitude),
      };
    } catch (err) {
      return {
        err: true,
        code: err.code,
        msg: err.message,
      };
    }
  }
};

const distance = (lat1, lat2, lon1, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  let c = 2 * Math.asin(Math.sqrt(a));
  let r = 6371;

  return c * r;
};

export { state, ask, distance };
