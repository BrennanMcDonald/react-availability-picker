# react-availability-picker

> A calander abailability picker

[![NPM](https://img.shields.io/npm/v/react-availability-picker.svg)](https://www.npmjs.com/package/react-availability-picker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install



```bash
npm install --save react-availability-picker
```

## Usage

For the date and time bounds of the picker, one of two methods can be used, either start-end date mode where you specify a first date and last date as well as the start and end times for the date range

### In start-end mode
```jsx
import React, { Component } from 'react'

import AvailabilityPicker from 'react-availability-picker'

class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      AvailableDates: []
    }
  }

  onChange(value) {
    this.setState({
      AvailableDates: value
    });
  }

  render () {
    var startDate = Date.parse('01 Jan 2020 09:00:00 EST');
    var endDate = Date.parse('08 Jan 2020 17:00:00 EST');
    return (
      <AvailabilityPicker
        value={this.state.AvailableDates}
        onChange={this.onChange}
        startDate={startDate}
        endDate={endDate} />
    )
  }
}
```

### In day-hour mode
```jsx
import React, { Component } from 'react'

import AvailabilityPicker from 'react-availability-picker'

class Index extends Component {

  constructor(props){
    super(props);
    this.state = {
      AvailableDates: []
    }
  }

  onChange(value) {
    this.setState({
      AvailableDates: value
    });
  }

  render () {
    var startTime = Date.parse('01 Jan 1970 09:00:00 GMT');
    return (
      <AvailabilityPicker
        value={this.state.AvailableDates}
        onChange={this.onChange}
        startTime={startTime}
        days={7}
        hours={9} />
    )
  }
}
```
## License

GPL-3.0 © [BrennanMcDonald](https://github.com/BrennanMcDonald)
