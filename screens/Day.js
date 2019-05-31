import React from 'react';
import { 
  StyleSheet, ListView,
  View,  Dimensions, 
  ScrollView, Text, 
  Image } from 'react-native';
import { 
  Container, 
  Content, 
  List, Item, 
  Icon, ListItem, 
  Button} from 'native-base';
import * as firebase from 'firebase';
import { firebaseApp } from './Month';

var data = [];
var data2 = [];
var data3 = [];
var jSONData = require('../i18next/sv.json');

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const months_localized = [jSONData.month.jan, jSONData.month.feb,jSONData.month.mar,jSONData.month.apr,jSONData.month.may,jSONData.month.jun,jSONData.month.jul,jSONData.month.aug,jSONData.month.sept,jSONData.month.oct,jSONData.month.nov,jSONData.month.dec];
var theDate = "";
var theDate_localized = "";
var d = new Date();
theDate = String(months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());
theDate_localized = String(months_localized[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());

var dayOfWeek = "";

var url = "This";
const screenWidth = Math.round(Dimensions.get('window').width);

export default class Day extends React.Component  {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      refreshing: false,
      colorCode: '#eee',
      textColor : '#000000',
      listViewData: data,
      listViewData2: data2,
      listViewData3: data3,
      newContact: "",
      image: url,
      uploading: false
    };
  }

  componentDidMount() {
    this.updateFirebase('Schedule/Morning', theDate)
    this.updateFirebase('Schedule/Noon', theDate)
    this.updateFirebase('Schedule/Night', theDate)

    if (d.getDay() == 0) {
        dayOfWeek = jSONData.weekdays.sunday;
        this.setState({colorCode : '#cc0000'});
        this.setState({textColor : '#ffffff'});
      } else if (d.getDay() == 1) {
        dayOfWeek = jSONData.weekdays.monday;
        this.setState({colorCode : '#339966'});
        this.setState({textColor : '#ffffff'});
      } else if (d.getDay() == 2) {
        dayOfWeek = jSONData.weekdays.tuesday;
        this.setState({colorCode : '#0066cc'});
        this.setState({textColor : '#ffffff'});
      } else if (d.getDay() == 3) {
        dayOfWeek = jSONData.weekdays.wednesday;
        this.setState({colorCode : '#ffffff'});
        this.setState({textColor : '#000000'});
      } else if (d.getDay() == 4) {
        dayOfWeek = jSONData.weekdays.thursday;
        this.setState({colorCode : '#996633'});
        this.setState({textColor : '#ffffff'});
      } else if (d.getDay() == 5) {
        dayOfWeek = jSONData.weekdays.friday;
        this.setState({colorCode : '#ffff00'});
        this.setState({textColor : '#000000'});
      } else if (d.getDay() == 6) {
        dayOfWeek = jSONData.weekdays.saturday;
        this.setState({colorCode : '#ff66ff'});
        this.setState({textColor : '#ffffff'});
      }
  }

  updateFirebase(ref, date) {
    var newData = []
    var that = this
      firebase.database().ref(ref).child(date).on('child_added', function(data){
          //newData = [...that.state.listViewData]
          newData.push(data)
          if(ref == 'Schedule/Morning') {
            that.setState({listViewData : newData})
          } else if(ref == 'Schedule/Noon') {
            that.setState({listViewData2 : newData})
          } else if(ref == 'Schedule/Night') {
            that.setState({listViewData3 : newData})
          }
      })
}

  async deleteRow(secId, rowId, rowMap, data) {
    await firebase.database().ref('Schedule/Morning/' + theDate + "/" + data.key).set(null)
    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });
  }

  render() {
      return (
       <ScrollView style={{backgroundColor: this.state.colorCode}}>

          <Item>
            <Button 
              transparent
              block
              onPress = {() => this.props.navigation.navigate('First')}
              style={{width: screenWidth / 3, alignContent: 'center'}}
              color= {this.state.textColor}> 
              <Text style={{color: this.state.textColor}}>{jSONData.button.go_to_day}</Text>
            </Button> 
            <Button 
              transparent 
              block
              onPress = {() => this.props.navigation.navigate('Second')}
              style={{width: screenWidth / 3, alignContent: 'center'}}
              color= {this.state.textColor}> 
              <Text style={{color: this.state.textColor}}> {jSONData.button.go_to_week}</Text>
            </Button>    
            <Button 
            transparent
            block
            onPress = {() => this.props.navigation.navigate('Third')}
            style={{width: screenWidth / 3, alignContent: 'center'}}
            color= {this.state.textColor}> 
              <Text style={{color: this.state.textColor}}> {jSONData.button.go_to_month}</Text>
            </Button>  
          </Item>

          <Item>
            <Button 
              transparent
              block
              onPress = {() => this.props.navigation.navigate('Add')}
              color= {this.state.textColor}
              style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}> 
              <Text style={{textAlign: 'center', color: this.state.textColor, fontSize: 15}}> {jSONData.button.schedule} </Text>
            </Button> 
          </Item>
          
          <Text style={{
            textAlign: 'center', 
            borderColor: '#bbb', 
            padding: 10,
            fontSize: 20,
            color: this.state.textColor, 
            backgroundColor: this.state.colorCode}}>{theDate_localized}</Text>
        <Text style={{
            textAlign: 'center', 
            borderColor: '#bbb', 
            padding: 10,
            fontSize: 20,
            color: this.state.textColor, 
            backgroundColor: this.state.colorCode}}>{dayOfWeek}</Text>
        <Button title = 'Add Schedule' 
          onPress = {() => this.props.navigation.navigate('Add')}
          color= {this.state.textColor}/> 
       
       <Content>
          <Text style={{ 
            borderColor: '#bbb', 
            padding: 10,
            fontSize: 18,
            color: this.state.textColor, 
            backgroundColor: this.state.colorCode}}>{jSONData.button.morning}</Text>
          <List
          enableEmptySections
          removeClippedSubviews={false}
          horizontal = {true}
          dataSource = {this.ds.cloneWithRows(this.state.listViewData)}
          renderRow = { this._RenderListItem.bind(data) }
          
          renderRightHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
              <Icon name="trash" />
            </Button>
          }

          leftOpenValue = {-75}
          rightOpenValue = {75}
          />
      </Content>

      <Content>
        <Text style={{ 
          borderColor: '#bbb', 
          padding: 10,
          fontSize: 18,
          color: this.state.textColor, 
          backgroundColor: this.state.colorCode}}>{jSONData.button.noon}</Text>
        <List
        enableEmptySections
        removeClippedSubviews={false}
        horizontal = {true}
        dataSource = {this.ds.cloneWithRows(this.state.listViewData2)}
        renderRow = { this._RenderListItem.bind(data) }
        
        renderRightHiddenRow={(data, secId, rowId, rowMap) =>
          <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
            <Icon name="trash" />
          </Button>
        }

        leftOpenValue = {-75}
        rightOpenValue = {75}
        />
      </Content>

      <Content>
          <Text style={{ 
            borderColor: '#bbb', 
            padding: 10,
            fontSize: 18,
            color: this.state.textColor, 
            backgroundColor: this.state.colorCode}}>{jSONData.button.night}</Text>
          <List
          enableEmptySections
          removeClippedSubviews={false}
          horizontal = {true}
          dataSource = {this.ds.cloneWithRows(this.state.listViewData3)}
          renderRow = { this._RenderListItem.bind(data) }
          
          renderRightHiddenRow={(data, secId, rowId, rowMap) =>
            <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
              <Icon name="trash" />
            </Button>
          }

          leftOpenValue = {-75}
          rightOpenValue = {75}
          />
        </Content>
        </ScrollView>
      );
    }

    _maybeRenderUploadingOverlay = () => {
      if (this.state.uploading) {
        return (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}>
            <ActivityIndicator color="#fff" animating size="large" />
          </View>
        );
      }
    };

    _RenderListItem = (data) => {
      var key = data.val().name
      var url = data.val().url
      return (
        <ListItem style={{backgroundColor: this.state.colorCode}}>
          <View>
            <Text style={{
                color: this.state.textColor, 
                backgroundColor: this.state.colorCode}}> {key} </Text>
              <Image  source={{uri : url}} style={{ width: 100, height: 100 }} />
              {this._maybeRenderUploadingOverlay()}
          </View>
      </ListItem>
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
      paddingTop: 20,
      backgroundColor: '#fff',
    },
  });