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
    $.ajax({
		url: "choices_data.blahblahblah ADD SQL HERE",
		data: data,
		dataType: "jsonp", // We use "jsonp" to ensure AJAX works correctly locally (otherwise it'll be blocked due to cross-site scripting).
		cache: true,
		success: function(results) {
			fillForm(results, choiceCode);
		}
	});
}

function fillForm(results, choiceCode) {
    console.log(results);

    var eventTextTemplate = document.querySelector("#event > p:first-of-type");
    var eventChoiceTemplate = document.getElementsByClassName("choiceButton");

    var eventText = records.choiceCode["flavourText"];
    // $.each(results.choiceCode.choices, function(choiceNumber, choiceOutcomeCode) {
    //     var recordTitle = recordValue["dc:title"];
	// 	var recordYear = getYear(recordValue["dcterms:temporal"]);
	// 	var recordImage = recordValue["150_pixel_jpg"];
	// 	var recordDescription = recordValue["dc:description"];

	// 	if(recordTitle && recordYear && recordImage && recordDescription) {

	// 		var clonedRecordTemplate = recordTemplate.clone();
	// 		clonedRecordTemplate.attr("id", "record-" + recordID).removeClass("record-template");
	// 		clonedRecordTemplate.appendTo("#records");

	// 		$("#record-" + recordID + " h2").html(recordTitle);
	// 		$("#record-" + recordID + " .year").html(recordYear);
	// 		$("#record-" + recordID + " .description").html(recordDescription);
	// 		$("#record-" + recordID + " img").attr("src", recordImage);

	// 	}

    // }); TODO: THIS SHIT

}