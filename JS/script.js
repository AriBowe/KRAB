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
var wantedValue = [0, 0];                   // Wanted value in pounds and shillings
var playerName = "placeholder name";        // Player character name
var dateOfDeath = "1/1/1 - placeholder";    // Date the convict died
var currentDay = 0;                         // The current day, as number of days from the start
var currentSavings = [0, 0];                // The player's current savings, as [pounds, shillings] where 20 shillings == one pound
var hasFood = false                         // Does the player have food for the night?
var lastFood = 0                            // How many days ago did the player have food for the night?
var hasHeat = false                         // Does the player have heat for the night? (Firewood)
var lastHeat = 0                            // How many days ago did the player have heat for the night?


function chooseCharacter() {
    var choiceOne = characterChoices.result.records[0];
    var choiceTwo = characterChoices.result.records[1];
    var choiceThree = characterChoices.result.records[2];
    console.log(choiceOne);
    console.log(choiceTwo);
    console.log(choiceThree);


}

function makeChoice(choiceCode, rawValue = "0p0s", choiceEffect = "none") {
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
    console.log(choiceEffect);
    applyEffect(choiceEffect);

    eventElement.innerHTML = eventText.toString(); // Fills out the event on the page

    for (i = 1; i <= choicesNumber; i++) {
        var content = '<a class="choiceButton" onClick="makeChoice(\'' + choiceOptions[i].outcomeCode + '\', \'' + choiceOptions[i].choiceValue + '\')">' + choiceOptions[i].choiceText + '</a>';
        choicesElement.insertAdjacentHTML('beforeend', content);
    }

    changeWantedValue(rawValue);

    if (wantedValue[0] !== 0 || wantedValue[1] !== 0) {
        updateValues();
    } 
}

function applyEffect(choiceEffect) {
    return;
}

