import React from 'react';
import { 
  ActivityIndicator,
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
  Button, ActionSheet } from 'native-base';
  import DateTimePicker from "react-native-modal-datetime-picker";
import * as firebase from 'firebase';
import DropdownMenu from 'react-native-dropdown-menu';

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
var dataList = [[jSONData.button.morning, "Alexander", "Anna", "Berker", "Carro", "Elin L", "Fabian", "Harald", "Herman", "Hertha", "Kalle", "Sara L", "Sebastain"], 
                [jSONData.button.noon, "Alexander", "Anna", "Berker", "Carro", "Elin L", "Fabian", "Harald", "Herman", "Hertha", "Kalle", "Sara L", "Sebastain"], 
                [jSONData.button.night, "Alexander", "Anna", "Berker", "Carro", "Elin L", "Fabian", "Harald", "Herman", "Hertha", "Kalle", "Sara L", "Sebastain"]];


export default class Add extends React.Component  {
  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      listViewData: data,
      listViewData2: data2,
      listViewData3: data3,
      newContact: "",
      newContact2: "",
      newContact3: "",
      image: url,
      uploading: false,
      isDateTimePickerVisible: false,
    };
  }

  async componentDidMount () {
      var that = this
      firebase.database().ref('Schedule/Morning').child(date).on('child_added', function(data){
          var newData = [...that.state.listViewData]
          newData.push(data)
          that.setState({listViewData : newData})
      })
      firebase.database().ref('Schedule/Noon').child(date).on('child_added', function(data){
        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({listViewData2 : newData})
      })
      firebase.database().ref('Schedule/Night').child(date).on('child_added', function(data){
        var newData = [...that.state.listViewData]
        newData.push(data)
        that.setState({listViewData3 : newData})
    })

      //await Permissions.askAsync(Permissions.CAMERA_ROLL);
      //await Permissions.askAsync(Permissions.CAMERA);

      //this.setState({ text : dataList[0][1] })
      //this.setState({ text2 : dataList[1][1] })
      //this.setState({ text3 : dataList[2][1] })
      this.setState({ text : " " })
      this.setState({ text2 : " "})
      this.setState({ text3 : " " })
  }

  handleList (selection, row) {
    if (selection == 0) {
      this.setState({ text : dataList[selection][row]})
    } else if (selection == 1) {
      this.setState({ text2 : dataList[selection][row]})
    } else if (selection == 2) {
      this.setState({ text3 : dataList[selection][row]})
    }
  }

  async addRow(data, data2, data3) {
      var key = firebase.database().ref('/Schedule/Morning').push().key
      firebase.database().ref('/Schedule/Morning').child(date).child(key).set({ name : data })

      var key2 = firebase.database().ref('/Schedule/Noon').push().key
      firebase.database().ref('/Schedule/Noon').child(date).child(key2).set({ name : data2 })

      var key3 = firebase.database().ref('/Schedule/Night').push().key
      firebase.database().ref('/Schedule/Night').child(date).child(key3).set({ name : data3 })

      this.props.navigation.navigate('First')
  }

  async deleteRow(secId, rowId, rowMap, data) {
    await firebase.database().ref('Schedule/Morning/' + date + "/" + data.key).set(null)
    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });
  }
  async deleteRow2(secId, rowId, rowMap, data) {
    await firebase.database().ref('Schedule/Noon/' + date + "/" + data.key).set(null)
    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData2];
    newData.splice(rowId, 1)
    this.setState({ listViewData2: newData });
  }
  async deleteRow3(secId, rowId, rowMap, data) {
    await firebase.database().ref('Schedule/Night/' + date + "/" + data.key).set(null)
    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData3];
    newData.splice(rowId, 1)
    this.setState({ listViewData3: newData });
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = theDate => {
    date = String(months[theDate.getMonth()] + " " + theDate.getDate() + " " + theDate.getFullYear());
    console.log(date);
    this.hideDateTimePicker();
  };

  render() {
    let { image } = this.state;
      return (
        <ScrollView>
          <Button
            transparent block
            onPress={this.showDateTimePicker}
            title="Pick an image from camera roll">
              <Text>
                Visa datumväljare
              </Text>
            </Button>
          <DateTimePicker
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />
          <Item>
            <DropdownMenu
              style={{flex: 1}}
              bgColor={'white'}
              tintColor={'#666666'}
              activityTintColor={'green'}
              handler={(selection, row) => this.handleList(selection, row)}
              data={dataList}>
            </DropdownMenu>

            <Button transparent block onPress = {() => this.addRow(this.state.text, this.state.text2, this.state.text3)}>
                <Icon name = "add"/>
            </Button>
          </Item>
      </ScrollView>
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