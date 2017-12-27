import {observable, observe, action} from 'mobx'
import firebase from 'react-native-firebase'

export default class DataStore {

  constructor() {
    observe(this, 'points', ({newValue, oldValue}) => {
      this.prevPoints = oldValue
      setTimeout(() => {
        this.prevPoints = newValue
      })
    })
  }

  @observable
  points = null

  @observable
  prevPoints = null

  @observable
  ending = false

  get pointsIncreased() {
    return this.points > this.prevPoints
  }

  @observable
  screen = 'quiz'

  @observable
  backgroundTrack = null

  connect() {
    const db = firebase.database().ref()
    db.on('value', this.onDatabaseValue)
  }

  onDatabaseValue = action(snapshot => {
    this.points = snapshot.child('points').val()
    this.screen = snapshot.child('screen').val()
    this.backgroundTrack = snapshot.child('backgroundTrack').val()
    this.ending = snapshot.child('ending').val()

    const sfx = snapshot.child('sfx').val()
    this.processSoundEffect(sfx)
  })

  //------
  // Sound effects

  sfxTimestamp = null

  soundEffectHandlers = new Set()

  onSoundEffect(handler) {
    this.soundEffectHandlers.add(handler)
  }

  triggerSoundEffect(name: string) {
    for (const handler of this.soundEffectHandlers) {
      handler(name)
    }
  }

  processSoundEffect(sfx) {
    if (sfx == null) { return }

    const {time, name} = sfx
    const timestamp = new Date(time).getTime()

    if (timestamp != null && this.sfxTimestamp != null && timestamp > this.sfxTimestamp) {
      this.triggerSoundEffect(name)
    }

    this.sfxTimestamp = timestamp
  }

}