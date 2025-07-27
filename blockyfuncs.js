import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';

const allSounds = [];

export function sayHelloTest(times, message)
{
    for(let i = 0; i<times; i++)
    {
        console.log(message);
    }
}

export function moveAxis(axis, num, gameObjects, name)
{
    if(axis == "X")
    {
        gameObjects.get(name).positionX += num;
    }
    else if(axis == "Y")
    {
        gameObjects.get(name).positionY += num;
    }
    else if(axis == "Z")
    {
        gameObjects.get(name).positionZ += num;
    }
    console.log("HAT GEKLAPPT VIELLECIHT");
}

export function playSound(audioLoader, listener, soundFile, sound)
{
    allSounds.push(sound);
    audioLoader.load(soundFile, (buffer) =>{
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.5);
        sound.play();
    });
}


export function changeAnimation(animator, gltf, index)
{
    const action = animator.clipAction(gltf.animations[index]);
    action.play();
    console.log("HAT GEKLAPPT ANIMATION CHANGE");
}


let currentKey = 'None';

document.addEventListener('keydown', function(event) {
    currentKey = event.key;
});

document.addEventListener('keyup', function(event) {
    currentKey = 'None';
});

export function getCurrentKey()
{
   return currentKey;
}