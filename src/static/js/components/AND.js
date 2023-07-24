import NODE from "./NODE.js";

export default class AND {
    constructor(ctx) {
        this.ctx = ctx;
        this.id = "and";
        this.x = 50;
        this.y = 350;
        this.width = 100;
        this.height = 75;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.nodeIN1 = new NODE(ctx, this.x - 11, this.y + 9, this);
        this.nodeIN2 = new NODE(ctx, this.x - 11, this.y + 49, this);
        this.nodeOUT = new NODE(ctx, this.x + 91, this.y + 29, this);
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
        this.ctx.fillText("AND", this.x + 30, this.y + 46);

        this.nodeIN1.draw();
        this.nodeIN2.draw();
        this.nodeOUT.draw();
    }

    // Conditional Method
    // IMIB (Is Mouse Inside Box)
    IMIBAND(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= (this.x + this.width) && mouseY >= this.y && mouseY <= (this.y + this.height);
    }

    // Event Listener Methods
    onMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
        const mouseY = event.clientY - this.ctx.canvas.offsetTop;

        if (this.IMIBAND(mouseX, mouseY)) {
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
            this.nodeIN1.x = this.x - 11;
            this.nodeIN1.y = this.y + 9;
            this.nodeIN2.x = this.x - 11;
            this.nodeIN2.y = this.y + 49;
            this.nodeOUT.x = this.x + 91;
            this.nodeOUT.y = this.y + 29;
            this.draw();
        }
    }

    onMouseUp() {
        this.dragging = false;
    }

    setValue() {
        const value1 = this.nodeIN1.getValue();
        const value2 = this.nodeIN2.getValue();
        if (value1 == true && value2 == true) {
            this.value = true;
        } else { this.value = false; }
        this.color = this.value ? 'red' : '#4b4b4b';
        this.nodeOUT.setValue(this.value);
        this.draw();
    }

    resetValue() {
        this.value = false;
        this.color = this.value ? 'red' : '#4b4b4b';
        this.nodeIN1.setValue(this.value);
        this.nodeIN2.setValue(this.value);
        this.nodeOUT.setValue(this.value);
        this.draw();
    }
}