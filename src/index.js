import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import './styles2.css';

export default class AvailabilityPicker extends Component {
  static propTypes = {
    text: PropTypes.string
  }
  headers = [
    "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
  ]
  constructor(props) {
    super(props);
    // Todo: checks here
    this.state = {
      days: this.props.days || 7,
      hours: this.props.hours || 24,
      mouseDown: false,
      selecting: false,
      start: 0,
      min: this.props.hours + 1,
      max: -1
    }
    this.createHours();
  }

  createHours = () => {
    var colsArray = this.props.value;
    for (let i = 0; i < this.state.days; i++) {
      colsArray.push([])
      for (let j = 0; j < this.state.hours; j++) {
        colsArray[i].push({ selected: false })
      }
    }
  }

  createHeader = () => {
    let table = []
    for (let i = 0; i < this.state.days; i++) {
      table.push(
        <div className={styles.headerItem}>
          {this.headers[i]}
        </div>)
    }
    return table
  }

  createDays = () => {
    let table = []
    for (let i = 0; i < this.state.days; i++) {
      table.push(
        <div id={`date-row-${i}`} data-col={i} className={styles.dateRow} onMouseUp={this.onMouseUp}>
          {
            this.props.value[i].map((x, j) => {
              return <div data-col={i} data-row={j} onMouseOver={this.onMouseOver} className={x.selected ? "row" : "selectedRow"} ></div>
            })
          }
        </div>)
    }
    return table
  }

  oneMouseDown = (event) => {
    var colsArray = this.props.value;
    this.setState({
      mouseDown: !this.state.mouseDown,
      selectedCol: event.target.dataset.col,
      selecting: !colsArray[event.target.dataset.col][event.target.dataset.row].selected,
      start: event.target.dataset.row,
      min: this.props.hours + 1,
      max: -1
    });
    if (!this.state.mouseDown) {
      colsArray[event.target.dataset.col][event.target.dataset.row].selected = !colsArray[event.target.dataset.col][event.target.dataset.row].selected;
      this.props.onChange(colsArray);
    }
  }

  onMouseOver = (event) => {
    var colsArray = this.props.value;
    if (this.state.mouseDown) {
      var row = event.target.dataset.row;
      var col = event.target.dataset.col;
      this.setState({
        min: Math.min(this.state.min, row)
      })
      this.setState({
        max: Math.max(this.state.max, row)
      })
      if (this.state.selectedCol === col) {
        for (var i = this.state.min; i <= this.state.max; i++) {
          colsArray[col][i].selected = !this.state.selecting;
        }
        for (var i = Math.min(this.state.start, row); i <= Math.max(this.state.start, row); i++) {
          colsArray[col][i].selected = this.state.selecting;
        }
      } else {
        for (var i = this.state.min; i <= this.state.max; i++) {
          colsArray[this.state.selectedCol][i].selected = !this.state.selecting;
        }
        for (var i = Math.min(this.state.start, row); i <= Math.max(this.state.start, row); i++) {
          colsArray[this.state.selectedCol][i].selected = this.state.selecting;
        }
      }
      this.props.onChange(colsArray);
    }
  }

  onMouseUp = (event) => {
    this.setState({
      mouseDown: false
    });
  }

  render() {
    return (
      <div style={{ ...this.props.style }} className={styles.wrapper}>
        <div className={styles.header}>
        {this.createHeader()}
        </div>
        <div className={styles.calendar7Days} onMouseDown={this.oneMouseDown} onMouseUp={this.onMouseUp}>
          {this.createDays()}
        </div>
      </div>
    )
  }
}
