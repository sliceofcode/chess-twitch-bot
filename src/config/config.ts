import * as _ from 'lodash';

const customConfig = require('../../config/config.json');

const config = _.extend({
    commandPrefix: '!',
    debug: false,
    rating: {
        funnyReplies: false,
        showLinks: true
    },
    channels: [''],
    identity: {
        username: '',
        password: ''
    }
}, customConfig);

global.botConfig = config;