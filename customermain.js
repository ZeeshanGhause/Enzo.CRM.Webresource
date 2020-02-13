// Prod
function customerLoad() {

    alert("Role: ");
}
function EnableDisableCustomerJourneyButton() {

    var formType = Xrm.Page.ui.getFormType();
    var customerStatus = null;
    var buttonShow = true;
    if (formType == 1) {
        return false;
    }
    else if (formType == 2) {

        if (Xrm.Page.getAttribute("sl_customerstatus") != null)
            customerStatus = Xrm.Page.getAttribute("sl_customerstatus").getValue();
        if (customerStatus == 102690004)
            buttonShow = false;
        var validUser = false;
        var ConditionString = "name eq 'Purchase Manager (PCM)' or name eq 'Contact Centre Agent (CCA) - New'";
        validUser = IsValidUser(ConditionString);
        if (validUser)
            return true;
        else
            return false;
    }
    else
        return false;
}
function CustomerJourneyBtnOnClick() {

    var validUserPCM = false;
    var validUserAgent = false;
    var ConditionStringPCM = "name eq 'Purchase Manager (PCM)'";
    validUserPCM = IsValidUser(ConditionStringPCM);
    if (validUserPCM)
        openDialog("Dialog to set Customer Status");
    else {
        var ConditionStringAgent = "name eq 'Contact Centre Agent (CCA) - New'";
        validUserAgent = IsValidUser(ConditionStringAgent);
        if (validUserAgent)
            openDialog("Dialog to set Customer Status");
        //openDialog("Dialog to set Customer Status - Telemarketing Agent");
    }


}
function openDialog(dialogName) {
    var dialogId = null;
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/workflows?$select=workflowid,category,name,type&$filter=name eq '" + dialogName + "' and  type eq 1 and  category eq 1 and  statecode eq 1", false);
    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");

    req.send();
    if (req.status === 200) {
        var results = JSON.parse(req.response);
        if (results != null && results.value != null && results.value.length > 0) {
            dialogId = results.value[0]["workflowid"];
        }
    } else {
        Xrm.Utility.alertDialog(req.statusText);
    }

    if (dialogId != null) {
        var entityName = Xrm.Page.data.entity.getEntityName();
        var recordId = Xrm.Page.data.entity.getId();
        LaunchModalDialog(dialogId, entityName, recordId);
    }

}

function LaunchModalDialog(dialogID, typeName, objectId) {

    var w = 630;
    var h = 500;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var url = window.location.protocol + "//" + window.location.host;
    if (window.location.href.indexOf(Xrm.Page.context.getOrgUniqueName()) > 0) {
        url = url + "/" + Xrm.Page.context.getOrgUniqueName();
    }
    url = url + '/cs/dialog/rundialog.aspx';
    popup = window.open(url + '?DialogId=' + dialogID + '&EntityName=' + typeName + '&ObjectId=' + objectId, "Dialog", "status=0,toolbar=0,scrollbars=0,height=" + h + ",width=" + w + ",top=" + top + ",left=" + left + ",resizable=1");
    detailsWindowTimer = setInterval("WatchDetailsWindowForClose('" + typeName + "')", 600); //Poll
}

function WatchDetailsWindowForClose(entityName) {
    if (!popup || popup.closed) {
        // Do your stuff here....
        clearInterval(detailsWindowTimer); //stop the timer

        RefreshCall();
    }
}

function RefreshCall() {
    Xrm.Utility.openEntityForm(Xrm.Page.data.entity.getEntityName(), Xrm.Page.data.entity.getId());
}
function IsValidUser(ConditionString) {

    //debugger;
    var req = new XMLHttpRequest();
    req.open("GET", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/roles?$select=name,roleid&$filter=" + ConditionString, false);

    req.setRequestHeader("OData-MaxVersion", "4.0");
    req.setRequestHeader("OData-Version", "4.0");
    req.setRequestHeader("Accept", "application/json");
    req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");

    req.send();
    req.onreadystatechange = null;
    if (req.status === 200) {
        var results = JSON.parse(req.response);
        if (results != null && results.value != null && results.value.length > 0) {
            var currentUserRoles = Xrm.Page.context.getUserRoles();
            for (var i = 0; i < results.value.length; i++) {
                var name = results.value[i]["name"];
                var roleid = results.value[i]["roleid"];

                //Check whether current user roles has the role passed as argument
                for (var j = 0; j < currentUserRoles.length; j++) {
                    var userRole = currentUserRoles[j];
                    if (GuidsAreEqual(userRole, roleid)) {
                        return true;
                    }
                }
            }
        }
    } else {
        Xrm.Utility.alertDialog("Error Occured in IsValidUser: " + req.statusText);
    }

    return false;


}

function GuidsAreEqual(guid1, guid2) {

    var isEqual = false;

    if (guid1 == null || guid2 == null) {
        isEqual = false;
    }
    else {
        isEqual = (guid1.replace(/[{}]/g, "").toLowerCase() == guid2.replace(/[{}]/g, "").toLowerCase());
    }
    return isEqual;
}
function redirectToCustomerType() {
    try {
        var customerType = Xrm.Page.getAttribute("sl_customertype").getValue();
        if (customerType != null && customerType != "") {
            if (customerType == 102690001)//Dealer
            {
                var dealerObj = Xrm.Page.getAttribute("sl_dealer"); //Check for Lookup Object
                if (dealerObj != null) {
                    var dealerObjValue = dealerObj.getValue();//Check for Lookup Value
                    if (dealerObjValue != null) {
                        var dealerId = dealerObjValue[0].id;
                        Xrm.Utility.openEntityForm("sl_dealer", dealerId);
                    }
                }
            }
            if (customerType == 102690002)//B2B
            {
                var b2bObj = Xrm.Page.getAttribute("sl_b2b"); //Check for Lookup Object
                if (b2bObj != null) {
                    var b2bObjValue = b2bObj.getValue();//Check for Lookup Value
                    if (b2bObjValue != null) {
                        var b2bId = b2bObjValue[0].id;
                        Xrm.Utility.openEntityForm("sl_fleetsale", b2bId);
                    }
                }
            }
        }
    } catch (ex) {

    }
}
