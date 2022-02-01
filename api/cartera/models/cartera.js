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

function normalizeJson(data) {
  for (let itemKey in data) {
      let item = data[itemKey];
      for (let key in item) {
          let newKey = key.trim().toUpperCase()
          item[newKey] = item[key];
          //delete item[key];
          //console.log("*" + key + "* - *" + newKey + "*");
      }
  }
  return data;
}

module.exports = {
  lifecycles: {
    async  afterCreate(result, data) {
        var XLSX = require("xlsx");

        var fileURL = "/opt/promotora-metropolitana/public" + result.file['url'];
        const excelFile = XLSX.readFile(fileURL);

        //var sheetsExcel = excelFile.SheetNames;
        var refSheet = excelFile.Sheets["Cartera"]['!ref'].split(":");

        let jsonData = XLSX.utils.sheet_to_json(excelFile.Sheets["Cartera"], {range: 'A1:' + refSheet[1] , raw: true, defval:null});

        jsonData = normalizeJson(jsonData);

        // Filter Json Data
        var newJsonData = jsonData.map(function(record){
            return {
                "customer_name": record['Nombre Cliente'],
                "insurance": record['Ramo'],
                "policy": record['Póliza'],
                "bill": record.Recibo,
                "balance": record['Importe (Factura/Recibo)'],
                "phone": record['Teléfono'],
                "customer_id": record['Identificación del Cliente'],
                "agent": record['Código Asesor'],
            };
        });

        // Saving Cartera Data
        newJsonData.forEach(element => {
            strapi.query('cartera-data').create({
                customer_name: element.customer_name,
                insurance: element.insurance,
                policy: element.policy,
                bill: element.bill,
                balance: isNumber(element.balance),
                phone: element.phone,
                customer_id: element.customer_id,
                agent: element.agent,
                contacted: false,
                cartera: result.id,
                created_by: result.created_by,
                updated_by: result.updated_by,
            });
        });

    },
  },
};
