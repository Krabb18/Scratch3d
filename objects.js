import * as THREE from 'https://unpkg.com/three@0.178.0/build/three.module.js?module';
import { sayHelloTest } from './blockyfuncs.js';
import { moveAxis } from './blockyfuncs.js';

//here function to create new Workspace
export function createNewWorkSpace(gameObject, gameObjectsList)
{
    const newDiv = document.createElement('div');
    newDiv.id = gameObject.name; //die id ist die slebe wie der name vom gameobecjt was gescripted wird
    newDiv.style.width = "1000px";
    newDiv.style.height = "800px";
    newDiv.style.border = "1px solid black";
    newDiv.style.marginTop = "10px";

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

    });

    container.appendChild(button);
}



class GameObject
{
    constructor()
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

class CubeObject extends GameObject
{
    constructor(scene, gameObjectsList)
    {
        super();

        this.geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.cube = new THREE.Mesh(this.geometry, this.material);
        scene.add(this.cube);

        this.gameObjectsList = gameObjectsList;
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

