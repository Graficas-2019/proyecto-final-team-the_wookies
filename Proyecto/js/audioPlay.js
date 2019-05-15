function loadAudio(name, src, volume)
{
    sounds[name] = new Audio(src);
    sounds[name].volume = volume;
}

function playAudio(name, loop)
{
    const playPromise = sounds[name].play();
    if (playPromise !== null){
        playPromise.catch(() => { 
        	sounds[name].play(); 
        })
    }
    
    if(loop)
    {
        sounds[name].onended = function() 
        {
            sounds[name].play();
        };
    }

}

function stopAudio(name)
{
	sounds[name].pause();
	sounds[name].currentTime = 0;
}



function playBeatSounds(src){
	var audio = document.createElement("audio");
	audio.src = src;
	audio.play();
	audio.currentTime = 0;
}