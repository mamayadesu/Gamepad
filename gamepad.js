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
        this.gpid = 0;
        this.interval1 = setInterval(function() {
            this.gamepads = navigator.getGamepads();
            if(this.gamepads.length > 0) {
                if(typeof this.gamepads[this.gpid] != "undefined" && this.gamepads[this.gpid] != null) {
                    if(this.gamepad == null) {
                        this.gamepad = this.gamepads[this.gpid];
                        if(this.gamepad != null) {
                            this.gamepadtype = this.gamepad.id;
                            for(var i in this.gamepad.axes) {
                                this.axises[i] = this.gamepad.axes[i];
                            }
                            this.MDGamepadDoEvent('connected', []);
                            for(var i in this.gamepad.buttons) {
                                if(this.gamepad.buttons[i] instanceof GamepadButton) {
                                    this.buttons[i] = [];
                                    this.buttons[i].pressed = false;
                                }
                            }
                        }
                    } else {
                        //if(this.gamepad != this.gamepads[0]) { // works incorrectly in new versions of Google Chrome
                        if(this.gamepads[this.gpid] != null && this.gamepad.id != this.gamepads[this.gpid].id) {
                            this.MDGamepadDoEvent('disconnected', []);
                            this.buttons = [];
                            this.gamepad = null;
                            this.gamepadtype = null;
                            
                            this.gamepad = this.gamepads[this.gpid];
                            this.gamepadtype = this.gamepad.id;
                            this.MDGamepadDoEvent('connected', []);
                            for(var i in this.gamepad.buttons) {
                                if(this.gamepad.buttons[i] instanceof GamepadButton) {
                                    this.buttons[i] = [];
                                    this.buttons[i].pressed = false;
                                }
                            }
                        } else {
                            this.gamepad = this.gamepads[this.gpid];
                        }
                    }
                } else {
                    if(this.gamepad != null && this.gamepad instanceof Gamepad) {
                        for(var i in this.buttons) {
                            if(this.buttons[i].pressed == true) {
                                this.MDGamepadDoEvent('buttonup', {'button': i});
                            }
                        }
                        this.MDGamepadDoEvent('disconnected', []);
                        this.buttons = [];
                        this.axises = [];
                        this.gamepad = null;
                        this.gamepadtype = null;
                    }
                }
            } else {
                if(this.gamepad != null && this.gamepad instanceof Gamepad) {
                    for(var i in this.buttons) {
                        if(this.buttons[i].pressed == true) {
                            this.MDGamepadDoEvent('buttonup', {'button': i});
                        }
                    }
                    this.MDGamepadDoEvent('disconnected', []);
                    this.buttons = [];
                    this.axises = [];
                    this.gamepad = null;
                    this.gamepadtype = null;
                }
            }
        }.bind(this), 1);
        
        this.interval2 = setInterval(function() {
            if(this.gamepad != null && this.gamepad instanceof Gamepad) {
                for(var i in this.gamepad.buttons) {
                    if(this.gamepad.buttons[i] instanceof GamepadButton) {
                        if(this.buttons[i].pressed == false && this.gamepad.buttons[i].pressed == true) {
                            this.MDGamepadDoEvent('buttondown', {'button': i});
                            this.buttons[i].pressed = true;
                        } else if(this.buttons[i].pressed == true && this.gamepad.buttons[i].pressed == false) {
                            this.MDGamepadDoEvent('buttonup', {'button': i});
                            this.buttons[i].pressed = false;
                        }
                    }
                }
            }
        }.bind(this), 1);
        
        this.interval3 = setInterval(function() {
            if(this.gamepad != null && this.gamepad instanceof Gamepad) {
                for(var i in this.gamepad.axes) {
                    if(this.axises[i] != this.gamepad.axes[i]) {
                        this.axises[i] = this.gamepad.axes[i];
                        this.MDGamepadDoEvent('newaxisposition', {'axis': i, 'position': this.gamepad.axes[i]});
                    }
                }
            }
        }.bind(this), 1);
    }
    
    MDGamepadDoEvent(eventname, args) {
        if(typeof this.eventsList[eventname] != 'undefined') {
            this.eventsList[eventname](args);
        }
    }
    
    on(eventname, callback) {
        this.eventsList[eventname] = callback;
    }
    
    isGamepadConnected() {
        return (this.gamepad != null && this.gamepad instanceof Gamepad);
    }
    
    getGamepadType() {
        return this.gamepadtype;
    }
    
    isButtonPressed(buttonIndex) {
        if(this.isGamepadConnected()) {
            if(typeof this.buttons[buttonIndex] != 'undefined') {
                return this.buttons[buttonIndex].pressed;
            }
        } else {
            return false;
        }
    }
    
    getAxises() {
        if(this.isGamepadConnected()) {
            return this.axises;
        } else {
            return false;
        }
    }
    
    setGamepadId(id) {
        if(parseInt(id) == NaN) {
            return;
        }
        if(this.gamepad != null && this.gamepad instanceof Gamepad) {
            for(var i in this.buttons) {
                if(this.buttons[i].pressed == true) {
                    this.MDGamepadDoEvent('buttonup', {'button': i});
                }
            }
            this.MDGamepadDoEvent('disconnected', []);
            this.buttons = [];
            this.axises = [];
            this.gamepad = null;
            this.gamepadtype = null;
        }
        this.gpid = id;
    }
    
    getGamepadId() {
        return this.gpid;
    }
    
    getCountOfConnectedGamepads() {
        var c = 0;
        var arr = navigator.getGamepads();
        for(var item in arr) {
            if(arr[item] instanceof Gamepad) {
                c++;
            }
        }
        return c;
    }
}
