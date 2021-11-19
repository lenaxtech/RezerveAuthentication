import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '../firebase';

import * as Google from 'expo-google-app-auth';
export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [googleSubmitting, setGoogleSubmitting] = useState(false);
    const Navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                Navigation.navigate('Home');
            } else {
                Navigation.navigate('Login');
            }

        });
        return unsubscribe;
    }, [])

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Registered with:', user.email);
            })
            .catch(error => alert(error.message))
    }
    const handleLogin = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Login with:', user.email);
                Navigation.navigate('Home');
            })
            .catch(error => alert(error.message))
    }
    const handleGoogleLogin = () => {
        setGoogleSubmitting(true);
        const config = {
            iosClientId: `25272748736-2ga3cv7s9i822fkgvkr5tp5quq28e33a.apps.googleusercontent.com`,
            androidClientId: `25272748736-h3pvnm8osf4r7v9i69g1gas7eqcb7422.apps.googleusercontent.com`,
            scopes: ['profile', 'email'],
        }
        Google.logInAsync(config)
            .then(result => {
                const { type, user } = result;
                if (type === 'success') {
                    const {email,password} = user;
                    Navigation.navigate('Home');
                    console.log(user);
            }else{
                    console.log(error);
            }
            setGoogleSubmitting(false);
        })
        .catch(error => {
            console.log(error);
            setGoogleSubmitting(false);
        })
    }
  const isUserEqual = (googleUser, firebaseUser) => {
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
     const onSignIn = googleUser => {
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
    const handleFacebookLogin = () => {
        auth
            .signInWithPopup(new auth.FacebookAuthProvider())
            .then(userCredentials => {
                const user = userCredentials.user;
                console.log('Login with:', user.email);
                Navigation.navigate('Home');
            })
            .catch(error => alert(error.message))
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    style={{}}
                    source={require('../assets/image/Saly-19.png')}
                />

            </View>
            <View style={styles.loginInputs}>
                <TextInput
                    placeholder="E-Mail"
                    style={styles.input}
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                />
                <TextInput
                    placeholder="Password"
                    secureTextEntry={true}
                    style={styles.input}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton}
                    onPress={handleLogin}
                >
                    <Text style={{ color: '#fff' }}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.registerButton}
                    onPress={handleSignUp}
                >
                    <Text style={{ color: '#fff', flex: 1, alignContent: 'center' }}>Register</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 15 }}>
                <View style={{ backgroundColor: 'black', height: 1, flex: 1 }} />
                <Text style={{ paddingHorizontal: 20 }}>YA DA</Text>
                <View style={{ backgroundColor: 'black', height: 1, flex: 1 }} />
            </View>
            <View style={styles.socialLogin}>
                {!googleSubmitting &&(
                <TouchableOpacity style={styles.Google}
                onPress={handleGoogleLogin}
            >
                <Image
                    style={{ width: 80, height: 80 }}
                    source={require('../assets/image/googleicon.png')}
                />
            </TouchableOpacity>
                )}
                
                <TouchableOpacity style={styles.Facebook}
                    onPress={() => {
                        alert('Facebook Girişi Başarılı')
                    }}
                >

                    <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../assets/image/facebook.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.Apple}
                    onPress={() => {
                        alert('Apple Girişi Başarılı')
                    }}
                >

                    <Image
                        style={{ width: 80, height: 80 }}
                        source={require('../assets/image/appleicon.png')}
                    />
                </TouchableOpacity>

            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 300,
        height: 50,
        borderColor: '#000',
        borderWidth: 1,
        margin: 10,
        padding: 10,
        borderRadius: 10,
    },
    loginButton: {
        width: 250,
        height: 50,
        backgroundColor: 'orange',
        margin: 10,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    registerButton: {
        width: 250,
        height: 50,
        backgroundColor: 'grey',
        opacity: 0.5,
        margin: 10,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',

    },
    socialLogin: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },


});
