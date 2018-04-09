$(window).scroll(function() {
  if ($(document).scrollTop() > 50) {
    $('nav').addClass('shrink');
  } else {
    $('nav').removeClass('shrink');
  }
});

window.onscroll = function() {
  growShrinkLogo()
};

function growShrinkLogo() {
  var Logo = document.getElementById("logo_header")
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 0) {
    Logo.style.width = '60px';
  } else {
    Logo.style.width = '90px';
  }
}

