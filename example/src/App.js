import React, { Component } from 'react'


import AvailabilityPicker from 'react-availability-picker'

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      colValues: {AvailableTimes: []}
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

    endDate.setDate(startDate.getDate() + 14)

    return (
      <div className="fullheight">
        <AvailabilityPicker 
          style={{ width: "700px", height: "500px" }} 
          startTime={9}
          stopTime={19}
          snapEvery={20}
          startDate={startDate}
          stopDate={endDate}
          value={this.state.colValues}
          onChange={this.onChange} />
          <div>
            {
              this.state.colValues.AvailableTimes.map(x => {
                return <div>{x.startTime.toString()} -> {x.stopTime.toString()}</div>
              })
            }
          </div>
      </div>
    )
  }
}
