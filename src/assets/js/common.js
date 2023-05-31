import $ from 'jquery'
$(document).ready(function(){

    $('.js-type-phone').on('input', function(e){
        let $target = $(e.target),
        regexp = /[^+()\-0-9 ]+/g;
        $target.val($target.val().replace (regexp,''))
    })

    $('.header__btn').click(function(){
        $(this).children().toggleClass('hidden');
        $('.nav').toggleClass('opened');
    });

    function close(){
        $('.nav').removeClass('opened');
        $('.header__btn-close').addClass('hidden');
        $('.header__btn-open').removeClass('hidden');
    }
    
    function closeMobileHeader(val){
        (val > 767) ? close() : '';
    }

    $( window ).resize(function() {
        closeMobileHeader($(window).width());
    });

    $('.service-item__button').on('click',function(){
        let $t = $(this);

        $t.toggleClass('service-item__button_active');
        $t.closest('.service-item__top').next('.service-item__bottom').toggle(300);
    })

    $('.review-item__more').on('click',function(){
        let $t = $(this);

        $t.closest('.review-item__info').find('.review-item__block').toggle(300);
    })
})