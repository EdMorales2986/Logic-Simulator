const cc = document.getElementById('canvas-container');
export const canvas = document.querySelector('canvas');
export const ctx = canvas.getContext('2d');

canvas.width = cc.clientWidth;
canvas.height = cc.clientHeight;