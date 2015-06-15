var sleep = require('sleep');

var _ = require('lodash');
var redis = require('redis');
var hamster = require('hamster');

var config = require('./config');

redisClient = redis.createClient();

hamster.setParams({
    keyID: config.keyID,
    vCode: config.vCode
});

var fetchPosNotifications = function(callback) {
    hamster.fetch('char:Notifications', {}, function (err, res) {
        if(err) throw err
        var notifications = res.notifications;

        // filter out all notifications w/o the right ids
        var posNotifications = _.filter(notifications, function (notification) {
          return notification.typeID == 75 || notification.typeID == 76;
        });

        callback(posNotifications);
    });
}

var getNewNotificationIds = function(notifications, callback) {
        // convert that collection an array with just the keys
        var typeKeys = _.keys(matchingType);

        // get the cached notifications and gets an array of their ids
        var cachedNotifications = redisClient.hgetall('notifications', function(err, obj) {
            if(err) throw err
            return obj
        });

        var notificationIds = _.pluck(cachedNotifications, 'Id');

        // only keep the notification id's that don't already exist
        var uniqueIds = _.difference(notificationIds, typeKeys);

        callback(uniqueIds);
}

var publishNewNotifications = function(uniqueIds, callback) {
    _.each(uniqueIds, function (id) {
        hamster.fetch('char:NotificationTexts', {IDs: id}, function(err, res) {
            if(err) throw err
            redisClient.publish(res);
        });
    });
}

var startup = function() {
    var resp = fetchPosNotifications(function(err, res) {
        if(err) throw err
        return res;
    });

    redisClient.hmset(notifications, resp);
}

startup();

while(true) {
    var resp = fetchPosNotifications(function(err, res) {
        if(err) throw err
        return res;
    });

    var newNotifications = getNewNotificationIds(resp, function(err, res) {
        if(err) throw err
        return res;
    });

    if(newNotifications) {
        publishNewNotifications(newNotifications, function(err) {
            if(err) throw err
        });

        redisClient.hmset(notifications, resp);
    }

    // sleep for 5 minutes
    sleep.sleep(300);
}

