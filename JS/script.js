// /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
// function openNav() {
//     document.getElementById("mySidebar").style.width = "20vw";
//     document.getElementById("open").style.marginRight = "20vw";
//     document.getElementsByClassName("openbtn")[0].setAttribute("onclick", "closeNav()");
// }

// /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
// function closeNav() {
//     document.getElementById("mySidebar").style.width = "0";
//     document.getElementById("open").style.marginRight = "0";
//     document.getElementsByClassName("openbtn")[0].setAttribute("onclick", "openNav()");
// }



function toggle_sidebar() {
    document.getElementById("mySidebar").classList.toggle("open");
}



// --- MAIN GAME CODE --- //
// Initialise variables
var wantedValue = [0, 0]; // Wanted value in pounds and shillings
var playerName = "placeholder name"; // TODO: Pull this from SLQ data
var dateOfDeath = "1/1/1 - placeholder"; // TODO: Pull this from SLQ data as well
var currentDay = 0;
var currentSavings = [0, 0];


function makeChoice(choiceCode, rawValue = "0p0s") {
    if (choiceCode.startsWith("random")) {
        if (Math.random() < 0.5) {
            choiceCode = choiceCode.split(" ")[1];
        } else {
            choiceCode = choiceCode.split(" ")[2];
        }
    } else if (choiceCode.startsWith("ending")) {
        endingChoice(choiceCode);
        return;
    } else if (choiceCode.startsWith("newDay")) {
        displayDay();
        return;
    }

    var eventElement = document.querySelector("#event > p:first-of-type"); // Selects the event description thing
    var choicesElement = document.querySelector("#choices"); // Selects the choices article

    clearScreen();

    var eventText = choiceData[choiceCode].flavourText; // Gets flavour text of question
    var choiceOptions = choiceData[choiceCode].choices; // Gets choices of question
    var choicesNumber = (Object.keys(choiceOptions).length); // Gets the number of choices

    eventElement.innerHTML = eventText.toString(); // Fills out the event on the page

    for (i = 1; i <= choicesNumber; i++) {
        var content = '<a class="choiceButton" onClick="makeChoice(\'' + choiceOptions[i].outcomeCode + '\', \'' + choiceOptions[i].choiceValue + '\')">' + choiceOptions[i].choiceText + '</a>';
        choicesElement.insertAdjacentHTML('beforeend', content);
    }

    changeWantedValue(rawValue);

    if (wantedValue[0] !== 0 || wantedValue[1] !== 0) {
        updateWantedValue();
    } 
}

function clearScreen(hideTalker = false) {
    var firstChild = document.querySelector("#choices").firstElementChild;
    var majorHeader = document.querySelector("#majorHeader");
    var eventElement = document.querySelector("#event > p:first-of-type")

    if (hideTalker) {
        document.querySelector("#event > div:first-of-type").classList.add("hidden");
    } else {
        document.querySelector("#event > div:first-of-type").classList.remove("hidden");
    }

    while (firstChild) {
        firstChild.remove();
        firstChild = document.querySelector("#choices").firstElementChild;
    }

    eventElement.innerHTML = "";

    try {
        majorHeader.remove();
    } catch (TypeError) {
        // Ignore
    }
}

function displayDay() {
    clearScreen(true);

    currentDay += 1;
    var dayNotifElement = '<div id="majorHeader"><p>Day ' + currentDay + '</p></div>';
    var dayCountElement = document.querySelector("#day");
    var choicesElement = document.querySelector("#choices");
    var choicesContent = '<a class="choiceButton" onClick="makeChoice(\'1A\', \'0p0s\')">Wake Up</a>';

    dayCountElement.innerHTML = currentDay;
    document.querySelector("main").insertAdjacentHTML('afterbegin', dayNotifElement);
    choicesElement.insertAdjacentHTML('beforeend', choicesContent);
}

function changeWantedValue(rawValue) {
    try {
        var poundValue = Number(rawValue.toString().split("p")[0]); // Extracts crime value in pounds, as a number
    } catch(TypeError) {
        var poundValue = 0;
    }

    if (isNaN(poundValue)) {
        var poundValue = 0;
    }

    try {
        var shillingValue = Number(rawValue.toString().split("p")[1].split("s")[0]); // Extracts crime value in shillings, as a number
    } catch(TypeError) {
        var shillingValue = 0;
    }

    var currentShillingValue = wantedValue[1];

    while (shillingValue + currentShillingValue >= 20) {
        poundValue += 1;
        shillingValue -= 20;
    }

    wantedValue[0] += poundValue;
    wantedValue[1] += shillingValue;
}

