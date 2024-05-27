sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) { 
    return Controller.extend("salesplanningreport.controller.Dettagli", { 
        onInit: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("Dettagli").attachPatternMatched(this._onProductMatched, this);
        },
        
        _onProductMatched: async function(oEvent) {
            var productPath = oEvent.getParameter("arguments").ID
            const call= await fetch("../model/data.json")
            const obj= await call.json()
            let data = obj.find((element) => element.id == productPath)
            let oModel = new sap.ui.model.json.JSONModel(data)
            this.getView().setModel(oModel, "ProductModel")
        },


        onEditSave: function() {
            var oButton = this.getView().byId("editSaveButton");
            if (!oButton) {
                console.error('Button with id "editSaveButton" not found');
                return;
            }
            var oForm = this.getView().byId("nuovaAcquisizioneForm");
            if (!oForm) {
                console.error('Form with id "nuovaAcquisizioneForm" not found');
                return;
            }
            var aInputs = oForm.getAggregation("form").getAggregation("formContainers")[0].getAggregation("formElements");
        
            if (oButton.getText() === "Modifica") {
               
                oButton.setText("Salva");
        
                aInputs.forEach(function(oInput) {
                 oInput.getAggregation("fields")[0].setEditable(true);
                });
            } else {
                oButton.setText("Modifica");
        
                aInputs.forEach(function(oInput) {
                    oInput.getAggregation("fields")[0].setEditable(false);
                });
        
                
            }
        },

        handleClose: function() {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("Acquisizioni");
        }
}); 

});