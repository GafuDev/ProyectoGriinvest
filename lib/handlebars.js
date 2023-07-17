const { format } = require('timeago.js');



const helpers = {};

helpers.timeago = (timestamp) => {
  return timeagoInstance.format(timestamp);
}


helpers.isEmpty = (value) => {
  if (typeof value === 'undefined' || value === null || value === '' || value === "" ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' && Object.keys(value).length === 0)) {
    return true;
  } else {
    return false;
  }
};

module.exports = helpers;