'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

function isNumber(value) {
    try {
        if(isNaN(value)){
            return(null);
        }
        else{
            return(value);
        }
    } catch (error) {
        return(null);
    }
 }

module.exports = {
    lifecycles: {
        async  afterCreate(result, data) {
            var XLSX = require("xlsx");

            var fileURL = "/opt/promotora-metropolitana/public" + result.file['url'];
            const excelFile = XLSX.readFile(fileURL);

            //var sheetsExcel = excelFile.SheetNames;
            var refSheet = excelFile.Sheets["HOJA DE VIDA TOTAL"]['!ref'].split(":");

            let jsonData = XLSX.utils.sheet_to_json(excelFile.Sheets["HOJA DE VIDA TOTAL"], {range: 'A2:' + refSheet[1] , raw: true, defval:null});
            //console.log(jsonData);

            // Filter Json Data
            var newJsonData = jsonData.map(function(record){
                return {
                    "user_code": record['Agente Lider Act'],
                    "name": record.Columna1,
                    "branch_gct": record['Ramo GCT'],
                    "pdn_new": record[' Pdn Nueva '],
                    "pdn_new_prev": record[' Pdn Nueva año ant '],
                    "pdn_total": record[' Pdn Total '],
                    "pdn_canc": record[' Pdn Canc '],
                    "pct_effect": record['% Efect 1'],
                    "avg_prima": record[' PrimaPromN 1 '],
                    "goal": record.Meta, // Pending Column
                };
            });
            //console.log(newJsonData);


            // Saving Reporte Integrado Data
            newJsonData.forEach(element => {
                strapi.query('reporte-integrado-data').create({
                    user_code: isNumber(element.user_code),
                    name: element.name,
                    report_date: result.report_date,
                    branch_gct: element.branch_gct,
                    pdn_new: isNumber(element.pdn_new),
                    pdn_new_prev: isNumber(element.pdn_new_prev),
                    pdn_total: isNumber(element.pdn_total),
                    pdn_canc: isNumber(element.pdn_canc),
                    pct_effect: isNumber(element.pct_effect),
                    avg_prima: isNumber(element.avg_prima),
                    goal: isNumber(element.goal),
                    integrated_report: result.id,
                    created_by: result.created_by,
                    updated_by: result.updated_by,
                });
            });
        },
    },
};
