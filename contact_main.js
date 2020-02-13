// JavaScript source code
// JavaScript source code
/**
 * Author: Haider Rasool
 */
var sl = sl || {};    //sl
/**************************************************
	Entity Meta data - <Fields, Enums>
***************************************************/
sl.entityname_meta = function () {
    return {
        //form logical-names for fields, tabs and grids etc go here.
        fieldexample: "sl_fieldexample",
        grid_gridexample: "examplegridname"
    };
}();
/**************************************************
	OnSave Methods - <entity-name>_<event>
***************************************************/
sl.entityname_OnSave = function (exeContext) {
    var formContext = exeContext.getFormContext();
    if (formContext) {
        try {
            //Functions Go here
        } catch (ex) { console.log("Error: " + ex.message); }
    }
}
/**************************************************
	OnLoad Methods - <entity-name>_<event>
***************************************************/
sl.contact_OnLoad = function (exeContext) {
    var formContext = exeContext.getFormContext();
    if (formContext) {
        try {
            //Functions Go here
            sl.changeFormType(formContext);
            sl.lockunlockcallmade(formContext);
        } catch (ex) { console.log("Error: " + ex.message); }
    }
}


sl.changeFormType = function (formContext) {

    var formLabel = formContext.ui.formSelector.getCurrentItem().getLabel();
    var custType = Xrm.Page.getAttribute("sl_customertype").getValue();
    var custTypeLabel = Xrm.Page.getAttribute("sl_customertype").getText();
    if (formLabel != null && custType != null) {
        if (custTypeLabel == "Customer" && formLabel != "Contact") {
            changeForm(formContext, "Contact");
            return;
        }
        if (custTypeLabel == "Dealer" && formLabel != "Linked Contact") {
            changeForm(formContext, "Linked Contact");
            return;
        }
        if (custTypeLabel == "B2B" && formLabel != "Linked Contact") {
            changeForm(formContext, "Linked Contact");
            return;
        }
        if (custTypeLabel == "Unknown" && formLabel != "Contact") {
            changeForm(formContext, "Contact");
            return;
        }
    }
};

sl.lockunlockcallmade = function (formContext) {
    debugger;
    var appdate = formContext.getAttribute("sl_appointmentdate").getValue();
    if (appdate == null) {
        formContext.getControl("sl_callmadeplus_1hour").setDisabled(true);
        formContext.getControl("sl_callmademinus_1day").setDisabled(true);
        formContext.getControl("sl_callmade_0day").setDisabled(true);
        formContext.getControl("sl_callmadeplus_1day").setDisabled(true);
        formContext.getControl("sl_callmadeplus_10days").setDisabled(true);
    } else {
        appdate = new Date(appdate.setHours(0));
        appdate = new Date(appdate.setMinutes(0));
        appdate = new Date(appdate.setSeconds(0));
        var _appdate = new Date(appdate);
        var currdate = new Date();
        currdate = new Date(currdate.setHours(0));
        currdate = new Date(currdate.setMinutes(0));
        currdate = new Date(currdate.setSeconds(0));
        var minusoneday = new Date(appdate.setDate((appdate).getDate() - 1));
        appdate = new Date(_appdate);
        var plusoneday = new Date(appdate.setDate((appdate).getDate() + 1));
        appdate = new Date(_appdate);
        var plustenday = new Date(appdate.setDate((appdate).getDate() + 10));

        formContext.getControl("sl_callmadeplus_1hour").setDisabled(false);
        if (currdate >= minusoneday) {
            formContext.getControl("sl_callmademinus_1day").setDisabled(false);
        }
        else {
            formContext.getControl("sl_callmademinus_1day").setDisabled(true);
        }
        if (currdate >= _appdate) {
            formContext.getControl("sl_callmade_0day").setDisabled(false);
        }
        else {
            formContext.getControl("sl_callmade_0day").setDisabled(true);
        }
        if (currdate >= plusoneday) {
            formContext.getControl("sl_callmadeplus_1day").setDisabled(false);
        }
        else {
            formContext.getControl("sl_callmadeplus_1day").setDisabled(true);
        }
        if (currdate >= plustenday) {
            formContext.getControl("sl_callmadeplus_10days").setDisabled(false);
        }
        else {
            formContext.getControl("sl_callmadeplus_10days").setDisabled(true);
        }
    }
};

function changeForm(formContext, formName) {
    var currentForm = formContext.ui.formSelector.getCurrentItem();
    var availableForms = formContext.ui.formSelector.items.get();
    if (currentForm.getLabel().toLowerCase() != formName.toLowerCase()) {
        for (var i in availableForms) {
            var form = availableForms[i];
            if (form.getLabel().toLowerCase() == formName.toLowerCase()) {
                form.navigate();
                return true;
            }
        }
    }
}
/**************************************************
	OnChange Methods - <entity-name>_<fieldname>_<event>
***************************************************/
sl.contact_appointmentdate_OnChange = function (exeContext) {
    var formContext = exeContext.getFormContext();
    if (formContext) {
        try {
            //Functions go here
            sl.lockunlockcallmade(formContext);
        } catch (ex) { console.log("Error: " + ex.message); }
    }
};
/**************************************************
	Re-useable Methods - <intent> (Pascal-case)
***************************************************/
/* {Brief Detail of what the Function does} E.g. This Method Calculates and sets age field */
sl.intent = function (formContext) {
    try {
        //Task goes here
    } catch (ex) { console.log("Error: " + ex.message); }
}
/**************************************************
	Ribbon Scripts - <entity-name>_<buttonname>_<event>
***************************************************/
sl.entityname_buttonname_OnClick = function (primaryControl) {
    var formContext = primaryControl;
    if (formContext) {
        try {
            //Functions go here
        } catch (ex) { console.log("Error: " + ex.message); }
    }
};


sl.setProspectTypeValue = function (formContext) {
    var prospectval = formContext.getAttribute("sl_calculateprospect").getValue();
    if (prospectval != null) {
        if (prospectval > 5) {
            formContext.getAttribute("sl_prospecttype").setValue(1); // Warm Prospect
        }
        else if (prospectval <= 5) {
            formContext.getAttribute("sl_prospecttype").setValue(2); // Hot Prospect
        }
    }
};