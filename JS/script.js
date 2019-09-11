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

function makeChoice(choiceCode) {
    console.log(choiceData);

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
        console.log(i)
        console.log(choiceOptions[i]);

        var content = '<a class="choiceButton" onClick="makeChoice(\'' + choiceOptions[i].outcomeCode + '\')">' + choiceOptions[i].choiceText + '</a>';
        console.log(content)
        choicesElement.insertAdjacentHTML('beforeend', content);
    }

    // for (choice in choiceOptions) { // Creates choice buttons
    //     console.log(choice);
        
    //     var content = '<a class="choiceButton" onClick="makeChoice(\'' + choice.outcomeCode + '\')">' + choiceData[choiceCode].choices.choiceText + '</a>';
    //     choicesElement.insertAdjacentHTML('beforeend', content);
    // }
}

$(document).ready(function() {

    var convictDataSearch = {
        resource_id: "dbcfa4a6-3ec7-4264-bcee-43b21a470d34",
        limit: 100
    }

    $.ajax({
        url: "https://data.qld.gov.au/api/3/action/datastore_search",
        data: convictDataSearch,
        dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise it'll be blocked due to cross-site scripting).
        cache: true,
        success: function(results) {
            window.convictData = results; // Global variable
        }
    });

    $.ajax({
        url: "data/exampleChoices.json",
        dataType: "json",
        success: function(results) {
            window.choiceData = results; // Global variable
        }
    });

    // window.choiceData = JSON.parse('{"1A":{"flavourText":"What do","choices":{"1":{"choiceText":"Nothing","outcomeCode":"2A"},"2":{"choiceText":"Something","outcomeCode":"2B"},"3":{"choiceText":"Everything","outcomeCode":"2C"}}},"2A":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2B":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}},"2C":{"flavourText":"","choices":{"1":{"choiceText":"","outcomeCode":""},"2":{"choiceText":"","outcomeCode":""},"3":{"choiceText":"","outcomeCode":""}}}}')

});