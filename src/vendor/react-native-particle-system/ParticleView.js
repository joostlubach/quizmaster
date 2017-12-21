import React from 'react'
import {requireNativeComponent} from 'react-native'
import DynamicProperty from './DynamicProperty';

const PSParticleView = requireNativeComponent('PSParticleView', null)

export default class ParticleView extends React.Component {
  static defaultProps = {
    birthRate: 1,
    lifetime: 1,
    emitterPosition: {x:0, y:0},
    emitterZPosition: 0,
    emitterShape: 'point',
    emitterSize: {width:0, height:0},
    emitterMode: 'volume',
    renderMode: 'unordered',
    emitterDepth: 0,
    preservesDepth: false,
    velocity: 1,
    scale: 1,
    spin: 1,
    seed: 0
  }

  render() {
    const children = []
    const dynamicProperties = []

    React.Children.forEach(this.props.children, child => {
      if (!React.isValidElement(child) || child.type !== DynamicProperty) {
        children.push(child)
        return
      }

      dynamicProperties.push(child.props)
    })

    return <PSParticleView {...this.props} dynamicProperties={dynamicProperties} children={children}/>
  }
}