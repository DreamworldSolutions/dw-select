import forEach from "lodash-es/forEach";
import toString from "lodash-es/toString";

export const KeyCode = {
  ENTER: 13,
  ARROW_UP: 38,
  ARROW_DOWN: 40,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  SPACE: 32,
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

export const NEW_VALUE_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  NEW_VALUE: "NEW_VALUE",
  ERROR: "ERROR",
};

/**
 * Whether query's all words are matching with input string
 * @param {String} value string which will be matched with query string
 * @param {Array} query string which is used to search
 * @returns return true if query string's any word is matched with input string
 */
export const filter = (value, query = "") => {
  value = toString(value); //Safe guard against Numeric value or any other type.
  value = value.trim().toLowerCase();
  const queryArray = query.trim().toLowerCase().split(" ");

  return queryArray.every((e) => {
    return value.indexOf(e) !== -1;
  });
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
        if (item.hasOwnProperty(key)  && item[key]) {
          str = str + " " + item[key];
        }
      });
    }
    return filter(str, query);
  };
};
