export default class OUTPUT {
    constructor(ctx) {
        this.ctx = ctx;
        this.id = "output";
        this.x = 50;
        this.y = 150;
        this.width = 100;
        this.height = 50;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.value = false;
        this.color = this.value ? 'red' : '#4b4b4b';
        this.node = {
            id: Date.now().toString(36).substring(3, 8) + '-' + Math.random().toString(36).substring(2, 6),
            size: 20,
            value: this.value,
            setValue: function (value) {
                this.value = value;
                this.color = this.value ? 'red' : '#4b4b4b';
                this.node.value = this.value;
                this.draw();
            }.bind(this),
            resetValue: function () {
                this.value = false;
                this.color = this.value ? 'red' : '#4b4b4b';
                this.node.value = this.value;
                this.draw();
            }.bind(this),
            setLink: function () {
                this.isLinked = true;
            },
            IMIB: function (mouseX, mouseY) {
                return mouseX >= this.x && mouseX <= (this.x + this.size) && mouseY >= this.y && mouseY <= (this.y + this.size);
            },
            x: this.x - 11,
            y: this.y + 16,
            isLinked: false
        };

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
        this.ctx.strokeRect(this.node.x, this.node.y, this.node.size, this.node.size);
        this.ctx.fillRect(this.node.x, this.node.y, this.node.size, this.node.size);

        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px Arial";
        this.ctx.fillText("OUTPUT", this.x + 14, this.y + 33);
    }

    // IMIB (Is Mouse Inside Box)
    IMIBOUT(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= (this.x + this.width) && mouseY >= this.y && mouseY <= (this.y + this.height);
    }

    // Event Listener Methods
    onMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
        const mouseY = event.clientY - this.ctx.canvas.offsetTop;

        if (this.IMIBOUT(mouseX, mouseY)) {
            this.dragging = true;
            this.offsetX = mouseX - this.x;
            this.offsetY = mouseY - this.y;
        }
    }

    onMouseMove(event) {
        if (this.dragging) {
            const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
            const mouseY = event.clientY - this.ctx.canvas.offsetTop;
            this.x = mouseX - this.offsetX;
            this.y = mouseY - this.offsetY;
            this.node.x = this.x - 11;
            this.node.y = this.y + 16;
            this.draw();
        }
    }

    onMouseUp() {
        this.dragging = false;
    }
}