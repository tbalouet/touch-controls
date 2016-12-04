var LEFT_TOUCH_CONTROLLER_MODEL_OBJ_URL = './models/touch_left.obj';
var LEFT_TOUCH_CONTROLLER_MODEL_MTL_URL = './models/touch_left.mtl';
var RIGHT_TOUCH_CONTROLLER_MODEL_OBJ_URL = './models/touch_right.obj';
var RIGHT_TOUCH_CONTROLLER_MODEL_MTL_URL = './models/touch_right.mtl';

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
  // 1 - trigger
  // 2 - grip
  // 3 - menu1 ( either A on right controler or X on the left one )
  // 4 - menu2 ( either B on right controler or Y on the left one )
  // 5 - surface ( the flat touch surface next to the buttons )
  mapping: {
    axis0   : 'trackpad',
    axis1   : 'trackpad',
    button0 : 'trackpad',
    button1 : 'trigger',
    button2 : 'grip',
    button3 : 'menu1',
    button4 : 'menu2',
    button5 : 'surface'
  },

  init: function () {
    var self = this;
    this.animationActive    = 'pointing';
    this.onButtonDown       = function (evt) { self.onButtonEvent(evt.detail.id, 'down'); };
    this.onButtonUp         = function (evt) { self.onButtonEvent(evt.detail.id, 'up'); };
    this.onButtonTouchStart = function (evt) { self.onButtonEvent(evt.detail.id, 'touchstart'); };
    this.onButtonTouchEnd   = function (evt) { self.onButtonEvent(evt.detail.id, 'touchend'); };
    this.onModelLoaded = this.onModelLoaded.bind(this);
  },

  play: function () {
    var el = this.el;
    el.addEventListener('buttondown', this.onButtonDown);
    el.addEventListener('buttonup', this.onButtonUp);
    el.addEventListener('touchstart', this.onButtonTouchStart);
    el.addEventListener('touchend', this.onButtonTouchEnd);
    el.addEventListener('model-loaded', this.onModelLoaded);
  },

  pause: function () {
    var el = this.el;
    el.removeEventListener('buttondown', this.onButtonDown);
    el.removeEventListener('buttonup', this.onButtonUp);
    el.removeEventListener('touchstart', this.onButtonTouchStart);
    el.removeEventListener('touchend', this.onButtonTouchEnd);
    el.removeEventListener('model-loaded', this.onModelLoaded);
  },

  update: function () {
    var el = this.el;
    var data = this.data;

    var objUrl, mtlUrl;
    if (data.hand === 'left') {
      objUrl = 'url(' + LEFT_TOUCH_CONTROLLER_MODEL_OBJ_URL + ')';
      mtlUrl = 'url(' + LEFT_TOUCH_CONTROLLER_MODEL_MTL_URL + ')';
    } else {
      objUrl = 'url(' + RIGHT_TOUCH_CONTROLLER_MODEL_OBJ_URL + ')';
      mtlUrl = 'url(' + RIGHT_TOUCH_CONTROLLER_MODEL_MTL_URL + ')';
    }
    // handId: 0 - right, 1 - left
    var id = "Oculus Touch " + (data.hand === 'left' ? "(Left)" : "(Right)");
    el.setAttribute('tracked-controls', 'id', id);
    el.setAttribute('obj-model', {obj: objUrl, mtl: mtlUrl});
  },

  onModelLoaded: function (evt) {
    var controllerObject3D = evt.detail.model;
    var buttonMeshes;
    if (!this.data.model) { return; }

    var leftHand = this.data.hand === "left";
    buttonMeshes          = this.buttonMeshes = {};
    
    buttonMeshes.grip     = controllerObject3D.getObjectByName(leftHand ? 'grip tooche1 group3' : "grip tooche group4");
    buttonMeshes.trackpad = controllerObject3D.getObjectByName(leftHand ? 'tooche1 group3 control_surface group2 thumb_stick' : "tooche group4 control_surface group2 thumb_stick");
    buttonMeshes.trigger  = controllerObject3D.getObjectByName(leftHand ? 'tooche1 group3 trigger' : "tooche group4 trigger");
    buttonMeshes.menu1    = controllerObject3D.getObjectByName(leftHand ? 'tooche1 group3 control_surface group2 button2' : 'tooche group4 control_surface group2 button2');
    buttonMeshes.menu2    = controllerObject3D.getObjectByName(leftHand ? 'tooche1 group3 control_surface group2 button3' : 'tooche group4 control_surface group2 button3');
    buttonMeshes.surface  = controllerObject3D.getObjectByName(leftHand ? 'tooche1 group3 face control_surface group2' : 'tooche group4 face control_surface group2');
  },

  onButtonEvent: function (id, evtName) {
    var buttonName = this.mapping['button' + id];
    this.el.emit(buttonName + evtName);
    console.log(evtName, buttonName);
  }
});
