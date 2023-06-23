import 'slick-carousel';
import $ from "jquery";

$(function() {
    let next = '<button type="button" class="slick-next"></button>'
    let prev = '<button type="button" class="slick-prev"></button>';

    $('.slider').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        variableWidth: true,
        centerMode:true,
        centerPadding: '0',
        arrows: true,
        infinite: true,
        nextArrow: next,
        prevArrow: prev,
        dots:false
    })

})

