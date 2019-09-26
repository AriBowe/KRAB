<?php 

include 'header.php';
include 'sidebar.php';

?>
<div id="statusBar">
    <p id="characterName">Test McTest</p>
    <p id="day">1</p>
    <p id="savings">10p, 2s</p>
    <p id="wantedvalue">Not Wanted</p>
</div>
<main>
    <article id="event">
        <div>   
            <img src="Images/no_profile.jpg" alt="">
            <h2>Character Name</h2>
        </div>
        <p>You're a poor Englishman in the 19th century. Click the buttons below to make decisions and go about your day.</p>
    </article>
    <article id="choices">
        <a class="choiceButton" onClick="makeChoice('1A')">Wake up</a>
    </article>
</main>

<?php 

include 'footer.php';

?>