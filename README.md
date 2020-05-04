# Web RTC Chat Server

This project is an experiment to create a WebRTC chat server using Spring Boot and ReactJS. It supports multiple peers for chat.
## Continous Integration
This project has a CI Pipeline in CircleCI here 
[![CircleCI](https://circleci.com/gh/viveksb007/webRTC-signalling.svg?style=svg)](https://circleci.com/gh/viveksb007/webRTC-signalling)
## Build and Run

### To run locally for testing:

1) cd to webRTC-client package

- run command `npm install` (you only need to this the first time or if you make changes to package.json)
- run command `npm start` You should now have a local frontend server running at <http://localhost:3000>

2) In a new terminal window cd to backend and run the main class WebRTCApplication.java

3) Open Inspect of browser -- you should be able to see logs of messages

4) Open another <http://localhost:3000> in browser to create 2 peers for sending messages

### Build locally and package JAR

In main package run `./gradlew build` in MacOS or just `gradlew build` in Windows

### To run as single JAR:

In main package run `./gradlew bootRun` in MacOS or just `gradlew bootRun` in Windows

## Deployment

You can easily deploy it anywhere as you would deploy any regular SpringBoot app.

Its currently deployed at <https://webrtc-viveksb007.herokuapp.com/>
