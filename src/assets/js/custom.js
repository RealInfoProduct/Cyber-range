function slidebar(){
	$('#sidebar').toggleClass('active');
	$(".ng-sidebar__content").toggleClass('p-active');
}
function alertfun(){
	window.setTimeout(function() {
		$(".alert").fadeTo(500, 0).slideUp(500, function(){
			$(this).remove(); 
		});
	}, 1000);
}

function activesidebar(){
   $(document).ready(function(){
	var url = window.location.pathname;
	$("nav  li a").removeClass("active");
	$("nav  li a").closest('ul').removeClass('show');

	$("nav  li a").each(function () {
		if ($(this).attr("id") == url) {
			$(this).addClass("active");
			$(this).closest('ul').addClass('show');
		}
	});
   });        
}

/* Exercise Console */
function openNav() {
	document.getElementById("mySidepanel").style.width = "250px";
}
function closeNav() {
	document.getElementById("mySidepanel").style.width = "0";
}

function sidepanel() {
	
	$(document).ready(function(){ 
		/* Drop Down */
		var dropdown = document.getElementsByClassName("dropdown-btn");
		var i;
		// $(".dropdown-container").hide(); 
		for (i = 0; i < dropdown.length; i++) {
			
			dropdown[i].addEventListener("click", function(event) {
			

			this.classList.toggle("active");
			
			var dropdownContent = this.nextElementSibling;
			if (dropdownContent.style.display === "block" ) {

					dropdownContent.style.display = "none";
			} else {

				dropdownContent.style.display = "block";

			}


			
			},false);
		}
	
	});
}

function scrollpop(){
	$(document).ready(function(){
			$(".messageThread").each(function(){
			$(this).animate({ scrollTop: $(this)[0].scrollHeight}, 100);
		})	
	});
}
function sidepanel_zoomimg() {

	$(document).ready(function(){ 	

		$('.zoom-display img').addClass('img-fluid zoomD');
		
		var zoomImg = function () {
			// (A) CREATE EVIL IMAGE CLONE
			var clone = this.cloneNode();
			clone.classList.remove("zoomD");
		  
			// (B) PUT EVIL CLONE INTO LIGHTBOX
			var lb = document.getElementById("lb-img");
			lb.innerHTML = "";
			lb.appendChild(clone);
		  
			// (C) SHOW LIGHTBOX
			lb = document.getElementById("lb-back");
			lb.classList.add("show");
		  };
		  
			// (D) ATTACH ON CLICK EVENTS TO ALL .ZOOMD IMAGES
			var images = document.getElementsByClassName("zoomD");
			if (images.length>0) {
			  for (var img of images) {
				img.addEventListener("click", zoomImg);
			  }
			}
		  
			// (E) CLICK EVENT TO HIDE THE LIGHTBOX
			document.getElementById("lb-back").addEventListener("click", function(){
			  this.classList.remove("show");
			})  
		//   });

	});
}

/* Hide Show */
function hideshow() {
	$(document).ready(function()
	{		
		if(window.matchMedia("(max-width: 767px)").matches){
			// Front End
			$(".fc_chatdiv").hide();
			$(".fc_chat_box_div").hide();


			$(document).on('click', ".fc-chat-drpd", function(){			
				$(".fc_chat_box_div").hide();
			});
			
			$(".closeb").click(function(){
				$(".fc_chat_box_div").hide();
			});
			
		} 
		else
		{
			
			// End Front
			$(".fc_chatdiv").hide();
			$(".fc_chat_box_div").hide();
			
			$(document).on('click', ".fc-chat-drpd", function(){			
				$(".fc_chat_box_div").hide();
			});
			
			$(document).on('click', ".fc_chatdiv a", function()
            {

				$(".fc_chat_box_div").show();
				
			});
			$(".closeb").click(function(){
				$(".fc_chat_box_div").hide();
			});
			// End Front

			// Admin
			
					
			// End Admin
		}
		$(".admin_chat_box").hide();
			$(document).on('click', ".admin_chatdiv a", function()
            {
				$(".admmin_c").parent().find('.admin_chat_box').addClass("acp");
				$(".admin_chat_box").show();
				
			});
	
		$(".closeb").click(function(){
			$(".admin_chat_box").hide();				
			$(".admmin_c").parent().find('.admin_chat_box').removeClass("acp");
		});

		$(function () {

            var chatdrpdf = $(".chat-drpd");
			var chatsecf = $(".chat_sec");
						
            $(window).scroll(function () {
				if($(window).width() > 1024) {
					var scroll = $(window).scrollTop();	
					if (scroll >= 150) {
						chatdrpdf.css({"bottom": "49px", "transition": "all 1s"});
						chatsecf.css({"bottom": "110px", "transition": "all 1s"});
					} 
					else {						
						chatdrpdf.css({"bottom": "7px"});
						chatsecf.css({"bottom": "68px"});
					}
				}
            });
        });

	});
}
function showhide2(){
	$(document).ready(function(){ 
	$(".fc_chatdiv a").click(function(){
		$(".fc_chat_box_div").show();
	});

});
}

/* Preloader */
function preloaderFadeOutInit(){
	$('.preloader').delay(100).fadeOut('slow');
	$('body').attr('id','');
	}

	// Window load function
	jQuery(window).on('load', function () {
	(function ($) {
	preloaderFadeOutInit();
	})(jQuery);
});
/* End Preloader */

/* Back to Top  */
function back_to_top(){
	$(document).ready(function() {
		var toTop = $('.to-top');
		// logic
		toTop.on('click', function() {
		  $('html, body').animate({
			scrollTop: $('html, body').offset().top,
		  });
		});	 

		$('.tticon').hide();

		var myScrollFunc = function () {
			var y = window.scrollY;
			if (y >= 50) {
				$('.tticon').show();
			} else {
				$('.tticon').hide();
			}
		};
		window.addEventListener("scroll", myScrollFunc);
	});
}
/* End Back to Top  */

/* Topology left right Button */
function topology_sidebtn(){

	$(".fa_left").hide();

	$(".tp-lr-btn").click(function(){
		$(".topo_relative").toggleClass("topology_width");
		$(".topo_side").toggleClass("side_topo");

		var id  = $(this).attr('id');
		if(id ==  0){
			$(".fa_right").hide();
			$(".fa_left").show();
			$(this).attr('id',1);
		}
		else{
			$(".fa_right").show();
			$(".fa_left").hide();
			$(this).attr('id',0);
		}
	});	
}
/* End Topology */

/* Header fixed */
function headerfix(){
}
/* End Header fixed */

