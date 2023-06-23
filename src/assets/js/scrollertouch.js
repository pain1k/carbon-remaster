import $ from "jquery";

const $touchScroller = $('.js-touchable');

if ($touchScroller.length) {

    $touchScroller.on('mousedown', function (e) {
        const $t = $(this);
        const startX = $t.scrollLeft() + e.pageX;

        $touchScroller.on('mousemove', function (e) {


            $t.scrollLeft(startX - e.pageX)
        });
    });

    $touchScroller.on('mouseup', function (e) {
        const $t = $(this);

        $touchScroller.off("mousemove");

    });

    $touchScroller.on('mouseleave', function () {
        $touchScroller.mouseup();
    })
}