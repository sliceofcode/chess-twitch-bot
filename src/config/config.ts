import * as _ from 'lodash';

const customConfig = require('../../config/config.json');

const config = _.extend({
    commandPrefix: '!',
    messagePrefix: '[Chess.com] ',
    debug: false,
    rating: {
        funnyReplies: false,
        showLinks: true
    },
    channels: [''],
    identity: {
        username: '',
        password: ''
    },
    userAgent: 'ChessTwitchBot - No contact details provided'
}, customConfig);

global.botConfig = config;