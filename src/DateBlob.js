import React, { Component } from 'react';
import PropTypes from 'prop-types';


import styles from './styles.css';
import './styles2.css';


export default class DateBlob extends Component {
  EVENTS = {
    MOVE: "MOVE",
    RESIZE: "RESIZE"
  };

  constructor(props) {
    super(props);
    this.state = {
      moveStart: 0,
      mouseDown: false,
      blob: this.props.blob,
      parents: []
    }
  }

  snap = (top) => {
    var closest = this.props.snapValues.reduce(function (prev, curr) {
      return (Math.abs(curr - top) < Math.abs(prev - top) ? curr : prev);
    });
    return closest
  }

  deleteBlob = (id) => {
    var { blob } = this.state;
    blob.visible = false;
    this.props.deleteBlob(id)
  }

  render() {
    var {
      blob
    } = this.state;

    var blobStyle = {
      top: blob.start,
      height: blob.stop - blob.start,
      width: "100px",
      position: "absolute",
      backgroundColor: "red",
      width: "50px",
      userSelect: "none"
    }
    return (
      <div
        style={blobStyle}
        className="blob"
        onClick={this.onClick}
        data-id={blob.blobID}
        data-click-type={this.props.temp?"temp-blob":"blob"}>
        <span style={{cursor:"pointer", position:'absolute', top:0, right:0, padding:2, backgroundColor:"blue"}} data-id={blob.blobID} onClick={this.props.events.deleteBlob}>x</span>
        {blob.blobID}<br />
      </div>
    )
  }
}

DateBlob.propTypes = {
  start: PropTypes.number,
  stop: PropTypes.number,
  visible: PropTypes.bool,
  background: PropTypes.string,
  temp: PropTypes.bool
}