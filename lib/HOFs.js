const injectResponse = (middlewareFunctionWithRes, {resolve, reject}) => {
  return function (request) {
    const response = resolve;
    response.success = resolve;
    response.error = reject;

    return middlewareFunctionWithRes(request, response);
  };
};

const withEarlyResponse = (middlewareFunction, {resolve, reject}) => {
  if (middlewareFunction.length == 2) {
    return injectResponse(middlewareFunction, {resolve, reject});
  } else {
    return middlewareFunction;
  }
};

// High Order Function Wrapper
module.exports = {
  withEarlyResponse,
  injectResponse
};