// LAZY LOADED WITH LAZYSIZES - IN JS
// https://github.com/aFarkas/lazysizes

// jQuery  - IN JS

  // Super simple mark-up. On button click overwrite/update iframe src / url 
  // and video caption with content of the respective data-attribute.
  // NOTE:  Working on an event listener to do stuff like advance to  
  // next video on end and shit like that.  Tricky. Stay tuned!

$("#video-player button").on("click", function () {
  // Create data attributes for buttons
  var iframesrc = $(this).attr("data-iframe");
  var caption = $(this).attr("data-caption");
  // Target the respective iframe and caption elements in HTML by ID
  // and update with content of data-attribute in PLAYLIST BUTTON HTML MARK-UP
  $("#video-player #video-caption").html(caption);
  $("#video-player iframe").attr("src", iframesrc);
  
  // Toggle button active class
  $(this).addClass("active").siblings().removeClass("active");
 
  
  });

// Scroll Playlist horizontally with mousewheel on hover
// Fork from Álvaro
// https://codepen.io/alvarotrigo/pen/gOmgRzL
// This is slick.

const scrollContainer = document.querySelector("#playlist");
scrollContainer.addEventListener("wheel", (evt) => {
  evt.preventDefault();
  scrollContainer.scrollLeft += evt.deltaY;
});