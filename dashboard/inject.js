(function () {
    "use strict";

    /*global Reveal*/

    window.go = function () {
    };

    var _codeDashboard;

    function _showCodeDashboard (usRef) {
        if (!_codeDashboard) {
            _codeDashboard = document.createElement("iframe");
            _codeDashboard.setAttribute("src", "dashboard/dashboard.html");
            document.body.appendChild(_codeDashboard);
        }
        if (_codeDashboard && "showDashboard" !== _codeDashboard.className) {
            _codeDashboard.className = "showDashboard";
            _codeDashboard.contentWindow.usRef = usRef;
        }
    }

    function _hideCodeDashboard () {
        if (_codeDashboard && "hideDashboard" !== _codeDashboard.className) {
            _codeDashboard.className = "hideDashboard";
        }
    }

    function _currentSlideChanged (revealSlide) {
        var usRef = revealSlide.getAttribute("us-ref");
        if (usRef) {
            _showCodeDashboard(usRef);
        } else {
            _hideCodeDashboard();
        }
    }

    window.addEventListener("load", function () {

        Reveal.addEventListener("slidechanged", function (event) {
            _currentSlideChanged(event.currentSlide);
        });
        _currentSlideChanged(Reveal.getCurrentSlide());

    });

}());
