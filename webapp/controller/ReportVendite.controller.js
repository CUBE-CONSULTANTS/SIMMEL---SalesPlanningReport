sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController , Controller, exportLibrary, Spreadsheet) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return BaseController.extend("salesplanningreport.controller.ReportVendite", {
            onInit: function () {

            },


            


            createColumnConfig: function () {
                let aCols = [];
                aCols.push({ label: 'Cliente', property: 'cliente' , type: EdmType.String });
                aCols.push({ label: 'Prodotto', property: 'prodotto' , type: EdmType.String });
                aCols.push({ label: 'Quantità', property: 'quantita' , type: EdmType.Number });
                aCols.push({ label: 'Valore', property: 'valoreRicavo' , type: EdmType.Number });
                return aCols;
              },

              onExport: function () {
                let aCols, oRowBinding, oSettings, oSheet, oTable
            
                this._oTable = this.getView().getModel('ProductModel').getProperty('/');
            
                let tableData = this.getView().byId('tableReportVendite');
                let oSelectedItems = tableData.getSelectedItems();
        
                if (oSelectedItems.length > 0) {
                    oRowBinding = oSelectedItems.map(item => item.getBindingContext('ProductModel').getObject());
                } else {
                    oRowBinding = this._oTable;
                }
            
                aCols = this.createColumnConfig();
            
                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: "Report Pianificazione Vendite",
                    worker: false
                };
            
                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy()
                })
            },


        });
    }




)