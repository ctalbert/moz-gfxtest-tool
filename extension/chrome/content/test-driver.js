var gfxTestDriver = {
  runReftest: function gtd_reftst(manifest) {
    // Most of this code is copied from the command line handler code.

    var args = Components.classes["@mozilla.org/supports-string;1"]
                         .createInstance(Components.interfaces.nsISupportsString);

    // Create a URI from the manifest file
    var iosvc = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
    var cmdline = Components.classes["@mozilla.org/toolkit/command-line;1"]
                  .createInstance(Components.interfaces.nsICommandLine);
    
    args.data = cmdline.resolveURI(manifest).spec;

    /* Ignore the platform's online/offline status while running reftests. */
    var ios2 = Components.classes["@mozilla.org/network/io-service;1"]
              .getService(Components.interfaces.nsIIOService2);
    ios2.manageOfflineStatus = false;
    ios2.offline = false;
    
    /* Force sRGB as an output profile for color management before we load a
       window. */
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch2);
    prefs.setBoolPref("gfx.color_management.force_srgb", true);

    var wwatch = Components.classes["@mozilla.org/embedcomp/window-watcher;1"]
                 .getService(Components.interfaces.nsIWindowWatcher);
    wwatch.openWindow(null, "chrome://reftest/content/reftest.xul", "_blank",
                      "chrome,dialog=no,all", args);
  },
  submitForm: function gtd_submit() {
    // If the warning is displayed, hide it.
    var shownwarning = document.getElementById("show");
    if (shownwarning) {
      shownwarning.setAttribute("id", "dontshow");
    }

    var inputctrl = document.getElementById("file-input");
    
    if (inputctrl.value.indexOf('reftest.list') ||
        inputctrl.value.indexOf('reftests.list') ||
        inputctrl.value.indexOf('crashtest.list') ||
        inputctrl.value.indexOf('crashtests.list') ) {
      this.runReftest(inputctrl.value);
    } else {
      var warning = document.getElementById("dontshow");
      warning.setAttribute("id", "show");
    }
  }
}