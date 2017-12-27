import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, View, Text, Image, Dimensions} from 'react-native'
import {layout} from '../styles'
import {dataStore} from '../stores'
import LinearGradient from 'react-native-linear-gradient'
import {ParticleView, ParticleCell, DynamicProperty} from '../vendor/react-native-particle-system'

@observer
export default class QuizScreen extends React.Component {

	state = {
		sparkle:    false,
		pointsRect: null
	}

	componentWillReact() {
		if (dataStore.pointsIncreased) {
			this.setState({sparkle: true})
			requestAnimationFrame(() => {
				this.setState({sparkle: false})
			})
		}
	}

	render() {
		const {pointsRect} = this.state
		
		return (
			<View style={$.screen}>
				<LinearGradient colors={['#0839B4', '#848F5F', '#000A27']} locations={[0, 0.65, 1]} style={$.background} />
				<View style={$.quiz}>
					<Image source={require('../../res/dook2.png')} style={$.dook}/>
					<Text style={$.points} onLayout={this.onPointsLayout}>{dataStore.points}</Text>
				</View>
				{this.renderPointStars()}
				{this.renderVictoryStars()}
			</View>
		)
	}

	renderPointStars() {
		const {pointsRect} = this.state
		if (pointsRect == null) { return }

		const x = pointsRect.x + pointsRect.width / 2
		const y = pointsRect.y + pointsRect.height / 2

		return (
			<View style={$.stars}>
				<ParticleView
					name='emitterLayer'
					style={{flex:1, backgroundColor:'transparent'}}
					emitterPosition={{x, y}}
					emitterZPosition={0}
					emitterShape='circle'
					emitterSize={{width:100, height:100}}
					emitterDepth={0}
					renderMode='additive'
					seed={2316268059}
				>
					<ParticleCell {...pointStarsParticleProps}>
						<Image source={require('../../res/star.png')} style={{width:32, height:32}}/>
					</ParticleCell>
					
					<DynamicProperty keyPath="emitterCells.stars.birthRate" value={this.state.sparkle ? 20 : 0}/>						
				</ParticleView>
			</View>
		)
	}

	renderVictoryStars() {
		const window = Dimensions.get('window')

		return (
			<View style={$.stars}>
				<ParticleView
					name='emitterLayer'
					style={{flex:1, backgroundColor:'transparent'}}
					emitterPosition={{x: 0, y: 0}}
					emitterZPosition={0}
					emitterShape='line'
					emitterSize={{width:window.width * 2, height:1}}
					emitterDepth={0}
					renderMode='additive'
					seed={2316268059}
				>
					<ParticleCell {...victoryStarsParticleProps}>
						<Image source={require('../../res/star.png')} style={{width:32, height:32}}/>
					</ParticleCell>
					
					<DynamicProperty keyPath="emitterCells.stars.birthRate" value={dataStore.ending ? 60 : 0}/>						
				</ParticleView>
			</View>
		)
	}

	onPointsLayout = (e) => {
		this.setState({pointsRect: e.nativeEvent.layout})

	}

}

const pointStarsParticleProps = {
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

	emissionLatitude:  0.000,
	emissionLongitude: 0.000,
	emissionRange:     6.283,
}

const victoryStarsParticleProps = {
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

	lifetime:      10000,
	lifetimeRange: 0.50,

	velocity:      400.00,
	velocityRange: 100.00,
	xAcceleration: 0.00,
	yAcceleration: 9.81,
	zAcceleration: 0.00,

	// these values are in radians, in the UI they are in degrees
	spin:      0.000,
	spinRange: 12.566,

	emissionLatitude:  -10.000,
	emissionLongitude: 0.000,
	emissionRange:     0.000,
}

const $ = StyleSheet.create({

	screen: {
		flex: 1,
		backgroundColor: 'black',
	},

	background: {
		...layout.overlay,
	},

	quiz: {
		...layout.overlay,

		flexDirection:   'row',
		alignItems:      'center',
		justifyContent:  'space-around'
	},

	dook: {
		width:  262,
		height: 393
	},

	points: {
		fontSize: 280,
		width:    400,
		textAlign: 'center',
		color:   'white',
		fontFamily: 'Quizzical-Pitch',
		backgroundColor: 'transparent'
	},

	stars: {
		...layout.overlay
	},

})