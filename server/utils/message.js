var moment = require('moment');

var generateMsg = (from, text) => {
  return {
    from,
    text,
    createdAt: moment().valueOf()
  };
};

var generateLocationMsg = (from, lat, long) => {
  return {
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    map: `https://www.google.com/maps/embed/v1/place?key=AIzaSyCxM0JsVY7-ycBS20o5B8y8G5AyPCs5ZjY&q=${lat},${long}`,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMsg, generateLocationMsg};
