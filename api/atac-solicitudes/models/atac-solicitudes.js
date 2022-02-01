'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {

  lifecycles: {
    async  afterCreate(result, data) {
      console.log("ATAC created... ");
      console.log(result);

      // Email to support
      await strapi.plugins['email'].services.email.send({
        to: 'kpareja@sura.com.co',
        from: 'soporte@innovaciones.co',
        subject: 'Nueva solicitud ATAC registrada',
        html: `<p>Hola Katlyn,</p>
          <p>Hemos recibo una solicitud de ATAC nueva:</p>
          <ul>
            <li>ID: ` + result.id + `</li>
            <li>Creado por: ` + result.user_id.name + ` ` + result.user_id.surname + `</li>
            <li>Correo: ` + result.user_id.email + `</li>
            <li>Servicio: ` + result.service + `</li>
            <li>Intereses: ` + result.interests + `</li>
          </ul>`,
      });

      // Email to customer
      await strapi.plugins['email'].services.email.send({
        to: result.user_id.email,
        from: 'soporte@innovaciones.co',
        subject: 'Solicitud ATAC registrada',
        html: `<p>Hola ` + result.user_id.name + `,</p>
          <p>Hemos recibo una solicitud de ATAC nueva:</p>
          <ul>
            <li>ID: ` + result.id + `</li>
            <li>Servicio: ` + result.service + `</li>
            <li>Intereses: ` + result.interests + `</li>
          </ul>`,
      });

    },
  },
};
