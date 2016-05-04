(function () {
    "use strict";

    document.addEventListener("keypress", function (event) {
        if (event.keyCode) {
            var dashboard = window.dashboard;
            if (!dashboard) {
                // Try using window opener
                dashboard = window.opener.dashboard;
            }
            if (dashboard) {
                dashboard.shortcut(String.fromCharCode(event.keyCode));
            }
        }
    });

}());
