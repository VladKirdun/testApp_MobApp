
'use strict';
 
import React, { Component } from 'react'
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableHighlight,
  FlatList,
  TextInput,
  Button,
  Text,
} from 'react-native';

var ImagePicker = require('react-native-image-picker');

var options = {
  title: 'Select Avatar',
  customButtons: [
    {name: 'fb', title: 'Choose Photo from Facebook'},
  ],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

export default class OrderView extends Component {
	static navigationOptions = {
    title: 'Order',
  };

  constructor(props) {
    super(props);
    this.state = {
      id: '',
      address: '',
      waiting_time: '',
      status: '',
      photo: '',
      trigger_address: true,
      trigger_status: true
    }
  }

  componentWillMount() {
    var order = this.props.navigation.state.params.order;
    this.setState({id: order.id});
    this.setState({address: order.address});
    this.setState({waiting_time: order.waiting_time});
    this.setState({status: order.status});
    this.setState({photo: order.photo});
  }

  onChangeAddressTrigger() {
    this.state.trigger_address ?
    this.setState({trigger_address: false}) :
    this.setState({trigger_address: true})
  }

  onChangeAddress(event) {
    this.setState({address: event.nativeEvent.text})
  }

  onChangeStatusTrigger() {
    this.state.trigger_status ?
    this.setState({trigger_status: false}) :
    this.setState({trigger_status: true})
  }

  onChangeStatus(event) {
    this.setState({status: event.nativeEvent.text})
  }

  onDelete() {
    var id = this.state.id;
    fetch('http://192.168.96.128:3000/api/delete', {
      method: 'POST',
      headers: {
        Accept: 'application/x-www-form-urlencoded',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        if(response.status == 200) {
          this.props.navigation.navigate('Home');
        };
      })
      .catch(function(error) {
        alert('There has been a problem with your fetch operation: ' + error.message);
      });
  }

  render() {
    var order = this.props.navigation.state.params.order;

    let img = this.state.photo == null ? null:
      <Image style={styles.thumb} source={{uri: 'data:image/png;base64,' + this.state.photo}} />

    let address = this.state.trigger_address == true ?
      <Text onPress={this.onChangeAddressTrigger.bind(this)} style={styles.address}>Адрес: {this.state.address}</Text> :
      <View> 
        <View style={styles.flowRight}>
          <Text style={styles.address}>Адрес: </Text>
          <TextInput 
            style={styles.status} 
            value={this.state.address} 
            onChange={this.onChangeAddress.bind(this)}
          />
        </View>
        <Button
          onPress={this.onChangeAddressTrigger.bind(this)}
          style={styles.searchImage}
          title='Изменить'
        />
      </View>

    let status = this.state.trigger_status == true ?
      <View style={styles.flowRight}>
        <Text onPress={this.onChangeStatusTrigger.bind(this)} style={styles.status}>Статус: {this.state.status}</Text>
        {img}
      </View> :
      <View> 
        <View style={styles.flowRight}>
          <Text style={styles.status}>Статус: </Text>
          <TextInput 
            style={styles.status} 
            value={this.state.status}
            onChange={this.onChangeStatus.bind(this)}
          />
          {img}
        </View>
        <Button
          onPress={this.onChangeStatusTrigger.bind(this)}
          style={styles.searchImage}
          title='Изменить'
        />
      </View>

    return (
      <ScrollView>
        <Button
          onPress={this.onDelete.bind(this)}
          style={styles.deleteOrder}
          title='Удалить заказ'
        />
        <View style={styles.container}>
          <Text style={styles.id}>id товара: {this.state.id}</Text>
          {address}
          <Text style={styles.waitingTime}>Время доставки: {this.state.waiting_time} часа(ов)</Text>
          {status}
        </View>
        <Button
          onPress={this.show.bind(this)}
          style={styles.searchImage}
          title='Добавить фото'
        />
      </ScrollView>
    );
  }

  show() {
    ImagePicker.showImagePicker(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let id = this.state.id;
        let photo = response.data;
        
        this.setState({
          photo: photo
        });

        fetch('http://192.168.96.128:3000/api/addPhoto', {
          method: 'POST',
          headers: {
            Accept: 'application/x-www-form-urlencoded',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify({
            id: id,
            photo: photo,
          }),
        })
          .then((response) => response.json())
          .then((responseJson) => {
              this.setState({waiting_time: responseJson.waiting_time});
              this.setState({status: responseJson.status});
              this.setState({photo: responseJson.photo});
            });
      }
    });
  }
}

var styles = StyleSheet.create({    
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: 5,
    marginBottom: 5
  },
  container: {
    padding: 10,
  },
  id: {
    fontSize: 12,
  },
  address: {
    fontSize: 19,
    fontWeight: "bold",
  },
  waitingTime: {
    fontSize: 14,
  },
  status: {
    fontSize: 16,
  },
  searchImage: {
    height: 36,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
  separator: {
    height: 1,
    backgroundColor: '#323232'
  },
  thumb: {
    width: 100,
    height: 30,
    marginLeft: 50
  },
});
