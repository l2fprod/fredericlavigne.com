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

  var ALL_ADS = {
    leaderboard: {
      google: '<!-- blog-leaderboard --><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-9173124308474083" data-ad-slot="8731115967"></ins>',
      amazon: '<iframe src="//rcm-na.amazon-adsystem.com/e/cm?o=1&p=48&l=ur1&category=amazonhomepage_2017&f=ifr&linkID=253243d6e880f1f0519248f43bd843f8&t=fredericlavigne-20&tracking_id=fredericlavigne-20" width="728" height="90" scrolling="no" border="0" marginwidth="0" style="border:none;" frameborder="0"></iframe>',
    },
    skyscraper: {
      google: '<!-- blog-skyscraper --><ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px" data-ad-client="ca-pub-9173124308474083" data-ad-slot="7861721574"></ins>',
    },
  };

  function fillAd(ad, type) {
    var availableAds = Object.keys(ALL_ADS[type]);
    var electedAd = availableAds[Math.floor(Math.random() * availableAds.length)];
    console.log('Picking', electedAd, 'for', type);
    ad.innerHTML = ALL_ADS[type][electedAd];
    if (electedAd.indexOf('google') >= 0) {
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  }

  function rotateAds() {
    console.log('Rotating ads...');
    
    var $ads = Array.prototype.slice.call(document.querySelectorAll('.ads'), 0);
    $ads.forEach(function ($ad) {
      var adType = $ad.getAttribute("data-ad-type");
      fillAd($ad, adType);
    });
  }

  rotateAds();

  setInterval(() => {
    rotateAds();
  }, 10000);

})();