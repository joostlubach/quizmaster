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

  get pointsIncreased() {
    return this.points > this.prevPoints
  }

  @observable
  screen = 'quiz'

  connect() {
    const db = firebase.database().ref()
    db.on('value', this.onDatabaseValue)
  }

  onDatabaseValue = action(snapshot => {
    const points = snapshot.child('points').val()
    const screen = snapshot.child('screen').val()

    this.points = points
    this.screen = screen
  })

  
}