import {observable, action} from 'mobx'
import firebase from 'react-native-firebase'

export default class DataStore {

  @observable
  points = null

  @observable
  screen = 'quiz'

  connect() {
    const db = firebase.database().ref()
    db.on('value', this.onDatabaseValue)
  }

  onDatabaseValue = action(snapshot => {
    this.points = snapshot.child('points').val()
    this.screen = snapshot.child('screen').val()
  })

  
}