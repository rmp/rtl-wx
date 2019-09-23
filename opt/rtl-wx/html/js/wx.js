// replace all svg img with inline
const img2svg = () => {
    jQuery('img[src$=\".svg\"]').each(function () {
	var $img = jQuery(this);
	var imgID = $img.attr('id');
	var imgClass = $img.attr('class');
	var imgURL = $img.attr('src');
	
	jQuery.get(imgURL, function(data) {
            // Get the SVG tag, ignore the rest
            var $svg = jQuery(data).find('svg');
	    
            // Add replaced image's ID to the new SVG
            if(typeof imgID !== 'undefined') {
		$svg = $svg.attr('id', imgID);
            }
            // Add replaced image's classes to the new SVG
            if(typeof imgClass !== 'undefined') {
		$svg = $svg.attr('class', imgClass+' replaced-svg');
            }
	    
            // Remove any invalid XML tags as per http://validator.w3.org
            $svg = $svg.removeAttr('xmlns:a');
	    
            // Check if the viewport is set, if the viewport is not set the SVG wont't scale.
            if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
		$svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
            }
	    
            // Replace image with new SVG
            $img.replaceWith($svg);
	    
	}, 'xml');
    });
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];

const update = () => {
    $.getJSON("/wx.cgi?type=wx", struct => {
	Object.keys(struct).forEach((k) => {
	    $(`#${k}`).html(struct[k]);
	});
    });
    
    $.getJSON("/wx.cgi?type=forecast", struct => {
	$('#headline').text(struct.Headline.Text);
	let  id=0;
	struct.DailyForecasts.forEach(day => {
	    const date = new Date(day.Date);
	    const moonrise = new Date(day.Moon.Rise).toLocaleDateString();
	    const moonset = new Date(day.Moon.Set).toLocaleDateString();
	    
	    const dayEl = $(`
<div>
  <div class="row">
    <div class="col date"><h4>${DAYS[date.getDay()]} ${date.toLocaleDateString()}</h4></div>
  </div>
  <div class="row">
    <div class="daytime col-lg-6 col-md-6 col-sm-12">
      <span class="d-xs-none d-sm-block">Day<br/></span>
      <img class="icon icon-wx" src="gfx/${day.Day.Icon}.svg" alt="${day.Day.IconPhrase}"/>
    </div>
    <div class="nighttime col-lg-6 col-md-6 col-sm-12">
      <span class="d-xs-none d-sm-block">Night<br/></span>
      <img class="icon icon-wx" src="gfx/${day.Night.Icon}.svg" alt="${day.Night.IconPhrase}"/>
    </div>
  </div>
  <div>
    High: ${day.Temperature.Maximum.Value}&deg;${day.Temperature.Maximum.Unit}
  </div>
  <div>
    Low: ${day.Temperature.Minimum.Value}&deg;${day.Temperature.Minimum.Unit}
  </div>
  <div>
   Chance of Rain: ${day.Day.PrecipitationIntensity||""} / ${day.Day.PrecipitationProbability}%
  </div>
  <div class="nighttime">
    <span class="d-xs-none d-sm-block">Moon<br/></span>
    <img class="icon icon-moon" src="gfx/moon/${day.Moon.Phase}.svg" alt="${day.Moon.Phase}"/>
  </div>
  <div class="description">
    ${day.Day.LongPhrase}
  </div>
</div>`);
	    $(`#day${id}`).empty().append(dayEl);
	    id += 1;
	});
	
	img2svg();
    });
};

const interval = setInterval(update, 30000);
update();
//{"time" : "2019-02-18 23:07:53", "model" : "Fine Offset Electronics WH1080/WH3080 Weather Station", "msg_type" : 0, "id" : 84, "temperature_C" : 4.100, "humidity" : 59, "direction_deg" : 225, "speed" : 1.224, "gust" : 3.672, "rain" : 804.600, "battery" : "LOW", "mic" : "CRC"}
