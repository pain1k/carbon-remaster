import $ from 'jquery'
import select2 from "select2";
$(document).ready(function(){
    $('.select2').select2({
        minimumResultsForSearch: Infinity,
        placeholder: {
            id: '-1', // the value of the option
            text: 'Выберите тип системы'
        },
        dropdownPosition:'below'
    });

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

    $('.feedback__btn').click(function(e){
        e.preventDefault();
        $('#upload').trigger('click');
    })

    let rangeInput = $('.range')
    rangeInput.closest('.range__wrapper').find('.js-value').eq(0).text(`${rangeInput.val()}%`)

    rangeInput.on('input',function(){
        let val = $(this).val();
        let label = $(this).closest('.range__wrapper').find('.js-value').eq(0)
        label.text(`${val}%`)
    })
})