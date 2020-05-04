# Web RTC Chat System

[![CircleCI](https://circleci.com/gh/viveksb007/webRTC-signalling.svg?style=svg)](https://circleci.com/gh/viveksb007/webRTC-signalling)

This project is an experiment to create a WebRTC chat system. Using SpringBoot to create Signalling server and ReactJS for frontend client. It supports multiple peers to chat.

## Development

### To start locally

`./gradlew bootRun`

This will start server at http://localhost:8080, open it in two  tabs and try messaging.

### To run locally for testing: (assuming npm is installed)

1) `cd` to webRTC-client package

    - run command `npm install` (you only need to this the first time or if you make changes to package.json)
    - run command `npm start` You should now have a local frontend server running at <http://localhost:3000>

2) Start backend server separately, if you are using IntelliJ, just run `WebRTCApplication.java`

3) Open **Development Console** of browser -- you should be able to see logs of messages

4) Open another <http://localhost:3000> in browser to create 2 peers for sending messages

### Build JAR

In project root folder, run `./gradlew build` in MacOS/Linux  or just `gradlew build` in Windows

## Deployment

You can easily deploy it anywhere as you would deploy any regular SpringBoot app.

Its currently deployed at <https://webrtc-viveksb007.herokuapp.com/>

## Contribution

Feel free to checkout the project, submit issues and enhancement requests. 
