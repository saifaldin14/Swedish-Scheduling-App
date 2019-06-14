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
  Button, Form, Label, Input} from 'native-base';
import * as firebase from 'firebase';
import { firebaseApp } from './Month';

export default class Login extends React.Component  {
    constructor(props) {
        super(props)
    
        this.state = ({
          email: '',
          password: ''
        })
      }
    
      componentDidMount() {
    
        firebase.auth().onAuthStateChanged((user) => {
          if (user != null) {
            console.log(user)
          }
        })
      }
    
      signUpUser = (email, password) => {
    
        try {
    
          if (this.state.password.length < 6) {
            alert("Please enter atleast 6 characters")
            return;
          }
    
          firebase.auth().createUserWithEmailAndPassword(email, password)
        }
        catch (error) {
          console.log(error.toString())
        }
      }
    
      loginUser = (email, password) => {
    
        try {
    
          firebase.auth().signInWithEmailAndPassword(email, password).then(function (user) {
            console.log(user)
    
          })
        }
        catch (error) {
          console.log(error.toString())
        }
      }
    
      async loginWithFacebook() {
    
        //ENTER YOUR APP ID 
        const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('632307010514585', { permissions: ['public_profile'] })
    
        if (type == 'success') {
    
          const credential = firebase.auth.FacebookAuthProvider.credential(token)
    
          firebase.auth().signInWithCredential(credential).catch((error) => {
            console.log(error)
          })
        }
      }

      isUserEqual = (googleUser, firebaseUser) => {
        if (firebaseUser) {
          var providerData = firebaseUser.providerData;
          for (var i = 0; i < providerData.length; i++) {
            if (
              providerData[i].providerId ===
                firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()
            ) {
              // We don't need to reauth the Firebase connection.
              return true;
            }
          }
        }
        return false;
      };
      onSignIn = googleUser => {
        console.log('Google Auth Response', googleUser);
        // We need to register an Observer on Firebase Auth to make sure auth is initialized.
        var unsubscribe = firebase.auth().onAuthStateChanged(
          function(firebaseUser) {
            unsubscribe();
            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(googleUser, firebaseUser)) {
              // Build Firebase credential with the Google ID token.
              var credential = firebase.auth.GoogleAuthProvider.credential(
                googleUser.idToken,
                googleUser.accessToken
              );
              // Sign in with credential from the Google user.
              firebase
                .auth()
                .signInAndRetrieveDataWithCredential(credential)
                .then(function(result) {
                  console.log('user signed in ');
                  if (result.additionalUserInfo.isNewUser) {
                    firebase
                      .database()
                      .ref('/users/' + result.user.uid)
                      .set({
                        gmail: result.user.email,
                        profile_picture: result.additionalUserInfo.profile.picture,
                        first_name: result.additionalUserInfo.profile.given_name,
                        last_name: result.additionalUserInfo.profile.family_name,
                        created_at: Date.now()
                      })
                      .then(function(snapshot) {
                        // console.log('Snapshot', snapshot);
                      });
                  } else {
                    firebase
                      .database()
                      .ref('/users/' + result.user.uid)
                      .update({
                        last_logged_in: Date.now()
                      });
                  }
                })
                .catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // The email of the user's account used.
                  var email = error.email;
                  // The firebase.auth.AuthCredential type that was used.
                  var credential = error.credential;
                  // ...
                });
            } else {
              console.log('User already signed-in Firebase.');
            }
          }.bind(this)
        );
      };
      signInWithGoogleAsync = async () => {
        try {
          const result = await Expo.Google.logInAsync({
            behavior: 'web',
            iosClientId: '147985957627-p83b220a0qrgfj2qj96dr3l1dm1h99bf.apps.googleusercontent.com', //enter ios client id
            androidClientId: '147985957627-pq7tbr673hot79ourclbcfghemnhpshj.apps.googleusercontent.com',
            scopes: ['profile', 'email']
          });
    
          if (result.type === 'success') {
            this.onSignIn(result);
            return result.accessToken;
          } else {
            return { cancelled: true };
          }
        } catch (e) {
          return { error: true };
        }
      };
    
      render() {
        return (
          <Container style={styles.container}>
            <Form>
              <Item floatingLabel>
                <Label>E-post</Label>
                <Input
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(email) => this.setState({ email })}
                />
    
              </Item>
    
              <Item floatingLabel>
                <Label>Lösenord</Label>
                <Input
                  secureTextEntry={true}
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText={(password) => this.setState({ password })}
                />
              </Item>
    
              <Button style={{ marginTop: 10 }}
                full
                rounded
                success
                onPress={() => this.loginUser(this.state.email, this.state.password)}>
                <Text style={{ color: 'white' }}> Logga in </Text>
              </Button>
              <Item>
                <Button style={{ marginTop: 10, flex: 1 }}
                    full
                    rounded
                    danger
                    onPress={() => this.loginWithFacebook()}>
                    <Text style={{ color: 'white' }}> Logga in med Facebook </Text>
                </Button>
                
                <Button style={{ marginTop: 10, flex: 1}}
                full
                rounded
                warning
                onPress={() => this.signInWithGoogleAsync()}>
                <Text style={{ color: 'white'}}> Logga in med Google </Text>
                </Button>
              </Item>
    
              <Button style={{ marginTop: 10 }}
                full
                rounded
                primary
                onPress={() => this.signUpUser(this.state.email, this.state.password)}
              >
                <Text style={{ color: 'white' }}> Bli Medlem </Text>
              </Button>
            </Form>
          </Container>
        );
      }
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 10
      },
    });