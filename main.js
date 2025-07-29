import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js?module';
import { TransformControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/TransformControls.js?module';

import { CubeObject, ModelObject } from './objects.js';
import { AssetContainer } from './objects.js';

import { createNewWorkSpace } from './objects.js';
import { getCurrentKey } from './blockyfuncs.js';

import { getSelectedObjectIndex } from './objects.js';

let playMode = false;
let selectedObjectIndex = "Model0";

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


    Blockly.Blocks['changeAnimation'] = {
        init: function()
        {
            this.appendValueInput("INDEX")
            .setCheck("Number")
            .appendField("changeAnimation");

            this.setColour(160);
            this.setTooltip("'ndert animation");
            this.setHelpUrl("");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    }

    Blockly.Blocks['playSound'] = {
        init: function()
        {
            this.appendValueInput("SOUNDFILE")
            .setCheck("String")
            .appendField("playsound");

            this.setColour(160);
            this.setTooltip("Spielt sound ab");
            this.setHelpUrl("");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
        }
    }


    Blockly.Blocks['stopSound'] = {
        init: function()
        {
            this.appendValueInput("SOUNDFILE")
            .setCheck("String")
            .appendField("stopsound");

            this.setColour(160);
            this.setTooltip("Spielt sound ab");
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

    Blockly.Blocks['started'] = 
    {
        init: function()
        {
            this.appendDummyInput()
            .appendField("started");
            this.setOutput(true, "Boolean");
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

    Blockly.JavaScript['started'] = function(block) 
    {
    return ["this.started", Blockly.JavaScript.ORDER_ATOMIC]
    };

    Blockly.JavaScript['moveX'] = function(block)
    {
        const name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        const axis = Blockly.JavaScript.valueToCode(block, 'AXIS', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        const val = Blockly.JavaScript.valueToCode(block, 'move', Blockly.JavaScript.ORDER_ATOMIC) || '100';
        return `moveAxis(${axis}, ${val}, this.gameObjectsList, ${name})\n`;
    }

    Blockly.JavaScript['playSound'] = function(block)
    {
        const soundFile = Blockly.JavaScript.valueToCode(block, 'SOUNDFILE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        return `playSound(this.audioLoader, this.assetConatiner.listener, this.assetConatiner.musicFiles.get(${soundFile}), this.sound);\n`;
    }

    Blockly.JavaScript['stopSound'] = function(block)
    {
        const soundFile = Blockly.JavaScript.valueToCode(block, 'SOUNDFILE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
        return `this.sound.stop();\n`;
    }

    Blockly.JavaScript['changeAnimation'] = function(block)
    {
       const index = Blockly.JavaScript.valueToCode(block, 'INDEX', Blockly.JavaScript.ORDER_ATOMIC) || '100';
       return `changeAnimation(this.animator, this.gltf, ${index});\n`;
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

const listener = new THREE.AudioListener();
camera.add( listener );

const light = new THREE.DirectionalLight(0xffffff, 10);
light.position.set(20,20,20)
scene.add(light);


const assetContainer = new AssetContainer(listener);


//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(1000, 600);
document.getElementById('myCanvasContainer').appendChild(renderer.domElement);


/*
let cube = new ModelObject(scene, gameObjectsList, assetContainer, "models/bird2/scene.gltf");
cube.name = "Object1";
cube.positionX = 1.0;
gameObjectsList.set(cube.name, cube);

createNewWorkSpace(cube, gameObjectsList, Blockly);
*/
camera.position.z = 5;


//gizmos test
const transformControls = new TransformControls(camera, renderer.domElement);
//transformControls.attach(cube.model);
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


let loadNumber = 0;
function openFileDialog() {
  loadNumber = 0;
  document.getElementById('fileInput').click();
  console.log("jdfksd");
}

function openFileDialogWav()
{
    loadNumber = 1;
    document.getElementById('fileInput').click();
    console.log("Wav clicked");
}

function openFileDialogModel()
{
    loadNumber = 2;
    document.getElementById('fileInputModel').click();
    console.log("model clicked");
}

const addCubeButton = document.getElementById("addCube");
addCubeButton.addEventListener("click", ()=>{
    let cubeInst = new CubeObject(scene, gameObjectsList, assetContainer);
    cubeInst.name = "Cube" + gameObjectsList.size.toString();
    gameObjectsList.set(cubeInst.name, cubeInst);

    createNewWorkSpace(cubeInst, gameObjectsList, Blockly);

});


document.getElementById('backgroundButton').addEventListener('click', openFileDialog);
document.getElementById('assetButtonWav').addEventListener('click', openFileDialogWav);
document.getElementById('addModel').addEventListener('click', openFileDialogModel);

document.getElementById('fileInput').addEventListener('change', function(event) 
{
    const files = event.target.files;
    for(const file of files)
    {
        if(loadNumber == 0)
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
        else if(loadNumber == 1)
        {
            console.log(file.name);
            assetContainer.addFile(file, "Music");
        }
    }
});


document.getElementById("fileInputModel").addEventListener('change', function(event){

    const file = event.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    let modelInst = new ModelObject(scene, gameObjectsList, assetContainer, url);
    modelInst.name = "Model" + gameObjectsList.size.toString();
    gameObjectsList.set(modelInst.name, modelInst);

    createNewWorkSpace(modelInst, gameObjectsList, Blockly, selectedObjectIndex);

});


transformControls.addEventListener('dragging-changed', function(event) {
    controls.enabled = !event.value;
});

function update()
{
    let selectedObjectIndex = getSelectedObjectIndex();
    if(playMode)
    {
        for (const [key, obj] of gameObjectsList) {
            obj.testcode();
            obj.update();

            let key = getCurrentKey();
            obj.currentKey = key;
            obj.started = true;
        }


        transformControls.getHelper().enabled = false;
        transformControls.getHelper().visible = false;

    }
    else
    {

        for (const [key, obj] of gameObjectsList) {
            obj.started = false;
            obj.currentKey = 'None';
            obj.sound.stop();
        }


        if(gameObjectsList.has(selectedObjectIndex))
        {
            if(gameObjectsList.get(selectedObjectIndex) instanceof ModelObject){transformControls.attach(gameObjectsList.get(selectedObjectIndex).model); console.log("Model");}
            else if(gameObjectsList.get(selectedObjectIndex) instanceof CubeObject){transformControls.attach(gameObjectsList.get(selectedObjectIndex).cube); console.log("Cube");}
            
        }

        transformControls.getHelper().enabled = true;
        transformControls.getHelper().visible = true;
        transformControls.update();

        controls.update();
    }

    renderer.render(scene, camera);
    requestAnimationFrame(update);    
}

update();