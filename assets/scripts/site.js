(function () {
  console.log('Starting');

  // show a banner
  var banner = document.getElementById('banner');
  if (banner) {
    banner.src = '/assets/banners/' + Math.floor(Math.random() * 4) + '.jpg';
    banner.style.opacity = 1.0;
  }
  
  // Get all "navbar-burger" elements
  var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(function ($el) {
      $el.addEventListener('click', function () {

        console.log('toggle');
        // Get the target from the "data-target" attribute
        var target = $el.dataset.target;
        var $target = document.getElementById(target);

        // Toggle the class on both the "navbar-burger" and the "navbar-menu"
        $el.classList.toggle('is-active');
        $target.classList.toggle('is-active');

      });
    });
  }
})();