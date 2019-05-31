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
var d = new Date();
theDate = String(months[d.getMonth()] + " " + d.getDate() + " " + d.getFullYear());
var dayOfWeek = "";

var jSONData = require('../i18next/sv.json');

var url = "This";
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
      listViewData: data,
      listViewData2: data2,
      listViewData3: data3,
      newContact: "",
      image: url,
      uploading: false
    };
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

  _OnDateChanged (selectedDate) {
    this.setState({selectedDate})
    var str = String(selectedDate)
    var dateArr = str.split(" ", 4);
    dateArr[2] = this.handleNum(dateArr);
    var date = dateArr[1] + " " + dateArr[2] + " " + dateArr[3]
    var array = str.split(" ", 3); 

    this.updateFirebase('Schedule/Morning', date)
    this.updateFirebase('Schedule/Noon', date)
    this.updateFirebase('Schedule/Night', date)

    if (array[0] == "Sun") {
        dayOfWeek = jSONData.weekdays.sunday;
        this.setState({colorCode: '#cc0000'});
        this.setState({textColor: '#ffffff'});
      } else if (array[0] == "Mon") {
        dayOfWeek = jSONData.weekdays.monday;
        this.setState({colorCode: '#339966'});
        this.setState({textColor: '#ffffff'});
      } else if (array[0] == "Tue") {
        dayOfWeek = jSONData.weekdays.tuesday;
        this.setState({colorCode: '#0066cc'});
        this.setState({textColor: '#ffffff'});
      } else if (array[0] == "Wed") {
        dayOfWeek = jSONData.weekdays.wednesday;
        this.setState({colorCode: '#ffffff'});
        this.setState({textColor: '#000000'});
      } else if (array[0] == "Thu") {
        dayOfWeek = jSONData.weekdays.thursday;
        this.setState({colorCode: '#996633'});
        this.setState({textColor: '#ffffff'});
      } else if (array[0] == "Fri") {
        dayOfWeek = jSONData.weekdays.friday;
        this.setState({colorCode: '#ffff00'});
        this.setState({textColor: '#000000'});
      } else if (array[0] == "Sat") {
        dayOfWeek = jSONData.weekdays.saturday;
        this.setState({colorCode: '#ff66ff'});
        this.setState({textColor: '#ffffff'});
      }
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
                showMonth={false}
                selectedDate={this.state.selectedDate}
                startingDate={this.state.weekStart}
                onWeekChange={this._handleOnWeekChange}
                onDateSelected={selectedDate => this._OnDateChanged(selectedDate)}
                highlightDateNumberStyle={{ color: 'white', fontSize: 12 }}
                highlightDateNameStyle={{ color: 'white', fontSize: 8 }}
                calendarAnimation={{type: 'sequence', duration: 30}}
                daySelectionAnimation={{type: 'background', duration: 300, highlightColor: '#5AC8FA'}}
                style={{height:100, paddingTop: 20, paddingBottom: 10}}
                calendarHeaderStyle={{color: 'white'}}
                calendarColor={'#007AFF'}
                dateNumberStyle={{color: 'white'}}
                dateNameStyle={{color: 'white'}}
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