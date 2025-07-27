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