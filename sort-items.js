import { forEach, get, isEmpty, sortBy } from 'lodash-es';

/**
 * Computes the order of the provided items based on the given query.
 *
 * @param {array} items - The items to sort.
 * @param {function(any): string} valueTextProvider - A function that returns the text representation of an item's value.
 * @param {string[]} extraSearchFields - Additional fields to include in the search.
 * @param {string} query - The search query to use for sorting.
 * @returns {array} - The sorted items.
 */
export const sortItems = (items, valueTextProvider, extraSearchFields, query) => {
  if (isEmpty(items) || !valueTextProvider) return;

  const queryWords = query.trim().toLowerCase().split(' ');

  const array = sortBy(items, item => {
    let itemText = valueTextProvider(item.value).toLowerCase();

    if (extraSearchFields) {
      forEach(extraSearchFields, key => {
        const value = get(item, `${key}`);
        if (value) {
          itemText += ` ${value.toLowerCase()}`;
        }
      });
    }

    const itemWords = itemText.split(' ');
    let weight = 999;

    if (itemText.startsWith(query)) {
      weight -= 1;
    }

    forEach(queryWords, queryWord => {
      if (itemText.startsWith(queryWord)) {
        weight -= 1;
      }

      forEach(itemWords, itemWord => {
        if (queryWord === itemWord) {
          weight -= 1;
        }

        if (itemWord.startsWith(queryWord)) {
          weight -= 1;
        }

        if (itemWord.includes(queryWord)) {
          weight -= 1;
        }
      });
    });

    return weight;
  });

  return array;
};
