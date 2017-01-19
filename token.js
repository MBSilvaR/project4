var AccessToken = require('twilio').AccessToken;

// Substitute your Twilio AccountSid and ApiKey details
var ACCOUNT_SID = 'ACc26fff086a652c540aaefc17e6c3bb5b';
var API_KEY_SID = 'SK3308cf715ae73033133304b229a0cff1';
var API_KEY_SECRET = 'U3XgLuDmp1NJF3lnrQNGUSQ7zXYXE0Gk';

// Create an Access Token
var accessToken = new AccessToken(
  ACCOUNT_SID,
  API_KEY_SID,
  API_KEY_SECRET
);

// Set the Identity of this token
accessToken.identity = 'Marcela';

// Grant access to Conversations
var grant = new AccessToken.ConversationsGrant();
grant.configurationProfileSid = 'configurationProfileSid';
accessToken.addGrant(grant);

// Serialize the token as a JWT
var jwt = accessToken.toJwt();
console.log(jwt);
