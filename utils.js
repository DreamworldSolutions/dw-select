import forEach from "lodash-es/forEach";

export const KeyCode = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
};

export const Direction = {
  UP: "up",
  DOWN: "down",
};

export const Position = {
  START: "start",
  CENTER: "center",
  END: "end",
  NEAREST: "nearest",
};

/**
 * Wheter query matching with any word of the input string
 * @param {String} value string which will be matched with query string
 * @param {Array} query string which is used to search
 * @returns return true if query string's any word is matched with input string
 */
export const filter = (value, query = "") => {
  value = value.toLowerCase();
  let queryArray = query.toLowerCase().split(" ");

  let isMatched = false;
  forEach(queryArray, (e) => {
    if (value.indexOf(e) !== -1) {
      isMatched = true;
      return false;
    }
  });
  return isMatched;
};

/**
 * Generator function
 * @param {Array} keys
 * @returns {Function}
 */
export const queryFilterGenerator = (keys) => {
  return (item, query) => {
    let str = "";
    if (keys && keys.length > 0) {
      keys.forEach((key) => {
        if (item.hasOwnProperty(key)) {
          str = str + " " + item[key];
        }
      });
    }
    return filter(str, query);
  };
};
