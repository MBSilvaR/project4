$(document).ready(function() {


if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
    tlog('You are using a browser that is not WebRTC compatible, please use Google Chrome or Mozilla Firefox', true);
}

function tlog(msg, e) {
  if (e) {
    $('.logs').append('<div class="log error">' + msg + '</div>');
  } else {
    $('.logs').append('<div class="log">' + msg + '</div>');
  }
}

});
