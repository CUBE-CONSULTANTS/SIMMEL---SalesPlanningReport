sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Controller, exportLibrary, Spreadsheet) {
        "use strict";
        var EdmType = exportLibrary.EdmType;

        return BaseController.extend("salesplanningreport.controller.ReportVendite", {
            onInit: function () {
                this.grafico()
                this.grafico2();
                this.grafico3();



            },


            grafico: function () {
                


            },

            grafico2: function () {
                var oModel = this.getOwnerComponent().getModel("ProductModel");
                this.getView().setModel(oModel, "ProductModel");
                console.log(oModel);

                //Creare un modello per il grafico estraendo la proprieta probabilita dal modello ProductModel
                var oModelChart = new sap.ui.model.json.JSONModel();
                var data = oModel.getProperty("/");
                var dataChart = [];

                var probCounts = {};

                data.forEach((item) => {
                    if (!probCounts[item.probabilita]) {
                        probCounts[item.probabilita] = 0;
                    }
                    probCounts[item.probabilita]++;
                });

                // Calcolare il totale delle occorrenze
                var totalCount = Object.values(probCounts).reduce((a, b) => a + b, 0);

                // Creare l'array di dati per il grafico
                for (var prob in probCounts) {
                    var count = probCounts[prob];
                    var percentage = (count / totalCount) * 100;
                    dataChart.push({
                        probabilita: prob,
                        percentage: percentage
                    });
                }

                oModelChart.setData(dataChart);
                this.getView().setModel(oModelChart, "ProductModelChart");
                console.log(oModelChart);
            },



            grafico3: function () {

                var oModel = this.getOwnerComponent().getModel("ProductModel");
                var rawData = oModel.getProperty("/");

                var aggregatedData = {};
                
                function convertPeriodToMonth(period) {
                    var monthMap = {
                        '01': 'GENNAIO',
                        '02': 'FEBBRAIO',
                        '03': 'MARZO',
                        '04': 'APRILE',
                        '05': 'MAGGIO',
                        '06': 'GIUGNO',
                        '07': 'LUGLIO',
                        '08': 'AGOSTO',
                        '09': 'SETTEMBRE',
                        '10': 'OTTOBRE',
                        '11': 'NOVEMBRE',
                        '12': 'DICEMBRE'
                    };
                
                    var monthNumber = period.substring(3, 5); // Esempio: "03"
                    return { monthName: monthMap[monthNumber], monthNumber: monthNumber };
                }
                
                // Aggrega i dati per periodo di acquisizione e probabilità
                rawData.forEach(function (item) {
                    var periodo = convertPeriodToMonth(item.periodoAcquisizione); // Esempio: { monthName: "MARZO", monthNumber: "03" }
                    var monthName = periodo.monthName;
                    var monthNumber = periodo.monthNumber;
                
                    if (!aggregatedData[monthNumber]) {
                        aggregatedData[monthNumber] = { periodo: monthName, monthNumber: monthNumber, probabile: 0, pocoProbabile: 0, nonProbabile: 0 };
                    }
                
                    if (item.probabilita === "H1") {
                        aggregatedData[monthNumber].probabile += 1;
                    } else if (item.probabilita === "H2") {
                        aggregatedData[monthNumber].pocoProbabile += 1;
                    } else if (item.probabilita === "H3") {
                        aggregatedData[monthNumber].nonProbabile += 1;
                    }
                });
                
                var formattedData = Object.values(aggregatedData);
                
                // Ordina i dati in base al numero del mese
                formattedData.sort(function(a, b) {
                    return a.monthNumber - b.monthNumber;
                });
                
                var oModel = new sap.ui.model.json.JSONModel();
                
                oModel.setData({ data: formattedData });
                this.getView().setModel(oModel, "ProductModelPeriod");
                
                console.log(oModel);
            },


            createColumnConfig: function () {
                let aCols = [];
                aCols.push({ label: 'Cliente', property: 'cliente', type: EdmType.String });
                aCols.push({ label: 'Prodotto', property: 'prodotto', type: EdmType.String });
                aCols.push({ label: 'Quantità', property: 'quantita', type: EdmType.Number });
                aCols.push({ label: 'Valore', property: 'valoreRicavo', type: EdmType.Number });
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
                let oChart = this.byId("chartReportVenditee");
                if (sKey === 'table') {
                    // Mostra la visualizzazione tabellare
                    this.getView().byId('tableReportVendite').setVisible(true);
                    // Nascondi la visualizzazione del grafico
                    this.getView().byId('chartReportVendite').setVisible(false);
                    this.getView().byId('flexBoxChart').setVisible(false);

                } else if (sKey === 'chart') {
                    // Nascondi la visualizzazione tabellare
                    this.getView().byId('tableReportVendite').setVisible(false);
                    // Mostra la visualizzazione del grafico
                    this.getView().byId('chartReportVendite').setVisible(true);
                    this.getView().byId('flexBoxChart').setVisible(true);

                }
            },




        });
    }




)