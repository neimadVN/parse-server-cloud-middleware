const { withEarlyResponse } = require('./HOFs');

const makeCombinedFunc = (cloudF, [...middlewares] = []) => {
  return (request) => new Promise(async (resolve, reject) => {
    try {
      let __early_stop_order = false;
      const earlyResolve = (...arg) => {
        __early_stop_order = true;
        return resolve(...arg);
      };
      const earlyReject = (...arg) => {
        __early_stop_order = true;
        return reject(...arg);
      };

      for (let nextWare of middlewares) {
        if (typeof nextWare === 'string') {

          const functionName = nextWare;
          if (!MIDDLE_WARES_POOL[functionName]) {
            throw new Error(`${functionName} is not initialized`); 
          } else {
            nextWare = MIDDLE_WARES_POOL[functionName];
          }

        }
        if (typeof nextWare === 'function') {
          await withEarlyResponse(nextWare, {resolve: earlyResolve, reject: earlyReject})(request);

          if (__early_stop_order) {
            return; // stop before conduct next middleware and main cloudF
          }
        }
      }

      const funcSuccess = await cloudF(request);
      resolve(funcSuccess);
    } catch (err) {
      reject(err);
    }
  });
};

Parse.Cloud.originDefine = Parse.Cloud.define;
Parse.Cloud.define = (cloudFName = "", cloudF = () => {}, [...middlewares] = []) => {
  return Parse.Cloud.originDefine(cloudFName, makeCombinedFunc(cloudF, [...middlewares]));
};

let MIDDLE_WARES_POOL = {};

module.exports = {
  init: (MiddleWaresMapping = {}) => {
    MIDDLE_WARES_POOL = MiddleWaresMapping;
  }
};