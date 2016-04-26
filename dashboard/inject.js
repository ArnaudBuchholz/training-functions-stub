(function () {
    "use strict";

    /*global Reveal*/

    var _codeDashboard,
        _codeDashboardReady = false,
        _usRef;

    function _updateDashboard () {
        if (_codeDashboard && "showDashboard" !== _codeDashboard.className) {
            _codeDashboard.className = "showDashboard";
        }
        _codeDashboard.contentWindow.setUsRef(_usRef);
    }

    function _showCodeDashboard (usRef) {
        _usRef = usRef; // Last one wins
        if (!_codeDashboard) {
            _codeDashboard = document.createElement("iframe");
            _codeDashboard.setAttribute("src", "dashboard/dashboard.html");
            _codeDashboard = document.body.appendChild(_codeDashboard);
            _codeDashboard.addEventListener("load", function () {
                _codeDashboardReady = true;
                _updateDashboard();
            });

        } else if (_codeDashboardReady) {
            _updateDashboard();
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
