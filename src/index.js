import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';
import './styles2.css';
import BlobContainer from './BlobContainer';

import { generateRowSizes, topToTime, generateGridCSS } from './Helpers';

export default class AvailabilityPicker extends Component {
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

    var dayHourMode = this.props.days !== undefined && this.props.hours !== undefined
    var startEndMode = this.props.startDate !== undefined && this.props.stopDate !== undefined && this.props.startTime !== undefined && this.props.stopTime !== undefined
    if ((dayHourMode || startEndMode) === false)
      throw new Error("You must set either Day and Hour or Start and End times.")



    if (dayHourMode) {
      // Todo: checks here
      this.state = {
        days: this.props.days,
        hours: this.props.hours || 8,
        gridRows: this.props.days + 1,
        gridColumns: this.props.hours + 1
      }
    } else {
      // Todo: checks here
      this.state = {
        startDate: this.props.startDate,
        stopDate: this.props.stopDate,
        startTime: this.props.startTime,
        endTime: this.props.endTime,
        gridRows: this.props.stopDate.getDate() - this.props.startDate.getDate(),
        gridColumns: this.props.stopTime - this.props.startTime
      }
    }

  }

  onChange = (BlobList) => {
    var {
      startTime,
      endTime,
      hours
    } = this.state;
    var dateFormattedBlobs = BlobList.map(x => {
      return {
        startTime: topToTime(startTime, endTime, x.start, hours * 60, parseInt(x.column)),
        endTime: topToTime(startTime, endTime, x.stop, hours * 60, parseInt(x.column)),
      }
    })
    this.props.onChange({
      AvailableTimes: dateFormattedBlobs
    })
  }

  createHeader = () => {
    let table = []
    for (let i = 0; i < this.state.days; i++) {
      table.push(
        <div className={styles.headerItem}>
          {this.defaultHeaders[i]}
        </div>)
    }
    return table
  }

  dateRow = (col) => {
    let rows = [];

    for (var row = 0; row < this.state.hours + 1; row++) {
      rows.push(<div key={row} style={{ width: "100%", height: "60px" }} data-col={col} data-row={row}>
        <span style={{ top: "-10px", position: "relative" }}>{(this.state.startTime + row) % 24}:00</span>
      </div>)
    }

    return rows;
  }

  createRows = (col) => {
    let rows = [];
    for (var row = 0; row < this.state.hours; row++) {
      rows.push(<div key={row.toString() + col.toString()} data-col={col} data-row={row} className={"row"}></div>)
    }
    return rows
  }

  createDays = () => {
    let RowTable = []
    for (let col = 0; col < this.state.days; col++) {

      let colBlobs = this.state.blobs.filter(x => x.column == col);
      if (this.state.blob.column == col) {
        colBlobs.push(this.state.blob)
      }
      RowTable.push(
        <div key={col.toString()} id={`date-row-${col}`} data-col={col} className={col === -1 ? "time-row" : "date-row"}>
          {this.createRows(col)}
        </div>)
    }
    return <div id="RowContainer">
      <div style={generateRowSizes(this.state.gridRows - 1)}>{RowTable}</div>
    </div>
  }

  render() {
    return (
      <div id="ReactDatePicker" className="rdp-grid" style={this.props.style}>
        <div className="rdp-header">{this.createHeader()}</div>
        <div className="rdp-date-column">{this.dateRow()}</div>
        <div className="rdp-body">
          {this.createDays()}
          <BlobContainer style={{ position: "absolute", width: "100%", background: "rgba(255,0,0,0.2)", top: 0, bottom: "50px" }} onChange={this.onChange} />
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
