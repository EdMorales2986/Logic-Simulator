import INPUT from "../components/INPUT.js";
import OUTPUT from "../components/OUTPUT.js";
import NOT from "../components/NOT.js";
import AND from "../components/AND.js";
import OR from "../components/OR.js";
import { ctx, canvas } from "./misc.js";

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
let currentRole = null;
let timeOut = null;
let tempObject = [];
let tempConnections = [];

const socket = io();
window.onload = function () {
    socket.emit('first_event');
}
socket.on('second_event', (newRole) => {
    currentRole = newRole;
    if (currentRole == 'viewer') {
        document.querySelectorAll('button').forEach((element) => {
            element.style.display = 'none';
        })
    }
});

function deletePrev() {
    while (tempObject.length > 0) {
        tempObject.pop();
    }
    while (tempConnections.length > 0) {
        tempConnections.pop();
    }
}
function drawTemp(t) {
    switch (t.id) {
        case 'input':
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.fillStyle = t.color;
            ctx.strokeRect(t.x, t.y, t.width, t.height);
            ctx.fillRect(t.x, t.y, t.width, t.height);
            ctx.fillStyle = 'white';
            ctx.strokeRect(t.node.x, t.node.y, t.node.size, t.node.size);
            ctx.fillRect(t.node.x, t.node.y, t.node.size, t.node.size);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("INPUT", t.x + 18, t.y + 33);
            break;
        case 'output':
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.fillStyle = t.color;
            ctx.strokeRect(t.x, t.y, t.width, t.height);
            ctx.fillRect(t.x, t.y, t.width, t.height);
            ctx.fillStyle = 'white';
            ctx.strokeRect(t.node.x, t.node.y, t.node.size, t.node.size);
            ctx.fillRect(t.node.x, t.node.y, t.node.size, t.node.size);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("OUTPUT", t.x + 14, t.y + 33);
            break;
        case 'not':
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.fillStyle = t.color;
            ctx.strokeRect(t.x, t.y, t.width, t.height);
            ctx.fillRect(t.x, t.y, t.width, t.height);
            ctx.fillStyle = 'white';
            ctx.strokeRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.fillRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.strokeRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.fillRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("NOT", t.x + 30, t.y + 33);
            break;
        case 'and':
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.fillStyle = t.color;
            ctx.strokeRect(t.x, t.y, t.width, t.height);
            ctx.fillRect(t.x, t.y, t.width, t.height);
            ctx.fillStyle = 'white';
            ctx.strokeRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.fillRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.strokeRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.fillRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.strokeRect(t.nodeC.x, t.nodeC.y, t.nodeC.size, t.nodeC.size);
            ctx.fillRect(t.nodeC.x, t.nodeC.y, t.nodeC.size, t.nodeC.size);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("AND", t.x + 30, t.y + 46);
            break;
        case 'or':
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 4;
            ctx.fillStyle = t.color;
            ctx.strokeRect(t.x, t.y, t.width, t.height);
            ctx.fillRect(t.x, t.y, t.width, t.height);
            ctx.fillStyle = 'white';
            ctx.strokeRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.fillRect(t.nodeA.x, t.nodeA.y, t.nodeA.size, t.nodeA.size);
            ctx.strokeRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.fillRect(t.nodeB.x, t.nodeB.y, t.nodeB.size, t.nodeB.size);
            ctx.strokeRect(t.nodeC.x, t.nodeC.y, t.nodeC.size, t.nodeC.size);
            ctx.fillRect(t.nodeC.x, t.nodeC.y, t.nodeC.size, t.nodeC.size);
            ctx.fillStyle = 'white';
            ctx.font = "20px Arial";
            ctx.fillText("OR", t.x + 30, t.y + 46);
            break;
        default: console.log('bruh');
            break;
    }
}
function drawTempWire(c) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(c.node1.x + 10, c.node1.y + 10);
    ctx.lineTo(c.node2.x + 10, c.node2.y + 10);
    ctx.stroke();
}

