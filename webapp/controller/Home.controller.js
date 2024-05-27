sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController) {
        "use strict";

        return BaseController.extend("salesplanningreport.controller.Home", {
            onInit: function () {

            },
            
            navToAcquisizioni : function (){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Acquisizioni");
            }
        });
    });
