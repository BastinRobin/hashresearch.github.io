// JavaScript Document
$( document ).ready(function() {
    "use strict";
$('.owl-carousel').owlCarousel({
    loop:true,
    margin:30,
    nav:false,
    items:3,
    dots:true,
   // navText:[ '<i class="fa fa-long-arrow-left"></i>', '<i class="fa fa-long-arrow-right"></i>'],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
})
});