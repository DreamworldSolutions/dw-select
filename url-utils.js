import URI from '@dw/urijs-esm';

/**
 * Navigates to given url
 * @param {String} url 
 */
export const navigate = (url) => {
  window.history.pushState({}, '', url);
}

/**
 * Sets given query param in the current URL
 * It sets param if param is not available in current URL or param avaialble with different paramValue
 * 
 * Removed given query param from the URL if paramValue is not available
 * It does nothing if given param is not available in the current URL
 * 
 * @param {String} ParamName - query param name to be add in the URL
 * @param {String} paramValue - query param value for the given paramName
 */
export const setQueryParam = (ParamName, paramValue) => {
  if(!ParamName) {
    return;
  }
  
  let uri = URI();
  let params = URI.parseQuery(uri.search());

  if(paramValue && params[ParamName] !== paramValue) {
    uri.setSearch(ParamName, paramValue); //Set new query parameter
  } 
  
  if(!paramValue && uri.hasSearch(ParamName)){
    uri.removeSearch(ParamName); //Remove query parameter
  }
  
  navigate(uri.toString());
}

/**
 * Sets given hash param in the current URL (in hash part)
 * It sets param if param is not available in current URL or param avaialble with different paramValue
 * 
 * Removed given hash param from the URL if paramValue is not available
 * It does nothing if given hash param is not available in the has part of the current URL
 * 
 * @param {String} ParamName - query param name to be add in the URL
 * @param {String} paramValue - query param value for the given paramName
 */
export const setHashParam = (ParamName, paramValue) => { 
  if (!ParamName) { 
    return;
  }

  let uri = new URI();
  let hashUri = new URI(uri.hash().substr(1));
  let params = URI.parseQuery(hashUri.search());

  // set new hash param if not available or available with diffrent value than paramValue in current URL and param value is not blank
  if(paramValue && params[ParamName] !== paramValue){
    hashUri.setSearch(ParamName, paramValue);
  } 
  
  // remove hash param if available in current URL and param value is blank
  if(!paramValue && hashUri.hasSearch(ParamName)){
    hashUri.removeSearch(ParamName);
  }

  uri.hash(hashUri.toString());

  navigate(uri.toString());
}
