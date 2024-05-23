function highlightRow (row,effect) {
    row.addClass(effect);
    var newPosition = row.offset().top - 100;
    console.log("newPosition",newPosition)
    $('html, body').animate({scrollTop : newPosition}, 1000, function(){
        setTimeout(function(){
            row.removeClass(effect);
        },2000);
    });
}