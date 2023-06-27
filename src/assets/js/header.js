import $ from "jquery";

$(function(){
    $('.burger').on('click',function (){
        $(this).toggleClass('burger_opened');
        $('.header__center').toggleClass('header__center_opened');
    })

    function close(){
        $('.burger').removeClass('burger_opened');
        $('.header__center').removeClass('header__center_opened');
    }

    function closeMobileHeader(val){
        if (val > 1100){
            close();
        }
    }

    $( window ).resize(function() {
        closeMobileHeader($(window).width())
    });
})
