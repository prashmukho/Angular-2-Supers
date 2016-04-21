module.exports = (function () {
  var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");

  this.isHex24 = function (id) {
    return checkForHexRegExp.test(id);
  }

  this.error400 = function (res) {
    return res.status(400).send(_wrapError('Bad request!'));
  }

  this.error404 = function (res, id) {
    return res.status(404).send(_wrapError('Document with id "'+id+'" not found!'));
  }

  this.error500 = function (res, type, errors) {
    return res.status(500).send(_wrapError('Unable to '+type, errors));
  }

  function _wrapError(message, errors) {
    return {
      message: message,
      errors: ( errors ? _parseErrors(errors) : undefined )
    };
  }

  function _parseErrors(errors) {
    var errorsArray = [];
    for (var type in errors)
      errorsArray.push({ 
        message: errors[type]['message'], 
        field: errors[type]['path'] 
      });
    return errorsArray;
  }

  return this;
})();