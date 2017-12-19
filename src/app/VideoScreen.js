import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, View} from 'react-native'
import Video from 'react-native-video'
import {dataStore} from '../stores'

export default class QuizScreen extends React.Component {

	render() {
		return (
			<View style={$.screen}>
				<Video style={$.video} source={require('../../res/dafunk.mp4') autoplay/>
			</View>
		)
	}

}

const $ = StyleSheet.create({

	screen: {
		flex: 1,
		backgroundColor: 'black',
		alignItems:      'center',
		justifyContent:  'center'
	},

	video: {
		flex: 1
	},

	points: {
		fontSize: 48
	}

})