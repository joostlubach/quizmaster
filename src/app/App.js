import React from 'react'
import {observer} from 'mobx-react'
import RNSound from 'react-native-sound'
import {StyleSheet, View, ActivityIndicator} from 'react-native'
import {QuizScreen, VideoScreen} from '.'
import {Sound} from '../components'
import {dataStore} from '../stores'

Sound.setCategory('SoloAmbient')

const soundEffects = [
	'correct',
	'wrong',
	'zap',
	'victory',
	'chimes',
	'boing'
]

@observer
export default class App extends React.Component {

	//------
	// Sounds

	sounds = new Map()

	componentDidMount() {
		dataStore.connect()
		dataStore.onSoundEffect(this.onSoundEffect)

		this.loadSoundEffects()
	}

	loadSoundEffects() {
		for (const effect of soundEffects) {
			this.sounds.set(effect, new RNSound(`${effect}.mp3`, RNSound.MAIN_BUNDLE))
		}
	}

	render() {
		if (dataStore.points == null) {
			return this.renderLoading()
		}

		return (
			<View style={$.app}>
				{dataStore.screen === 'quiz' && <QuizScreen/>}
				{dataStore.screen === 'video' && <VideoScreen/>}

				{this.renderBackgroundMusic()}
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

	renderBackgroundMusic() {
		const {backgroundTrack, screen} = dataStore
		const shouldPlay = screen !== 'video'

		return (
			<View>
				<Sound repeat repeatOverlap={1.2} playing={shouldPlay && backgroundTrack === 'neutral'} source='bg-neutral.mp3'/>
				{/*<Sound repeat playing={shouldPlay && backgroundTrack === 'heartbeat'} source='bg-heartbeat.mp3'/>
		<Sound repeat playing={shouldPlay && backgroundTrack === 'suspense'} source='bg-suspense.mp3'/>*/}
			</View>
		)
	}

	onSoundEffect = (name: string) => {
		const sound = this.sounds.get(name)
		console.log(name, sound)

		if (sound == null) { return }

		sound.play()
	}

}

const $ = StyleSheet.create({

	app: {
		flex: 1
	},

	loading: {
		flex: 1,
		backgroundColor: 'black',

		alignItems:     'center',
		justifyContent: 'center'
	}
	
})