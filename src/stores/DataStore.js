import {observable, action} from 'mobx'
import firebase from 'react-native-firebase'

const firebaseConfig = {
  apiKey:        'AIzaSyAPOxzhOycUrvHqsICvUUmWyL-z_g7JDM8',
  databaseURL:   'https://quizmaster-7bb92.firebaseio.com'
}

export default class DataStore {

  @observable
  firebase = null

  @observable
  dataRef = null

  @observable
  points = null

  @observable
  screen = 'quiz'

  connect() {
    const app = Firebase.initializeApp(firebaseConfig)
    app.onReady().then(action(() => {
      this.firebase = app
      this.dataRef = this.firebase.database().ref()
      this.dataRef.on('value', this.onDatabaseValue)
    }))
  }

  @action
  onDatabaseValue(snapshot) {
    console.log(snapshot)
  }

  
}