import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, View, Text} from 'react-native'
import {dataStore} from '../stores'

@observer
export default class QuizScreen extends React.Component {

	render() {
		return (
			<View style={$.screen}>
				<Text style={$.points}>{dataStore.points}</Text>
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

	points: {
		fontSize: 48,
		color:   'white'
	}

})