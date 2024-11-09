

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



//հիմնական տեղական Պահպանման բեռնաթափում
//get վերադարձնում է վերլուծված LS-ը
//save հրում օբյեկտը ցանկում պահելու համար
//հեռացնելը այլ ֆունկցիայի մեջ է (դե ես չգիտեմ)
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


//ավելացնում է բլոկի html-ն իր բոլոր արժեքներով և իրադարձություններով
function appendblock(title, url, index) {

	function getdomainroot(url) {
		var a = document.createElement('a');
		a.href = url;
		return a.hostname;
	}

	var googleIconUrl = "https://www.google.com/s2/favicons?domain=" + getdomainroot(url);

	var b = "<div class='block'><a href='" + url + "'><img class='l_icon' src='" + googleIconUrl + "'><p>" + title + "</p><button class='remove' onclick='removeblock(" + index + ")'>&times;</button></a><div>";

	$(".linkblocks").append(b);
}

//սկզբնավորում է բլոկները՝ հիմնված պահեստավորման վրա
//պարզապես օգտագործեք appendBlock հանգույցը
function initblocks() {

	$(".linkblocks").empty();

	var links = storage("get");

	if (links) {

		for (var i = 0; i < links.length; i++) {
		
			appendblock(links[i][0], links[i][1], i);
		}
	}
}

//նախ հանեք բլոկը ըստ իր ինդեքսի (n-րդ երեխան, եթե կա 1-ից ավելի բլոկ)
//ապա տեղադրեք պահեստը բլոկի ինդեքսում
//և զրոյացնում է բլոկները
function removeblock(index) {

	var links = storage("get");
	var selec;

	(links.length <= 1 ? selec = ".linkblocks:nth-child(" + index + ")" : ".linkblocks:first-child")
	$(selec).remove();

	

	links.pop(index);
	localStorage.links = JSON.stringify(links);



	initblocks();
}

//երբ մենք հղում ենք ավելացնում
//կցել բլոկի վերնագրով, url-ով ԵՎ ինդեքսով
//ավելացնել այս տվյալները պահեստում
//remet a զրոյական les մուտքերը
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

	//ամսաթիվը սահմանում է ինդեքսը օրերի և ամիսների ցանկում՝ այն ամբողջությամբ ցուցադրելու համար
	$(".date span").text(days[d.getDay()] + " " + d.getDate() + " " + months[d.getMonth()]);
}




function weather() {


	//եթե արևը ծագում է, վերադարձի օրը
	//վերադարձը համապատասխանում է օրվա/գիշերային պատկերակների գրացուցակի անվանմանը
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

	//վերցնում է եղանակի id-ը և վերադարձնում նկարագրությունը
	//համընկնում է պատկերակի անվան հետ (+ .png)
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


		//նկարագրության և ջերմաստիճանի համար

		var desc = '<span>' + data.weather[0].description + '</span>. It is <span class="w_temp"></span> currently.'
		$(".w_description").html(desc);
		$(".w_temp").text(Math.floor(data.main.temp) + '°');
		

		//պատկերակի համար
		var dOrN = dayOrNight(data.sys.sunset, data.sys.sunrise);
		var wId = imgId(data.weather[0].id);

		$(".w_icon").attr("src", "src/icons/weather/" + dOrN + "/" + wId + ".png");
	}


	//Ես նախընտրում եմ մեկուսացնել հարցումը և օգտագործել մեկ այլ ավելի բարձր գործառույթ՝ տվյալները փոփոխելու համար
	function weatherRequest(city, unit, api) {

		//փոխարկիչ
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

				//պատասխանն օգտագործվում է ավելի բարձր ֆունկցիայի մեջ
				dataHandling(data);					

			} else {
				console.log('error');
			}
		}

		request_w.send();
	}
	



	//երբ մենք ընդունում ենք նոր քաղաքը
	//հարցում կատարեք քաղաքի եղանակին և պահպանեք այն
	$(".submitw_city").click(function() {
		var city = $(".change_weather input[name='city']").val();

		weatherRequest(city, localStorage.wUnit);
		localStorage.wCity = city;
	});

	//մենք ընտրում ենք մետրիկ
	//մետրիկով հարցրեք եղանակը և գրանցեք այն
	$(".submitw_metric").click(function() {

		weatherRequest(localStorage.wCity, "metric");
		localStorage.wUnit = "metric";
	});

	//մենք ընտրում ենք կայսերական
	//req եղանակը կայսերական հետ և փրկում է այն
	$(".submitw_imperial").click(function() {

		weatherRequest(localStorage.wCity, "imperial");
		localStorage.wUnit = "imperial";
	});



	//սկզբնավորվել է Paris + Metric-ում
	//եթե պահեստը գոյություն ունի, գործարկեք պահեստի հետ

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

	//ցուցադրում է քաղաքը քաղաքի մուտքագրման մեջ
	$(".change_weather input[name='city']").val(localStorage.wCity);
}


$(".showSettings button").click(function() {
	$(".settings").toggle();
});


$(document).ready(function() {
	initblocks();
	weather();
	date();
	clock();
	greetings();
});