import INPUT from "../components/INPUT.js";
import OUTPUT from "../components/OUTPUT.js";
import NOT from "../components/NOT.js";
import AND from "../components/AND.js";
import OR from "../components/OR.js";
import { cc, ctx, canvas } from "./misc.js"

let inputs = [];
let outputs = [];
let notGates = [];
let andGates = [];
let orGates = [];

let connections = [];
let sending = [];
let getting = [];

let firstClick = null;
let secondClick = null;
let timeOut = null;

document.getElementById('input').addEventListener('click', (e) => {
    inputs.push(new INPUT(ctx, false));
    for (let i = 0; i < inputs.length; i++) {
        sending.push(inputs[i].node);
    }
})
document.getElementById('output').addEventListener('click', (e) => {
    outputs.push(new OUTPUT(ctx));
    for (let i = 0; i < outputs.length; i++) {
        getting.push(outputs[i].node);
    }
})
document.getElementById('not').addEventListener('click', (e) => {
    notGates.push(new NOT(ctx));
    for (let i = 0; i < notGates.length; i++) {
        getting.push(notGates[i].nodeIN); //izquierda
        sending.push(notGates[i].nodeOUT); // derecha
    }
})
document.getElementById('and').addEventListener('click', (e) => {
    andGates.push(new AND(ctx));
    for (let i = 0; i < andGates.length; i++) {
        getting.push(andGates[i].nodeIN1);
        getting.push(andGates[i].nodeIN2);
        sending.push(andGates[i].nodeOUT);
    }
})
document.getElementById('or').addEventListener('click', (e) => {
    orGates.push(new OR(ctx));
    for (let i = 0; i < orGates.length; i++) {
        getting.push(orGates[i].nodeIN1);
        getting.push(orGates[i].nodeIN2);
        sending.push(orGates[i].nodeOUT);
    }
})
document.getElementById('delete').addEventListener('click', (e) => {
    while (inputs.length > 0) {
        inputs.pop();
    }
    while (outputs.length > 0) {
        outputs.pop();
    }
    while (notGates.length > 0) {
        notGates.pop();
    }
    while (andGates.length > 0) {
        andGates.pop();
    }
    while (orGates.length > 0) {
        orGates.pop();
    }
    while (connections.length > 0) {
        connections.pop();
    }
    while (sending.length > 0) {
        sending.pop();
    }
    while (getting.length > 0) {
        getting.pop();
    }
})
document.getElementById('unlink').addEventListener('click', (e) => {
    while (connections.length > 0) {
        connections.pop();
    }
})

function drawGrid() {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'black';
    // Draw horizontal lines
    for (let y = 0; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw vertical lines
    for (let x = 0; x < canvas.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

function connection() {
    canvas.addEventListener("click", (event) => {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;

        if (firstClick === null && event.ctrlKey) {
            for (let S of sending) {
                if (event.ctrlKey & S.IMIBNODE(mouseX, mouseY)) {
                    firstClick = S;
                    console.log(S.id);
                    break;
                }
            }
            timeOut = setTimeout(() => {
                // If the second click is not detected within the specified time interval, reset the first click
                console.log('time is over');
                firstClick = null;
            }, 3000);
        } else if (secondClick === null && event.ctrlKey) {
            try {
                for (let G of getting) {
                    if (event.ctrlKey && G.IMIBNODE(mouseX, mouseY)) {
                        clearTimeout(timeOut);
                        secondClick = G;
                        console.log(G.id);
                        break;
                    }
                }
                firstClick.setLink(secondClick);
                secondClick.setLink(firstClick);
                connections.push({ node1: firstClick.id, node2: secondClick.id });
                console.log(`linked ${firstClick.id} with ${secondClick.id}`);

                firstClick = null;
                secondClick = null;
            } catch (error) {
                console.error('conexion no permitida');
            }
        }
    });
}


// Update loop function
function update() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();

    // Draw all components
    for (let i of inputs) {
        i.draw();
    }
    for (let o of outputs) {
        o.draw();
    }
    for (let not of notGates) {
        not.draw();
    }
    for (let and of andGates) {
        and.draw();
    }
    for (let or of orGates) {
        or.draw();
    }

    // Check for intersection and set values
    for (let I of sending) {
        const first = I;
        for (let O of getting) {
            const second = O;
            if (first.x < second.x + second.size &&
                first.x + first.size > second.x &&
                first.y < second.y + second.size &&
                first.y + first.size > second.y) {
                second.setValue(first.value);
                second.parent.setValue(first.value);
            }
        }
    }
    // Reset values when no longer intersecting
    for (let O of getting) {
        const first = O;
        let foundInter = false;
        for (let I of sending) {
            const second = I;
            if (first.x < second.x + second.size &&
                first.x + first.size > second.x &&
                first.y < second.y + second.size &&
                first.y + first.size > second.y) {
                foundInter = true
                break
            }
        }
        if (!foundInter) {
            first.parent.resetValue();
        }
    }


    //Check for Connections and set corresponding value
    for (let cnn of connections) {
        for (let S of sending) {
            for (let G of getting) {
                if (cnn.node1 == S.id && cnn.node2 == G.id) {
                    G.setValue(S.value);
                    G.parent.setValue(S.value);
                }
            }
        }
    }

    // Schedule next update
    requestAnimationFrame(update);
}



// Start update loop
connection();
requestAnimationFrame(update);
