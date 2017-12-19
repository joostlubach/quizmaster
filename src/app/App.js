import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, View} from 'react-native'
import {dataStore} from '../stores'

@observer
export default class App extends React.Component {

	componentDidMount() {
		dataStore.connect()
	}

	render() {
		if (dataStore.firebase == null) {
			return this.renderLoading()
		}

		return (
			<View style={$.app}>
				{dataStore.screen === 'quiz' && <QuizScreen/>}
				{dataStore.screen === 'video' && <VideoScreen/>}
			</View>
		)
	}

	renderLoading() {
		return (
			<View style={$.loading}>
				<ActivityIndicator color='white' size='large'/>
			</View>
		)
	}

}

const $ = StyleSheet.create({

	app: {
		flex: 1
	},

	loading: {
		flex: 1,
		backgroundColor: 'black'
	}
	
})