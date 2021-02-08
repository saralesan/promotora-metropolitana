'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

var pattern = new RegExp('^(https?)://');

module.exports = {
    lifecycles: {
        async beforeCreate(data) {
            if(!pattern.test(data.video_url) && (data.video_url!=null)) {
                data.video_url = "https://" + data.video_url;
            }
        },
        async beforeUpdate(params, data) {
            if(!pattern.test(data.video_url)) {
                data.video_url = "https://" + data.video_url;
                if(data.video_url === "https://") {
                    data.video_url = null;
                }
            }
        },

    },
};
