/**
 * @flow
 *
 * <BuildingDetail/> manages the time that's passed on to the rest of the
 * building.
 */

import React from 'react'
import type {BuildingType} from '../types'
import type momentT from 'moment'
import moment from 'moment-timezone'
import {BuildingDetail} from './building'

const CENTRAL_TZ = 'America/Winnipeg'

export class BuildingHoursDetailView extends React.PureComponent {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.state.params.building.name,
    }
  }

  state: {intervalId: number, now: momentT} = {
    intervalId: 0,
    // now: moment.tz('Wed 7:25pm', 'ddd h:mma', null, CENTRAL_TZ),
    now: moment.tz(CENTRAL_TZ),
  }

  componentWillMount() {
    // This updates the screen every ten seconds, so that the building
    // info statuses are updated without needing to leave and come back.
    this.setState({intervalId: setInterval(this.updateTime, 10000)})
  }

  componentWillUnmount() {
    clearTimeout(this.state.intervalId)
  }

  props: {navigation: {state: {params: {building: BuildingType}}}}

  updateTime = () => {
    this.setState({now: moment.tz(CENTRAL_TZ)})
  }

  render() {
    const info = this.props.navigation.state.params.building
    const {now} = this.state

    return <BuildingDetail info={info} now={now} />
  }
}
