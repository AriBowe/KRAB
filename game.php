<?php 

include 'header.php';
include 'sidebar.php';
include 'statusbar.php';

?>
<main>
    <div id="event">
        <div>   
            <img src="Images/no_profile.jpg" alt="">
            <h2>Character Name</h2>
        </div>
        <p>You're a poor Englishman in the 19th century. Click the buttons below to make decisions and go about your day.</p>
    </div>
    <div id="choices">
    </div>
    <div id="endOfDay">
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
            <h2 class="characterName"></h2>
            <img class="characterImage" src="">
            <p class="startingMoney"></p>
            <a class="choiceButton" onClick="chooseCharacter()"></a>
        </div>
    </div>
</main>

<?php 

include 'footer.php';

?>