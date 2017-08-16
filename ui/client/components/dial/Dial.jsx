/*
  ./client/components/Dial.jsx
*/
import React from 'react';
import ReactDOM from 'react-dom';
import * as dialjs from './js/dial.js';
import {ButtonGroupIndicator} from './js/button-indicator.js';
import {AutoPaceIndicator} from './js/autopace-indicator.js';
import {InclineIndicator} from './js/incline-indicator.js';
import Lane from "./Lane.jsx";
import "./css/defaults.css";
import "./css/red.css";

var dialDefaults = {
    // none so far
    width: '700px',
    height: '700px'
};

export default class Dial extends React.Component {
    componentDidMount() {
        var el = ReactDOM.findDOMNode(this.refs.dialComp);
        this.options = dialDefaults;
        //this.dialControl = document.createElement("div");
        var dial = this.dial = new dialjs.Dial(el, this.options);

        // speed increment/decrement buttons
        dial.plugin("increment",  new ButtonGroupIndicator({
            lane: {
                ordinal: 0,
                //offset: dial.getLane(-1).offset,     // make this lane start at the same offset as lane 1
                alignment: 'bottom'
            },
            arcrange: [ 0.83*Math.PI, 1.17*Math.PI ],
            button_options: {
                background: {
                    fill: '#222',
                    margin: { inner: dial.progress.lane.offset - dial.speed.lane.offset }
                },
                text: {
                    color: '#aaa',
                    size: '90px'
                },
                click: function(b) { if(b.name=="speed-increase") treadmill.increaseSpeed(); else treadmill.decreaseSpeed(); }
            },
            buttons: [
                {
                    id: "speed-increase",
                    caption: "$up"
                },
                {
                    id: "speed-decrease",
                    caption: "$down"
                }
            ]
        }));

        /*dial.plugin("autopace",  new AutoPaceIndicator({
            lane: {
                ordinal: 1,
                alignment: 'left'
            },
            arcrange: 0.6*Math.PI
        }));
        dial.plugin("incline",  new InclineIndicator({
            lane: {
                ordinal: 2,
                alignment: 'left'
            },
            arcrange: 0.6*Math.PI
        }));*/

        // speed macro buttons
        /*dial.plugin("quickdial",  new ButtonGroupIndicator({
            lane: {
                ordinal: 3,
                offset: dial.getLane(1).offset,     // make this lane start at the same offset as lane 1
                width: 400,                         // set as a large width for our buttons
                alignment: 'right'
            },
            arcrange: [ 0.75*Math.PI, 0.15*Math.PI ],
            button_options: {
                background: {
                    fill: '#222'
                },
                text: {
                    color: '#aaa',
                    size: '90px'
                },
                //click: function(b) { dial.speed.set(Number(b.caption)); }
                click: function(b) { treadmill.setSpeed(Number(b.caption)); }
            },
            buttons: [
                "3.2","3.6","4.2","4.8","5.5"
            ]
        }));

        dial.zoom(1.5, 1000);
*/
    }

    render() {
        return (
            <div id="speed-dial" ref="dialComp" className="chartComp" style={{textAlign: 'center' }}>
                <svg className="dial" viewBox="-1500 -1500 3000 3000">
                    <defs></defs>
                    <g className="background"></g>
                    <g className="ticks">
                        <g className="background-ticks"></g>
                    </g>
                    <g className="lanes">{this.props.children.map( (c) => { if(c.type === Lane) return c; } )}</g>
                    <g className="status"></g>
                </svg>
            </div>);
    }
}

