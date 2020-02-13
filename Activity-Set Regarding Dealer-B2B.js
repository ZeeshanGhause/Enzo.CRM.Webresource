var FORM_TYPE_CREATE = 1;
var FORM_TYPE_UPDATE = 2;
var FORM_TYPE_READ_ONLY = 3;
var FORM_TYPE_DISABLED = 4;
var FORM_TYPE_QUICK_CREATE = 5;
var FORM_TYPE_BULK_EDIT = 6;

function SetRegardingWhenParentWindowIsDealerB2B(exeContext) {
    try {
        var formContext = exeContext.getFormContext();
        if (formContext.ui.getFormType() == FORM_TYPE_CREATE) {
            var parentRef = new Array();
            if (window.top.opener) {
                if (window.top.opener.Xrm.Page.ui.formSelector.getCurrentItem()) {
                    //oppFormLabel = window.top.opener.formContext.ui.formSelector.getCurrentItem().getLabel();
                    parentRef = window.top.opener.Xrm.Page.data.entity.getEntityReference();

                    if (parentRef.entityType == "sl_dealer" || parentRef.entityType == "sl_fleetsale") {
                        var customerlookup = window.top.opener.Xrm.Page.getAttribute("sl_customer").getValue();
                        if (customerlookup)
                            formContext.getAttribute("regardingobjectid").setValue(customerlookup);
                    }
                }
            }
        }
    } catch (ex) {
        console.log(ex);
    }
}