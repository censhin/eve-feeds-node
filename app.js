var hamster = require('hamster');
var config = require('./config');

hamster.setParams({
    keyID: config.keyID,
    vCode: config.vCode
});

hamster.fetch('char:Notifications', {}, function (err, res) {
    if (err) throw err
    var notifications = res.notifications;
    for(var key in notifications) {
        var typeId = notifications[key].typeID;
        if(typeId === 75 || typeId === 76) {
            var cachedNotifications = 'stuff'; // pull data from redis
            for(var cKey in cachedNotifications) {
                if(cachedNotifications.Id != key) {
                    // cache the notification
                    hamster.fetch('char:NotificationTexts', {IDs: key}, function(err, res) {
                        if (err) throw err
                        // publish the notification to all subscribers
                    }
                }
            }
        }
    }
});

