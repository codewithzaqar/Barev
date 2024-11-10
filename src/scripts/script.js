function clock() {
	
	function checkTime(i) {
		if (i < 10) {i = "0" + i};
		return i;
	}

	var today = new Date();
	var h = today.getHours();
	var m = today.getMinutes();
	m = checkTime(m);

	$('#clock').text(h + ":" + m);
	var t = setTimeout(clock, 999);
}










function greetings() {
	var h = new Date().getHours();
	var m;

	if (h >= 6 && h < 12) {
		m = 'Good Morning'; 

	} else if (h >= 12 && h < 17) {
		m = 'Good Afternoon';

	} else if (h >= 17 && h < 23) {
		m = 'Good Evening';

	} else if (h >= 23 && h < 6) {
		m = 'Good Night';
	}

	$('.greetings').append(m);
}














function storage(state, title, url) {
	if (state === "get") {

		if (localStorage.links) {
			return JSON.parse(localStorage.links);
		}
		else {
			return false;
		}
		
	}

	if (state === "save") {

		if (localStorage.links) {
			var arr = JSON.parse(localStorage.links);

			var topush = [title, url];
			arr.push(topush);

			localStorage.links = JSON.stringify(arr);
		}
		else {
			localStorage.links = JSON.stringify([[title, url]]);
		}
	}
}



function appendblock(title, url, index) {

	function getdomainroot(url) {
		var a = document.createElement('a');
		a.href = url;
		return a.hostname;
	}

	var googleIconUrl = "https://www.google.com/s2/favicons?domain=" + getdomainroot(url);

	var b = "<div class='block'><a href='" + url + "'><img class='l_icon' src='" + googleIconUrl + "'><p>" + title + "</p></a><button class='remove'>&times;</button><div>";

	$(".linkblocks").append(b);
}



function initblocks() {

	$(".linkblocks").empty();

	var links = storage("get");

	if (links) {

		for (var i = 0; i < links.length; i++) {
		
			appendblock(links[i][0], links[i][1], i);
		}
	}
}







function showRemoveLink() {


	var remTimeout;
	var canRemove = false;

	
	$(".linkblocks").on("mouseenter", ".block", function(e) {

		remTimeout = setTimeout(function() {
			
			e.currentTarget.children[1].setAttribute("style", "opacity: 1");
			canRemove = true;
		}, 500);
	});

	$(".linkblocks").on("mouseleave", ".block", function(e) {

		clearTimeout(remTimeout);
		e.currentTarget.children[1].setAttribute("style", "opacity: 0");
		canRemove = false;
	});




	function removeblock(i) {

		
		$(".linkblocks")[0].children[i].remove();
		
		
		function ejectIntruder(arr) {
			var temp0 = arr.slice(i + 1);
			var temp1 = links.slice(0, i);

			return temp1.concat(temp0);
		}
		
		var links = storage("get");
		localStorage.links = JSON.stringify(ejectIntruder(links));
	}


	
	$(".linkblocks").on("click", ".remove", function() {
		
		var index = $(".block").index(this.parentElement);
		(canRemove ? removeblock(index) : "");
	});
}







$(".submitlink").click(function() {
	var title = $(".addlink input[name='title'").val();
	var url = $(".addlink input[name='url'").val();

	appendblock(title, url, storage("get").length);

	storage("save", title, url);

	$(".addlink input[name='title'").val("");
	$(".addlink input[name='url'").val("");
});









function date() {
	var d = new Date();
	d.getDay();

	var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

	
	$(".date span").text(days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()]);
}














