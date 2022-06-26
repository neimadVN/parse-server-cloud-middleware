const checkVersion = (request) => {
  const { version } = request.params;
  if (!version) {
    throw new Error('missing version'); // new Parse.Error
  }
  if (version !== '1.1.1') {
    throw new Error('this cloud function is only for version 1.1.1') // new Parse.Error
  }
}

module.exports = checkVersion;