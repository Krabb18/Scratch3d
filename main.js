import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js?module';
import { OrbitControls } from 'https://unpkg.com/three@0.178.0/examples/jsm/controls/OrbitControls.js?module';
import { CubeObject } from './objects.js';
import { createNewWorkSpace } from './objects.js';



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

    //hier ist noch ein fehler
    Blockly.JavaScript['say_hello'] = function(block) 
    {
    const message = Blockly.JavaScript.valueToCode(block, 'MESSAGE', Blockly.JavaScript.ORDER_ATOMIC) || '""';
    const times = Blockly.JavaScript.valueToCode(block, 'TIMES', Blockly.JavaScript.ORDER_ATOMIC) || '100';
    return `sayHelloTest(${times}, ${message});\n`;
    };

    console.log('say_hello Block definiert:', Blockly.Blocks['say_hello']);
    console.log('say_hello Generator definiert:', Blockly.JavaScript['say_hello'].toString());
}

defineCustomBlocks();


const gameObjectsList = new Map();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 100.0);
const renderer = new THREE.WebGLRenderer({antialias: true});

//renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(1000, 600);
document.getElementById('myCanvasContainer').appendChild(renderer.domElement);


let cube = new CubeObject(scene);
cube.name = "Object1";
cube.positionX = 1.0;
gameObjectsList.set(cube.name, cube);

createNewWorkSpace(cube, gameObjectsList, Blockly);

camera.position.z = 5;


const btn = document.getElementById("testbtn");
btn.addEventListener("click", () =>{
cube.testcode(Blockly);

});

function update()
{
    cube.update();
    renderer.render(scene, camera);
    requestAnimationFrame(update);    
}

update();