/**
 * Copyright Rezo Zero 2016
 *
 *
 *
 * @file canvas2dHelper.js
 * @copyright Rezo Zero 2016
 * @author Ambroise Maupate
 */
export class Canvas2dHelper {

  /**
   *
   * @param  {HTMLElement} A canvas HTML element
   * @param  {Object} size
   */
  constructor(element, size) {
    this.canvas = element;
    this.ctx = this.canvas.getContext('2d');
    this.isActive = false;

    this.layers = [];
    this.contexts = [];

    this.hidpi = true;

    this.drawRAF = null;
    this.bindedDraw = this._draw.bind(this);

    this.resize(size);
    this.init();
  }

  start() {
    this.isActive = true;
    this._draw();
  }

  stop() {
    this.isActive = false;
  }

  pushLayer() {
    let layer = document.createElement('canvas');
    this.setLayerSize(layer);
    this.layers.push(layer);
    return layer;
  }

  clearLayer(ctx) {
    ctx.clearRect(
      0,
      0,
      this.size.width * this.pixelRatio,
      this.size.height * this.pixelRatio
    );
  }

  setLayerSize(layer) {
    layer.width = this.size.width * this.pixelRatio;
    layer.height = this.size.height * this.pixelRatio;
  }

  circle(ctx, x, y, radius) {
    ctx.arc(
      x,
      y,
      radius,
      0,
      Math.PI*2,
      false
    );
  }

  centerCircle(ctx, radius) {
    this.circle(
      ctx,
      (this.size.width)/2,
      (this.size.height)/2,
      radius
    );
  }

  /**
   * By Ken Fyrstenberg Nilsen
   *
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   *
   * If image and context are only arguments rectangle will equal canvas
  */
  drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {

    if (arguments.length === 2) {
      x = y = 0;
      w = ctx.canvas.width / this.pixelRatio;
      h = ctx.canvas.height / this.pixelRatio;
    }

    // default offset is center
    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    let iw = img.width,
        ih = img.height;

    if (img instanceof HTMLVideoElement) {
       iw = img.videoWidth,
       ih = img.videoHeight;
    }

    let r = Math.min(w / iw, h / ih),
        nw = iw * r,   // new prop. width
        nh = ih * r,   // new prop. height
        cx, cy, cw, ch, ar = 1;

    // decide which gap to fill
    if (nw < w) ar = w / nw;
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
    nw *= ar;
    nh *= ar;

    // calc source rectangle
    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    // make sure source rectangle is valid
    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    // fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
  }

  /**
   * Get device pixel ratio. Buggy!
   * @param  {Canvas2dContext} context
   * @return {Number}
   */
  getPixelRatio(context) {
    if (!this.hidpi) return 1;

    let backingStore = context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio || 1;

    let pixelRatio = window.devicePixelRatio || 1;

    return (pixelRatio || 1) / backingStore;
  }

  resize(size) {
    if (size) {
      this.size = size;
    }

    this.pixelRatio = this.getPixelRatio(this.ctx);
    this.canvas.setAttribute('width', size.width*this.pixelRatio);
    this.canvas.setAttribute('height', size.height*this.pixelRatio);
    this.canvas.style.width = size.width + "px";
    this.canvas.style.height = size.height + "px";

    this.scaleLayer(this.ctx);
    this.setLayerSize(this.canvas);

    for (let i=0; i<this.layers.length; i++) {
      this.setLayerSize(this.layers[i]);
      this.scaleLayer(this.contexts[i]);
    }
  }
  /**
   * Main draw loop
   *
   * @private
   */
  _draw() {
    this.clearLayer(this.ctx);
    this.beforeLayers();

    for (let i=0; i<this.layers.length; i++) {
      this.ctx.drawImage(this.layers[i], 0, 0);
    }

    if(this.isActive) this.drawRAF = requestAnimationFrame(this.bindedDraw);
    else if(this.drawRAF !== null) cancelAnimationFrame(this.drawRAF);
  }

  scaleLayer(ctx) {
    ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  /**
   * Get canvas context scaled according to pixel ratio.
   * @param  {Canvas} layer
   * @return {Canvas2dContext}
   */
  pushLayerContext(layer) {
    let ctx = layer.getContext('2d');
    this.scaleLayer(ctx);
    this.contexts.push(ctx);

    return ctx;
  }

  init() {
    // Do your init stuff here
  }
  beforeLayers() {
    // Do your stuff here
  }

  minSize() {
    return Math.min(this.size.width, this.size.height);
  }

  maxSize() {
    return Math.max(this.size.width, this.size.height);
  }
}