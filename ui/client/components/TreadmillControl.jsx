/*
 ./client/components/App.jsx
 */
import React from 'react';
import Dial from './dial/Dial.jsx';
import Lane from './dial/Lane.jsx';
import MeterIndicator from './dial/MeterIndicator.jsx';
import RangeIndicator from './dial/RangeIndicator.jsx';
import ButtonGroup from "./dial/ButtonGroup.jsx";
import Button from "./dial/Button.jsx";
import "shapes.css";


export default class TreadmillControl extends React.Component {
    constructor(props) {
        super(props);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.incrementSpeed = this.incrementSpeed.bind(this);
        this.decrementSpeed = this.decrementSpeed.bind(this);
        this.quickSpeed = this.quickSpeed.bind(this);
    }

    stop() {
        console.log("stop");
        this.speed.setValue(0);
    }

    reset() {
        console.log("reset");
        this.speed.setValue(0);
    }

    incrementSpeed() {
        this.speed.setValue(this.speed.getValue()+0.1);
    }

    decrementSpeed() {
        this.speed.setValue(this.speed.getValue()-0.1);
    }

    quickSpeed(e) {
        console.log(e.getValue());
        this.speed.setValue(e.getValue());
        //this.speed.setValue(this.speed.getValue()-0.1);
    }

    render() {
        return (
            <div className="treadmill-control" style={{
                textAlign: 'center',

            }}>
                <button id="stop" className="stop shape-tag right" onClick={this.stop}>STOP</button>
                <button id="reset" className="reset shape-tag left" onClick={this.reset}>RESET</button>
                <Dial id="speed-control" theme="red">
                    <Lane id="root" lane="0" radius="700" width="250px" alignment="bottom">
                        <MeterIndicator ref={meter => {this.speed=meter;} } domain={[2, 9]} arcrange={[ 1.18*Math.PI, 2.82*Math.PI ]} value="3.2" />
                        <ButtonGroup arcrange={[ 0.83*Math.PI, 1.17*Math.PI ]} style={{ alignment: 'bottom' }}>
                            <Button id="speed-increase" caption="$up"   onClick={this.incrementSpeed} />
                            <Button id="speed-decrease" caption="$down" onClick={this.decrementSpeed} />
                        </ButtonGroup>
                    </Lane>
                    <Lane id="incline" lane="1" radius="980" alignment="bottom">
                        <RangeIndicator className="incline-indicator" arcrange={[ 1.18*Math.PI, 1.75*Math.PI ]} />
                    </Lane>
                    <Lane id="autopace" lane="2" radius="1100" alignment="bottom">
                        <RangeIndicator className="autopace-indicator" value="0.3" arcrange={[ 1.18*Math.PI, 1.75*Math.PI ]} regions={[0.3, 0.6, 0.8, 1.0]} />
                    </Lane>
                    <Lane id="quickspeed" lane="3" radius="980" width="250px" alignment="bottom">
                        <ButtonGroup arcrange={[ 0.15*Math.PI, 0.7*Math.PI ]} style={{ alignment: 'bottom' }}>
                            <Button id="q1" caption="5.5" value={5.5} onClick={this.quickSpeed} />
                            <Button id="q2" caption="4.8" value={4.8} onClick={this.quickSpeed} />
                            <Button id="q3" caption="4.2" value={4.2} onClick={this.quickSpeed} />
                            <Button id="q4" caption="3.6" value={3.6} onClick={this.quickSpeed} />
                            <Button id="q5" caption="3.2" value={3.2} onClick={this.quickSpeed} />
                        </ButtonGroup>
                    </Lane>
                </Dial>
            </div>);
    }
}
