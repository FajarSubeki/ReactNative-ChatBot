/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import { dialogflowConfig } from './env';
import { GiftedChat } from 'react-native-gifted-chat';

const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar: 'https://i.imgur.com/7k12EPD.png'
}

class SplashScreen extends React.Component {
  render() {
    const viewStyles = {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    };
    const textStyles = {
      color: 'white',
      fontSize: 40,
      fontWeight: 'bold',
      color: '#000'
    };

    return (
      <View style={viewStyles}>
        <Text style={textStyles}>
          Muslim Bot
        </Text>
      </View>
    );
  }
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = { isLoading: true }
  }

  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(
        () => { resolve('result') },
        2000
      )
    )
  }

  state = {
    messages: [
      {
        _id: 1,
        text: `Hi! I am the FAQ bot 🤖 from Jscrambler.\n\nHow may I help you with today?`,
        createdAt: new Date(),
        user: BOT_USER
      }
    ]
  }

  async componentDidMount() {

    const data = await this.performTimeConsumingTask();

    if (data != null) {
      this.setState({ isLoading: false })
    }

    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id
    )
  }

  handleGoogleResponse(result) {
    let text = result.queryResult.fulfillmentMessages[0].text.text[0];
    this.sendBotResponse(text)
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages)
    }));

    let message = messages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      result => this.handleGoogleResponse(result),
      error => console.log(error)
    );
  }

  sendBotResponse(text) {
    let msg = {
      _id: this.state.messages.length + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER
    };

    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, [msg])
    }));
  }

  render() {

    if (this.state.isLoading) {
      return <SplashScreen />
    }

    return (
      <View style={styles.container}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
