import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js?module';

import { TransformControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/TransformControls.js?module';

import { CubeObject } from './objects.js';
import { createNewWorkSpace } from './objects.js';
import { getCurrentKey } from './blockyfuncs.js';

let playMode = false;

function defineCustomBlocks()
{
if (typeof Blockly === 'undefined') {
        console.error('Blockly ist noch nicht geladen!');
        return;
    }

    Blockly.Blocks['say_hello'] = {
        init: function()
        {
            this.appendValueInput("MESSAGE")
            .setCheck("String")
            .appendField("message");

            this.appendValueInput("TIMES")
            .setCheck("Number")
            .appendField("times");


            this.setColour(160);
            this.setTooltip("Gibt 'Hallo Welt' in der Konsole aus.");
            this.setHelpUrl("");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    }

    Blockly.Blocks['moveX'] = {
        init: function()
        {
            this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("name");

            this.appendValueInput("AXIS")
            .setCheck("String")
            .appendField("axis");

            this.appendValueInput("move")
            .setCheck("Number")
            .appendField("move");


            this.setColour(160);
            this.setTooltip("Bewegt das ding");
            this.setHelpUrl("");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }

    }

    Blockly.Blocks['button'] = 
    {
        init: function()
        {
            this.appendValueInput("BUTTON")
            .setCheck("String")
            .appendField("button");

            this.setOutput(true, "String"); // gibt einen String-Wert zurück
            this.setColour(230);
            this.setTooltip("Stellt die Taste A als festen Wert dar.");
            this.setHelpUrl("");
        }
    }

    Blockly.Blocks['currentPressedKey'] = 
    {
        init: function()
        {
            this.appendDummyInput()
            .appendField("currentPressedKey");
            this.setOutput(true, "String");
            this.setColour(230);
            this.setTooltip("Stellt die Taste A als festen Wert dar.");
            this.setHelpUrl("");
        }
    }

    //hier ist noch ein fehler
    Blockly.JavaScript['say_hello'] = function(block) 
    {
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const times = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ATOMIC) || '100';
    return `sayHelloTest(${times}, ${message});\n`;
    };

    Blockly.JavaScript['moveX'] = function(block)
    {
        const name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        const axis = Blockly.JavaScript.valueToCode(block, 'AXIS', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        const val = Blockly.JavaScript.valueToCode(block, 'move', Blockly.JavaScript.ORDER_ATOMIC) || '100';
        return `moveAxis(${axis}, ${val}, this.gameObjectsList, ${name})\n`;
    }

    Blockly.JavaScript['button'] = function(block)
    {
       const button = Blockly.JavaScript.valueToCode(block, 'BUTTON', Blockly.JavaScript.ORDER_ATOMIC) || '""';
       return [button, Blockly.JavaScript.ORDER_ATOMIC];
    }

    Blockly.JavaScript['currentPressedKey'] = function(block)
    {
        return ["this.currentKey", Blockly.JavaScript.ORDER_ATOMIC]
    }

    //console.log('say_hello Block definiert:', Blockly.Blocks['say_hello']);
    //console.log('say_hello Generator definiert:', Blockly.JavaScript['say_hello'].toString());
}

defineCustomBlocks();


const gameObjectsList = new Map();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100.0);
const renderer = new THREE.WebGLRenderer({antialias: true});
const controls = new OrbitControls(camera, renderer.domElement);

//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(1000, 600);
document.getElementById('myCanvasContainer').appendChild(renderer.domElement);


let cube = new CubeObject(scene, gameObjectsList);
cube.name = "Object1";
cube.positionX = 1.0;
gameObjectsList.set(cube.name, cube);

createNewWorkSpace(cube, gameObjectsList, Blockly);

camera.position.z = 5;


//gizmos test
const transformControls = new TransformControls(camera, renderer.domElement);
transformControls.attach(cube.cube);
//transformControls.setMode('scale');
//transformControls.setSize(0.8);
scene.add(transformControls.getHelper());



//paar buttons
const btn = document.getElementById("testbtn");
btn.addEventListener("click", () =>{
cube.testcode(Blockly);

});


const playButton = document.getElementById("playButton");
playButton.addEventListener("click", () =>{

    if(!playMode)
    {
        for (const [key, value] of gameObjectsList.entries()) 
        {
            //console.log(key, value);
            value.playmodeInit();
        }
        playMode = true;
    }
    else
    {
        for (const [key, value] of gameObjectsList.entries()) 
        {
            //console.log(key, value);
            value.playmodeDeInit();
        }
        playMode = false;
    }

});


function openFileDialog() {
  document.getElementById('fileInput').click();
  console.log("jdfksd");
}

document.getElementById('backgroundButton').addEventListener('click', openFileDialog);
document.getElementById('fileInput').addEventListener('change', function(event) 
{
    const files = event.target.files;
    for(const file of files)
    {
        const texloader = new THREE.TextureLoader();
        const reader = new FileReader();

        reader.onload = function(event)
        {
            const imageUrl = event.target.result;
            console.log(imageUrl);

            texloader.load(imageUrl, function(texture) {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            });
        }

        reader.readAsDataURL(file);
    }
});


transformControls.addEventListener('dragging-changed', function(event) {
    controls.enabled = !event.value;
});

function update()
{
    if(playMode)
    {
        cube.testcode();
        cube.update();

        let key = getCurrentKey();
        cube.currentKey = key;

        transformControls.getHelper().enabled = false;
        transformControls.getHelper().visible = false;
    }
    else
    {
        cube.currentKey = 'None';

        transformControls.getHelper().enabled = true;
        transformControls.getHelper().visible = true;
        transformControls.update();

        controls.update();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(update);    
}

update();