function updateWantedValue() {
    var wantedElement = document.querySelector("#wantedValue");
    wantedElement.innerHTML = wantedValue[0].toString() + " pence, " + wantedValue[1].toString() + " shillings";
}

function endingChoice(choiceCode) {
    var eventElement = document.querySelector("#event > p:first-of-type"); // Selects the event description thing
    var choicesElement = document.querySelector("#choices"); // Selects the choices article

    eventElement.remove();
    choicesElement.remove();

    var fieldsOptions = choiceData[choiceCode].fields; // Gets fields of question
    var fieldsNumber = (Object.keys(fieldsOptions).length); // Gets the number of fields

    wantedValue = String(wantedValue[0]) + " pence, " + String(wantedValue[1]) + " shillings";

    for (i = 1; i <= fieldsNumber; i++) {
        var content = '<p><strong>' + fieldsOptions[i].title + '</strong> ' + eval(fieldsOptions[i].value) + '</p>';
        document.querySelector("main").insertAdjacentHTML('beforeend', content);
    }
}

function spendMoney(target) {
    var marker = document.querySelector("." + CSS.escape(target) + " p:first-of-type");
    var button = document.querySelector("." + CSS.escape(target) + " a:first-of-type");

    marker.classList.add("bought");
    marker.innerHTML = "Bought";

    button.innerHTML = 'Sell ' + target ;
    button.setAttribute('onClick', 'unspendMoney(\'' + target + '\')');
}

function unspendMoney(target) {
    var marker = document.querySelector("." + CSS.escape(target) + " p:first-of-type");
    var button = document.querySelector("." + CSS.escape(target) + " a:first-of-type");

    marker.classList.remove("bought");
    marker.innerHTML = "Not bought";

    button.innerHTML = 'Buy ' + target ;
    button.setAttribute('onClick', 'spendMoney(\'' + target + '\')');
}

function iterateRecords(results) {

	console.log(results);

	var recordTemplate = $(".record-template");

	$.each(results.result.records, function(recordID, recordValue) {

		var recordName = recordValue["Convict Name"];
		var recordTitle = recordValue["Title"];

		if(true) {

			var clonedRecordTemplate = recordTemplate.clone();
			clonedRecordTemplate.attr("id", "record-" + recordID).removeClass("record-template");
			clonedRecordTemplate.appendTo("#records");

			$("#record-" + recordID + " h2").html(recordName);
			$("#record-" + recordID + " h3").html(recordTitle);

		}

	});

	$("#record-count strong").text($(".record:visible").length);

	$("#filter-text").keyup(function() {

		var searchTerm = $(this).val();
		console.log(searchTerm);
	
		$(".record").hide();
		$(".record:contains('" + searchTerm + "')").show();
	
		$("#record-count strong").text($(".record:visible").length);
	
	});

	setTimeout(function() {
		$("body").addClass("loaded");
	}, 2000); // 2 second delay

}

$(document).ready(function() {

    var convictDataSearch = {
        resource_id: "dbcfa4a6-3ec7-4264-bcee-43b21a470d34",
        limit: 10
    }

    $.ajax({
        url: "https://data.qld.gov.au/api/3/action/datastore_search",
        data: convictDataSearch,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise it'll be blocked due to cross-site scripting).
        cache: true,
        success: function(results) {
            window.convictData = results; // Global variable
            iterateRecords(results);
            }
        
    });

    $.ajax({
        url: "data/choices.json",
        dataType: "json",
        success: function(results) {
            window.choiceData = results; // Global variable
        }
    });

    // window.choiceData = JSON.parse('{"1A":{"flavourText":"What do","choices":{"1":{"choiceText":"Nothing","outcomeCode":"2A"},"2":{"choiceText":"Something","outcomeCode":"2B"},"3":{"choiceText":"Everything","outcomeCode":"2C"}}},"2A":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2B":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2C":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}}}')

});

