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

                var oModel = new sap.ui.model.json.JSONModel();
                oModel.setData({
                    milk: [
                        { Date: new Date(2022, 0, 1), Revenue: 100 },
                        { Date: new Date(2022, 0, 2), Revenue: 200 },
                        { Date: new Date(2022, 0, 3), Revenue: 300 },
                        { Date: new Date(2022, 0, 4), Revenue: 400 },
                        { Date: new Date(2022, 0, 5), Revenue: 500 }
                    ],
                    chartType: {
                        name: "Chart Type",
                        defaultSelected: "timeseries_column",
                        values: [
                            { name: "Column", key: "timeseries_column"}
                            // Altri tipi di grafico qui
                        ]
                    }
                });
                
                this.getView().setModel(oModel);

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


            onViewChange: function (oEvent) {
                let sKey = oEvent.getParameter('item').getProperty('key')
                let oTable = this.byId("tableReportVendite");
                let oChart = this.byId("chartReportVendite");
                if (sKey === "table") {
                    oTable.getColumns().forEach(function (oColumn) {
                        oColumn.setVisible(true);
                    });
                    oTable.getItems().forEach(function (oItem) {
                        oItem.setVisible(true);
                    });
                    oChart.setVisible(false);
                } else if (sKey === "chart") {
                    oTable.getColumns().forEach(function (oColumn) {
                        oColumn.setVisible(false);
                    });
                    oTable.getItems().forEach(function (oItem) {
                        oItem.setVisible(false);
                    });
                    oChart.setVisible(true);
                }
            },




        });
    }




)