function clearScreen(hideTalker = false) {
    var firstChild = document.querySelector("#choices").firstElementChild;
    var majorHeader = document.querySelector("#majorHeader");
    var eventElement = document.querySelector("#event > p:first-of-type")

    if (hideTalker) {
        document.querySelector("#event").classList.add("hidden");
    } else {
        document.querySelector("#event").classList.remove("hidden");
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

function endOfDay() {
    clearScreen(true);

    var choicesElement = document.querySelector("#choices");
    var content = '<a class="choiceButton" onClick="makeChoice(\'newDay\')">Go home</a>';
    choicesElement.insertAdjacentHTML('beforeend', content);

    document.querySelector("#endOfDay").classList.remove("hidden");
}

function displayDay() {
    clearScreen(true);

    currentDay += 1;

    if (hasFood) {
        lastFood = 1
    } else {
        lastFood += 1
    }
    if (hasHeat) {
        lastHeat = 1
    } else {
        lastHeat += 1
    }

    if (lastHeat > 2) {
        endOfGame("food")
    } else if (lastHeat > 2) {
        endOfGame("heat")
    }

    hasFood = false;
    hasHeat = false;

    var dayNotifElement = '<div id="majorHeader"><p>Day ' + currentDay + '</p></div>';
    var choicesElement = document.querySelector("#choices");
    var choicesContent = '<a class="choiceButton" onClick="makeChoice(\'1A\', \'0p0s\')">Wake Up</a>';

    document.querySelector("main").insertAdjacentHTML('afterbegin', dayNotifElement);
    choicesElement.insertAdjacentHTML('beforeend', choicesContent);
    document.querySelector("#endOfDay").classList.add("hidden");

    updateValues();
}

function decodeValues(rawValue) {
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

    var currentShillingValue = currentSavings[1];

    while (shillingValue < 0) {
        poundValue -= 1;
        shillingValue += 20;
    }

    while (shillingValue + currentShillingValue >= 20) {
        poundValue += 1;
        shillingValue -= 20;
    }

    return [poundValue, shillingValue];
}
    

function changeWantedValue(rawValue) {
    var values = decodeValues(rawValue);

    wantedValue[0] += values[0];
    wantedValue[1] += values[1];
}

function changeSavings(rawValue) {
    var values = decodeValues(rawValue);

    currentSavings[0] += values[0];
    currentSavings[1] += values[1];
}


function updateValues() {
    var dayCountElement = document.querySelector("#day");
    var wantedElement = document.querySelector("#wantedValue");
    var savingsElement = document.querySelector("#savings");

    dayCountElement.innerHTML = currentDay;
    wantedElement.innerHTML = wantedValue[0].toString() + " pence, " + wantedValue[1].toString() + " shillings";
    savingsElement.innerHTML = currentSavings[0].toString() + " pence, " + currentSavings[1].toString() + " shillings";
}

function endOfGame(endingCode) {
    var eventElement = document.querySelector("#event > p:first-of-type"); // Selects the event description thing
    var choicesElement = document.querySelector("#choices"); // Selects the choices article

    eventElement.remove();
    choicesElement.remove();

    var fieldsOptions = choiceData[endingCode].fields; // Gets fields of question
    var fieldsNumber = (Object.keys(fieldsOptions).length); // Gets the number of fields

    wantedValue = String(wantedValue[0]) + " pence, " + String(wantedValue[1]) + " shillings";

    for (i = 1; i <= fieldsNumber; i++) {
        var content = '<p><strong>' + fieldsOptions[i].title + '</strong> ' + eval(fieldsOptions[i].value) + '</p>';
        document.querySelector("main").insertAdjacentHTML('beforeend', content);
    }
}

function canAfford(rawCost) {
    var values = decodeValues(rawCost);
    var newValues = [currentSavings[0] - values[0], currentSavings[1] - values[1]];

    while (newValues[1] < 0) {
        newValues[0] -= 1;
        newValues[1] += 20;
    }

    if (newValues[0] >= 0 && newValues[1] >= 0) {
        return true;
    } else {
        return false;
    }
}

function spendMoney(target, cost) {
    var marker = document.querySelector("." + CSS.escape(target) + " p:first-of-type");
    var button = document.querySelector("." + CSS.escape(target) + " a:first-of-type");

    if (!canAfford(cost)) {
        alert("You cannot afford this!")
        return;
    }

    changeSavings("-" + cost);

    marker.classList.add("bought");
    marker.innerHTML = "Bought";

    window["has" + target] = true;

    button.innerHTML = 'Sell ' + target ;
    button.setAttribute('onClick', "unspendMoney('" + target + "','" + cost + "')");

    updateValues();
}

function unspendMoney(target, cost) {
    var marker = document.querySelector("." + CSS.escape(target) + " p:first-of-type");
    var button = document.querySelector("." + CSS.escape(target) + " a:first-of-type");

    changeSavings(cost);

    marker.classList.remove("bought");
    marker.innerHTML = "Not bought";

    window["has" + target] = false;

    button.innerHTML = 'Buy ' + target ;
    button.setAttribute('onClick', "spendMoney('" + target + "','" + cost + "')");

    updateValues();
}

// --- Hall of fame functions --- //

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


// --- Data collection & loading --- // 

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

    var random = Math.floor((Math.random() * 10) + 1);

    var characterChoicesSearch = {
        resource_id: "dbcfa4a6-3ec7-4264-bcee-43b21a470d34",
        limit: 3,
        q: random,
    }

    $.ajax({
        url: "https://data.qld.gov.au/api/3/action/datastore_search",
        data: characterChoicesSearch,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise it'll be blocked due to cross-site scripting).
        cache: true,
        success: function(results) {
            window.characterChoices = results; // Global variable
            console.log(characterChoices);
            }
        
    });

    $.ajax({
        url: "data/choices.json",
        dataType: "json",
        success: function(results) {
            window.choiceData = results; // Global variable
        }
    });

    $.ajax({
        url: "data/ending.json",
        dataType: "json",
        success: function(results) {
            window.endingData = results; // Global variable
        }
    });

    // window.choiceData = JSON.parse('{"1A":{"flavourText":"What do","choices":{"1":{"choiceText":"Nothing","outcomeCode":"2A"},"2":{"choiceText":"Something","outcomeCode":"2B"},"3":{"choiceText":"Everything","outcomeCode":"2C"}}},"2A":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2B":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2C":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}}}')

});

