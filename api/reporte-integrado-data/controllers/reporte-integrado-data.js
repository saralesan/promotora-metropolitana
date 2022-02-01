'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */


function rankingQuery(knex, category, reportId) {
    return (
        knex('integrated_report_data')
        .where({'branch_gct': category, 'integrated_report': reportId})
        .select('id', 'user_code', 'name')
        .limit(10))
}

module.exports = {
    findRanking: async ctx => {
        
        var jsonRanking = {
            'VIDA INDIVIDUAL': {},
            'SALUD FAMILIAR2': {},
            'AUTOS INDIVIDUAL': {},
            'HOGARSURA': {},
            'VIDA DE GRUPO': {},
            'SALUD COLECTIVO2': {},
            'AUTOS COLECTIVO': {},
            'INCENDIO': {},
        };
        
        const knex = strapi.connections.default;

        var reportId = await knex('integrated_report_data')
          .select('integrated_report')
          .orderBy('integrated_report', 'desc')
          .limit(1)
        reportId = Object.values(JSON.parse(JSON.stringify(reportId)));
        reportId = reportId[0]['integrated_report'];

        jsonRanking["VIDA INDIVIDUAL"] = await rankingQuery(knex, 'VIDA INDIVIDUAL', reportId);
        jsonRanking["SALUD FAMILIAR2"] = await rankingQuery(knex, 'SALUD FAMILIAR2', reportId);
        jsonRanking["AUTOS INDIVIDUAL"] = await rankingQuery(knex, 'AUTOS INDIVIDUAL', reportId);
        jsonRanking["HOGARSURA"] = await rankingQuery(knex, 'HOGARSURA', reportId);
        jsonRanking["VIDA DE GRUPO"] = await rankingQuery(knex, 'VIDA DE GRUPO', reportId);
        jsonRanking["SALUD COLECTIVO2"] = await rankingQuery(knex, 'SALUD COLECTIVO2', reportId);
        jsonRanking["AUTOS COLECTIVO"] = await rankingQuery(knex, 'AUTOS COLECTIVO', reportId);
        jsonRanking["INCENDIO"] = await rankingQuery(knex, 'INCENDIO', reportId);

        return (jsonRanking);
      },
};
