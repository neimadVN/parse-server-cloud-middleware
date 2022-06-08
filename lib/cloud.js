const processAllMiddlewares = async (middlewares = [], request) => {
  const nextWare = middlewares.shift();
  if (typeof nextWare === 'function') {
    await nextWare(request);
  }
  return processAllMiddlewares(middlewares, request);
};

const getWrapped = (cloudF, [...middlewares] = []) => {
  return async (request) => {
    await processAllMiddlewares(middlewares, request);
    return cloudF(request);
  }
};

Parse.Cloud.originDefine = Parse.Cloud.define;
Parse.Cloud.define = (cloudFName = "", cloudF = () => {}, [...middlewares] = []) => {
  return Parse.Cloud.originDefine(cloudFName, getWrapped(cloudF, [...middlewares]));
};

// Parse.Cloud.define('setUserInfo', UserCloud.setUserInfo, [checkOperator, from7_4, logRequest, withDeviceInfo])