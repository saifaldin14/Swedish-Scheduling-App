import React from 'react';
import { 
  Platform, 
  StatusBar, 
  StyleSheet, 
  View, Dimensions, 
  ScrollView, Text, 
  RefreshControl,
 ListView,
  Image, AsyncStorage } from 'react-native';
import {Calendar, CalendarList, Agenda, LocaleConfig} from 'react-native-calendars';
import { Container, Content, Card, CardItem, List, Item, Icon, ListItem, Button} from 'native-base';
import * as firebase from 'firebase';

var dayOfWeek = "";
var textBackgroundColor = '#eee';

const firebaseConfig = {
  apiKey: "AIzaSyBmDkiGwOFerKPf22HyB_kBNS7MFMkcQk0",
  authDomain: "special-learning-app.firebaseapp.com",
  databaseURL: "https://special-learning-app.firebaseio.com",
  projectId: "special-learning-app",
  storageBucket: "special-learning-app.appspot.com",
  messagingSenderId: "147985957627"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
var jSONData = require('../i18next/sv.json');

var data = [];
var data2 = [];
var data3 = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September","October","November","December"];
var theDate = "";
var d = new Date();
theDate = String(months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());

var imageKey = "John";
var url = "This";
var imageURL = "Saif";
const screenWidth = Math.round(Dimensions.get('window').width);
LocaleConfig.locales[jSONData.local.lang] = {
  monthNames: [jSONData.month.jan, jSONData.month.feb,jSONData.month.mar,jSONData.month.apr,jSONData.month.may,jSONData.month.jun,jSONData.month.jul,jSONData.month.aug,jSONData.month.sept,jSONData.month.oct,jSONData.month.nov,jSONData.month.dec],
  monthNamesShort: [jSONData.month_short.jan, jSONData.month_short.feb, jSONData.month_short.mar, jSONData.month_short.apr,jSONData.month_short.may, jSONData.month_short.jun, jSONData.month_short.jul,jSONData.month_short.aug, jSONData.month_short.sept,jSONData.month_short.oct,jSONData.month_short.nov, jSONData.month_short.dec],
  dayNames: [jSONData.weekdays.sunday, jSONData.weekdays.monday,jSONData.weekdays.tuesday,jSONData.weekdays.wednesday,jSONData.weekdays.thursday,jSONData.weekdays.friday,jSONData.weekdays.saturday],
  dayNamesShort: [jSONData.weekdays_short.sunday,jSONData.weekdays_short.monday,jSONData.weekdays_short.tuesday,jSONData.weekdays_short.wednesday,jSONData.weekdays_short.thursday,jSONData.weekdays_short.friday,jSONData.weekdays_short.saturday],
  today: 'Aujourd\'hui'
};
LocaleConfig.defaultLocale = jSONData.local.lang;
export default class Month extends React.Component {
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
      uploading: false,
      languageState: 1
    };
    this.onDayPress = this.onDayPress.bind(this);

    this.listViewData1Base = this.state.listViewData;
    this.listViewData2Base = this.state.listViewData2;
    this.listViewData3Base = this.state.listViewData3;
  }

  componentDidMount () {
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

  _onRefresh = () => {
    this.setState({refreshing: true});
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

  monthNames(month) {
    switch (month) {
      case 1:
        return "January"
      case 2:
        return "February"
      case 3:
        return "March"
      case 4:
        return "April"
      case 5:
        return "May"
      case 6:
        return "June"
      case 7:
        return "July"
      case 8:
        return "August"
      case 9:
        return "September"
      case 10:
        return "October"
      case 11:
        return "November"
      case 12:
        return "December"
    }
  }
  onDayPress = (day) => {

    var that = this;
      //console.log(day.day)
      var date = new Date(this.monthNames(day.month) + day.day + ", " + day.year)
      this.setState({
        selected: day.dateString,
      });
      var newDate = String(months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear());

      firebase.database().ref('Schedule/Morning').child(newDate).on('value', function (snapshot) {
        //console.log(snapshot.hasChild.val().name)
  
        if (snapshot.exists()) {
          that.updateFirebase('Schedule/Morning', newDate)
        } else {
          that.setState({listViewData : that.listViewData1Base});
        }
    });
  
    firebase.database().ref('Schedule/Noon').child(newDate).on('value', function (snapshot) {
      //console.log(snapshot.hasChild.val().name)
      if (snapshot.exists()) {
        that.updateFirebase('Schedule/Noon', newDate)
      } else {
        that.setState({listViewData2 : that.listViewData2Base});
      }
  });
  
  firebase.database().ref('Schedule/Night').child(newDate).on('value', function (snapshot) {
    //console.log(snapshot.hasChild.val().name)
    if (snapshot.exists()) {
      that.updateFirebase('Schedule/Night', newDate)
    } else {
      that.setState({listViewData3 : that.listViewData3Base});
    }
  });

      //this.updateFirebase('Schedule/Morning', newDate)
      //this.updateFirebase('Schedule/Noon', newDate)
      //this.updateFirebase('Schedule/Night', newDate)

      if (date.getDay() == "0") {
        dayOfWeek = jSONData.weekdays.sunday;
        this.setState({colorCode: '#cc0000'});
        this.setState({textColor: '#ffffff'});
      } else if (date.getDay() == "1") {
        dayOfWeek = jSONData.weekdays.monday;
        this.setState({colorCode: '#339966'});
        this.setState({textColor: '#ffffff'});
      } else if (date.getDay() == "2") {
        dayOfWeek = jSONData.weekdays.tuesday;
        this.setState({colorCode: '#0066cc'});
        this.setState({textColor: '#ffffff'});
      } else if (date.getDay() == "3") {
        dayOfWeek = jSONData.weekdays.wednesday;
        this.setState({colorCode: '#ffffff'});
        this.setState({textColor: '#000000'});
      } else if (date.getDay() == "4") {
        dayOfWeek = jSONData.weekdays.thursday;
        this.setState({colorCode: '#996633'});
        this.setState({textColor: '#ffffff'});
      } else if (date.getDay() == "5") {
        dayOfWeek = jSONData.weekdays.friday;
        this.setState({colorCode: '#ffff00'});
        this.setState({textColor: '#000000'});
      } else if (date.getDay() == "6") {
        dayOfWeek = jSONData.weekdays.saturday;
        this.setState({colorCode: '#ff66ff'});
        this.setState({textColor: '#ffffff'});
      }
       
    }

    async deleteRow(secId, rowId, rowMap, data) {
      await firebase.database().ref('Schedule/Morning/' + theDate + "/" + data.key).set(null)
      rowMap[`${secId}${rowId}`].props.closeRow();
      var newData = [...this.state.listViewData];
      newData.splice(rowId, 1)
      this.setState({ listViewData: newData });
    }
  
    async deleteRow2(secId, rowId, rowMap, data) {
      await firebase.database().ref('Schedule/Noon/' + theDate + "/" + data.key).set(null)
      rowMap[`${secId}${rowId}`].props.closeRow();
      var newData = [...this.state.listViewData2];
      newData.splice(rowId, 1)
      this.setState({ listViewData2: newData });
    }
  
    async deleteRow3(secId, rowId, rowMap, data) {
      await firebase.database().ref('Schedule/Night/' + theDate + "/" + data.key).set(null)
      rowMap[`${secId}${rowId}`].props.closeRow();
      var newData = [...this.state.listViewData3];
      newData.splice(rowId, 1)
      this.setState({ listViewData3: newData });
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

        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          hideExtraDays
          showWeekNumbers
          markedDates={{[this.state.selected]: {selected: true}}}
        />

          <Text style={{
            textAlign: 'center', 
            borderColor: '#bbb', 
            padding: 10,
            fontSize: 20,
            color: this.state.textColor, 
            backgroundColor: this.state.colorCode}}>{dayOfWeek}</Text>
         <Content>
            <Item>
              <Text style={{ 
                  borderColor: '#bbb', 
                  padding: 10,
                  fontSize: 18,
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}>{jSONData.button.morning}</Text>
              <Image source={require('../assets/images/sun.png')} style={{width: 35, height: 35}}/>
            </Item>
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
              <Button full danger onPress={() => this.deleteRow2(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>
            }

            leftOpenValue = {-75}
            rightOpenValue = {75}
            />
            </Content>

            <Content>
            <Item>
          <Text style={{ 
              borderColor: '#bbb', 
              padding: 10,
              fontSize: 18,
              color: this.state.textColor, 
              backgroundColor: this.state.colorCode}}>{jSONData.button.night}</Text>
          <Image source={require('../assets/images/moon.png')} style={{width: 35, height: 35}}/>
         </Item>
            <List
            enableEmptySections
            removeClippedSubviews={false}
            horizontal = {true}
            dataSource = {this.ds.cloneWithRows(this.state.listViewData3)}
            renderRow = { this._RenderListItem.bind(data) }
            
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow3(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>
            }

            leftOpenValue = {-75}
            rightOpenValue = {75}
            />
            </Content>
            <Button 
              transparent
              block
              onPress={() => firebase.auth().signOut()}
              color= {this.state.textColor}
              style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}> 
              <Text style={{textAlign: 'center', color: this.state.textColor, fontSize: 15}}> logga ut </Text>
            </Button> 
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

   /* _RenderListItem = (data) => {
      var key = data.val().name
      //var url = jSONWorkers.staff[key].image.url
      //var url = data.val().url
      if (key == "Alexander") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/alexander.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Anna") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/anna.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Berker") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/berker.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Carro") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/carro.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Elin L") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/elin.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Fabian") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/fabian.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Harald") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/harald.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Herman") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/herman.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Hertha") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/hertha.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Kalle") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/kalle.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Sara L") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/sara.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      } else if (key == "Sebastian") {
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={require('../assets/images/sebastian.jpg')} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      }
      return;
    }*/

    _RenderListItem = (data) => {
      var key = data.val().name
      //var url = jSONWorkers.staff[key].image.url
      var url = data.val().url
        return (
          <ListItem style={{backgroundColor: this.state.colorCode}}>
            <View>
              <Text style={{
                  color: this.state.textColor, 
                  backgroundColor: this.state.colorCode}}> {key} </Text>
                <Image  source={{uri: url}} style={{ width: 100, height: 100 }} />
                {this._maybeRenderUploadingOverlay()}
            </View>
        </ListItem>
        );
      }
  }
    
    const styles = StyleSheet.create({
      calendar: {
        borderTopWidth: 1,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 350
      },
      text: {
        textAlign: 'center',
        borderColor: '#bbb',
        padding: 10,
      },
      container: {
        flex: 1,
        backgroundColor: 'gray'
      }
    });