import React, { Component } from 'react'


import AvailabilityPicker from 'react-availability-picker'

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      colValues: []
    }
  }

  onChange = (value) => {
    this.setState({
      colValues: value
    })
    console.log(value)
  }

  render() {
    var startDate = new Date();
    var endDate = new Date();

    endDate.setDate(startDate.getDate() + 7)

    return (
      <div className="fullheight">
        <AvailabilityPicker 
          style={{ width: "500px", height: "500px" }} 
          startTime={9}
          stopTime={20}
          startDate={startDate}
          stopDate={endDate}
          value={this.state.colValues}
          onChange={this.onChange} />
      </div>
    )
  }
}
