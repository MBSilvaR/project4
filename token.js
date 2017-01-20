var AccessToken = require('twilio').AccessToken;


var ACCOUNT_SID = process.env.ACCOUNT_SID;
var API_KEY_SID = process.env.API_KEY_SID;
var API_KEY_SECRET = process.env.API_KEY_SECRET;


var accessToken = new AccessToken(
  ACCOUNT_SID,
  API_KEY_SID,
  API_KEY_SECRET
);


accessToken.identity = 'Marcela';


var grant = new AccessToken.ConversationsGrant();
grant.configurationProfileSid = 'configurationProfileSid';
accessToken.addGrant(grant);


var jwt = accessToken.toJwt();
console.log(jwt);
