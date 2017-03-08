// JavaScript Document

//dropdown menu
(function($){
	$(document).ready(function(){
    "use strict"
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault(); 
			event.stopPropagation(); 
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
	});
 
})(jQuery);

 

 

jQuery(function($) {
    "use strict"
    if($(window).width()>769){
        $('.navbar .dropdown').hover(function() {
            $(this).find('.dropdown-menu').first().stop(true, true).delay(80).slideDown();

        }, function() {
            $(this).find('.dropdown-menu').first().stop(true, true).delay(100).slideUp();

        });

        $('.navbar .dropdown > a').click(function(){
            location.href = this.href;
        });

    }
});