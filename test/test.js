// init mini Parse
const _pool = {};
const Parse = {
  Cloud: {
    define: (FName, handler) => {
      _pool[FName] = handler;
    },
    run: (FName, params) => {
      const request = { params };

      return _pool[FName](request);
    },
  },
};

global.Parse = Parse;

// require lib
const { init } = require('../index');
const MiddleWares = {
  checkVersion: require('./middlewares/checkVersion'),
  earlyReturnWithoutError: require('./middlewares/earlyReturnWithoutError'),
}

init(MiddleWares);

// Directly used
// Parse.Cloud.define('testCloudFunction', (request) => {
//   console.log('Main cloud Function reached', request.params);
// }, [MiddleWares.checkVersion, MiddleWares.earlyReturnWithoutError, 1])

// injection used
Parse.Cloud.define('testCloudFunction', (request) => {
  console.log('Main cloud Function reached', request.params);
}, ['checkVersion', 'earlyReturnWithoutError'])

Parse.Cloud.run('testCloudFunction', {
  version: '1.1.1', // adjust the params here
  page: 1,
  perPage: 10,
  earlyResponse: false,
  earlyError: false 
});
