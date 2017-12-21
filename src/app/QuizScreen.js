import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native'
import {layout} from '../styles'
import {dataStore} from '../stores'
import {ParticleView, ParticleCell, DynamicProperty} from '../vendor/react-native-particle-system'

@observer
export default class QuizScreen extends React.Component {

	state = {
		sparkle: false
	}

	componentWillReact() {
		console.log(dataStore.pointsIncreased)
		if (dataStore.pointsIncreased) {
			this.setState({sparkle: true})
			requestAnimationFrame(() => {
				this.setState({sparkle: false})
			})
		}
	}

	render() {
		return (
			<View style={$.screen}>
				<View style={$.quiz}>
					<Text style={$.points}>{dataStore.points}</Text>
				</View>
				<View style={$.stars}>
					<ParticleView
						name='emitterLayer'
						style={{flex:1, backgroundColor:'transparent'}}
						emitterPosition={{x: Dimensions.get('window').width / 2, y: Dimensions.get('window').height / 2}}
						emitterZPosition={0}
						emitterSize={{width:1, height:1}}
						emitterDepth={0}
						renderMode='additive'
						seed={2316268059}
					>
						<ParticleCell {...starsParticleProps}>
							<Image source={require('../../res/star.png')} style={{width:32, height:32}}/>
						</ParticleCell>
						
						<DynamicProperty keyPath="emitterCells.stars.birthRate" value={this.state.sparkle ? 20 : 0}/>						
					</ParticleView>
				</View>
			</View>
		)
	}

}

const starsParticleProps = {
	name:      'stars',

	contentsRect: {x: 0.0, y: 0.0, width: 1.0, height: 1.0},
	magnificationFilter: 'linear',
	minificationFilter:  'linear',

	scale:      1.0,
	scaleRange: 0.5,
	scaleSpeed: 0.1,

	color:      '#7f7f7f',
	redRange:   1.00,
	redSpeed:   0.00,
	greenRange: 1.00,
	greenSpeed: 0.00,
	blueRange:  1.00,
	blueSpeed:  0.00,
	alphaRange: 0.00,
	alphaSpeed: 0.00,

	lifetime:      1000,
	lifetimeRange: 0.50,

	velocity:      150.00,
	velocityRange: 25.00,
	xAcceleration: 0.00,
	yAcceleration: 0.00,
	zAcceleration: 0.00,

	// these values are in radians, in the UI they are in degrees
	spin:      0.000,
	spinRange: 12.566,

	emissionLatitude: 0.000,
	emissionLongitude: 0.000,
	emissionRange:     6.283,
}

const $ = StyleSheet.create({

	screen: {
		flex: 1,
		backgroundColor: 'black',
	},

	quiz: {
		...layout.overlay,

		alignItems:      'center',
		justifyContent:  'center'
	},

	points: {
		fontSize: 48,
		color:   'white'
	},

	stars: {
		...layout.overlay
	},

})