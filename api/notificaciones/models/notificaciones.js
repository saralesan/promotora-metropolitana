'use strict';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

function notificationRequest(title, message, deviceToken, action, actionArgument) {
    var notificationData = JSON.stringify({
        "notification": {
            "title": title,
            "body": message
        },
        "to": deviceToken,
        "data": {
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "tap_action": action,
            "tap_action_arguments": actionArgument
        }
    });

    console.log(notificationData);

    return notificationData;
}

module.exports = {
    lifecycles: {
        async  afterCreate(result, data) {
            var actionArgument = 0;
            if (data.action == "Educación" && data.education) {
                actionArgument = data.education;
            }
            else if (data.action == "Preguntas_frequentes" && data.faq_categories) {
                actionArgument = data.faq_categories;
            }

            // creating request
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = true;

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    //console.log(this.responseText);
                }
            });

            xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
            xhr.setRequestHeader("Authorization", "key=AAAAKfPlAio:APA91bFOeKzrGX80keUc6t8sXiChA7ukBDpZElACSCqIWhkg4ahlchchMVhuO9pElU_88MQjyVT_s-1nARoIT5vGrgNDeFuFQhW9viF9-8hy_vcVu5f2uzc7jdJSSNI0DDu2xtq0pGJI");
            xhr.setRequestHeader("Content-Type", "application/json");

            // Users Validation
            var devices = [];
            if (Object.keys(result.users).length) { // Users
                console.log("Has users");
                
                Object.values(result.users).forEach(function(user){
                    // console.log(user.device_token);
                    if (user.device_token != null) {
                        //devices.push(user.device_token);
                        var notificationData = notificationRequest(result.title, result.message, user.device_token, data.action, actionArgument);
                        xhr.send(notificationData);
                        console.log(xhr.responseText);
                    }
                });
            }
            else { // NO Users
                console.log("NO users");
                var usersPromise = strapi.query('user', 'users-permissions').find();
                usersPromise.then((users) => {
                    users.forEach(user => {
                    if (user.device_token != null) {
                        // console.log("¡Sí! " + user.device_token);
                        // devices.push(user.device_token);
                        var notificationData = notificationRequest(result.title, result.message, user.device_token, data.action, actionArgument);
                        xhr.send(notificationData);
                        console.log(xhr.responseText);
                    }
                    });
                });
            }

            //var notificationData = notificationRequest(result.title, result.message, "cE9B8gqEROyTc0zWV0nrOO:APA91bHby3F8U5iyiAFrOAlzWjkYkZ4dH6zd0dfbdZxQSXTsOwjHp5_1B3Ow3yvJ4CAdiEmyHFDHedrLBf0H7CsnXXSDsZcbWmYkBIlvT4ffF4SsqXUjyA8_9hfHV8LGExzc79qVzNAn");
            //xhr.send(notificationData);

            //console.log(xhr.responseText);
        },
    },
};
