sap.ui.define([
    "sap/ui/model/Filter", 
    "sap/ui/comp/smartfilterbar/SmartFilterBar", 
    "sap/m/MultiComboBox",
    "sap/m/MessageBox"
], function (Filter, SmartFilterBar, MultiComboBox,MessageBox) {
    "use strict";
    return {
        onAfterRendering(){
            var filter = this.byId("listReportFilter");
            var oFilter = filter.getAllFilterItems()[2].getControl();
            oFilter.setTokens([new sap.m.Token({
                key:"MANAGER",
                text:"MANAGER"
            })]);
        },
        getCustomAppStateDataExtension: function (oCustomData) {
            //the content of the custom field will be stored in the app state, so that it can be restored later, for example after a back navigation.
            //The developer has to ensure that the content of the field is stored in the object that is passed to this method.
            if (oCustomData) {
                var oCustomField1 = this.oView.byId("Status");
                if (oCustomField1) {
                    oCustomData.Status = oCustomField1.getSelectedKeys();
                }
            }
        },
        restoreCustomAppStateDataExtension: function (oCustomData) {
            //in order to restore the content of the custom field in the filter bar, for example after a back navigation,
            //an object with the content is handed over to this method. Now the developer has to ensure that the content of the custom filter is set to the control
            if (oCustomData) {
                if (oCustomData.Status) {
                    var oComboBox = this.oView.byId("Status");
                    oComboBox.setSelectedKeys(
                        oCustomData.Status
                    );
                }
            }
        },
        onBeforeRebindTableExtension: function(oEvent) {
            var oBindingParams = oEvent.getParameter("bindingParams");
            oBindingParams.parameters = oBindingParams.parameters || {};

            var oSmartTable = oEvent.getSource();
            var oSmartFilterBar = this.byId(oSmartTable.getSmartFilterId());
            if (oSmartFilterBar instanceof SmartFilterBar) {
                var oCustomControl = oSmartFilterBar.getControlByKey("Status");

                var oDesig = oSmartFilterBar.getControlByKey("Desig");

                // if(oDesig.getTokens().length === 0){
                //     MessageBox.error("Designation required");
                //     oBindingParams.preventTableBind=true;
                // }
                // else{
                //     if (oCustomControl instanceof MultiComboBox) {
                //         var aStatus = oCustomControl.getSelectedKeys();
                //         var aStatusFilters=[];
    
                //         if(aStatus.length>0){
                //             for(var i=0;i<aStatus.length;i++){
                //                 aStatusFilters.push(new Filter("Status","EQ",aStatus[i]));
                //             }
                //             oBindingParams.filters.push(new Filter(aStatusFilters,false));
                //         }
    
                //         if(oBindingParams.filters.length === 0){
                //             MessageBox.error("Please select atleast one filter and press Go");
                //             oBindingParams.preventTableBind=true;
                //         }
                //     }
                // }
                if (oCustomControl instanceof MultiComboBox) {
                    var aStatus = oCustomControl.getSelectedKeys();
                    var aStatusFilters=[];

                    if(aStatus.length>0){
                        for(var i=0;i<aStatus.length;i++){
                            aStatusFilters.push(new Filter("Status","EQ",aStatus[i]));
                        }
                        oBindingParams.filters.push(new Filter(aStatusFilters,false));
                    }

                    if(oBindingParams.filters.length === 0){
                        MessageBox.error("Please select atleast one filter and press Go");
                        oBindingParams.preventTableBind=true;
                    }
                }
                
            }
        },
        sendNotice: function(oEvent) {
        var extensionAPI = this.extensionAPI;
        var aSelectContexts = extensionAPI.getSelectedContexts();
        var aEmails = [];
        for (var i=0;i<aSelectContexts.length;i++){
            aEmails.push(aSelectContexts[i].getProperty("Email"));
        }
        var toList = aEmails.toString();
        var subject = "Warning notice on performance";
        var body = "Hi, \n We have noticed your perfomance is not upto mark, Please give us the detailed explanation. \n Thanks shivasai";
        sap.m.URLHelper.triggerEmail(toList,subject,body);
        }
    };
});