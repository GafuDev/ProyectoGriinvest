const {format} = require('timeago.js');


const helpers = {};

helpers.timeago = (timestamp)=>{
    return timeagoInstance.format(timestamp);
}


module.exports = helpers;