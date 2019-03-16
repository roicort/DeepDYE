import React, { Component } from 'react'; // 1
import {
  ActivityIndicator,
  Button,
  Text,
  Slider,
  View,
} from 'react-native';
import { Haptic } from 'expo';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      Val1: 10,
      Val2: 20,
      Val3: 30,
    }
    } 
    getVal(val){
    console.warn(val);
    } 
  
    render() {
      let { Val1, Val2, Val3} = this.state;
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>S1: {Val1} S2: {Val2} S3: {Val3}</Text>
          <Slider
           style={{ width: 250 }}
           step={1}
           minimumValue={0}
           maximumValue={255}
           value={this.state.Val1}
           onValueChange={val => this.setState({ Val1: val })}
           onSlidingComplete={ Haptic.selection()}
          />
          <Slider
           style={{ width: 250 }}
           step={1}
           minimumValue={0}
           maximumValue={255}
           value={this.state.Val2}
           onValueChange={val => this.setState({ Val2: val })}
           //onSlidingComplete={ val => this.getVal(val)}
          />
          <Slider
           style={{ width: 250 }}
           step={1}
           minimumValue={0}
           maximumValue={255}
           value={this.state.Val3}
           onValueChange={val => this.setState({ Val3: val })}
           //onSlidingComplete={ val => this.getVal(val)}
          />   

          <Button
          title="Go to Details"
          onPress={() => {
            /* 1. Navigate to the Details route with params */
            this.props.navigation.navigate('LinksScreen', {
              itemId: 86,
              otherParam: 'anything you want here',
            });
          }}
        />
                                                            
        </View>
      );
    }
}



