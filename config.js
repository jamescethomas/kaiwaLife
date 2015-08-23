// config.js

var config = {};

// should end in /
config.rootUrl  = process.env.ROOT_URL                  || 'http://localhost:8080/';

config.facebook = {
    appId:          process.env.FACEBOOK_APPID          || '916053341770476',
    appSecret:      process.env.FACEBOOK_APPSECRET      || '465210a7ecec7da4fa67d141b65008a5',
    appNamespace:   process.env.FACEBOOK_APPNAMESPACE   || 'kaiwalife',
    redirectUri:    process.env.FACEBOOK_REDIRECTURI    ||  config.rootUrl + 'login/callback'
};

module.exports = config;