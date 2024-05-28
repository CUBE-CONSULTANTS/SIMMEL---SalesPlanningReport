sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/f/library"
], function (Controller, JSONModel, fioriLibrary) {
    "use strict";

    var LayoutType = fioriLibrary.LayoutType;

    return Controller.extend("salesplanningreport.controller.Acquisizioni", {
        onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
            let oModel = new JSONModel({
                newPlanning:{
                    fullname: "",
                    productName: "",
                    productCategory: "",
                    productPrice: 0,
                    productQuantity: 0
                }
            });
            this.getView().setModel(oModel, "newPlanningModel");
        },
		onListItemPress: function (oEvent) {
			let productPath = oEvent.getSource().getSelectedItem().getBindingContext("ProductModel").getPath()
			let	id = oEvent.getSource().getSelectedItem().getBindingContext("ProductModel").getObject().id

			this.oRouter.navTo("Dettagli", { ID: id });
		},


        onAdd: function() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("salesplanningreport.view.fragments.NuovaAcquisizione", this);
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
        },

        onLoad: function() {
            if (!this._oDialog) {
                this._oDialog = sap.ui.xmlfragment("salesplanningreport.view.fragments.UploadAcquisizione", this);
                this.getView().addDependent(this._oDialog);
            }
            this._oDialog.open();
            
        },

        onSave: function() {
            let oModel = this.getView().getModel("newPlanningModel");
            let oNewPlanning = oModel.getProperty("/newPlanning");

            let oTable = this.byId("table");
            let oTableModel = oTable.getModel("ProductModel");
            let aData = oTableModel.getProperty("/");
            aData.push(oNewPlanning);
            oTableModel.setProperty("/", aData);	
            this._oDialog.close();
            this.onCancel();
        },

        onCancel: function() {
            this._oDialog.close();
        
            let oModel = this.getView().getModel("newPlanningModel");
            oModel.setProperty("/newPlanning", {
                fullname: "",
                productName: "",
                productCategory: "",
                productPrice: 0,
                productQuantity: 0
            });
        },
    });

}
);