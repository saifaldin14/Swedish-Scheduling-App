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
  Button } from 'native-base';
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

      await Permissions.askAsync(Permissions.CAMERA_ROLL);
      await Permissions.askAsync(Permissions.CAMERA);

  }

  async addRow(data) {
      var key = firebase.database().ref('/Schedule/Morning').push().key
      imageURL = key;
      imageKey = data
  }
  async addRow2(data) {
    var key = firebase.database().ref('/Schedule/Noon').push().key
    imageURL = key;
    imageKey = data
  }
  async addRow3(data) {
    var key = firebase.database().ref('/Schedule/Night').push().key
    imageURL = key;
    imageKey = data
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
  render() {
    let { image } = this.state;
      return (
        <ScrollView>
            <Content>
                <Item>
                  <Input
                  onChangeText = {(newContact) => this.setState({newContact})}
                  placeholder = 'Add Workers in the Morning'/>

                <Button transparent block onPress = {() => this.addRow(this.state.newContact)}>
                    <Icon name = "add"/>
                </Button>
                </Item>
                <Button
                  transparent block
                  onPress={this._pickImage}
                  title="Pick an image from camera roll">
                  <Text>
                    Pick an image from camera roll
                  </Text>
                  </Button>

                <Button onPress={this._takePhoto} title="Take a photo" />     
            </Content>
            <Content>
                <Item>
                  <Input
                  onChangeText = {(newContact2) => this.setState({newContact2})}
                  placeholder = 'Add Workers at Noon'/>

                <Button transparent block onPress = {() => this.addRow(this.state.newContact2)}>
                    <Icon name = "add"/>
                </Button>
                </Item>
                <Button
                  transparent block
                  onPress={this._pickImage2}
                  title="Pick an image from camera roll">
                  <Text>
                    Pick an image from camera roll
                  </Text>
                  </Button>

                <Button onPress={this._takePhoto2} title="Take a photo" />     
            </Content>
            <Content>
                <Item>
                  <Input
                  onChangeText = {(newContact3) => this.setState({newContact3})}
                  placeholder = 'Add Workers at Night'/>

                <Button transparent block onPress = {() => this.addRow(this.state.newContact3)}>
                    <Icon name = "add"/>
                </Button>
                </Item>
                <Button
                  transparent block
                  onPress={this._pickImage3}
                  title="Pick an image from camera roll">
                  <Text>
                    Pick an image from camera roll
                  </Text>
                  </Button>

                <Button onPress={this._takePhoto3} title="Take a photo" />     
            </Content>

            <Content>
                <List
                enableEmptySections
                dataSource = {this.ds.cloneWithRows(this.state.listViewData)}
                renderRow = { this._RenderListItem.bind(data) }
                renderLeftHiddenRow = { data =>
                    <Button full onPress = {() => this.addRow(data)}>
                        <Icon name = 'information-circle'/>
                    </Button>
                }
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

    _RenderListItem =  (data) => {
      var key = data.val().name
      var url = data.val().url
      return (
        <ListItem>
          <Text> {key} </Text>
          <Image  source={{uri : url}} style={{ width: 100, height: 100 }} />
          {this._maybeRenderUploadingOverlay()}
      </ListItem>
      );
    }
    _takePhoto = async () => {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked(pickerResult);
    };
    _takePhoto2 = async () => {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked2(pickerResult);
    };
    _takePhoto3 = async () => {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked3(pickerResult);
    };
  
    _pickImage = async () => {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked(pickerResult);
    };
    _pickImage2 = async () => {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked2(pickerResult);
    };
    _pickImage3 = async () => {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
  
      this._handleImagePicked3(pickerResult);
    };
  
    _handleImagePicked = async pickerResult => {
      try {
        this.setState({ uploading: true });
  
        if (!pickerResult.cancelled) {
          uploadUrl = await uploadImageAsync(pickerResult.uri);
          firebase.database().ref('/Schedule/Morning').child(date).child(imageURL).set({ name : imageKey, url : uploadUrl })
          this.setState({ image: uploadUrl });
        }
      } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
      } finally {
        this.setState({ uploading: false });
      }
    };

    _handleImagePicked2 = async pickerResult => {
      try {
        this.setState({ uploading: true });

        if (!pickerResult.cancelled) {
          uploadUrl = await uploadImageAsync(pickerResult.uri);
          firebase.database().ref('/Schedule/Noon').child(date).child(imageURL).set({ name : imageKey, url : uploadUrl })
          this.setState({ image: uploadUrl });
        }
      } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
      } finally {
        this.setState({ uploading: false });
      }
    };
    _handleImagePicked3 = async pickerResult => {
      try {
        this.setState({ uploading: true });

        if (!pickerResult.cancelled) {
          uploadUrl = await uploadImageAsync(pickerResult.uri);
          firebase.database().ref('/Schedule/Night').child(date).child(imageURL).set({ name : imageKey, url : uploadUrl })
          this.setState({ image: uploadUrl });
        }
      } catch (e) {
        console.log(e);
        alert('Upload failed, sorry :(');
      } finally {
        this.setState({ uploading: false });
      }
    };
}
  async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  
    const ref = firebase
      .storage()
      .ref()
      .child(imageKey);
      //.child(uuid.v4());
    const snapshot = await ref.put(blob);
  
    // We're done with the blob, close and release it
    blob.close();
  
    return await snapshot.ref.getDownloadURL();
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