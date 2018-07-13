
'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  FlatList,
  Button,
  ActivityIndicator,
  Image,
  NetInfo
} from 'react-native'; 

const Realm = require('realm');

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
  }

  render() {
    const item = this.props.item;

    let img = item.photo == null ? null:
      <Image style={styles.thumb} source={{uri: 'data:image/png;base64,' + item.photo}} />

    return (
      <TouchableHighlight
        onPress={this._onPress}>
        <View>
          <View style={styles.container}>
            <Text style={styles.id}>id товара: {item.id}</Text>
            <Text style={styles.address}>Адрес: {item.address}</Text>
            <Text style={styles.waitingTime}>Время доставки: {item.waiting_time} часа(ов)</Text>
            <View style={styles.flowRight}>
              <Text style={styles.status}>Статус: {item.status}</Text>
              {img}
            </View>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class OrdersList extends Component<{}> {
  static navigationOptions = {
    title: 'Orders List',
  };
  
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      data: '',
    };
  }

  componentWillMount() {
    fetch('http://192.168.96.128:3000/api/')
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        this.setState({data: responseJson});
        return true
      });
  }

  // componentWillUpdate() {
  //   fetch('http://192.168.96.128:3000/api/')
  //     .then((response) => {
  //       return response.json()
  //     })
  //     .then((responseJson) => {
  //       this.setState({data: responseJson});
  //       return true
  //     });
  // }

  onChangeId(event) {
    this.setState({id: event.nativeEvent.text})
  }

  onSearchOrders() {
    fetch('http://192.168.96.128:3000/api?id=' + this.state.id)
      .then((response) => {
        return response.json()
      })
      .then((responseJson) => {
        this.setState({data: responseJson});
        return true
      });
  }

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  _onPressItem = (index) => {
    var order = this.state.data[index];
    this.props.navigation.navigate(
      'Order', {order: order});
  };

  render() {
    const params = this.state.data;
    
    return (
      <View>
        <View style={styles.flowRight}>
          <TextInput 
            style={styles.status} 
            value={this.state.id} 
            onChange={this.onChangeId.bind(this)}
          />
          <Button
            onPress={this.onSearchOrders.bind(this)}
            style={styles.searchImage}
            title='Поиск'
          />
        </View>
        <FlatList
          data={params}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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