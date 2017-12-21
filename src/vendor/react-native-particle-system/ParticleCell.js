import React from 'react'
import {requireNativeComponent} from 'react-native'

const PSParticleCell = requireNativeComponent('PSParticleCell', null)

export default class ParticleCell extends React.Component {

  render() {
    return <PSParticleCell {...this.props}/>
  }

}