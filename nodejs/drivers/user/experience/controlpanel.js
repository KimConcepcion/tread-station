'use strict';
const Session = require("./session");

/*
 * This controller provides high level behavioral control over the treadmill controller. It keeps the controller drivers
 * simple by implementing the running logic here. The interface to this controller should be similar to the human interface
 * you would experience on a real treadmill.
 *
 */

//const Simulation = require('./controllers/simulation.js');
//const Nordic = require('./controllers/nordic.js');


class ControlPanel {
    constructor() {
        this.name = "Treadmill Control";
        this.devicePath = "controlpanel";
        this.description = "Provides user experience for treadmill control";
        this.devices = [];
        this.driver = {};
        this.depends = ["motion/controllers"];

        this.currentSpeed = 0;
        this.desiredSpeed = 0;
        this.speedMeasured = 0;
        this.accelleration = 1;

        this.currentIncline = 0;
        this.desiredIncline = 0;

        // limits - in native format
        this.speedIncrement = this.MPHtoNative(0.1);
        this.minSpeed = 2; // this is a built in limit of the speed controller
        this.maxSpeed = 9;

        this.inclineIncrement = this.inclineGradeToNative(1);
        this.minIncline = this.inclineGradeToNative(0);
        this.maxIncline = this.inclineGradeToNative(50);

        this.session = null;
    }

    probe(props) {
        if(this.refs.controllers && this.refs.controllers.devices && this.refs.controllers.devices.length>0) {
            let devs = this.refs.controllers.devices;
            let sim = null;
            this.motion = null;
            for(let i=0, _i=devs.length; i<_i; i++) {
                if(!devs[i].simulation) {
                    this.motion = devs[i];
                    break;
                } else
                    sim = devs[i];
            }
            if(this.motion===null) {
                if(sim) {
                    this.motion = sim;
                } else {
                    console.log("no motion controller available, at least I require the simulation controller");
                    return false;
                }
            }

            this.system = props;
            this.sessionChannel = this.postal.channel("session");

            this.devices.push(this);
            console.log("selected "+this.motion.name+" motion controller");

            // setting a user enables the control panel
            this.subscriptions = {
                enable: this.postal.subscribe({
                        channel: "user",
                        topic: "selected",
                        callback: (user) => {
                            if(user) {
                                // start a new session and enable the control panel
                                this.__newSession(user);
                                this.enable();
                            } else {
                                // user logged out, close his session and disable the control panel
                                this.__closeSession();
                                this.disable();
                            }
                        }})
            };

            return !!this.motion;
        }
        return false; // no controllers to try
    }

    enable() {
        console.log("enabling control panel for "+this.session.user.name);

        // startup a thread to send status every 1 second
        if(this.__updateInterval)
            clearInterval(this.__updateInterval);
        this.__updateInterval = setInterval(function() { this.__updateStatus() }.bind(this), 1000);
        this.active = true;
        this.__sendStatus();
    }

    disable() {
        console.log("disabling control panel");

        this.active = false;
        if(this.__updateInterval) {
            clearInterval(this.__updateInterval);
            this.__updateInterval = null;
        }
        this.__sendStatus();
    }


    __closeSession()
    {
        if(this.session) {
            this.session.deactivate();
            this.sessionChannel.publish("close", this.session);
            this.session = null;
        }
    }

    __newSession(user)
    {
        this.__closeSession();
        this.reset();
        this.system.session = this.session = new Session(user);
        if(user.goaltime!==null)
            this.goaltime=user.goaltime;
        if(user.goaldistance!==null)
            this.goaldistance=user.goaldistance;
        this.session.activate();
        this.sessionChannel.publish("new", this.session);
        //console.log("created new session");
    }

    __speed(value) {
        this.motion.speed(value);
        this.__sendEvent("speed", { value: value });
    }

    __activate() {
        this.motion.enable();
        this.__sendEvent("active", { active: true });
    }

    __deactivate() {
        this.motion.disable();
        this.__sendEvent("active", { active: false });
    }

    speed(value) {
        if(!this.motion) return false;

        var was_active = this.active;

        // TODO: The accelleration verbs
        if(value==="STOP") {
            return this.stop();
        } else if(value==="PANIC" || value==="ESTOP") {
            return this.fullstop();
        } else if(value==="START") {
            return this.speed("2.0");
        } else if(value==="++") {
            this.active = true;
            this.desiredSpeed += this.speedIncrement;
        } else if(value==="--") {
            this.active = true;
            this.desiredSpeed -= this.speedIncrement;
        } else if(!Number.isNaN(value)) {
            // startup if stopped
            this.active = true;
            console.log("speed <= "+value);
            this.desiredSpeed = this.MPHtoNative(Number(value)).clamp(this.minSpeed, this.maxSpeed);
        } else {
            console.trace("unexpected speed value", value);
        }

        // check limits
        if(this.desiredSpeed>this.maxSpeed)
            this.desiredSpeed=this.maxSpeed;
        else if(this.desiredSpeed<this.minSpeed && this.desiredSpeed>0)
            this.desiredSpeed=this.minSpeed;

        // start to accellerate or deccellerate
        /*if(this.currentSpeed < this.desiredSpeed)
            this.accellerate();
        else if(this.currentSpeed > this.desiredSpeed)
            this.deccellerate();*/

        // update the PWM
        this.headline = null;   // clear any headline
        this.__speed(this.desiredSpeed);
        if(!was_active && this.active) {
            this.__activate();
            if(!this.motion.active)
                this.motion.enable();
        }
    }

