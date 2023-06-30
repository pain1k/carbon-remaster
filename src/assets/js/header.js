import $ from "jquery";

$(function(){
    $('.burger').on('click',function (){
        $(this).toggleClass('burger_opened');
        $('.header__center').toggleClass('header__center_opened');
        $('.overlay').removeClass('overlay_opened');
        $('.overlay__submenu').removeClass('overlay__submenu_visible');
        $('.overlay__item-icon').removeClass('overlay__item-icon_visible overlay__item-icon_opened');
    })

    function close(){
        $('.burger').removeClass('burger_opened');
        $('.header__center').removeClass('header__center_opened');
        $('.overlay').removeClass('overlay_opened');
        $('.overlay__submenu').removeClass('overlay__submenu_visible');
        $('.overlay__item-icon').removeClass('overlay__item-icon_visible overlay__item-icon_opened');
    }

    function closeMobileHeader(val){
        if (val > 1100){
            close();
        }
    }

    $( window ).resize(function() {
        closeMobileHeader($(window).width())
    });

    $('.overlay__back').on('click',function(){
        $('.overlay').removeClass('overlay_opened');
        $('.overlay__item-icon').removeClass('overlay__item-icon_visible')
    })

    $('.header__more').on('click',function (e){
        e.preventDefault();
        $('.overlay').toggleClass('overlay_opened');

        $('.overlay__item-icon').each(function(){
            if($(this).closest('.overlay__item').next().hasClass('overlay__submenu')) {
                $(this).addClass('overlay__item-icon_visible')
            }
        })
    })
    $('.overlay__item-icon').on('click',function(){
        if($(this).closest('.overlay__item').next().hasClass('overlay__submenu')) {
            $(this).closest('.overlay__item').next().toggleClass('overlay__submenu_visible')
            $(this).toggleClass('overlay__item-icon_opened')
        }
    })

    $("a[href='#form']").click(function(e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $("#form").offset().top
        }, 1300);
    });

    $("a[href='#']").click(function(e) {
        e.preventDefault();
        $(location).attr('href','services-detail.html')
    });
})