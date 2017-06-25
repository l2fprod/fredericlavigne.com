$(document).ready(function() {
	$('#title').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 3000);
	$('#theL').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 5000);
	$('#theD').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 1.0}, 5000);
	$('#teaser').css({opacity: 0.0, visibility: "visible"}).animate({opacity: 0.8}, 5000);	
	
	// add fb like button to images in fullscreen
	$('#blueimp-gallery')
		.on('slide', function (event, index, slide) {
			var description = $(this).find(".description");			
			description.empty();
			
			var imgSrc = $(slide).find("img").attr("src");
			var newHtml = '<div class="fb-like" data-href="' + imgSrc + '" data-width="300" data-layout="standard" data-action="like" data-show-faces="true" data-share="false"></div>';
			description.append(newHtml);
			FB.XFBML.parse(description[0]);
		});	
		
	$('#permalink').tooltip();
});

(function ($) {
    $.deserialize = function (str, options) {
        var pairs = str.split(/&amp;|&/i),
            h = {},
            options = options || {};
        for(var i = 0; i < pairs.length; i++) {
            var kv = pairs[i].split('=');
            kv[0] = decodeURIComponent(kv[0]);
												
            if(!options.except || options.except.indexOf(kv[0]) == -1) {
                if((/^\w+\[\w+\]$/).test(kv[0])) {
                    var matches = kv[0].match(/^(\w+)\[(\w+)\]$/);
                    if(typeof h[matches[1]] === 'undefined') {
                        h[matches[1]] = {};
                    }
										
                    h[matches[1]][matches[2]] = decodeURIComponent(kv[1]);

										if ("true" == kv[1]) { h[matches[1]][matches[2]] = true; }
										if ("false" == kv[1]) { h[matches[1]][matches[2]] = false; }										
                } else {
                    h[kv[0]] = decodeURIComponent(kv[1]);
										if ("true" == kv[1]) { h[kv[0]] = true; }
										if ("false" == kv[1]) { h[kv[0]] = false; }										
                }
            }
        }
        return h;
    };

    $.fn.deserialize = function (options) {
        return $.deserialize($(this).serialize(), options);
    };
})(jQuery);

var lmApp = angular.module('lmApp', ['ngAnimate', 'localization', 'ngDraggable']);

lmApp.controller('ImageListController', function ($scope) {
  $scope.images = allImages;
	$scope.emotions = allEmotions;

  var filterConfiguration =  {
		man: true,
		woman: true,
		eyeColors: { },
		hairColors: { },
		emotions: { neutral: true },
		showHands: false,
		newOnly: false,
		focusOn: null,
	};

	var filterConfigurationFromURL = $.deserialize(window.location.search.substring(1));
	if (filterConfigurationFromURL.man!=null) { filterConfiguration.man = filterConfigurationFromURL.man; }
	if (filterConfigurationFromURL.woman!=null) { filterConfiguration.woman = filterConfigurationFromURL.woman; }
	if (filterConfigurationFromURL.eyeColors!=null) { filterConfiguration.eyeColors = filterConfigurationFromURL.eyeColors; }
	if (filterConfigurationFromURL.hairColors!=null) { filterConfiguration.hairColors = filterConfigurationFromURL.hairColors; }
	if (filterConfigurationFromURL.emotions!=null) { filterConfiguration.emotions = filterConfigurationFromURL.emotions; }
	if (filterConfigurationFromURL.showHands!=null) { filterConfiguration.showHands = filterConfigurationFromURL.showHands; }
	if (filterConfigurationFromURL.newOnly!=null) { filterConfiguration.newOnly = filterConfigurationFromURL.newOnly; }
	if (filterConfigurationFromURL.focusOn!=null) { filterConfiguration.focusOn = filterConfigurationFromURL.focusOn; }
	
	
	// initialize the default filter
	$scope.filterConfiguration = filterConfiguration;
	
	$scope.onDragComplete=function(data,event) {
		event.returnValue = false;
		$scope.filterConfiguration.focusOn = data.personId;
	};
});

lmApp.filter('imageFilter', function() {
	return function(items, filterConfiguration) {		
			
		var url = [location.protocol, '//', location.host, location.pathname, '?', $.param(filterConfiguration)].join('');
		$('#permalink').attr('href', url);

    var thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		
		var results = [];				
    var hasEmotionConfigured = false;
		$.each(filterConfiguration.emotions, function(i, val) {	if (val) { hasEmotionConfigured = true;	}	});
    var hasHairColorConfigured = false;
		$.each(filterConfiguration.hairColors, function(i, val) {	if (val) { hasHairColorConfigured = true;	}	});
    var hasEyeColorConfigured = false;
		$.each(filterConfiguration.eyeColors, function(i, val) {	if (val) { hasEyeColorConfigured = true;	}	});
		
		items.forEach(function(image) {
			var match = true;
			var matchSet = false;
			
      // keep only the selected genre
			if (!filterConfiguration.man && image.sex == 'm') { match = false; }
			if (!filterConfiguration.woman && image.sex == 'w') { match = false; }
			
			// show all pics with the selected emotions
			if (match && hasEmotionConfigured) {
				var matchAtLeastOneEmotion = false;
				allEmotions.forEach(function(emotion) {
					if (!matchAtLeastOneEmotion && filterConfiguration.emotions[emotion]) { matchAtLeastOneEmotion = image.emotion == emotion; }
			  });
				match = matchAtLeastOneEmotion;
			}
		
		  // only pics with the selected hair color (if any picked)
			if (match && hasHairColorConfigured) {
				var matchAtLeastOneHairColor = false;
				$.each(filterConfiguration.hairColors, function(key, val) {
					if (!matchAtLeastOneHairColor && val) { matchAtLeastOneHairColor = image.hairColor == key; }
				});
				match = matchAtLeastOneHairColor;
			}
		
		  // only pics with the selected hair color (if any picked)
			if (match && hasEyeColorConfigured) {
				var matchAtLeastOneEyeColor = false;
				$.each(filterConfiguration.eyeColors, function(key, val) {
					if (!matchAtLeastOneEyeColor && val) { matchAtLeastOneEyeColor = image.eyeColor == key; }
				});
				match = matchAtLeastOneEyeColor;
			}
			
			if (match && filterConfiguration.showHands) {
				match = image.showHands;
			}
			
			// keep only the ones added in the last 30 days
			if (match && filterConfiguration.newOnly) {
				var addedOn = new Date(image.lastUpdate);
				match = addedOn > thirtyDaysAgo;
			}
			
			if (match && filterConfiguration.focusOn) {
				match = filterConfiguration.focusOn == image.personId;
			}
			
			if (match) {
				results.push(image);
			}
		});
		
		return results;
	}
});
