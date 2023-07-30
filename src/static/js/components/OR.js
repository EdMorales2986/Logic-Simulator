export default class OR {
    constructor(ctx) {
        this.ctx = ctx;
        this.id = "or";
        this.x = 50;
        this.y = 475;
        this.width = 100;
        this.height = 75;
        this.dragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.nodeA = {
            id: Date.now().toString(36).substring(3, 8) + '-' + Math.random().toString(36).substring(2, 6),
            size: 20,
            value: this.value,
            setValue: function (value) {
                this.nodeA.value = value;
                this.update();
            }.bind(this),
            resetValue: function () {
                this.nodeA.value = false;
                this.update();
            }.bind(this),
            setLink: function () {
                this.isLinked = true;
            },
            IMIB: function (mouseX, mouseY) {
                return mouseX >= this.x && mouseX <= (this.x + this.size) && mouseY >= this.y && mouseY <= (this.y + this.size);
            },
            x: this.x - 11,
            y: this.y + 9,
            isLinked: false
        };
        this.nodeB = {
            id: Date.now().toString(36).substring(3, 8) + '-' + Math.random().toString(36).substring(2, 6),
            size: 20,
            value: this.value,
            setValue: function (value) {
                this.nodeB.value = value;
                this.update();
            }.bind(this),
            resetValue: function () {
                this.nodeB.value = false;
                this.update();
            }.bind(this),
            setLink: function () {
                this.isLinked = true;
            },
            IMIB: function (mouseX, mouseY) {
                return mouseX >= this.x && mouseX <= (this.x + this.size) && mouseY >= this.y && mouseY <= (this.y + this.size);
            },
            x: this.x - 11,
            y: this.y + 49,
            isLinked: false
        };
        this.nodeC = {
            id: Date.now().toString(36).substring(3, 8) + '-' + Math.random().toString(36).substring(2, 6),
            size: 20,
            value: this.value,
            setLink: function () {
                this.isLinked = true;
            },
            IMIB: function (mouseX, mouseY) {
                return mouseX >= this.x && mouseX <= (this.x + this.size) && mouseY >= this.y && mouseY <= (this.y + this.size);
            },
            x: this.x + 91,
            y: this.y + 29,
            isLinked: false
        };
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
        this.ctx.strokeRect(this.nodeA.x, this.nodeA.y, this.nodeA.size, this.nodeA.size);
        this.ctx.fillRect(this.nodeA.x, this.nodeA.y, this.nodeA.size, this.nodeA.size);
        this.ctx.strokeRect(this.nodeB.x, this.nodeB.y, this.nodeB.size, this.nodeB.size);
        this.ctx.fillRect(this.nodeB.x, this.nodeB.y, this.nodeB.size, this.nodeB.size);
        this.ctx.strokeRect(this.nodeC.x, this.nodeC.y, this.nodeC.size, this.nodeC.size);
        this.ctx.fillRect(this.nodeC.x, this.nodeC.y, this.nodeC.size, this.nodeC.size);

        this.ctx.fillStyle = 'white';
        this.ctx.font = "20px Arial";
        this.ctx.fillText("OR", this.x + 30, this.y + 46);
    }

    // IMIB (Is Mouse Inside Box)
    IMIBOR(mouseX, mouseY) {
        return mouseX >= this.x && mouseX <= (this.x + this.width) && mouseY >= this.y && mouseY <= (this.y + this.height);
    }

    // Event Listener Methods
    onMouseDown(event) {
        const mouseX = event.clientX - this.ctx.canvas.offsetLeft;
        const mouseY = event.clientY - this.ctx.canvas.offsetTop;

        if (this.IMIBOR(mouseX, mouseY)) {
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
            this.nodeA.x = this.x - 11;
            this.nodeA.y = this.y + 9;
            this.nodeB.x = this.x - 11;
            this.nodeB.y = this.y + 49;
            this.nodeC.x = this.x + 91;
            this.nodeC.y = this.y + 29;
            this.draw();
        }
    }

    onMouseUp() {
        this.dragging = false;
    }

    update() {
        if (this.nodeA.value || this.nodeB.value) {
            this.value = true;
            this.nodeC.value = true;
            this.color = this.value ? 'red' : '#4b4b4b';
        } else {
            this.value = false;
            this.nodeC.value = false;
            this.color = this.value ? 'red' : '#4b4b4b';
        }
    }
}