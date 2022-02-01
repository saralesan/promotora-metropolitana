'use strict';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

function notificationRequest(title, message, deviceToken, action, actionArgument, name, sale) {
    title = title && name != null ? title.replace(/%NOMBRE%/g, name) : title;
    message = message && name != null ? message.replace(/%NOMBRE%/g, name) : message;

    title = title && sale != null ? title.replace(/%VENTAS%/g, sale) : title;
    message = message && sale != null ? message.replace(/%VENTAS%/g, sale) : message;

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
            // Current month
            var today = new Date();
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();
            today = yyyy + '-' + mm + '-01';
            
            // Actions
            var actionArgument = 0;
            if (data.action == "Educación" && data.education) {
                actionArgument = data.education;
            }
            else if (data.action == "Preguntas_frecuentes" && data.faq_categories) {
                actionArgument = data.faq_categories;
            }

            // Users Validation
            var devices = [];
            if (Object.keys(result.users).length) { // Has Users
                console.log("Has users");

                var usersID = result.users.map(function (users) {
                    return users.id;
                });

                var usersPromise = strapi.query('user', 'users-permissions').find({ id_nin: [1]}, ['sale']);
                usersPromise.then((users) => {
                    users.forEach(user => {
                        if (user.device_token != null && usersID.includes(user.id)) {

                            // creating request
                            var xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                
                            xhr.addEventListener("readystatechange", function () {
                                if (this.readyState === 4) {
                                    console.log(this.responseText);
                                }
                            });

                            // User sales
                            user.salesCount = 0;
                            user.sale.forEach(userSales => {
                                userSales.date >= today ? user.salesCount++ : user.salesCount;
                            });

                            xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
                            xhr.setRequestHeader("Authorization", "key=AAAAKfPlAio:APA91bFOeKzrGX80keUc6t8sXiChA7ukBDpZElACSCqIWhkg4ahlchchMVhuO9pElU_88MQjyVT_s-1nARoIT5vGrgNDeFuFQhW9viF9-8hy_vcVu5f2uzc7jdJSSNI0DDu2xtq0pGJI");
                            xhr.setRequestHeader("Content-Type", "application/json");
                            var notificationData = notificationRequest(result.title, result.message, user.device_token, data.action, actionArgument, user.name, user.salesCount);
                            xhr.send(notificationData);
                            console.log(xhr.responseText);
                        }
                    });
                });
            }
            else { // NO Users
                console.log("NO users");
                var usersPromise = strapi.query('user', 'users-permissions').find({ id_nin: [1]}, ['sale']);
                usersPromise.then((users) => {
                    users.forEach(user => {
                        if (user.device_token != null) {

                            // creating request
                            var xhr = new XMLHttpRequest();
                            xhr.withCredentials = true;
                
                            xhr.addEventListener("readystatechange", function () {
                                if (this.readyState === 4) {
                                    console.log(this.responseText);
                                }
                            });

                            // User sales
                            user.salesCount = 0;
                            user.sale.forEach(userSales => {
                                userSales.date >= today ? user.salesCount++ : user.salesCount;
                            });

                            xhr.open("POST", "https://fcm.googleapis.com/fcm/send");
                            xhr.setRequestHeader("Authorization", "key=AAAAKfPlAio:APA91bFOeKzrGX80keUc6t8sXiChA7ukBDpZElACSCqIWhkg4ahlchchMVhuO9pElU_88MQjyVT_s-1nARoIT5vGrgNDeFuFQhW9viF9-8hy_vcVu5f2uzc7jdJSSNI0DDu2xtq0pGJI");
                            xhr.setRequestHeader("Content-Type", "application/json");
                            var notificationData = notificationRequest(result.title, result.message, user.device_token, data.action, actionArgument, user.name, user.salesCount);
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
