// MamayAdesu Gamepad
class MDGamepad {
    
    constructor() {
        this.gamepad = null;
        this.gamepads = [];
        this.interval1 = null;
        this.interval2 = null;
        this.interval3 = null;
        this.eventsList = [];
        this.buttons = [];
        this.axises = [];
        this.gamepadtype = null;
        this.interval1 = setInterval(function() {
            mdg.gamepads = navigator.getGamepads();
            if(mdg.gamepads.length > 0) {
                if(typeof mdg.gamepads[0] != "undefined" && mdg.gamepads[0] != null) {
                    if(mdg.gamepad == null) {
                        mdg.gamepad = mdg.gamepads[0];
                        if(mdg.gamepad != null) {
                            mdg.gamepadtype = mdg.gamepad.id;
                            for(var i in mdg.gamepad.axes) {
                                mdg.axises[i] = mdg.gamepad.axes[i];
                            }
                            mdg.MDGamepadDoEvent('connected', []);
                            for(var i in mdg.gamepad.buttons) {
                                if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                                    mdg.buttons[i] = [];
                                    mdg.buttons[i].pressed = false;
                                }
                            }
                        }
                    } else {
                        //if(mdg.gamepad != mdg.gamepads[0]) { // works incorrectly in new versions of Google Chrome
                        if(mdg.gamepads[0] != null && mdg.gamepad.id != mdg.gamepads[0].id) {
                            console.log("zdes' kaka");
                            mdg.MDGamepadDoEvent('disconnected', []);
                            mdg.buttons = [];
                            mdg.gamepad = null;
                            mdg.gamepadtype = null;
                            
                            mdg.gamepad = mdg.gamepads[0];
                            mdg.gamepadtype = mdg.gamepad.id;
                            mdg.MDGamepadDoEvent('connected', []);
                            for(var i in mdg.gamepad.buttons) {
                                if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                                    mdg.buttons[i] = [];
                                    mdg.buttons[i].pressed = false;
                                }
                            }
                        } else {
                            mdg.gamepad = mdg.gamepads[0];
                        }
                    }
                } else {
                    if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                        for(var i in mdg.buttons) {
                            if(mdg.buttons[i].pressed == true) {
                                mdg.MDGamepadDoEvent('buttonup', {'button': i});
                            }
                        }
                        mdg.MDGamepadDoEvent('disconnected', []);
                        mdg.buttons = [];
                        mdg.axises = [];
                        mdg.gamepad = null;
                        mdg.gamepadtype = null;
                    }
                }
            } else {
                if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                    for(var i in mdg.buttons) {
                        if(mdg.buttons[i].pressed == true) {
                            mdg.MDGamepadDoEvent('buttonup', {'button': i});
                        }
                    }
                    mdg.MDGamepadDoEvent('disconnected', []);
                    mdg.buttons = [];
                    mdg.axises = [];
                    mdg.gamepad = null;
                    mdg.gamepadtype = null;
                }
            }
        }, 1);
        
        this.interval2 = setInterval(function() {
            if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                for(var i in mdg.gamepad.buttons) {
                    if(mdg.gamepad.buttons[i] instanceof GamepadButton) {
                        if(mdg.buttons[i].pressed == false && mdg.gamepad.buttons[i].pressed == true) {
                            mdg.MDGamepadDoEvent('buttondown', {'button': i});
                            mdg.buttons[i].pressed = true;
                        } else if(mdg.buttons[i].pressed == true && mdg.gamepad.buttons[i].pressed == false) {
                            mdg.MDGamepadDoEvent('buttonup', {'button': i});
                            mdg.buttons[i].pressed = false;
                        }
                    }
                }
            }
        }, 1);
        
        this.interval3 = setInterval(function() {
            if(mdg.gamepad != null && mdg.gamepad instanceof Gamepad) {
                for(var i in mdg.gamepad.axes) {
                    if(mdg.axises[i] != mdg.gamepad.axes[i]) {
                        mdg.axises[i] = mdg.gamepad.axes[i];
                        mdg.MDGamepadDoEvent('newaxisposition', {'axis': i, 'position': mdg.gamepad.axes[i]});
                    }
                }
            }
        }, 1);
    }
    
    MDGamepadDoEvent(eventname, args) {
        if(typeof mdg.eventsList[eventname] != 'undefined') {
            mdg.eventsList[eventname](args);
        }
    }
    
    on(eventname, callback) {
        mdg.eventsList[eventname] = callback;
    }
    
    isGamepadConnected() {
        return (mdg.gamepad != null && mdg.gamepad instanceof Gamepad);
    }
    
    getGamepadType() {
        return mdg.gamepadtype;
    }
    
    isButtonPressed(buttonIndex) {
        if(mdg.isGamepadConnected()) {
            if(typeof mdg.buttons[buttonIndex] != 'undefined') {
                return mdg.buttons[buttonIndex].pressed;
            }
        } else {
            return false;
        }
    }
    
    getAxises() {
        if(mdg.isGamepadConnected()) {
            return mdg.axises;
        } else {
            return false;
        }
    }
}
