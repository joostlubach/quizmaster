// @flow

import React from 'react'
import RNSound from 'react-native-sound'

export type Props = {
	/// The sound source (must be a resource in the main bundle).
	name:           string,

	/// Whether the sound is playing.
	playing:        boolean,

	/// Whether to repeat the sound.
	repeat:         boolean,

	/// The number of seconds to overlap for a gapless repeat.
	repeatOverlap:  ?number,

	/// The volume of the sound.
	volume:         ?number,

	/// Handler to be called when the sound is loaded.
	onLoad:         () => void,

	/// Handler to be called when a load error occurs.
	onLoadError:    (error: Error) => void,

	/// Handler to be called when the sound starts playing. When repeating is enabled, this
	/// event is fired upon every start.
	onStart: () => void,

	/// Handler to be called when the sound stops playing. When repeating is enabled, this
	/// event is fired upon every start.
	onStop: () => void,

	/// Handler to be called when the sound playback ends.
	onEnded: () => void
}
const defaultProps = {
	playing:        false,
	repeat:         false,

	onLoad:      () => void 0,
	onLoadError: () => void 0,

	onStart: () => void 0,
	onStop:  () => void 0,
	onEnded: () => void 0
}

type State = {
	loading:   boolean,
	playing:   boolean,
	loadError: ?Error
}

export default class Sound extends React.Component<typeof defaultProps, Props, State> {

	//------
	// Props

	props: Props
	static defaultProps = defaultProps

	state: State = {
		playing:   false,
		loadError: null
	}

	rnSound: ?RNSound = null

	// For gapless repeat.

	rnSoundAlt: ?RNSound = null
	rnSoundCurrent: ?RNSound = null

	gaplessTimeout: ?number = null

	get gaplessRepeat(): boolean {
		return this.props.repeat && this.props.repeatOverlap != null
	}

	getCurrentRNSound(): RNSound {
		if (!this.gaplessRepeat) {
			return this.rnSound
		} else {
			return this.rnSoundCurrent
		}
	}

	nextGaplessSound() {
		if (this.rnSoundCurrent === this.rnSoundAlt) {
			return this.rnSound
		} else {
			return this.rnSoundAlt
		}
	}

	//------
	// Interface

	static setMode(mode: string) {
		RNSound.setMode(mode)
	}

	static setCategory(category: string, mixWithOthers: boolean = false) {
		RNSound.setCategory(category, mixWithOthers)
	}

	static setActive(active: boolean) {
		RNSound.setActive(active)
	}

	start() {
		const rnSound = this.getCurrentRNSound()
		if (rnSound == null) { return }

		this.props.onStart()
		this.rnSound.setCurrentTime(0.0)
		this.play()
	}

	stop() {
		const rnSound = this.getCurrentRNSound()
		if (rnSound == null) { return }

		this.pause(() => {
			rnSound.setCurrentTime(0.0)
			this.props.onStop()
		})
	}

	play(callback?: () => any) {
		const rnSound = this.getCurrentRNSound()
		if (rnSound == null) { return }

		console.log('play!', rnSound === this.rnSound)

		this.setState({playing: true}, () => {
			if (this.gaplessRepeat) {
				// Don't use a callback, the sound will stop only when stopped on command.
				rnSound.play()

				if (this.gaplessTimeout != null) {
					clearTimeout(this.gaplessTimeout)
				}

				// Toggle the sound just before the end.
				rnSound.getCurrentTime(currentTime => {
					const duration = rnSound.getDuration()
					const delay = Math.max(0, duration - currentTime - this.props.repeatOverlap) * 1000

					this.gaplessTimeout = setTimeout(() => {
						this.gaplessTimeout = null
						this.rnSoundCurrent = this.nextGaplessSound()
						this.play()
					}, delay)
				})
			} else {
				rnSound.play(() => {
					this.setState({playing: false})
					this.props.onStop()				
				})
			}

			if (callback) { callback() }
		})
	}

	pause(callback?: () => any) {
		const rnSound = this.getCurrentRNSound()
		if (rnSound == null) { return }

		this.setState({playing: false}, () => {
			rnSound.pause(callback)

			if (this.gaplessTimeout != null) {
				clearTimeout(this.gaplessTimeout)
			}
		})
	}

	async load() {
		if (this.rnSound != null) { return }

		this.setState({
			loading:   true,
			loadError: null
		})

		try {
			this.rnSound = await this.loadSound(this.props.source)

			if (this.gaplessRepeat) {
				this.rnSoundAlt = await this.loadSound(this.props.source)
				this.rnSoundCurrent = this.rnSound
			}

			this.setState({
				loadError: null,
				loading:   false
			})
		} catch (error) {
			this.setState({
				loadError: error,
				loading:   false
			})
		}

		this.setDynamicProperties(this.rnSound)
		this.setDynamicProperties(this.rnSoundAlt)
		this.updatePlayingStatus()
	}

	loadSound(source: string) {
		return new Promise((resolve, reject) => {
			const sound = new RNSound(source, RNSound.MAIN_BUNDLE, error => {
				if (error != null) {
					reject(error)
				} else {
					resolve(sound)
				}
			})
		})
	}

	unload() {
		this.stop()
		if (this.rnSound != null) {
			this.rnSound.release()
		}
		if (this.rnSoundAlt != null) {
			this.rnSoundAlt.release()
		}
		this.rnSoundCurrent = null
	}
	
	reload() {
		this.unload()
		this.load()
	}

	//------
	// Lifecycle

	componentDidMount() {
		this.load()
	}

	componentWillReceiveProps(props: Props) {
		if (this.props.source !== props.source) {
			// We need to reload.
			this.reload()
		}

		const oldGaplessRepeat = this.props.repeatOverlap != null
		const newGaplessRepeat = props.repeatOverlap != null
		if (oldGaplessRepeat !== newGaplessRepeat || newGaplessRepeat && this.props.repeat !== props.repeat) {
			this.reload()
		}

		this.updatePlayingStatus(props)
	}

	componentDidUpdate() {
		this.setDynamicProperties(this.rnSound)
		this.setDynamicProperties(this.rnSoundAlt)
	}

	setDynamicProperties(rnSound: ?RNSound = null) {
		const {props} = this
		if (rnSound == null || !rnSound.isLoaded()) { return }

		if (props.volume != null && props.volume !== rnSound.getVolume()) {
			rnSound.setVolume(props.volume)
		}
		
		const isRepeating = rnSound.getNumberOfLoops() === -1
		const shouldRepeat = props.repeat && props.repeatOverlap == null
		if (shouldRepeat !== isRepeating) {
			rnSound.setNumberOfLoops(shouldRepeat ? -1 : 1)
		}
	}

	//------
	// Playing status

	updatePlayingStatus(props: Props = this.props) {
		const rnSound = this.getCurrentRNSound()
		if (rnSound == null) { return }

		const shouldPlay = rnSound.isLoaded() && props.playing
		const isPlaying  = this.state.playing
		if (shouldPlay === isPlaying) { return }

		if (shouldPlay) {
			this.play()
		} else {
			this.pause()
		}
	}

	render() {
		return null
	}

}