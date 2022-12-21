/**
 * Whether query's all words are matching with input string
 * @param {String} value string which will be matched with query string
 * @param {Array} query string which is used to search
 * @returns return true if query string's any word is matched with input string
 */
export const filter = (value, query = "") => {
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
        if (item.hasOwnProperty(key)) {
          str = str + " " + item[key];
        }
      });
    }
    return filter(str, query);
  };
};
