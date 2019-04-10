function HighScores() {
    if(typeof(Storage)!=="undefined"){
        var scores = false;
        if(localStorage["high-scores"]) {
            high_scores.style.display = "block";
            high_scores.innerHTML = '';
            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort(function(a,b){return parseInt(b)-parseInt(a)});

            for(var i = 0; i < 5; i++){
                var s = scores[i];

                if (i == 0){
                    var h = document.createElement("h2");
                    var t = document.createTextNode("Score");
                    h.appendChild(t);
                    high_scores.appendChild(h);       
                }                        
                var fragment = document.createElement('p');
                fragment.innerHTML = (typeof(s) != "undefined" ? s : "" );
                high_scores.appendChild(fragment);
            }
        }
    } else {
        high_scores.style.display = "none";
    }
}

function UpdateScores() {
    if(typeof(Storage)!=="undefined"){
        var current = parseInt(score);
        var scores = false;
        if(localStorage["high-scores"]) {

            scores = JSON.parse(localStorage["high-scores"]);
            scores = scores.sort(function(a,b){return parseInt(b)-parseInt(a)});
            
            for(var i = 0; i < 5; i++){
                var s = parseInt(scores[i]);
                
                var val = (!isNaN(s) ? s : 0 );
                if(current > val)
                {
                    val = current;
                    scores.splice(i, 0, parseInt(current));
                    break;
                }
            }
            
            scores.length = 5;                                
            localStorage["high-scores"] = JSON.stringify(scores);

        } else {                        
            var scores = new Array();
            scores[0] = current;
            localStorage["high-scores"] = JSON.stringify(scores);
        }
        
        HighScores();
    } 
}