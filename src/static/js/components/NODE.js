export default class NODE {
    constructor(ctx, x, y, parent) {
        this.ctx = ctx;
        this.id = Math.random().toString(36).substring(2, 8);
        this.size = 20
        this.parent = parent;
        this.value = parent.value;
        this.x = x;
        this.y = y;

        this.link = null;
        this.isLinked = false;

        /*
            Add event listeners to the canvas
            this.ctx.canvas.addEventListener("mousedown", );
            this.ctx.canvas.addEventListener("mousemove", );
            this.ctx.canvas.addEventListener("mouseup", );
        */

        this.draw();
    }

    draw() {
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'white';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(this.x, this.y, this.size, this.size);
        this.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    // Conditional Method
    // IMIB (Is Mouse Inside Box)
    IMIBNODE(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= (this.x + this.size) && mouseY >= this.y && mouseY <= (this.y + this.size);
    }

    setValue(value) {
        this.value = value;
        this.draw();
    }

    getValue() {
        return this.value
    }

    setLink(cnn) {
        this.link = cnn;
        this.isLinked = true;
    }

    msg() {
        console.log('hello');
    }
}