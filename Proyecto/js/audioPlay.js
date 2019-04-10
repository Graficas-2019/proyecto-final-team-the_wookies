function loadAudio(name,src)
{
    sounds[name] = new Audio(src);
}

function playAudio(name,loop)
{
    const playPromise = sounds[name].play();
    if (playPromise !== null){
        playPromise.catch(() => { sounds[name].play(); })
    }
    if(loop)
    {
        sounds[name].onended = function() 
        {
            sounds[name].play();
        };
    }

}