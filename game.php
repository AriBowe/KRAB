<?php 

include 'header.php';
include 'sidebar.php';
include 'statusbar.php';

?>
<main>
    <div id="event">
        <div id="character">   
            <h2>Character Name</h2>
        </div>
        <p>You're a poor Englishman in the 19th century. Click the buttons below to make decisions and go about your day.</p>
    </div>
    <div id="choices">
    </div>
    <div id="endOfDay">
        <h2>You can survive 2 days in a row without food, and 3 in a row without heat</h2>
        <div class="purchase Food">
            <a class="choiceButton" onClick="spendMoney('Food','4p')">Buy food</a>
            <p>Not bought</p>
        </div>
        <div class="purchase Heat">
            <a class="choiceButton" onClick="spendMoney('Heat','2p')">Buy firewood</a>
            <p>Not bought</p>
        </div>
    </div> 
    <div id="characterSelect">
        <div class="characterOption">
            <h2 class="characterName">Bob Bobbings</h2>
            <p class="startingMoney">Savings: 2 pounds, 3 shillings</p>
            <a class="choiceButton" onClick="chooseCharacter()">Select</a>
        </div>
        <div class="characterOption">
            <h2 class="characterName">Bob Bobbings</h2>
            <p class="startingMoney">Savings: 2 pounds, 3 shillings</p>
            <a class="choiceButton" onClick="chooseCharacter()">Select</a>
        </div>
        <div class="characterOption">
            <h2 class="characterName">Bob Bobbings</h2>
            <p class="startingMoney">Savings: 2 pounds, 3 shillings</p>
            <a class="choiceButton" onClick="chooseCharacter()">Select</a>
        </div>
    </div>
    <div id="endgame">
        <h2></h2>
        <p id="reason"></p>
        <p id="finalSavings"></p>
        <p id="finalWanted"></p>
        <p id="finalDay"></p>
        <p><strong>Please visit the museum staff to collect your ticket of leave</strong></p>
    </div>
</main>

<?php 

include 'footer.php';

?>