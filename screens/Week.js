import React from 'react';
import { 
  StyleSheet, ListView,
  View,  Dimensions, 
  ScrollView, Text, 
  Image, RefreshControl } from 'react-native';
import { 
  Container, 
  Content, 
  List, Item, 
  Icon, ListItem, 
  Card, CardItem,
  Button} from 'native-base';
import * as firebase from 'firebase';
import { AppLoading, Asset, Font } from 'expo';
import { Header } from "react-native-elements";
//import moment from 'moment';
import 'moment/locale/sv';
import moment from 'moment-timezone';

import CalendarStrip from 'react-native-calendar-strip';

var data = [];
var data2 = [];
var data3 = [];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var theDate = "";
defaultState = { data: null, error: null };
var d = new Date();
theDate = String(months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());
var dayOfWeek = "";

var jSONData = require('../i18next/sv.json');

var url = "";
var key = "";
const screenWidth = Math.round(Dimensions.get('window').width);
moment().locale('fr');

const localeConst = {
  name: 'sv',
  config: {
    months: 'Januari_Februari_Mars_April_Maj_Juni_Juli_Augusti_September_Oktober_November_December'.split(
      '_'
    ),
    monthsShort: 'Jan_Feb_Mar_Apr_Maj_Jun_Jul_Aug_Sept_Okt_Nov_Dec'.split(
      '_'
    ),
    weekdays: 'Söndag_Måndag_Tisdag_Onsdag_Torsdag_Fredag_Lördag'.split('_'),
    weekdaysShort: 'Sön_Mån_Tis_Ons_Tors_Fre_Lör'.split('_'),
    weekdaysMin: 'Sö_Må_Ti_On_Tor_Fr_Lö'.split('_'),
    longDateFormat: {
      LT: 'HH:mm',
      LTS: 'HH:mm:ss',
      L: 'DD/MM/YYYY',
      LL: 'D MMMM YYYY',
      LLL: 'D MMMM YYYY LT',
      LLLL: 'dddd D MMMM YYYY LT'
    },
    calendar: {
      sameDay: "[Aujourd'hui à] LT",
      nextDay: '[Demain à] LT',
      nextWeek: 'dddd [à] LT',
      lastDay: '[Hier à] LT',
      lastWeek: 'dddd [dernier à] LT',
      sameElse: 'L'
    },
    relativeTime: {
      future: 'dans %s',
      past: 'il y a %s',
      s: 'quelques secondes',
      m: 'une minute',
      mm: '%d minutes',
      h: 'une heure',
      hh: '%d heures',
      d: 'un jour',
      dd: '%d jours',
      M: 'un mois',
      MM: '%d mois',
      y: 'une année',
      yy: '%d années'
    },
    ordinalParse: /\d{1,2}(er|ème)/,
    ordinal: function(number) {
      return number + (number === 1 ? 'er' : 'ème');
    },
    meridiemParse: /PD|MD/,
    isPM: function(input) {
      return input.charAt(0) === 'M';
    },
    // in case the meridiem units are not separated around 12, then implement
    // this function (look at locale/id.js for an example)
    // meridiemHour : function (hour, meridiem) {
    //     return /* 0-23 hour, given meridiem token and hour 1-12 */
    // },
    meridiem: function(hours, minutes, isLower) {
      return hours < 12 ? 'PD' : 'MD';
    },
    week: {
      dow: 1, // Monday is the first day of the week.
      doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
  }
};

export default class Week extends React.Component  {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      refreshing: false,
      colorCode: '#eee',
      textColor : '#000000',
      items: {},
      weekStart: moment(),
      selectedDate: moment(),
      colorCode: '#eee',
      textColor : '#000000',
      buttonColor : '007AFF',
      weekColor: '#007AFF',
      weekHighlightColor: '#5AC8FA',
      listViewData: data,
      listViewData2: data2,
      listViewData3: data3,
      newContact: "",
      image: url,
      uploading: false,
      refreshing : false,
      
    };

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

      this.setState({ weekColor : '#ff5050'});
      this.setState({ weekHighlightColor: '#ff6666'});
    } else if (d.getDay() == 1) {
      dayOfWeek = jSONData.weekdays.monday;
      this.setState({colorCode : '#339966'});
      this.setState({textColor : '#ffffff'});

      this.setState({ weekColor : '#339933'});
      this.setState({ weekHighlightColor: '#00cc66'});
    } else if (d.getDay() == 2) {
      dayOfWeek = jSONData.weekdays.tuesday;
      this.setState({colorCode : '#0066cc'});
      this.setState({textColor : '#ffffff'});

      this.setState({ weekColor : '#0099ff'});
      this.setState({ weekHighlightColor: '#33ccff'});
    } else if (d.getDay() == 3) {
      dayOfWeek = jSONData.weekdays.wednesday;
      this.setState({colorCode : '#ffffff'});
      this.setState({textColor : '#000000'});

      this.setState({ weekColor : '#ffffff'});
      this.setState({ weekHighlightColor: '#d9d9d9'});
    } else if (d.getDay() == 4) {
      dayOfWeek = jSONData.weekdays.thursday;
      this.setState({colorCode : '#996633'});
      this.setState({textColor : '#ffffff'});

      this.setState({ weekColor : '#ac7339'});
      this.setState({ weekHighlightColor: '#cc9966'});
    } else if (d.getDay() == 5) {
      dayOfWeek = jSONData.weekdays.friday;
      this.setState({colorCode : '#ffff00'});
      this.setState({textColor : '#000000'});

      this.setState({ weekColor : '#ffcc00'});
      this.setState({ weekHighlightColor: '#ffd11a'});
    } else if (d.getDay() == 6) {
      dayOfWeek = jSONData.weekdays.saturday;
      this.setState({colorCode : '#ff66ff'});
      this.setState({textColor : '#ffffff'});

      this.setState({ weekColor : '#ff99ff'});
      this.setState({ weekHighlightColor: '#ffccff'});
    }
  }

  updateFirebase(ref, date) {
    var newData = []
    var that = this
    firebase.database().ref(ref).child(date).on('child_added', function(data){
      //newData = [...that.state.listViewData]
      newData.push(data)
      if(ref === "Schedule/Morning") {
        that.setState({listViewData : that.listViewData1Base});

        that.setState({listViewData : newData})
      } else if(ref === "Schedule/Noon") {
        that.setState({listViewData2 : that.listViewData2Base});

        that.setState({listViewData2 : newData})
      } else if(ref === "Schedule/Night") {
        that.setState({listViewData3 : that.listViewData3Base});

        that.setState({listViewData3 : newData})
      }
    })
  }

  _OnDateChanged (selcDate) {

    //this.setState({listViewData : this.listViewData1Base});
    //this.setState({listViewData2 : this.listViewData2Base});
    //this.setState({listViewData3 : this.listViewData3Base});
    var that = this
    this.setState({ selectedDate : selcDate })
    var str = String(selcDate)
    console.log(str)
    var dateArr = str.split(" ", 4);
    dateArr[1] = this.handleMonth(dateArr);
    dateArr[2] = this.handleNum(dateArr);
    var date = dateArr[1] + " " + dateArr[2] + " " + dateArr[3]
    var array = str.split(" ", 3);
    
    firebase.database().ref('Schedule/Morning').child(date).on('value', function (snapshot) {
      //console.log(snapshot.hasChild.val().name)

      if (snapshot.exists()) {
        that.updateFirebase('Schedule/Morning', date)
      } else {
        that.setState({listViewData : that.listViewData1Base});
      }
  });

  firebase.database().ref('Schedule/Noon').child(date).on('value', function (snapshot) {
    //console.log(snapshot.hasChild.val().name)
    if (snapshot.exists()) {
      that.updateFirebase('Schedule/Noon', date)
    } else {
      that.setState({listViewData2 : that.listViewData2Base});
    }
});

firebase.database().ref('Schedule/Night').child(date).on('value', function (snapshot) {
  //console.log(snapshot.hasChild.val().name)
  if (snapshot.exists()) {
    that.updateFirebase('Schedule/Night', date)
  } else {
    that.setState({listViewData3 : that.listViewData3Base});
  }
});
    if (array[0] == "Sun") {
      dayOfWeek = jSONData.weekdays.sunday;
      this.setState({colorCode: '#cc0000'});
      this.setState({textColor: '#ffffff'});
      
      this.setState({ weekColor : '#ff5050'});
      this.setState({ weekHighlightColor: '#ff6666'});
    } else if (array[0] == "Mon") {
      dayOfWeek = jSONData.weekdays.monday;
      this.setState({colorCode: '#339966'});
      this.setState({textColor: '#ffffff'});

      this.setState({ weekColor : '#339933'});
      this.setState({ weekHighlightColor: '#00cc66'});
    } else if (array[0] == "Tue") {
      dayOfWeek = jSONData.weekdays.tuesday;
      this.setState({colorCode: '#0066cc'});
      this.setState({textColor: '#ffffff'});

      this.setState({ weekColor : '#0099ff'});
      this.setState({ weekHighlightColor: '#33ccff'});
    } else if (array[0] == "Wed") {
      dayOfWeek = jSONData.weekdays.wednesday;
      this.setState({colorCode: '#ffffff'});
      this.setState({textColor: '#000000'});

      this.setState({ weekColor : '#ffffff'});
      this.setState({ weekHighlightColor: '#d9d9d9'});
    } else if (array[0] == "Thu") {
      dayOfWeek = jSONData.weekdays.thursday;
      this.setState({colorCode: '#996633'});
      this.setState({textColor: '#ffffff'});

      this.setState({ weekColor : '#ac7339'});
      this.setState({ weekHighlightColor: '#cc9966'});
    } else if (array[0] == "Fri") {
      dayOfWeek = jSONData.weekdays.friday;
      this.setState({colorCode: '#ffff00'});
      this.setState({textColor: '#000000'});

      this.setState({ weekColor : '#ffcc00'});
      this.setState({ weekHighlightColor: '#ffd11a'});
    } else if (array[0] == "Sat") {
      dayOfWeek = jSONData.weekdays.saturday;
      this.setState({colorCode: '#ff66ff'});
      this.setState({textColor: '#ffffff'});

      this.setState({ weekColor : '#ff99ff'});
      this.setState({ weekHighlightColor: '#ffccff'});
    }

  }

  _onRefresh() {
    this.setState({refreshing: true});
    // your callback function or call this.componentDidMount()
  }

  //This is because CalendarStrip date is 01, 02, etc while the data base has dates 1, 2 etc.
  handleNum (dateArr) {
    if (dateArr[2] == '01'){
      dateArr[2] = '1'
    } else if (dateArr[2] == '02') {
      dateArr[2] = '2'
    } else if (dateArr[2] == '03') {
      dateArr[2] = '3'
    } else if (dateArr[2] == '04') {
      dateArr[2] = '4'
    } else if (dateArr[2] == '05') {
      dateArr[2] = '5'
    } else if (dateArr[2] == '06') {
      dateArr[2] = '6'
    } else if (dateArr[2] == '07') {
      dateArr[2] = '7'
    } else if (dateArr[2] == '08') {
      dateArr[2] = '8'
    } else if (dateArr[2] == '09') {
      dateArr[2] = '9'
    } 
    return dateArr[2];
  }

  handleMonth(dateArr) {
    if (dateArr[1] == 'Jan') {
      dateArr[1] = 'January'
    } else if (dateArr[1] == 'Feb') {
      dateArr[1] = 'February'
    } else if (dateArr[1] == 'Mar') {
      dateArr[1] = 'March'
    } else if (dateArr[1] == 'Apr') {
      dateArr[1] = 'April'
    } else if (dateArr[1] == 'Jun') {
      dateArr[1] = 'June'
    } else if (dateArr[1] == 'Jul') {
      dateArr[1] = 'July'
    } else if (dateArr[1] == 'Aug') {
      dateArr[1] = 'August'
    } else if (dateArr[1] == 'Sep') {
      dateArr[1] = 'September'
    } else if (dateArr[1] == 'Oct') {
      dateArr[1] = 'October'
    } else if (dateArr[1] == 'Nov') {
      dateArr[1] = 'November'
    } else if (dateArr[1] == 'Dec') {
      dateArr[1] = 'December'
    }

    return dateArr[1];
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

          <CalendarStrip
                ref={'myCalendarStrip'}
                showMonth={true}
                selectedDate={this.state.selectedDate}
                startingDate={this.state.weekStart}
                onWeekChange={this._handleOnWeekChange}
                onDateSelected={selectedDate => this._OnDateChanged(selectedDate)}
                highlightDateNumberStyle={{ color: this.state.textColor, fontSize: 12 }}
                highlightDateNameStyle={{ color: this.state.textColor, fontSize: 8 }}
                calendarAnimation={{type: 'sequence', duration: 30}}
                daySelectionAnimation={{type: 'background', duration: 300, highlightColor: this.state.weekHighlightColor}}
                style={{height:100, paddingTop: 20, paddingBottom: 10}}
                calendarHeaderStyle={{color: this.state.textColor}}
                calendarColor={this.state.weekColor}
                dateNumberStyle={{color: this.state.textColor}}
                dateNameStyle={{color: this.state.textColor}}
                iconContainer={{flex: 0.1}}
                locale = {{name:moment.locale('sv'), config:localeConst}}
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