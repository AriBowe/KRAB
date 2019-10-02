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
        <a class="choiceButton" onClick="makeChoice('newDay')">Begin game</a>
    </div>
    <div class="endOfDay hidden">
        <div class="purchase food">
            <a class="choiceButton" onClick="spendMoney('food','4p')">Buy food</a>
            <p>Not bought</p>
        </div>
        <div class="purchase heat">
            <a class="choiceButton" onClick="spendMoney('heat','2p')">Buy firewood</a>
            <p>Not bought</p>
        </div>
    </div> 
</main>

<?php 

include 'footer.php';

?>