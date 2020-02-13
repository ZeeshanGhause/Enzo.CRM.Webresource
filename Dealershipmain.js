function redirectToDealerType() {
    try {
        var customerType = Xrm.Page.getAttribute("sl_dealershiptype").getValue();
        if (customerType != null && customerType != "") {
            if (customerType == 102690001)//B2B
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