// Set from field to Infopakistan or InfoTukrey on base of loged in user
function isFormClassicOrUCI() {
    var classicOrUCI = Xrm.Internal.isUci();
    return classicOrUCI;
}

function onLoadEmail(primaryControl) {

    var formContext;
    if (isFormClassicOrUCI() == false) {
        formContext = primaryControl.getFormContext();
    }
    if (isFormClassicOrUCI() == true) {
        formContext = primaryControl;
    }

    var logedUserId = formContext.context.getUserId().replace("{", "").replace("}", "");
    console.log("Current Loged in User = " + logedUserId);

    if ((getCRMFormType(formContext) == 1) || (getCRMFormType(formContext) == 2 && getSubject(formContext) != false && getDirection(formContext) == 1 && getStatusReason(formContext) == 1)) {
        getBU(logedUserId, formContext);
    }
}

function getBU(id, formContext) {

    var businessUnit, id, name; //Variable to hold business unit object

    if (id != null) {

        var req = new XMLHttpRequest();
        req.open("GET", formContext.context.getClientUrl() + "/XRMServices/2011/OrganizationData.svc/SystemUserSet?$select=BusinessUnitId&$filter=SystemUserId eq guid'" + id + "'", true);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                this.onreadystatechange = null;

                if (this.status === 200) {
                    var returned = JSON.parse(this.responseText).d;
                    var results = returned.results;

                    for (var i = 0; i < results.length; i++) {
                        businessUnit = results[i].BusinessUnitId;
                        id = businessUnit.Id; //Set BU id in id
                        name = businessUnit.Name; //Set BU name in name
                        console.log("The business unit name:  " + name + "\nThe business unit ID:  " + id);
                    }

                    var enviroment = formContext.context.getClientUrl();
                    var sandbox = "https://vavacarssb.crm4.dynamics.com";
                    var production = "https://vavacarslive.crm4.dynamics.com";
                    if (enviroment == sandbox) {
                        console.log("inside sandbox");
                        if (name == "Pakistan") {
                            setLookupValue(formContext, "from", "systemuser", "5BCB4AF3-7A1D-EA11-A811-000D3AB5D04F", "# VavaCars Pakistan");
                        }
                        else if (name == "Turkey") {
                            setLookupValue(formContext, "from", "systemuser", "40B1136E-A7AC-E911-A83F-000D3AB18B89", "VavaCars #");
                        }
                        else if (name == "vavacarssb") {
                            setLookupValue(formContext, "from", "systemuser", "40B1136E-A7AC-E911-A83F-000D3AB18B89", "VavaCars #");
                        }

                        if (getCRMFormType(formContext) != 1) {
                            setToAsRegarding(formContext);
                        }

                    }
                    else if (enviroment == production) {
                        console.log("inside production");
                        if (name == "Pakistan") {
                            setLookupValue(formContext, "from", "systemuser", "FC49B608-7B1D-EA11-A813-000D3A490C65", "# VavaCars Pakistan");
                        }
                        else if (name == "Turkey") {
                            setLookupValue(formContext, "from", "systemuser", "553FEC69-A7AC-E911-A824-000D3A289FCD", "VavaCars #");
                        }
                        else if (name == "vavacarslive") {
                            setLookupValue(formContext, "from", "systemuser", "553FEC69-A7AC-E911-A824-000D3A289FCD", "VavaCars #");
                        }

                        if (getCRMFormType(formContext) != 1) {
                            setToAsRegarding(formContext);
                        }

                    }

                }
                else {
                    Xrm.Utility.alertDialog(this.statusText);
                }

            }

        };
        req.send();
    }
}

function setLookupValue(formContext, lookUpSchemaName, entitySchemaName, recordId, recordName) {
    var lookUpObj = [];
    lookUpObj[0] = {};
    lookUpObj[0].id = recordId;
    lookUpObj[0].entityType = entitySchemaName;
    lookUpObj[0].name = recordName;
    if (formContext.getAttribute(lookUpSchemaName) != null)
        formContext.getAttribute(lookUpSchemaName).setValue(lookUpObj);
}

function getCRMFormType(formContext) {
    return formContext.ui.getFormType();
}

function getSubmittedBy(formContext) {
    var submitedBy = getFieldValue(formContext, "submittedby");
    return submitedBy;
}

