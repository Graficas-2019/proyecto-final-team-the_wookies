  function showCredits() {
    var credits = document.getElementById("credits");
    var menu = document.getElementById("menu");

    if (credits.style.display === "none") {
      credits.style.display = "block";
      menu.style.display = "none";
    } 
    else {
      credits.style.display = "none";
      menu.style.display = "block";
    }
  }

  function showInstructions() {
    var instructions = document.getElementById("instructions");
    var menu = document.getElementById("menu");

    if (instructions.style.display === "none") {
      instructions.style.display = "block";
      menu.style.display = "none";
    } 
    else {
      instructions.style.display = "none";
      menu.style.display = "block";
    }
  }

  function showScores() {
    var scores = document.getElementById("high-scores");
    var menu = document.getElementById("menu");

    if (scores.style.display === "none") {
      scores.style.display = "block";
      menu.style.display = "none";
      high_scores = document.getElementById("scores");
      HighScores();
    } 
    else {
      scores.style.display = "none";
      menu.style.display = "block";
    }
  }

   function backtoMenu() {
    var credits = document.getElementById("credits");
    var instructions = document.getElementById("instructions");
    var scores = document.getElementById("high-scores");
    var menu = document.getElementById("menu");

    if (menu.style.display === "none") {
      menu.style.display = "block";

      instructions.style.display = "none";
      scores.style.display = "none";
      credits.style.display = "none";
    } 
    else {
      menu.style.display = "none";
      instructions.style.display = "block";
      scores.style.display = "block";
      credits.style.display = "block";
    }
  }