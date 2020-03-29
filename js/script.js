
window.onload = function () {
    window.openMobileNav = function() {
        var x = document.getElementById("topnav");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    };

    var menu_item = document.getElementsByClassName("topnav-item");
    for (var i = 0; i < menu_item.length; i++) {
        menu_item[i].onclick = function () {
            openMobileNav()
        };
    }
};

