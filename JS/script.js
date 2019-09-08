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