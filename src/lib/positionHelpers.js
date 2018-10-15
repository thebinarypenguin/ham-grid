
  const isPosition = function (input) {

    if (!input) {
      return false;
    }

    if (input.constructor.name === 'Position') {
      return true;
    }

    if (input.coords !== undefined &&
        input.coords.latitude !== undefined &&
        input.coords.longitude !== undefined &&
        input.coords.accuracy !== undefined) {
      return true;
    }

    return false;
  }

  const isPositionError = function (input) {

    if (!input) {
      return false;
    }

    if (input.constructor.name === 'PositionError') {
      return true;
    }

    if (input.code !== undefined &&
        input.message !== undefined) {
      return true;
    }

    return false;
  }

export default {
  isPosition,
  isPositionError,
};
