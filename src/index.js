import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import BlobContainer from './BlobContainer';

import { ModeEnums } from './Enums'
import { generateRowSizes, topToTime, generateColumnSizes } from './Helpers';

export class AvailabilityPicker extends Component {
  static propTypes = {
    // If using start-end mode
    startDate: PropTypes.instanceOf(Date),
    stopDate: PropTypes.instanceOf(Date),
    startTime: PropTypes.number,
    stopTime: PropTypes.number,

    // If using day-hour mode
    days: PropTypes.number,
    hours: PropTypes.number,

    // Override custom headers and dateFormats
    customHeaders: PropTypes.arrayOf(PropTypes.string),
    customDateFormat: PropTypes.string,
  }

  defaultHeaders = [
    "Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"
  ]

  constructor(props) {
    super(props);

    var dayHourMode = this.props.days !== undefined && this.props.hours !== undefined && this.props.startTime !== undefined
    var startEndMode = this.props.startDate !== undefined && this.props.stopDate !== undefined && this.props.startTime !== undefined && this.props.stopTime !== undefined
    if ((dayHourMode || startEndMode) === false)
      throw new Error("You must set either Day and Hour or Start and End times.")

    if (dayHourMode) {
      // Todo: checks here
      this.state = {
        mode: ModeEnums.DAY_HOUR_MODE,
        days: this.props.days,
        snap: this.props.snap,
        hours: this.props.hours || 8,
        startTime: this.props.startTime,
        gridColumns: this.props.days + 1,
        gridRows: this.props.hours + 1
      }
    } else {
      // Todo: checks here
      this.state = {
        mode: ModeEnums.START_END_MODE,
        snap: this.props.snap,
        startDate: this.props.startDate,
        stopDate: this.props.stopDate,
        startTime: this.props.startTime,
        stopTime: this.props.stopTime,
        gridColumns: this.props.stopDate.getDate() - this.props.startDate.getDate(),
        gridRows: this.props.stopTime - this.props.startTime
      }
    }
  }

  onChange = (BlobList) => {
    var { mode } = this.state;
    let dateFormattedBlobs;
    var BlobContainer = document.getElementById("BlobContainer");

    const boundingTop = BlobContainer.getBoundingClientRect().top;
    const boundingHeight = BlobContainer.getBoundingClientRect().height;

    var startTime = this.state.startTime;
    var stopTime = this.state.stopTime;

    if (mode === ModeEnums.START_END_MODE) {
      dateFormattedBlobs = BlobList.map(x => {
        // Find and set hours
        var startPercentOfBounding = x.start/boundingHeight;
        var timeDiff = (startTime/stopTime) * startPercentOfBounding
        console.log(timeDiff)
        return {
          startTime: startTime,
          stopTime: stopTime,
        }
      });
    } else {
      var endTime = this.state.startTime + this.state.hours;
      dateFormattedBlobs = BlobList.map(x => {
        return {
          startTime: topToTime(this.state.startTime, endTime, x.start, hours * 60, parseInt(x.column), mode),
          stopTime: topToTime(this.state.startTime, endTime, x.stop, hours * 60, parseInt(x.column), mode),
        }
      });
    }

    this.props.onChange({
      AvailableTimes: dateFormattedBlobs
    })
  }

  createHeader = () => {
    let table = []
    for (let i = 0; i < this.state.gridColumns; i++) {
      table.push(
        <div key={i} className={styles.headerItem}>
          {this.defaultHeaders[i % 7]}
        </div>)
    }
    return table
  }

  dateRow = (col) => {
    let rows = [];

    for (var row = 0; row < this.state.gridRows + 1; row++) {
      rows.push(<div key={row} style={{ width: "100%" }} data-col={col} data-row={row}>
        <span style={{ top:"-9px", position: "relative" }}>{(this.state.startTime + row) % 24}:00</span>
      </div>)
    }

    return rows;
  }

  createRows = (col) => {
    let rows = [];
    for (var row = 0; row < this.state.gridRows * (60/this.props.snap); row++) {
      rows.push(<div key={row.toString() + col.toString()} data-col={col} data-row={row}></div>)
    }
    return rows
  }

  createDays = () => {
    let RowTable = []
    for (let col = 0; col < (this.state.gridColumns); col++) {
      RowTable.push(
        <div key={col.toString()} id={`date-row-${col}`} data-col={col} className={col === -1 ? "time-row" : "date-row"} style={{height:"100%"}}>
          {this.createRows(col)}
        </div>)
    }
    return <div id="RowContainer">
      <div style={{...generateColumnSizes(this.state.gridColumns), height:"100%"}}>{RowTable}</div>
    </div>
  }

  render() {
    return (
      <div id="ReactDatePicker" className="rdp-grid" style={this.props.style}>
        <div className="rdp-header" style={generateColumnSizes(this.state.gridColumns)}>{this.createHeader()}</div>
        <div className="rdp-date-column" style={generateRowSizes(this.state.gridRows)}>{this.dateRow(this.state.hours)}</div>
        <div className="rdp-body">
          {this.createDays()}
          <BlobContainer snap={this.props.snap} cols={this.state.gridColumns} rows={this.state.gridRows} style={{ position: "absolute", width: "100%", background: "rgba(255,0,0,0.2)", top: 0, bottom: "50px" }} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

/*


        <div style={{ ...this.props.style }} className={styles.wrapper}>
          <div className="headerRow" style={{ display: "grid", gridTemplateColumns: "50px auto" }}>
            <div style={{ width: "50px" }}></div>
            <div style={generateRowSizes(this.state.gridRows - 1)}>
              {this.createHeader()}
            </div>
          </div>

          <div className="bodyRow" style={{ display: "grid", gridTemplateColumns: "50px auto" }}>
            <div style={{ width: "50px" }}>{this.dateRow()}</div>
            <div id="DatePickerContent" style={{ position: 'relative' }}>
              {this.createDays()}
              <BlobContainer style={{ position: "absolute", width: "100%", background: "rgba(255,0,0,0.2)", top: 0, bottom: "50px" }} onChange={this.onChange} />
            </div>
          </div>
        </div>

*/
