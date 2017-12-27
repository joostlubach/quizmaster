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
	'boing',
	'drumroll',
	'drumroll-release',
	'question',
	'victory',
	'start',
	'ending',
	'21-seconds',
	'21-seconds-over'
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

	componentWillReact() {
		if (dataStore.pointsIncreased) {
			this.sounds.get('correct').play()
		}
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
		if (!dataStore.started) {
			return this.renderSplash()
		}

		return (
			<View style={$.app}>
				{dataStore.screen === 'quiz' && <QuizScreen/>}
				{dataStore.screen === 'video' && <VideoScreen/>}

				{this.renderBackgroundMusic()}
			</View>
		)
	}

	renderSplash() {
		return <View style={$.splash}/>
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
				<Sound repeat repeatOverlap={1.3} playing={shouldPlay && backgroundTrack === 'neutral'} source='bg-neutral.mp3'/>
				<Sound repeat repeatOverlap={0.2} playing={shouldPlay && backgroundTrack === 'heartbeat'} source='bg-heartbeat.mp3'/>
				<Sound repeat repeatOverlap={0.1} playing={shouldPlay && backgroundTrack === 'suspense'} source='bg-suspense.mp3'/>
			</View>
		)
	}

	twentyOneTimeout: ?number = null

	onSoundEffect = (name: string) => {
		const sound = this.sounds.get(name)
		if (sound == null) { return }

		if (name === 'drumroll-release') {
			setTimeout(() => {
				this.sounds.get('drumroll').stop()
			}, 200)
		}

		if (name === '21-seconds-over') {
			clearTimeout(this.twentyOneTimeout)
			setTimeout(() => {
				this.sounds.get('21-seconds').stop()
			}, 200)
		}

		if (name === '21-seconds') {
			this.twentyOneTimeout = setTimeout(() => {
				this.onSoundEffect('21-seconds-over')
			}, 21000)
		}

		sound.stop(() => {
			sound.play()
		})
	}

}

const $ = StyleSheet.create({

	app: {
		flex: 1
	},

	splash: {
		flex: 1,
		backgroundColor: 'black'
	},

	loading: {
		flex: 1,
		backgroundColor: 'black',

		alignItems:     'center',
		justifyContent: 'center'
	}
	
})