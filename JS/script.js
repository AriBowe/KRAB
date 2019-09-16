/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "15vw";
    document.getElementById("open").style.marginRight = "15vw";
    document.getElementsByClassName("openbtn")[0].setAttribute("onclick", "closeNav()");
}

/* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("open").style.marginRight = "0";
    document.getElementsByClassName("openbtn")[0].setAttribute("onclick", "openNav()");
}

var wantedValue = [0, 0]; // Wanted value in pounds and shillings
var playerName = "placeholder name" // TODO: Pull this from SLQ data
var dateOfDeath = "1/1/1 - placeholder" // TODO: Pull this from SLQ data as well


function makeChoice(choiceCode, rawValue = "0p0s") {
    if (choiceCode.startsWith("random")) {
        if (Math.random() < 0.5) {
            choiceCode = choiceCode.split(" ")[1]
        } else {
            choiceCode = choiceCode.split(" ")[2]
        }
    }

    if (choiceCode.startsWith("ending")) {
        endingChoice(choiceCode);
        return;
    }

    var eventElement = document.querySelector("#event > p:first-of-type"); // Selects the event description thing
    var choicesElement = document.querySelector("#choices"); // Selects the choices article

    var firstChild = choicesElement.firstElementChild;
    while (firstChild) {
        firstChild.remove();
        firstChild = choicesElement.firstElementChild;
    }

    var eventText = choiceData[choiceCode].flavourText; // Gets flavour text of question
    var choiceOptions = choiceData[choiceCode].choices; // Gets choices of question
    var choicesNumber = (Object.keys(choiceOptions).length); // Gets the number of choices

    eventElement.innerHTML = eventText.toString(); // Fills out the event on the page

    for (i = 1; i <= choicesNumber; i++) {
        var content = '<a class="choiceButton" onClick="makeChoice(\'' + choiceOptions[i].outcomeCode + '\', \'' + choiceOptions[i].choiceValue + '\')">' + choiceOptions[i].choiceText + '</a>';
        choicesElement.insertAdjacentHTML('beforeend', content);
    }

    addWantedValue(rawValue);
}

function addWantedValue(rawValue) {
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
function iterateRecords(results) {

	console.log(results);

	var recordTemplate = $(".record-template");

	$.each(results.result.records, function(recordID, recordValue) {

		var recordName = recordValue["Convict Name"];
		var recordSentence = recordValue["Sentence Details"];
		var recordVessel = recordValue["Vessel"];
		var recordDepart = recordValue["Date of Departure"];
		var recordTitle = recordValue["Title"];
		var recordDescription = recordValue["dc:description"];

		if(true) {

			var clonedRecordTemplate = recordTemplate.clone();
			clonedRecordTemplate.attr("id", "record-" + recordID).removeClass("record-template");
			clonedRecordTemplate.appendTo("#records");

			$("#record-" + recordID + " h2").html(recordName);
			$("#record-" + recordID + " h2").html(recordSentence);
			$("#record-" + recordID + " h2").html(recordVessel);
			$("#record-" + recordID + " h2").html(recordDepart);
			$("#record-" + recordID + " h2").html(recordTitle);
			$("#record-" + recordID + " h2").html(recordDescription);
			$("#record-" + recordID + " a").click(function(event) {
				Strip.show({
					url: recordImageLarge,
					caption: recordTitle
				});
				event.preventDefault();
			});

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
        limit: 52
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

