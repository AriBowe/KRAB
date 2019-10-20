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
var dateOfDepature = "1/1/1 - placeholder";    // Date the convict died
var currentDay = 0;                         // The current day, as number of days from the start
var currentSavings = [0, 0];                // The player's current savings, as [pounds, shillings] where 20 shillings == one pound
var hasFood = true                         // Does the player have food for the night?
var lastFood = 0                            // How many days ago did the player have food for the night?
var hasHeat = true                         // Does the player have heat for the night? (Firewood)
var lastHeat = 0                            // How many days ago did the player have heat for the night?
var hasJob = false                          // Does the player have a job?
var eventSpeaker = undefined                     // Who is speaking?

// TEMPLATES ARE PROCESSED IN ON READY, AT THE BOTTOM OF THE FILE

function characterSelect() {                // Character selection
    characterSelectElement.appendTo("main")
    for (i = 0; i <= 2; i+=1) {
        var characterOptionWorking = characterOption.clone();
        characterOptionWorking.attr("id", "character" + i)

        var characterName = characterChoices.result.records[i]["Convict Name"];
        try {
            characterName = characterName.split(", ")[1].split(".")[0] + " " + characterName.split(", ")[0];
        }
        catch {
            // Ignore
        }
        var startingMoney = [Math.round(Math.random()*3), Math.round(Math.random()*20)];

        characterOptionWorking.appendTo("#characterSelect");
        
        $("#character" + i + " h2").html(characterName);
        $("#character" + i + " .startingMoney").html("Savings: " + startingMoney[0] + " pence, " + startingMoney[1] + " shillings");
        $("#character" + i + " .choiceButton").attr("onClick", "chooseCharacter(" + i + ", [" + startingMoney + "])");
        console.log("Generated character")
    }
}

function chooseCharacter(number, startingMoney) {
    clearScreen();
    var playerData = characterChoices.result.records[Number(number)];

    // NOTE: Didn't have internet when I wrote these, need to check that the field names are correct
    playerName = playerData["Convict Name"];
    playerName = playerName.split(", ")[1].split(".")[0] + " " + playerName.split(", ")[0];
    console.log(playerName);
    dateOfDepature = playerData["Date of Departure"];
    currentSavings = startingMoney;
    updateValues();

    choicesElement.appendTo("main");

    document.querySelector("#characterName").innerHTML = playerName;

    var choicesSelector = document.querySelector("#choices")
    var content = '<a class="choiceButton" onClick="makeChoice(\'newDay\')">Begin Game</a>';

    choicesSelector.insertAdjacentHTML('beforeend', content);
}

function makeChoice(choiceCode, rawValue = "0p0s", choiceEffect = undefined) {
    console.log(choiceCode);
    if (choiceCode.startsWith("random")) {
        console.log("randomising")
        if (Math.random() < 0.5) {
            choiceCode = choiceCode.split(" ")[1];
        } else {
            choiceCode = choiceCode.split(" ")[2];
        }
    }
    
    if (choiceCode.startsWith("ending")) {
        endOfGame(choiceCode.split(" ")[1]);
        return;
    } else if (choiceCode.startsWith("endOfDay")) {
        applyEffect(choiceEffect);
        endOfDay();
        return;
    } else if (choiceCode.startsWith("newDay")) {
        displayDay();
        return;
    }

    console.log(choiceCode);
    console.log("choiceEffect: " + choiceEffect);
    console.log("stored effect: " + choiceData[choiceCode]);

    applyEffect(choiceEffect);

    clearScreen();

    eventElement.appendTo("main");
    detailsElement.appendTo("#event");
    choicesElement.appendTo("main");

    var eventSelector = document.querySelector("#event > p:first-of-type"); // Selects the event description thing
    var eventDetailsSelector = document.querySelector("#event > #character")
    var choicesSelector = document.querySelector("#choices"); // Selects the choices article

    var eventText = choiceData[choiceCode].flavourText; // Gets flavour text of question
    var choiceOptions = choiceData[choiceCode].choices; // Gets choices of question
    var choicesNumber = (Object.keys(choiceOptions).length); // Gets the number of choices
    if (choiceData[choiceCode].speaker == ":name:") {
        eventSpeaker = playerName + " (self)";
    } else if (choiceData[choiceCode].speaker == ":none:") {
        eventSpeaker = undefined;
    } else {
        eventSpeaker = choiceData[choiceCode].speaker;
    }

    if (eventSpeaker != undefined) {                    // Only triggers is there is a speaker
        eventDetailsSelector.querySelector("h2").innerHTML = eventSpeaker;  // Fills out the speaker details
    } else {
        eventDetailsSelector.remove();
    }

    eventSelector.innerHTML = eventText.toString();     // Fills out the event on the page

    for (i = 1; i <= choicesNumber; i++) {
        var content = '<a class="choiceButton" onClick="makeChoice(\'' + choiceOptions[i].outcomeCode + '\', \'' + choiceOptions[i].choiceValue + '\', \'' + choiceOptions[i].choiceEffect + '\')">' + choiceOptions[i].choiceText + '</a>';
        console.log("Saved effect: " + choiceOptions[i].choiceEffect)
        choicesSelector.insertAdjacentHTML('beforeend', content);
    }

    changeWantedValue(rawValue);

    if (wantedValue[0] !== 0 || wantedValue[1] !== 0) {
        updateValues();
    } 
}