function weather() {


	

	function dayOrNight(sunset, sunrise) {
		var ss = new Date(sunset * 1000);
		var sr = new Date(sunrise * 1000);
		var n = new Date();

		if (n.getHours() > sr.getHours() && n.getHours() < ss.getHours()) {
			return "day";
		}
		else {
			return "night";
		}
	}

	

	function imgId(id) {
		if (id >= 200 && id <= 232) {
			return "thunderstorm"
		} 
		else if (id >= 300 && id <= 321) {
			return "showerrain"
		}
		else if (id === 500 || id === 501) {
			return "lightrain"
		}
		else if (id >= 502 && id <= 531) {
			return "showerrain"
		}
		else if (id >= 602 && id <= 622) {
			return "snow"
		}
		else if (id >= 701 && id <= 781) {
			return "mist"
		}
		else if (id === 800) {
			return "clearsky"
		}
		else if (id === 801 || id === 802) {
			return "fewclouds"
		}
		else if (id === 803 || id === 804) {
			return "brokenclouds"
		}
		else {
			console.log(id);
		}
	}


	function dataHandling(data) {


		

		var desc = '<span>' + data.weather[0].description + '</span>. It is <span class="w_temp"></span> currently.'
		$(".w_description").html(desc);
		$(".w_temp").text(Math.floor(data.main.temp) + '°');
		

		
		var dOrN = dayOrNight(data.sys.sunset, data.sys.sunrise);
		var wId = imgId(data.weather[0].id);

		$(".w_icon").attr("src", "src/icons/weather/" + dOrN + "/" + wId + ".png");
	}


	
	function weatherRequest(city, unit, api) {

		
		api = '7c541caef5fc7467fc7267e2f75649a9';

		var request_w = new XMLHttpRequest();
		request_w.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q='
			+ city
			+ '&units='
			+ unit
			+ '&appid='
			+ api
			+ '&lang='
			+ navigator.language, true);

		request_w.onload = function() {
			
			var data = JSON.parse(this.response);

			if (request_w.status >= 200 && request_w.status < 400) {

				
				dataHandling(data);					

			} else {
				console.log('error');
			}
		}

		request_w.send();
	}
	



	

	$(".submitw_city").click(function() {
		var city = $(".change_weather input[name='city']").val();

		weatherRequest(city, localStorage.wUnit);
		localStorage.wCity = city;
	});

	

	$(".submitw_metric").click(function() {

		weatherRequest(localStorage.wCity, "metric");
		localStorage.wUnit = "metric";
	});

	

	$(".submitw_imperial").click(function() {

		weatherRequest(localStorage.wCity, "imperial");
		localStorage.wUnit = "imperial";
	});



	


	var c = localStorage.wCity;
	var u = localStorage.wUnit;

	if (!c) {
		weatherRequest("Paris", "metric");

		localStorage.wCity = "paris";
		localStorage.wUnit = "metric";
	}
	else {
		weatherRequest(c, u);
	}

	
	$(".change_weather input[name='city']").val(localStorage.wCity);
}







function renderImage(file) {

	
	var reader = new FileReader();

	
	reader.onload = function(event) {
		url = event.target.result
		localStorage.background = url;
		$('.change_background .bg_preview').attr("src", url);
		$('.background').css("background-image", 'url(' + localStorage.background + ')');
	}

	
	reader.readAsDataURL(file);
}


function initBackground() {

	var ls = localStorage.background;

	if (ls) {
		$('.change_background .bg_preview').attr("src", );
		$('.background').css("background-image", 'url(' + ls + ')');

		bg_blur(localStorage.background_blur);
		
	} else {
		$('.change_background .bg_preview').attr("src", "src/images/background.jpg");
		$('.background').css("background-image", 'url("src/images/background.jpg")');
	}
}

function bg_blur(val) {
	$('.background').css("filter", 'blur(' + val + 'px)');
	localStorage.background_blur = val;
}




$(".change_background input[name='background_file']").change(function() {

	renderImage(this.files[0]);
});


$(".change_background input[name='background_blur']").change(function() {

	bg_blur(this.value);
});








$(".showSettings button").click(function() {
	$(".settings").toggle();
});





$(document).ready(function() {
	initBackground();
	showRemoveLink();
	initblocks();
	weather();
	date();
	clock();
	greetings();
});