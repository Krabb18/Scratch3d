import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';
import { GLTFLoader } from 'https://unpkg.com/three@0.178.0/examples/jsm/loaders/GLTFLoader.js?module';
import { sayHelloTest } from './blockyfuncs.js';
import { moveAxis } from './blockyfuncs.js';
import { playSound } from './blockyfuncs.js';
import { changeAnimation } from './blockyfuncs.js';

//here function to create new Workspace
let selectedObjectIndex = "Model0";

export function getSelectedObjectIndex()
{
    return selectedObjectIndex;
}

export function createNewWorkSpace(gameObject, gameObjectsList, Blockly)
{
    const newDiv = document.createElement('div');
    newDiv.id = gameObject.name; //die id ist die slebe wie der name vom gameobecjt was gescripted wird
    newDiv.style.width = "1200px";
    newDiv.style.height = "1000px";
    newDiv.style.border = "1px solid black";
    newDiv.style.position = 'absolute';
    newDiv.style.left = '0px';
    newDiv.style.top = '100px';
    document.body.appendChild(newDiv);


    const workspaceInst = Blockly.inject(newDiv.id, {
        toolbox: document.getElementById('toolbox')
    });
    gameObject.workSpace = workspaceInst;

    //hier ein ausählbutton für as gameobject
    const container = document.getElementById("buttonContainer");
    const button = document.createElement("button");
    button.textContent = newDiv.id;
    button.style.margin = "5px";

    button.addEventListener("click", () =>{

        for (let [key, value] of gameObjectsList) {
            //console.log(key + " is " + value);
            document.getElementById(key).style.display = 'none';
        }

        document.getElementById(newDiv.id).style.display = 'block';
        console.log("Button gedrückt")
        selectedObjectIndex = gameObject.name;
    });

    container.appendChild(button);
}


class AssetContainer
{
    constructor(listener)
    {
        this.musicFiles = new Map();
        this.listener = listener;
    }

    addFile(file, type)
    {
        if(type == "Music")
        {
            const objectURL = URL.createObjectURL(file);
            this.musicFiles.set(file.name, objectURL);
            console.log("Added: ", file.name);
        }
    }
}
export{AssetContainer}


class GameObject
{
    constructor(scene, gameObjectsList, assetConatiner)
    {
        this.name = "Empty";

        this.positionX = 0.0;
        this.positionY = 0.0;
        this.positionZ = 0.0;

        this.rotationX = 0.0;
        this.rotationY = 0.0;
        this.rotationZ = 0.0;

        this.scaleX = 0.0;
        this.scaleY = 0.0;
        this.scaleZ = 0.0;


        this.workSpace = null;
        this.currentKey = 'None';
        this.started = false;

        this.gameObjectsList = gameObjectsList;
        this.assetConatiner = assetConatiner;

        this.audioLoader = new THREE.AudioLoader();
        this.sound = new THREE.Audio(assetConatiner.listener);
        this.scene = scene;

        //nachher noch scale usw
    }

    update()
    {
        console.log("was geht original");
    }

    playmodeInit()
    {
        console.log("Playmode original");
    }

    playmodeDeInit()
    {
        console.log("Playmode deinit original");
    }

    testcode()
    {
        const code = Blockly.JavaScript.workspaceToCode(this.workSpace);
        eval(code);
    }
}
export{GameObject}


class ModelObject extends GameObject
{
    constructor(scene, gameObjectsList, assetConatiner, modelPath)
    {
        super(scene, gameObjectsList, assetConatiner);

        this.loader = new GLTFLoader();
        //this.model;
        this.animator;
        this.loader.load(
            modelPath,
            (gltf) =>
            {
                this.gltf = gltf;
                this.model = gltf.scene;
                this.model.position.set(0, 0, 0);
                this.model.scale.set(1, 1, 1);

                this.modelMatSafe = this.model.matrix.clone();

                this.animator = new THREE.AnimationMixer(this.model);
                const action = this.animator.clipAction(gltf.animations[0]);
                action.play();

                this.scene.add(this.model);
            },
            undefined,
            function(error)
            {
                console.log("Fehler beim laden", error);
            }
        )

        //this.scene.add(this.cube);

    }

    playmodeInit()
    {
        this.modelMatSafe = this.model.matrix.clone();

        this.positionX = this.model.position.x;
        this.positionY = this.model.position.y;
        this.positionZ = this.model.position.z;

        this.rotationX = this.model.rotation.x;
        this.rotationY = this.model.rotation.y;
        this.rotationZ = this.model.rotation.z;

        this.scaleX = this.model.scale.x;
        this.scaleY = this.model.scale.y;
        this.scaleZ = this.model.scale.z;
    }

    playmodeDeInit()
    {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        this.modelMatSafe.decompose(position, quaternion, scale);
        this.model.position.copy(position);
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        this.model.rotation.copy(rotation);
        this.model.scale.copy(scale);
    }

    update()
    {
        this.model.position.x = this.positionX;
        this.model.position.y = this.positionY;
        this.model.position.z = this.positionZ;

        if(this.animator)
        {
            this.animator.update(1.0/60.0);   
        }

        console.log("was geht model");
    }
}
export{ModelObject}


class CubeObject extends GameObject
{
    constructor(scene, gameObjectsList, assetConatiner)
    {
        super(scene, gameObjectsList, assetConatiner);

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);

        this.scene.add(this.cube);

        this.modelMatSafe = this.cube.matrix.clone();
    }
    
    playmodeInit()
    {
        this.modelMatSafe = this.cube.matrix.clone();

        this.positionX = this.cube.position.x;
        this.positionY = this.cube.position.y;
        this.positionZ = this.cube.position.z;

        this.rotationX = this.cube.rotation.x;
        this.rotationY = this.cube.rotation.y;
        this.rotationZ = this.cube.rotation.z;

        this.scaleX = this.cube.scale.x;
        this.scaleY = this.cube.scale.y;
        this.scaleZ = this.cube.scale.z;
    }

    playmodeDeInit()
    {
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        this.modelMatSafe.decompose(position, quaternion, scale);
        this.cube.position.copy(position);
        const rotation = new THREE.Euler().setFromQuaternion(quaternion);
        this.cube.rotation.copy(rotation);
        this.cube.scale.copy(scale);
    }

    update()
    {
        this.cube.position.x = this.positionX;
        this.cube.position.y = this.positionY;
        this.cube.position.z = this.positionZ;
        console.log("was geht");
        //hier wird nachher der javascritp code ausgeführt von blocky
    }
}

export{CubeObject}