function applyEffect(choiceEffect) {
    console.log("applying effect")
    if (choiceEffect == undefined) {
        return
    } else if (choiceEffect.startsWith("changeSavings")){
        choiceEffect = choiceEffect.split(" ");
        changeSavings(choiceEffect[1]);
        console.log(choiceEffect);
    } else if (choiceEffect.startsWith("gain")){
        choiceEffect = choiceEffect.split(" ");
        window["has" + choiceEffect[1]] = true;
        console.log(choiceEffect);
        console.log("has" + choiceEffect[1])
    } else if (choiceEffect.startsWith("lose")){
        choiceEffect = choiceEffect.split(" ");
        window["has" + choiceEffect[1]] = false;
        console.log(choiceEffect);
        console.log("has" + choiceEffect[1])
    }
}

function clearScreen() {
    try {
        var firstChild = document.querySelector("#choices").firstElementChild;
        while (firstChild) {
            firstChild.remove();
            firstChild = document.querySelector("#choices").firstElementChild;
        }
    } catch (TypeError) {
        // Ignore
    }

    try {
        document.querySelector("#event").remove();
    } catch (TypeError) {
        // Ignore
    }

    try {
        document.querySelector("#endgame").remove();
    } catch (TypeError) {
        // Ignore
    }
    
    try {
        document.querySelector("#choices").remove();
    } catch (TypeError) {
        // Ignore

    }
    try {
        document.querySelector("#endOfDay").remove();
    } catch (TypeError) {
        // Ignore

    }
    try {
        document.querySelector("#characterSelect").remove();
    } catch (TypeError) {
        // Ignore

    }
    try {
        document.querySelector("#majorHeader").remove();
    } catch (TypeError) {
        // Ignore

    }
}

function endOfDay() {
    clearScreen();

    endOfDayElement.appendTo("main")
    choicesElement.appendTo("main")
    
    if (hasFood) {
        var marker = document.querySelector(".Food p:first-of-type");
        var button = document.querySelector(".Food" + " a:first-of-type");

        marker.classList.add("bought");
        marker.innerHTML = "Bought";

        button.innerHTML = 'Sell food';
        button.setAttribute('onClick', "gainMoney('Food', '4p0s')");
    } else {
        var marker = document.querySelector(".Food p:first-of-type");
        var button = document.querySelector(".Food" + " a:first-of-type");

        marker.classList.remove("bought");
        marker.innerHTML = "Not bought";

        button.innerHTML = 'Buy food';
        button.setAttribute('onClick', "spendMoney('Food', '4p0s')");
    }

    if (hasHeat) {
        var marker = document.querySelector(".Heat p:first-of-type");
        var button = document.querySelector(".Heat" + " a:first-of-type");

        marker.classList.add("bought");
        marker.innerHTML = "Bought";

        button.innerHTML = 'Sell heat';
        button.setAttribute('onClick', "gainMoney('Heat', '2p0s')");
    } else {
        var marker = document.querySelector(".Heat p:first-of-type");
        var button = document.querySelector(".Heat" + " a:first-of-type");

        marker.classList.remove("bought");
        marker.innerHTML = "Not bought";

        button.innerHTML = 'Buy heat';
        button.setAttribute('onClick', "spendMoney('Heat', '2p0s')");
    }

    var choicesSelector = document.querySelector("#choices");
    var content = '<a class="choiceButton" onClick="makeChoice(\'newDay\')">Go home</a>';
    choicesSelector.insertAdjacentHTML('beforeend', content);
}