socket.on('step_two', (arr, cnn) => {
    deletePrev();
    if (arr.length > 0) {
        for (let a of arr) {
            tempObject.push(a);
        }
    }
    if (cnn.length > 0) {
        for (let c of cnn) {
            tempConnections.push(c);
        }
    }
})

function logicSim() {
    handlers();
    update();
}
function handlers() {
    document.getElementById('input').addEventListener('click', (e) => {
        inputs.push(new INPUT(ctx, false));
        for (let i of inputs) {
            sending.push(i.node);
        }
    })
    document.getElementById('output').addEventListener('click', (e) => {
        outputs.push(new OUTPUT(ctx));
        for (let o of outputs) {
            getting.push(o.node);
        }
    })
    document.getElementById('not').addEventListener('click', (e) => {
        notGates.push(new NOT(ctx));
        for (let not of notGates) {
            getting.push(not.nodeA);
            sending.push(not.nodeB);
        }
    })
    document.getElementById('and').addEventListener('click', (e) => {
        andGates.push(new AND(ctx));
        for (let and of andGates) {
            getting.push(and.nodeA);
            getting.push(and.nodeB);
            sending.push(and.nodeC);
        }
    })
    document.getElementById('or').addEventListener('click', (e) => {
        orGates.push(new OR(ctx));
        for (let or of orGates) {
            getting.push(or.nodeA);
            getting.push(or.nodeB);
            sending.push(or.nodeC);
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
        for (let S of sending) {
            S.link = null;
            S.isLinked = false;
        }
        for (let G of getting) {
            G.link = null;
            G.isLinked = false;
        }
        while (connections.length > 0) {
            connections.pop();
        }
    })
}
function drawAll() {
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
}
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
function drawWire() {
    for (let cnn of connections) {
        for (let S of sending) {
            for (let G of getting) {
                if (cnn.node1.id == S.id && cnn.node2.id == G.id) {
                    ctx.beginPath();
                    ctx.lineCap = "round";
                    ctx.moveTo(S.x + 10, S.y + 10);
                    ctx.lineTo(G.x + 10, G.y + 10);
                    ctx.stroke();
                }
            }
        }
    }
}
function collisions() {
    for (let I of sending) {
        const first = I;
        for (let O of getting) {
            const second = O;
            if (first.x < second.x + second.size &&
                first.x + first.size > second.x &&
                first.y < second.y + second.size &&
                first.y + first.size > second.y) {
                second.setValue(first.value);
            }
        }
    }

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
            first.resetValue();
        }
    }
}
function connection() {
    canvas.addEventListener("click", (event) => {
        const mouseX = event.clientX - canvas.offsetLeft;
        const mouseY = event.clientY - canvas.offsetTop;

        if (firstClick === null && event.ctrlKey) {
            for (let S of sending) {
                if (event.ctrlKey & S.IMIB(mouseX, mouseY)) {
                    firstClick = S;
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
                    if (event.ctrlKey && G.IMIB(mouseX, mouseY) && G.isLinked == false) {
                        clearTimeout(timeOut);
                        secondClick = G;
                        break;
                    }
                }

                firstClick.setLink(secondClick);
                secondClick.setLink(firstClick);
                connections.push({ node1: firstClick, node2: secondClick });
                console.log(`linked ${firstClick.id} with ${secondClick.id}`);

                firstClick = null;
                secondClick = null;
            } catch (error) {
                console.error('conexion no permitida');
            }
        }
    });
}
function ensureConnection() {
    for (let cnn of connections) {
        for (let S of sending) {
            for (let G of getting) {
                if (cnn.node1.id == S.id && cnn.node2.id == G.id) {
                    G.setValue(S.value);
                }
            }
        }
    }
    drawWire();
}
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (currentRole == 'admin') {
        const combinedArray = inputs.concat(outputs, notGates, andGates, orGates);
        socket.emit('step_one', combinedArray, connections);
        drawGrid();
        drawAll();
        collisions();
        ensureConnection();
    }
    else {
        if (tempObject.length) {
            for (let t of tempObject) {
                drawTemp(t);
            }
            for (let c of tempConnections) {
                drawTempWire(c);
            }
        }
    }

    requestAnimationFrame(update);
}

connection();
logicSim();