function getSubject(formContext) {

    var subject = getFieldValue(formContext, "subject");
    var replyMode = subject.substr(0, 3);
    if (replyMode == "Re:" || replyMode == "RE:") {
        return true
    }
    return false;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function getDirection(formContext) {
    var direction = getFieldValue(formContext, "directioncode");
    console.log("direction = " + direction);
    return direction;
}

function getStatusReason(formContext) {
    var status = getFieldValue(formContext, "statuscode");
    console.log("status = " + status);
    return status;

}

function getFieldValue(formContext, attributeName) {
    try {

        console.log('getFieldValue');
        var returnValue = null;
        var attrb = formContext.getAttribute(attributeName);
        if (attrb != null) {
            var attrbValue = attrb.getValue();
            if (attrbValue != null) {
                returnValue = attrbValue;
            }
        }
        return returnValue;
    }
    catch (ex) {
        console.log(ex.message + ' ' + ex.name);
    }
}

function getToField(formContext, attributeName) {

    try {
        console.log('get To FieldValue');
        var partlistData = new Array();
        var attrb = formContext.getAttribute(attributeName);
        if (attrb != null) {
            var emails = attrb.getValue() || [];
            if (emails != null) {
                if (emails.length > 0) {
                    for (var index = 0; index < emails.length; index++) {
                        if ((emails[index].name != "# VavaCars Pakistan" && emails[index].name != "infopakistan@vava.cars") && (emails[index].name != "VavaCars #" && emails[index].name != "infoturkey@vava.cars")) {
                            console.log("Racipient contain Pakistan");
                            partlistData[index] = new Object();
                            partlistData[index].id = emails[index].id.replace("{", "").replace("}", "");
                            partlistData[index].name = emails[index].name;
                            if (emails[index].type == 1) {
                                partlistData[index].entityType = "account";
                            }
                            else if (emails[index].type == 2) {
                                partlistData[index].entityType = "contact";
                            }
                            else if (emails[index].type == 3) {
                                partlistData[index].entityType = "opportunity";
                            }
                            else if (emails[index].type == 4) {
                                partlistData[index].entityType = "lead";
                            }
                            else if (emails[index].type == 8) {
                                partlistData[index].entityType = "systemUser";
                            }
                            else if (emails[index].type == 9) {
                                partlistData[index].entityType = "team";
                            }

                        }

                    }
                    formContext.getAttribute(attributeName).setValue(null);
                    saveRecipient(formContext, partlistData);

                }
            }
        }
    }
    catch (ex) {
        console.log(ex.message + ' ' + ex.name);
    }
}

function saveRecipient(formContext, partlistData) {
    formContext.getAttribute("to").setValue(partlistData);
}

function setToAsRegarding(formContext) {

    var regarding = getFieldValue(formContext, "regardingobjectid")
    var partlistData = new Array();


    if ((regarding != null)) {


        partlistData[0] = new Object();
        partlistData[0].id = regarding[0].id.replace("{", "").replace("}", "");
        partlistData[0].name = regarding[0].name;

        console.log("Comapign code =" + regarding[0].type);

        if (regarding[0].type == 1) {
            partlistData[0].entityType = "account";
        }
        else if (regarding[0].type == 2) {
            partlistData[0].entityType = "contact";
        }
        else if (regarding[0].type == 3) {
            partlistData[0].entityType = "opportunity";
        }
        else if (regarding[0].type == 4) {
            partlistData[0].entityType = "lead";
        }
        else if (regarding[0].type == 8) {
            partlistData[0].entityType = "systemUser";
        }
        else if (regarding[0].type == 9) {
            partlistData[0].entityType = "team";
        }
        else if (regarding[0].type == 112) {
            partlistData = getRelatedCustomer(partlistData, formContext);
            return;
        }
        else if (regarding[0].type == 4402 || regarding[0].type == 4406) {
            return;
        }

        formContext.getAttribute("to").setValue(null);
        formContext.getAttribute("to").setValue(partlistData);

    }
}

function getRelatedCustomer(partlistData, formContext) {

    var contactRelatedCase = null;
    var contactFetchXML = "<fetch distinct='true' mapping='logical' output-format='xml-platform' version='1.0'>" +
        "<entity name='contact' >" +
        "<attribute name='fullname' />" +
        "<attribute name='telephone1' />" +
        "<attribute name='contactid' />" +
        "<order descending='false' attribute='fullname' />" +
        "<link-entity name='incident' alias='aa' link-type='inner' to='contactid' from='customerid'>" +
        "<filter type='and'> " +
        "<condition attribute='incidentid' value='{" + partlistData[0].id + "}' operator='eq' />" +
        "</filter>" +
        "</link-entity>" +
        "</entity>" +
        "</fetch>";

    contactFetchXML = "?fetchXml=" + encodeURIComponent(contactFetchXML);

    var outputText = "Contact Name\t\t\tId\n---------------------------------------------------\n";
    Xrm.WebApi.retrieveMultipleRecords("contact", contactFetchXML).then(
        function success(result) {
            for (var contactRecordsCount = 0; contactRecordsCount < result.entities.length; contactRecordsCount++) {
                contactRelatedCase = result.entities[0];

                outputText += result.entities[contactRecordsCount].fullname + "\t\t" + result.entities[contactRecordsCount].contactid + "\n";
            }

            partlistData[0].id = contactRelatedCase.contactid;
            partlistData[0].name = contactRelatedCase.fullname;
            partlistData[0].entityType = "contact";
            formContext.getAttribute("to").setValue(null);
            formContext.getAttribute("to").setValue(partlistData);
            //Xrm.Utility.alertDialog(outputText, null);
        },
        function (error) {
            // Handle error conditions
            Xrm.Utility.alertDialog(error.message, null);
        });

}
