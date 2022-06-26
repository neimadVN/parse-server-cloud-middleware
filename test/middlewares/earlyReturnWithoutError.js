const earlyContent = 'This is the early response content';

const earlyReturnWithoutError = (request, response) => {
  if (request.params.earlyResponse) {
    return response.success(earlyContent)
  } else if (request.params.earlyError) {
    return response.error(earlyContent)
  }

  return;
};

module.exports = earlyReturnWithoutError;
