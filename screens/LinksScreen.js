import React, { Component } from 'react';
import {
  ActivityIndicator,
  Button,
  Clipboard,
  Image,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  Picker,
  View,
} from 'react-native';
import { Constants, ImagePicker, Permissions } from 'expo';
import { Haptic } from 'expo';
import { WebBrowser } from 'expo';

export default class App extends Component {
  state = {
    image: null,
    uploading: false,
    selectedcolor: "red"
  };

  render() {
    let {
      image,
      selectedcolor
    } = this.state;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="default" />

        <Text
          style={styles.exampleText}>
          Upload Image
        </Text>

        <Button
          onPress={this._pickImage}
          title="Camera roll"
        />

        <Button 
          onPress={this._takePhoto}
          title="Take a photo" 
        />
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}
        <Text>Color: {selectedcolor} </Text>
        <Picker
      selectedValue={this.state.selectedcolor}
      style={{ height: 50, width: 100}}
      onValueChange={(itemValue, itemIndex) => this.setState({selectedcolor: itemValue})}>
      <Picker.Item label="Red" value="red" />
      <Picker.Item label="Green" value="green" />
      <Picker.Item label="Blue" value="blue" />
      <Picker.Item label="White" value="white" />
      <Picker.Item label="Pink" value="pink" />
    </Picker>
    
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) {
      return (
        <View
          style={[StyleSheet.absoluteFill, styles.maybeRenderUploading]}>
          <ActivityIndicator color="#fff" size="large" />
        </View>
      );
    }
  };

  _maybeRenderImage = () => {
    let {
      image
    } = this.state;

    if (!image) {
      return;
    }

    return (
      <View
        style={styles.maybeRenderContainer}>
        <View
          style={styles.maybeRenderImageContainer}>
          <Image source={{ uri: image }} style={styles.maybeRenderImage} />
        </View>

        <Text
          onPress={this._Saave}
          style={styles.maybeRenderImageText}>
          Save
        </Text>

      </View>
    );
  };

  _share = () => {
    Share.share({
      message: this.state.image,
      title: 'Check out this photo',
      url: this.state.image,
    });
  };
  _Saave = () => {
    WebBrowser.openBrowserAsync(this.state.image);
    Haptic.impact(Haptic.ImpactFeedbackStyle.Heavy)
    alert('Reddirecting');
  };

  _takePhoto = async () => {
    const {
      status: cameraPerm
    } = await Permissions.askAsync(Permissions.CAMERA);

    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera AND camera roll
    if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _pickImage = async () => {
    const {
      status: cameraRollPerm
    } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      this._handleImagePicked(pickerResult);
    }
  };

  _handleImagePicked = async pickerResult => {
    let uploadResponse, uploadResult;
    let {
      selectedcolor
    } = this.state;

    try {
      this.setState({
        uploading: true
      });

      if (!pickerResult.cancelled) {
        uploadResponse = await uploadImageAsync(pickerResult.uri,selectedcolor);
        uploadResult = await uploadResponse.json();
        let apiUrl = "http://104.198.11.27:6969/" + "static/" + uploadResult.Out_Filename
        this.setState({
          image: apiUrl
        });
      }
    } catch (e) {
      console.log({ uploadResponse });
      console.log({ uploadResult });
      console.log({ e });
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({
        uploading: false
      });
    }
  };
}

async function uploadImageAsync(uri,selectedcolor) {
  let apiUrl = 'http://104.198.11.27:6969/DyeHair';

  // Note:
  // Uncomment this if you want to experiment with local server
  //
  // if (Constants.isDevice) {
  //   apiUrl = `https://your-ngrok-subdomain.ngrok.io/upload`;
  // } else {
  //   apiUrl = `http://localhost:3000/upload`
  // }

  let uriParts = uri.split('.');
  let fileType = uriParts[uriParts.length - 1];

  let formData = new FormData(); 

  formData.append('photo', {
    uri,
    name: `photo.${fileType}`,
    type: `image/${fileType}`,
  });

  formData.append('color',
  selectedcolor
  );

  let options = {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
  };
  Haptic.impact(Haptic.ImpactFeedbackStyle.Success)
  return fetch(apiUrl, options);
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  exampleText: {
    fontSize: 20,
    marginBottom: 20,
    marginHorizontal: 15,
    textAlign: 'center',
  },
  maybeRenderUploading: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
  },
  maybeRenderContainer: {
    borderRadius: 3,
    elevation: 2,
    marginTop: 0,
    shadowColor: 'rgba(0,0,0,1)',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 4,
      width: 4,
    },
    shadowRadius: 5,
    width: 250,
  },
  maybeRenderImageContainer: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    overflow: 'hidden',
  },
  maybeRenderImage: {
    height: 250,
    width: 250,
  },
  maybeRenderImageText: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 25,
  }
});