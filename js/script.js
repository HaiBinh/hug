var EPPZScrollTo =
{
    /**
     * Helpers.
     */
    documentVerticalScrollPosition: function()
    {
        if (self.pageYOffset) return self.pageYOffset; // Firefox, Chrome, Opera, Safari.
        if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop; // Internet Explorer 6 (standards mode).
        if (document.body.scrollTop) return document.body.scrollTop; // Internet Explorer 6, 7 and 8.
        return 0; // None of the above.
    },

    viewportHeight: function()
    { return (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight; },

    documentHeight: function()
    { return (document.height !== undefined) ? document.height : document.body.offsetHeight; },

    documentMaximumScrollPosition: function()
    { return this.documentHeight() - this.viewportHeight(); },

    elementVerticalClientPositionById: function(id)
    {
        var element = document.getElementById(id);
        var rectangle = element.getBoundingClientRect();
        return rectangle.top;
    },

    /**
     * Animation tick.
     */
    scrollVerticalTickToPosition: function(currentPosition, targetPosition)
    {
        var filter = 0.1;
        var fps = 60;
        var difference = parseFloat(targetPosition) - parseFloat(currentPosition);

        // Snap, then stop if arrived.
        var arrived = (Math.abs(difference) <= 0.5);
        if (arrived)
        {
            // Apply target.
            scrollTo(0.0, targetPosition);
            return;
        }

        // Filtered position.
        currentPosition = (parseFloat(currentPosition) * (1.0 - filter)) + (parseFloat(targetPosition) * filter);

        // Apply target.
        scrollTo(0.0, Math.round(currentPosition));

        // Schedule next tick.
        setTimeout("EPPZScrollTo.scrollVerticalTickToPosition("+currentPosition+", "+targetPosition+")", (1000 / fps));
    },

    /**
     * For public use.
     *
     * @param id The id of the element to scroll to.
     * @param padding Top padding to apply above element.
     */
    scrollVerticalToElementById: function(id, padding)
    {
        var element = document.getElementById(id);
        if (element == null)
        {
            console.warn('Cannot find element with id \''+id+'\'.');
            return;
        }

        var targetPosition = this.documentVerticalScrollPosition() + this.elementVerticalClientPositionById(id) - padding;
        var currentPosition = this.documentVerticalScrollPosition();

        // Clamp.
        var maximumScrollPosition = this.documentMaximumScrollPosition();
        if (targetPosition > maximumScrollPosition) targetPosition = maximumScrollPosition;

        // Start animation.
        this.scrollVerticalTickToPosition(currentPosition, targetPosition);
    }
};

window.onload = function () {
    var topnav = document.getElementById("topnav-mobile");
    // var topnav = $("#topnav-mobile");
    var topnav_menuitems = $(".topnav-mobile-menuitems");
    window.openMobileNav = function(e) {
        if (topnav.style.display === "block" || (e !== undefined && !e.hasAttribute("mobile"))) {


            topnav_menuitems.removeClass('display').addClass('hide');

            // topnav_menuitems.addClass('hide');
            setTimeout(function () {
                topnav.style.display = "none";
                topnav_menuitems.css('right', '-100%');
            }, 250);

        } else {
            topnav.style.display = "block";
            // topnav_menuitems;
            topnav_menuitems.removeClass('hide').addClass('display');
            topnav_menuitems.css('right', '0px');

        }
    };

    topnav.onclick = openMobileNav;

    var menu_item = document.getElementsByClassName("topnav-item");
    for (var i = 0; i < menu_item.length; i++) {
        var menu = menu_item[i];
        menu.onclick = function (event) {
            var e = event.currentTarget;
            openMobileNav(e);
            EPPZScrollTo.scrollVerticalToElementById(e.name, 0);
        };
    }

    // var sticky_header = document.getElementsByClassName("sticky-header")[0];
    var sticky_header = $('.sticky-header');
    var currentY = 0;
    var started = false;
    document.onscroll = function (event) {
        var up = false;
        if (started) {
            up = window.pageYOffset - currentY < 0;
        }
        else {
            started = true;
        }
        if (up && window.pageYOffset !== 0) {
            sticky_header.addClass('sticky-header-display');
        }
        else {
            sticky_header.removeClass('sticky-header-display');
        }
        currentY = window.pageYOffset;
    }
};
