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
      blob: this.props.blob
    }
  }

  componentDidMount() {
  }

  onClick = () => {
  }

  snap = (top) => {
    var closest = this.props.snapValues.reduce(function (prev, curr) {
      return (Math.abs(curr - top) < Math.abs(prev - top) ? curr : prev);
    });
    return closest
  }

  onMouseDown = (event) => {
    event.target.parentElement.parentElement.addEventListener("mousemove", this.onMouseMove, true);
    event.target.parentElement.parentElement.addEventListener("mouseup", this.onMouseUp, true);
    if (event.target.offsetHeight + event.target.offsetTop - event.clientY > 4) {
      var mouseToTopOfBlobOffset = event.clientY - this.state.blob.start;
      var mouseToBottomOfBlobOffset = event.clientY - this.state.blob.stop;
      this.setState({
        mouseToTopOfBlobOffset: mouseToTopOfBlobOffset,
        mouseToBottomOfBlobOffset: mouseToBottomOfBlobOffset,
        mouseDown: true,
        currentEvent: this.EVENTS.MOVE
      });
    } else {
      var mouseToTopOfBlobOffset = event.clientY - this.state.blob.start;
      var mouseToBottomOfBlobOffset = event.clientY - this.state.blob.stop;
      this.setState({
        mouseToTopOfBlobOffset: mouseToTopOfBlobOffset,
        mouseToBottomOfBlobOffset: mouseToBottomOfBlobOffset,
        mouseDown: true,
        currentEvent: this.EVENTS.RESIZE
      });
    }
  }

  onMouseMove = (event) => {
    if (this.state.mouseDown) {
      if (this.state.currentEvent === this.EVENTS.RESIZE) {
        var { blob } = this.state;
        blob.stop = this.snap(event.clientY);
        this.setState({
          moveStart: event.clientY,
          blob: blob
        });

      } else {
        var {
          mouseToTopOfBlobOffset,
          mouseToBottomOfBlobOffset
        } = this.state;
        var { blob } = this.state;
        blob.start = this.snap((event.clientY - mouseToTopOfBlobOffset));
        blob.stop = this.snap(event.clientY - mouseToBottomOfBlobOffset);
        this.setState({
          moveStart: event.clientY,
          blob: blob
        });
      }
    }
  }

  onMouseUp = () => {
    event.target.parentElement.parentElement.removeEventListener("mouseup", this.onMouseUp, false);
    event.target.parentElement.parentElement.removeEventListener("mousemove", this.onMouseMove, false);
    var { blob } = this.state;
    this.setState({
      mouseDown: false
    })
    this.props.updateBlob(blob.blobID, blob)
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
        onMouseDown={this.onMouseDown}
        onMouseMove={this.onMouseMove}
        onMouseUp={this.onMouseUp}>
        {blob.blobID}
      </div>
    )
  }
}