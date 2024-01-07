import { View, Text, TouchableOpacity, TextInput, StyleSheet, Button,Alert } from 'react-native';
import React, {useRef, useState} from 'react';
import {getApp,initializeApp} from 'firebase/app';
import {FirebaseRecaptchaVerifierModal,FirebaseRecaptchaBanner} from 'expo-firebase-recaptcha';
import {getAuth,PhoneAuthProvider,signInWithCredential} from 'firebase/auth';
import { firebaseConfig,FIREBASE_APP,FIREBASE_AUTH } from '../../FirebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'; // Add this line for importing PhoneAuthProvider

try{
    firebase.initializeApp(firebaseConfig);
}catch(error){
    console.log("Initializing error ",error);
}

const Otp = () =>{

    
    const app = getApp();
    const auth = getAuth(app);
    const recaptchaVerifier = useRef(null);

    const [phoneNumber,setPhoneNumber] = useState('');
    const [verificationId,setVerificationID] = useState('');
    const [verificationCode,setVerificationCode] = useState('');

    const firebaseConfig = app ? app.options : undefined;
    const [info,setInfo] = useState("");
    const attemptInvisibleVerification = false;

    const handleSendVerificationCode = async () => {
        try{
            const phoneProvider = new PhoneAuthProvider(auth); // initialize the phone provider.
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
            ); // get the verification id
            setVerificationID(verificationId); // set the verification id
            setInfo('Success : Verification code has been sent to your phone'); // If Ok, show message.
        }catch(error){
            setInfo(`Error : ${error.message}`); // show the error
        }
    };

    const handleVerifyVerificationCode = async () => {
        try{
            const credential = PhoneAuthProvider.credential(verificationId,verificationCode); // get the credential
            await signInWithCredential(auth,credential); // verify the credential
            setInfo('Success: Phone authentication successful'); // if OK, set the message
             // navigate to the welcome screen
        }catch(error){
            setInfo(`Error : ${error.message}`); // show the error.
        }
    }

    return (
    <View style={styles.container}>

        <FirebaseRecaptchaVerifierModal 
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
        />

        {
            info && <Text style={styles.text}>{info}</Text>
        }

        { // show the phone number input field when verification id is not set.
            !verificationId && (
                <View>
                    <Text style={styles.text}>Enter the phone number</Text>

                        <TextInput
                            placeholder='+2547000000'
                            autoFocus
                            autoComplete='tel'
                            keyboardType='phone-pad'
                            textContentType='telephoneNumber'
                            onChangeText={ (phoneNumber) => setPhoneNumber(phoneNumber)}
                        />

                        <Button 
                            onPress={ () => handleSendVerificationCode()}
                            title= "Send Verification Code"
                            disabled={!phoneNumber}
                        />
                </View>
            )
            
        }

        { // if verification id exists show the confirm code input field.
            verificationId && (
                <View>
                    <Text style={styles.text}>Enter the verification code</Text>

                    <TextInput
                        editable={!!verificationId}
                        placeholder= "123456"
                        onChangeText={setVerificationCode}
                    />

                    <Button
                        title= "Confirm Verification Code"
                        disabled={!verificationCode}
                        onPress = {() => handleVerifyVerificationCode()}
                    />
                </View>
            )
        }

        {attemptInvisibleVerification && <FirebaseRecaptchaBanner/>}
    </View>
)
}

export default Otp;

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#000',
        alignItems:'center',
        justifyContent:'center'
    },
    textInput:{
        paddingTop:40,
        paddingBottom:20,
        paddingHorizontal:20,
        fontSize:24,
        borderBottomColor:'#fff',
        borderBottomWidth:2,
        marginBottom:20,
        textAlign:'center',
        color:'#fff'
    },
    sendVerification:{
        padding:20,
        backgroundColor:'#3498db',
        borderRadius:10,
    },
    sendCode:{
        padding:20,
        backgroundColor:'#9b59b6',
        borderRadius:10,
    },
    buttonText:{
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
    },
    otpText:{
        fontSize:24,
        fontWeight:'bold',
        color:'#fff',
        margin:20
    },
    text:{
        color: "#fff"
    }
});