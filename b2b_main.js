function b2bload() {
    var formType = Xrm.Page.ui.getFormType();
    if (formType == 1) {
        ShowHideTab("history", false);
    }
    if (formType == 2) {
        ShowHideTab("history", true);
    }
    else
        ShowHideTab("history", false);
}

function ShowHideTab(tabName, show) {
    if (Xrm.Page.ui.tabs.get(tabName) != null)
        Xrm.Page.ui.tabs.get(tabName).setVisible(show);
}

function EnableDisableValidateButton() {
    //debugger
    var B2BStatus = null;
    var formType = Xrm.Page.ui.getFormType();
    if (formType == 1) {
        return false;
    }
    else if (formType == 2) {
        // check security role 	

        var validUser = false;
        var ConditionString = "name eq 'System Administrator' or name eq 'Corporate Sales Manager (CSM)'";
        validUser = IsValidUser(ConditionString);
        if (validUser) {
            return true;
        }
        else { return false; }
    }
    else
        return false;

}
function ValidateBtnOnClick() {
    //debugger;
    openDialog("Dialog to set b2b status - B2B");
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