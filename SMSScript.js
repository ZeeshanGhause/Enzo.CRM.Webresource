function setMobileNumber(executionContext) {

    var formContext = executionContext.getFormContext();
    var formtype = formContext.ui.getFormType();
    var regarding = formContext.getAttribute("regardingobjectid").getValue();
    var mobile = "";
    if (formtype == 1) {
        if (regarding != null && regarding != "") {
            if (regarding[0].entityType == "contact") {
                Xrm.WebApi.retrieveRecord("contact", regarding[0].id, "?$select=telephone1").then(
                    function success(result) {
                        // Get Mobile number
                        if (result.telephone1 != null) {
                            mobile = result.telephone1;
                            Xrm.Page.getAttribute("sl_mobile").setValue(mobile);
                        }
                    },
                    function (error) {
                        // handle error conditions
                        alert("Error while retrieving the Contact Record : " + error.message, null);
                    }
                );
            }
        }

    }
}
