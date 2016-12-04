var LEFT_HAND_MODEL_URL = 'https://cdn.aframe.io/controllers/hands/leftHand.json';
var RIGHT_HAND_MODEL_URL = 'https://cdn.aframe.io/controllers/hands/rightHand.json';

/**
 * Oculus Touch Controls Component
 * Interfaces with oculus touch controls and maps Gamepad events to
 * touch controller buttons: trackpad, trigger, grip, menu and system
 * It loads a hand controller model and highlights the pressed buttons
 */
AFRAME.registerComponent('touch-controls', {
  dependencies: ['tracked-controls'],

  schema: {
    hand: {default: 'left'},
    buttonColor: {default: '#FAFAFA'},  // Off-white.
    buttonHighlightColor: {default: '#22D1EE'},  // Light blue.
    model: {default: true}
  },

  // buttonId
  // 0 - trackpad
  // 1 - trigger ( intensity value from 0.5 to 1 )
  // 2 - grip
  // 3 - menu ( dispatch but better for menu options )
  // 4 - system ( never dispatched on this layer )
  mapping: {
    axis0: 'trackpad',
    axis1: 'trackpad',
    button0: 'trackpad',
    button1: 'trigger',
    button2: 'grip',
    button3: 'menu',
    button4: 'system'
  },

  init: function () {
    var self = this;
    this.animationActive = 'pointing';
    this.onButtonDown    = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
    this.onButtonUp      = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };  },

  play: function () {
    var el = this.el;
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
  },

  update: function () {
    var el = this.el;
    var data = this.data;

    var modelUrl;
    if (data.hand === 'left') {
      modelUrl = 'url(' + LEFT_HAND_MODEL_URL + ')';
    } else {
      modelUrl = 'url(' + RIGHT_HAND_MODEL_URL + ')';
    }
    // handId: 0 - right, 1 - left
    var id = "Oculus Touch " + (data.hand === 'left' ? "(Left)" : "(Right)");
    el.setAttribute('tracked-controls', 'id', id);
    el.setAttribute('blend-character-model', modelUrl);
  },

  onButtonEvent: function (id, evtName) {
    var buttonName = this.mapping['button' + id];
    this.el.emit(buttonName + evtName);
    console.log("button event", buttonName, evtName);
    this.handleButton(buttonName, evtName);
  },

 /** Play the model animations based on the pressed button and kind of event.
   *
   * @param {string} button the name of the button
   * @param {string} evt the event associated to the button
   */
  handleButton: function (button, evt) {
    var el = this.el;
    var isPressed = evt === 'down';
    switch (button) {
      case 'trackpad':
        if (isPressed === this.trackpadPressed) { return; }
        this.trackpadPressed = isPressed;
        this.playAnimation('thumb', !isPressed);
        evt = isPressed ? 'thumbup' : 'thumbdown';
        el.emit(evt);
        break;
      case 'trigger':
        if (isPressed === this.triggerPressed) { return; }
        this.triggerPressed = isPressed;
        var animation = (this.gripPressed ? "close" : "pointing");
        this.playAnimation(animation, !isPressed);
        evt = isPressed ? 'pointup' : 'pointdown';
        el.emit(evt);
        break;
      case 'grip':
        if (isPressed === this.gripPressed) { return; }
        this.gripPressed = isPressed;
        var animation = (this.triggerPressed ? "close" : "pointing");
        this.playAnimation(animation, !isPressed);
        evt = isPressed ? 'gripclose' : 'gripopen';
        el.emit(evt);
        break;
    }
  },

  /**
  * Play the hand animations based on button state.
  *
  * @param {string} animation - the name of the animation.
  * @param {string} reverse - It the animation has to play in reverse.
  */
  playAnimation: function (animation, reverse) {
    var animationActive = this.animationActive;
    var timeScale = 1;
    var mesh = this.el.getObject3D('mesh');
    if (!mesh) { return; }

    // determine direction of the animation.
    if (reverse) { timeScale = -1; }

    // stop current animation.
    if (animationActive) { mesh.play(animationActive, 0); }

    // play new animation.
    mesh.mixer.clipAction(animation).loop = 2200;
    mesh.mixer.clipAction(animation).clampWhenFinished = true;
    mesh.mixer.clipAction(animation).timeScale = timeScale;
    mesh.play(animation, 1);
    this.animationActive = animation;
  }
});