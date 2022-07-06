# Finally middleware is here!
Are you looking for something like this:
<pre><code>Parse.Cloud.define('doSomethingA', UserModule.doSomethingA, ['checkVersion', 'validateActiveUser']);
Parse.Cloud.define('doAnotherThingB', UserModule.doAnotherThingB, ['checkVersion', 'onlyAdmin', 'logRequest']);
</code></pre>

# Including
Support Application-level middleware, middleware must be a custom middleware and following Usage part.
This plugin is NOT compatible with expressJS style middleware.


# Usage 1
First, require the package only once, before defining cloud functions
<pre><code>require('parse-server-cloud-middleware');
</code></pre>


Then, you can now pass an Array of middleware function as third param of `Parse.Cloud.define`
<pre><code>Parse.Cloud.define('doSomethingA', UserModule.doSomethingA, [checkVersion, validateActiveUser]);
</code></pre>


Unlike expressJS middleware style which is required to use next() function, a Parse middleware function can be written similar to a Cloud function, it has `request` object.
You can:
 * Add more data/properties into `request` so next middlewares and main Cloud function can access to that information. 
 * Throw an error.

<pre><code>const validateActiveUser = (request) => {
  const user = request.user;
  if (!user || user.get('status') !== 'ACTIVE') {
    throw new Parse.Error(403, 'FORBIDDEN')
  }
};
</code></pre>

<pre><code>const checkVersion = (request) => {
  const { version } = request.params;
  if (!version) {
    throw new Error('missing version'); // new Parse.Error
  }
  if (version !== '1.1.1') {
    throw new Error('this cloud function is only for version 1.1.1') // new Parse.Error
  }
};
</code></pre>

 * Early response (response without error but still prevent next middleware/cloud function). To do so, we need to use second param in the middleware function.

<pre><code>const withCachedMiddleware = async (request, response) => {
  const cachedData = cacheProvider.key(request.params.sample)
  if (cachedData.exists()) {
    return response(await cachedData.fetch()); // this is the end, main cloud function won't be reached.
  }

  return; // enter main cloud function, responded by main cloud function result
};
</code></pre>

 * instead of using `response` as function. You can also use `response` similar to legacy style Parse server 2.x.x:
<pre><code>return response(await cachedData.fetch());
return response.success(await cachedData.fetch());
return response.error(); // Using "throw" statement is better than response.error()
</code></pre>



# Usage 2
It's basically the same, but you can inject the middleware function name-string instead!
<pre><code>const { init } = require('parse-server-cloud-middleware');
const MiddleWares = {
  checkVersion: require('./middlewares/checkVersion'),
  validateActiveUser: userModule.validateActiveUserMiddleware,
}

init(MiddleWares);

Parse.Cloud.define('doSomethingA', UserModule.doSomethingA, ['checkVersion', 'validateActiveUser']);
</code></pre>

