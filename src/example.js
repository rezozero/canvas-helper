/**
 * Copyright Rezo Zero 2016
 *
 *
 *
 * @file example.js
 * @copyright Rezo Zero 2016
 * @author Ambroise Maupate
 */
import {Canvas2dHelper} from "./canvas2dHelper";

export class ExampleCanvas extends Canvas2dHelper {
  init() {
    super.init();

    this.image = null;
    this.time = new Date();

    let video = document.createElement('video');
    this.setImage(video);
    video.src = 'http://mazwai.com/system/posts/videos/000/000/225/original/andrew-arthur-breese_boneyard-raw-broll.mp4';
    video.loop = true;
    video.play();

    video.addEventListener('play', () => {
        this.start();
    });
    this.canvas.addEventListener('click', () => {
        video.play();
    });
    window.addEventListener('resize', () => {
        this.resize({
            width: window.innerWidth,
            height: window.innerHeight
        });
    });

    /*
     * Push layers and contexts
     * ---------------------------------
     * Make sure to use push methods to be able to
     * resize and draw every off-canvas and their contexts
     */
    let videoCanvas = this.pushLayer();
    this.videoCtx = this.pushLayerContext(videoCanvas);

    let offCanvas = this.pushLayer();
    this.offCtx = this.pushLayerContext(offCanvas);

    let graphCanvas = this.pushLayer();
    this.graphCtx = this.pushLayerContext(graphCanvas);
  }

  setImage(image) {
    this.image = image;
  }

  /*
   * Main drawing loop
   *
   * DO NOT CALL requestAnimationFrame here
   * main private draw loop does it for you!
   *
   */
  beforeLayers() {
    super.beforeLayers();

    this.time = new Date();

    this.drawVideo(this.videoCtx);
    this.drawCircle(this.offCtx);
    this.drawGraph(this.graphCtx);
  }

  drawVideo(ctx){
    ctx.save();
    this.clearLayer(ctx);

    //ctx.drawImage(this.image, 0, 0, this.size.width, this.size.height);
    this.drawImageProp(ctx, this.image);
    ctx.beginPath();

    this.centerCircle(ctx, this.cosValueForSize(this.maxSize()));
    ctx.globalCompositeOperation = 'destination-in';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
    ctx.restore();
  }

  drawCircle(ctx) {
    ctx.save();
    this.clearLayer(ctx);
    ctx.rect(0, 0, this.size.width, this.size.height);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fill();
    ctx.beginPath();
    this.centerCircle(ctx, this.sinValueForSize(this.minSize()*0.5));
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
    ctx.restore();
  }

  drawGraph(ctx) {
    ctx.save();
    this.clearLayer(ctx);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(this.size.width, this.size.height);
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, this.size.height);
    ctx.lineTo(this.size.width, 0);
    ctx.strokeStyle = 'rgba(255,0,0,1)';
    ctx.stroke();


    ctx.beginPath();
    this.centerCircle(ctx, this.cosValueForSize(this.minSize()*0.75));
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fill();
    ctx.restore();
  }

  sinValueForSize(size) {
    return (Math.sin(this.time.getTime()/500)*size/2) + size/2;
  }
  cosValueForSize(size) {
    return (Math.cos(this.time.getTime()/500)*size/2) + size/2;
  }
}