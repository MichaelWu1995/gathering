# Project: Gathering

## 1. Project description

Gathering is an activity organisation website. Within this website, the signed-in users can issue various activities. If others are intersted in a particular activitiy, they can register and then participate in it . Meanwhile, this website offers users a full calendar to manage their activities. Furthermore, every registered users can leave some comments below, thus making this website more sociable. This project idea is from https://www.meetup.com/.

## 2. Project Local Setup

This website is developed using Vue-cli. If you want to use this website locally, the following steps are useful:

1. Clone this application:

```markdown
\$ git clone https://github.com/MichaelWu1995/gathering.git
```

2. Obtain the application folder:

```markdown
\$ cd my-app
```

3. Install the dependencies package:

```
$ npm install
```

4. Run the application:

```markdown
\$ npm run serve
```

5. View in the browser:

```markdown
http://localhost: 8080
```

If you want build this website for production, using the following command:

```
$ npm run build
```

## 3. Technology Stack

1. Vue-cli
2. Vue
3. Vuex
4. Vue-Router
5. Vuetify Components
6. Axios
7. Firebase
8. Mapbox
9. Tiny-Mce

## 4. Firebase Configuration

The website uses firebase as back-end server. Therefore, the firebase configuration is necessary. The following is my firebase configuration:

```javascript
import firebase from "firebase/app";

//web app's Firebase Configuration
firebase.initializeApp({
  apiKey: "AIzaSyBaN7Pf8rMInyP9IpoloovEd29zmKHPnBY",
  authDomain: "meetup-2a651.firebaseapp.com",
  databaseURL: "https://meetup-2a651.firebaseio.com",
  projectId: "meetup-2a651",
  storageBucket: "meetup-2a651.appspot.com",
  messagingSenderId: "707460878522",
  appId: "1:707460878522:web:a0cbe60e29e0b19e693283",
});
```

Please refer to Firebase Documentation for more information: https://firebase.google.com/docs/web/setup
