const createRequest = async (options) => {
  let response = await fetch(options.url, options.params);
  let result = await response.json();
  return result;
};

export default createRequest;
