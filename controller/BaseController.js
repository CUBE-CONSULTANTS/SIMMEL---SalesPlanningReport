sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/core/UIComponent"
    ],
    function (Controller, UIComponent) {
        "use strict";

        return Controller.extend("salesplanningreport.controller.BaseController", {
            /**
             * Convenience method for accessing the router in every controller of the application.
             * @public
             * @returns {sap.ui.core.routing.Router} the router for this component
             */


            navToAcquisizioni : function (){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Acquisizioni");
            }
        });
    }
);
