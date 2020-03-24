const imageLocation = document.getElementById('imageLocation');
const myInput = document.getElementById('myInput');
const myOptions = document.getElementById('possibilities');
const inv = document.getElementById('inv');
const ErrorMSG = document.getElementById("error");
const DescMSG = document.getElementById("beschrijving");


let inventory = [];

setInterval(update, 1)

class room {
    constructor(options, imagePath, items, requiredItem, description = "") {
        this.options = options;
        this.image = imagePath;
        this.items = items;
        this.requiredItem = requiredItem;
        this.beschrijving = description;
    }
}


// 3d array
let grid = [
    [
        ["1", "7", "2"],
        ["4"], // Floor 0
        ["3", "5", "6"]
    ],
    [
        ["10", "11", "12"],
        ["13", "14", "15"],  // FLoor 1
        ["16", "17", "18"]
    ],
];

let rooms = [];

rooms[1] = new room(["omlaag", "oost"], "media/room1.jpg", [], "", "gang");
rooms[2] = new room(["west"], "media/room3.jpg", ["keycard"], "", "er is / was hier een Keycard!");
rooms[3] = new room(["omhoog", "oost"], "media/room7.jpg", [], "keycard", "aula/uitgang");
rooms[4] = new room(["omhoog", "omlaag"], "media/room4.jpg", [], "", "trap");
rooms[5] = new room(["west", "oost"], "media/room5.jpg", [], "", "kantine");
rooms[6] = new room(["west"], "media/room6.jpg", [], "", "toiletten");
rooms[7] = new room(["west", "oost"], "media/room2.jpg", [], "", "lokaal");



let currentX = 0;
let currentY = 0;
let currentZ = 0;

function getPlayerRoom() {
    return grid[currentX][currentY][currentZ];
}

function update() {
    //update the image
    imageLocation.src = rooms[getPlayerRoom()].image;

    // update options text
    let optionsMSG = "";
    for (let i = 0; i < rooms[getPlayerRoom()].options.length; i++) {
        optionsMSG += "<li>" + rooms[getPlayerRoom()].options[i] + "</li>"
    }

    if (rooms[getPlayerRoom()].items.length != 0) {
        optionsMSG += "pak ";
    }

    DescMSG.innerHTML = rooms[getPlayerRoom()].beschrijving;

    myOptions.innerHTML = optionsMSG;

    // update inventory
    let items = "";
    for (let i = 0; i < inventory.length; i++) {
        items += "<li>" + inventory[i] + "</li>";
        if (i + 1 < inventory.length) {
            items += " - "
        }
    }

    inv.innerHTML = items;
}

myInput.addEventListener('keydown', getInput, false);

function getInput(e) {
    if (e.key == "Enter") {
        let inputArray = myInput.value.split(" ");

        let isOption = false;
        for (let i = 0; i < rooms[getPlayerRoom()].options.length; i++) {
            if (rooms[getPlayerRoom()].options[i] == inputArray[0]) {
                isOption = true;
            }
        }

        if (rooms[getPlayerRoom()].items.length != 0) {
            if (inputArray[0] === "pak") {
                isOption = true;
            }
        }

        let newY = currentY;
        let newX = currentX;
        let newZ = currentZ;

        if (isOption) {
            console.log("true")
            switch (inputArray[0]) {
                case "omlaag":
                    newY += 1;
                    break;
                case "oost":
                    newZ += 1;
                    break;
                case "west":
                    newZ -= 1;
                    break;
                case "omhoog":
                    newY -= 1;
                    break;
                case "floordown":
                    newX -= 1;
                    break;
                case "floorup":
                    newX += 1;
                    break;
                case "pak":
                    let item = Math.floor(Math.random() * rooms[getPlayerRoom()].items.length);
                    inventory.push(rooms[getPlayerRoom()].items[item]);
                    rooms[getPlayerRoom()].items = rooms[getPlayerRoom()].items.filter(el => el !== rooms[getPlayerRoom()].items[item]);
                    break;
            }
        } else {
            errorMSG("is dit wel een optie?");
        }

        if (rooms[grid[newX][newY][newZ]].requiredItem != "") {
            if (!(inventory.includes(rooms[grid[newX][newY][newZ]].requiredItem))) {
                errorMSG("u heeft niet de juiste items om deze kamer in te gaan.\nNodig: " + rooms[grid[newX][newY][newZ]].requiredItem);
                update();
                myInput.value = "";
                return;
            } else {
                inventory = inventory.filter(el => el !== rooms[getPlayerRoom()].requiredItem);
            }
        }
        currentX = newX;
        currentY = newY;
        currentZ = newZ;

        update();
        myInput.value = "";
    }
}


let errorMSG = function (msg) {
    ErrorMSG.innerHTML = msg;

    setTimeout(function () {
        if (ErrorMSG.innerHTML == msg) {
            ErrorMSG.innerHTML = "";
        }
    }, 3000);
}
