import React from 'react';
import { 
  Alert, ActivityIndicator,
  View,
  StyleSheet, 
  ScrollView, Text, 
  ListView,
  Image } from 'react-native';
import { ImagePicker, Permissions } from 'expo';
import { 
  Content, 
  ListItem, 
  List, Item, 
  Input, Icon, 
  Button } from 'native-base';
  import DateTimePicker from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';

var data = [];
var data2 = [];
var data3 = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var date = "";
var d = new Date();
date = String(months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());

var imageKey = "John";
var url = "This";
var imageURL = "Saif";
var jSONData = require('../i18next/sv.json');


export default class Passcode extends React.Component  {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      passcode: "",
    };
  }

  async componentDidMount () {

  }

  handlePasscode(passcode) {
      if (passcode == "ostergardsgatan" || passcode == "Ostergardsgatan") {
        this.props.navigation.navigate('Loading')
      } else {
        Alert.alert(
            'Fel Lösenord',
            'försök igen',
            [
              {text: 'OK', onPress: () => console.log('Ok Pressed')},
            ],
            {cancelable: false},
          );
      }
  }

  render() {
      return (
        <View>
            <Item>
            <Input
                secureTextEntry={true}
                autoCorrect={false}
                autoCapitalize="none"
                placeholder = "Ange lösenordet för att fortsätta"
                onChangeText = {(passcode) => this.setState({passcode})}
                />
                <Button transparent block onPress = {() => this.handlePasscode(this.state.passcode)}>
                    <Icon name = "paper-plane"/>
                </Button>
            </Item>
       </View>
      );
    }
}
  
  const styles = StyleSheet.create({
    item: {
      backgroundColor: 'white',
      flex: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      marginTop: 17
    },
    emptyDate: {
      height: 15,
      flex:1,
      paddingTop: 30
    },
    container: { 
      flex: 1, 
      paddingTop: 50, 
      alignItems: "center", 
    },
  });