function displayDay() {
    clearScreen();

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

    if (lastFood > 2) {
        endOfGame("food")
    } else if (lastHeat > 3) {
        endOfGame("heat")
    }

    hasFood = false;
    hasHeat = false;

    choicesElement.appendTo("main");

    var dayNotifElement = '<div id="majorHeader"><p>Day ' + currentDay + '</p></div>';
    var choicesSelector = document.querySelector("#choices");
    if (hasJob) {
        var choicesContent = '<a class="choiceButton" onClick="makeChoice(\'1B\', \'0p0s\')">Wake Up</a>';
    } else {
        var choicesContent = '<a class="choiceButton" onClick="makeChoice(\'1A\', \'0p0s\')">Wake Up</a>';
    }

    document.querySelector("main").insertAdjacentHTML('afterbegin', dayNotifElement);
    choicesSelector.insertAdjacentHTML('beforeend', choicesContent);

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

    return [poundValue, shillingValue];
}
    

function changeWantedValue(rawValue) {
    var values = decodeValues(rawValue);

    wantedValue[0] += values[0];
    wantedValue[1] += values[1];
}

function changeSavings(rawValue) {
    if (rawValue.startsWith("random")) {
        var values = [Math.round(Math.random()*3), Math.round(Math.random()*20)];
    } else {
        var values = decodeValues(rawValue);
    }

    while (currentSavings[1] + values[1] < 0) {
        values[0] -= 1;
        values[1] += 20;
    }

    while (currentSavings[1] + values[1] >= 20) {
        values[0] += 1;
        values[1] -= 20;
    }

    currentSavings[0] += values[0];
    currentSavings[1] += values[1];

    updateValues();
}


function updateValues() {
    var dayCountSelector = document.querySelector("#day");
    var wantedSelector = document.querySelector("#wantedValue");
    var savingsSelector = document.querySelector("#savings");

    dayCountSelector.innerHTML = currentDay;
    wantedSelector.innerHTML = wantedValue[0].toString() + " pence, " + wantedValue[1].toString() + " shillings";
    savingsSelector.innerHTML = currentSavings[0].toString() + " pence, " + currentSavings[1].toString() + " shillings";
}

function endOfGame(endingCode) {
    console.log("Ending: " + endingCode);
    clearScreen();

    endingElement.appendTo("main")
    var reason = "An unknown reason"

    if (endingCode == "food") {
        var reason = "You and your family starved to death"
        console.log(1)
    } else if (endingCode == "heat") {
        var reason = "You and your family froze to death"
        console.log(2)
    } else if (endingCode == "police") {
        var reason = "You were caught by the police and shipped to Australia"
        console.log(3)
    }

    var endingHeaderSelector = document.querySelector("#endgame > h2");
    var reasonSelector = document.querySelector("#endgame > #reason");
    var finalSavingsSelector = document.querySelector("#endgame > #finalSavings");
    var finalWantedSelector = document.querySelector("#endgame > #finalWanted");
    var finalDaySelector = document.querySelector("#endgame > #finalDay");

    endingHeaderSelector.innerHTML = "You've been caught!";
    reasonSelector.innerHTML = reason;
    finalSavingsSelector.innerHTML = "Your savings were: " + currentSavings[0] + " pence, and " + currentSavings[1] + " shillings";
    finalWantedSelector.innerHTML = "You were wanted for: " + wantedValue[0] + " pence, and " + wantedValue[1] + " shillings";
    finalDaySelector.innerHTML = "You survived for " + currentDay + " days";
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
    button.setAttribute('onClick', "gainMoney('" + target + "','" + cost + "')");

    updateValues();
}

function gainMoney(target, cost) {
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
        url: "data/new_choices.json",
        dataType: "json",
        success: function(results) {
            window.choiceData = results; // Global variable
        }
    });

    // Load templates
    window.detailsElement = $("#event > *").clone();
    document.querySelector("#event > *").remove(); // Need to remove the inside of eventElement
    document.querySelector("#event > *").remove(); // Otherwise we get BAD errors
    window.eventElement = $("#event").clone();
    window.choicesElement = $("#choices").clone();
    window.endOfDayElement = $("#endOfDay").clone();
    window.endingElement = $("#endgame").clone();

    // We only want one template of character
    document.querySelector(".characterOption").remove();
    document.querySelector(".characterOption").remove();
    window.characterOption = $(".characterOption").clone();

    // Remove the initial templates
    document.querySelector("#event").remove();
    document.querySelector("#choices").remove();
    document.querySelector("#endOfDay").remove();
    document.querySelector(".characterOption").remove();
    document.querySelector("#endgame").remove();
    

    // Need to load characterSelect after removing it's inner options
    window.characterSelectElement = $("#characterSelect").clone();
    document.querySelector("#characterSelect").remove();

    console.log("Removed templates");

    setTimeout(function() {
		console.log(characterChoices);
        characterSelect();;
    }, 1200);
});

