import NODE from "./NODE.js";

export default class NOT {
    constructor(ctx) {
        this.ctx = ctx;
        this.id = "not";
        this.x = 50;
        this.y = 250;
        this.width = 100;
        this.height = 50;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.nodeIN = new NODE(ctx, this.x - 11, this.y + 16, this);// izquierda
        this.nodeOUT = new NODE(ctx, this.x + 91, this.y + 16, this);// derecha
        this.value = false;
        this.color = this.value ? 'red' : '#4b4b4b';

        this.ctx.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.ctx.canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.ctx.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
        this.draw();
    }

    draw() {
        //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 4;
        this.ctx.fillStyle = this.color;
        this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.ctx.fillRect(this.x, this.y, this.width, this.height);

        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px Arial";
        this.ctx.fillText("NOT", this.x + 30, this.y + 33);

        this.nodeIN.draw();
        this.nodeOUT.draw();
    }

    // Conditional Method
    // IMIB (Is Mouse Inside Box)
    IMIBNOT(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= (this.x + this.width) && mouseY >= this.y && mouseY <= (this.y + this.height);
    }

    // Event Listener Methods
    onMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
        const mouseY = event.clientY - this.ctx.canvas.offsetTop;

        if (this.IMIBNOT(mouseX, mouseY)) {
            this.dragging = true;
            this.offsetX = mouseX - this.x;
            this.offsetY = mouseY - this.y;
            //console.log(this);
        }
    }

    onMouseMove(event) {
        if (this.dragging) {
            const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
            const mouseY = event.clientY - this.ctx.canvas.offsetTop;
            this.x = mouseX - this.offsetX;
            this.y = mouseY - this.offsetY;
            this.nodeIN.x = this.x - 11;
            this.nodeIN.y = this.y + 16;
            this.nodeOUT.x = this.x + 91;
            this.nodeOUT.y = this.y + 16;
            this.draw();
        }
    }

    onMouseUp() {
        this.dragging = false;
    }

    setValue(value) {
        this.value = value;
        this.color = !this.value ? 'red' : '#4b4b4b';
        this.nodeIN.setValue(this.value);
        this.nodeOUT.setValue(!this.value);
        this.draw();
    }

    resetValue() {
        this.value = false;
        this.color = this.value ? 'red' : '#4b4b4b';
        this.nodeIN.setValue(this.value);
        this.nodeOUT.setValue(this.value);
        this.draw();
    }
}