    incline(value)
    {
        if(value==="++") {
            this.desiredIncline += this.inclineIncrement;
        } else if(value==="--") {
            this.desiredIncline -= this.inclineIncrement;
        } else if(value==="FLOOR") {
            this.desiredIncline = this.minIncline;
        } else if(!isNaN(value)) {
            value = clamp(Number(value), this.minIncline, this.maxIncline);
        }

        // TODO: do something here to make the incline change
    }
/*
    accellerate()
    {
        if(this.currentSpeed !== this.desiredSpeed) {
            this.currentSpeed += this.accelleration;
            if(this.currentSpeed < this.minSpeed)
                this.currentSpeed = this.minSpeed;

            if(this.currentSpeed > this.maxSpeed)
                this.currentSpeed = this.maxSpeed;
            else if(this.currentSpeed > this.desiredSpeed)
                this.currentSpeed = this.desiredSpeed;
            else {
                setTimeout(function() { this.accellerate(); }.bind(this), 100);
            }
            this.__speed(this.currentSpeed);
        }
        this.__sendStatus();
    }

    deccellerate()
    {
        if(this.currentSpeed !== this.desiredSpeed) {
            this.currentSpeed -= this.accelleration;
            if (this.currentSpeed < this.minSpeed) {
                // we've stopped
                this.fullstop();
            } else if (this.currentSpeed < this.desiredSpeed) {
                this.currentSpeed = this.desiredSpeed;
            } else {
                setTimeout(function() { this.deccellerate(); }.bind(this), 100);
            }
            this.__speed(this.currentSpeed); // new
        }
        this.__sendStatus();
    }
*/
    __stop(value) {
        if(!this.motion) return false;
        this.__sendEvent("stop");
        this.motion.stop(value)
    }

    stop()
    {
        // todo: somehow the autpace UI driver needs to get an event from here
        //if(this.autopace.active)
        //    this.activateAutopace(false);
        this.__stop();
        this.__updateStatus();
    }

    fullstop()
    {
        // todo: somehow the autpace UI driver needs to get an event from here
        //if(this.autopace.active)
        //    this.activateAutopace(false);

        this.active = false;
        this.motion.stop();
        this.desiredSpeed=0;
        //this.currentSpeed=0;
        this.headline = "Emergency!";
        this.__sendEvent("fullstop");
        this.__updateStatus();
    }

    reset()
    {
        this.stop();
        this.runningSince=null;
        this.runningTime = 0;
        if(this.session)
            this.session = null;    // session begins when user starts treadmill again
        this.__sendStatus();
        this.__sendEvent("reset");
    }

    __sendEvent(name, data) {
        this.bus.publish("event."+name, data);
    }

    __updateStatus() {
        var now = new Date();

        // if we are starting or stopping, then start our running timer
        if(this.session) {
            if (!this.active && this.session.runningSince != null) {
                // we are stopping, add latest runtime to accumulated total
                this.runningTime += new Date().valueOf() - this.runningSince.valueOf();
                this.runningSince = null;
            } else if (this.active && this.session.runningSince == null) {
                // we are starting up, could be a new session or a continuation of an existing session
                if (this.session.id == null) {
                    // new session
                    this.runningSince = new Date();
                    this.session.id = this.runningSince.unix_timestamp();
                } else {
                    this.runningSince = new Date();
                }
            }
        }


        // HACK: make the incline move for now
        if(this.desiredIncline != this.currentIncline) {
            if(this.currentIncline < this.desiredIncline)
                this.currentIncline += this.inclineIncrement;
            else
                this.currentIncline -= this.inclineIncrement;
        }

        this.__sendStatus();
    };

    state() {
        if(this.motion.desired===0 && this.motion.value>0)
            return "Stopping";
        else if(!this.motion.active || this.motion.value===0)
            return "Stopped";
        else if(this.motion.desired>this.minSpeed && this.motion.value<this.minSpeed)
            return "Starting";
        else if(this.motion.active && this.motion.value>=8)
            return "Sprinting";
        else if(this.motion.active && this.motion.value>=5.6)
            return "Running";
        else if(this.motion.active && this.motion.value>=4.2)
            return "Jogging";
        else if(this.motion.active && this.motion.value>=3.0)
            return "Walking";
        else if(this.motion.active && this.motion.value>=2.0)
            return "Walking Dead";
        else
            return"Duck!";  // we should never get here
    }

    __sendStatus() {
        let status = {
            type: 'status',
            headline: this.headline ? this.headline : this.state(),
            timestamp: new Date(),
            active: this.active,
            runningSince: this.session ? this.session.runningSince : null,
            runningTime: this.session ? this.session.getTotalRunningMillis() : 0,
            distance: this.session ? this.session.distance : 0,
            //currentSpeed: this.nativeToMPH(this.currentSpeed),
            currentSpeed: this.nativeToMPH(this.motion.value),
            desiredSpeed: this.nativeToMPH(this.desiredSpeed),
            currentIncline: this.nativeToInclineGrade(this.currentIncline),
            desiredIncline: this.nativeToInclineGrade(this.desiredIncline)
        };
        this.bus.publish("state", status);
    }

    MPHtoNative(value)
    {
        // 90 is 2mph, 150 is 3.4mph, 250 is 6mph
        return Number(value);// * 45;
    }

    nativeToMPH(value)
    {
        return Number(value);// / 45;
    };

    inclineGradeToNative(value)
    {
        return Number(value);
    };

    nativeToInclineGrade(value)
    {
        return Number(value);
    };

};

module.exports = ControlPanel;
