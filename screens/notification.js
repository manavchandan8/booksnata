import React, { Component } from 'react';
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import { SnapshotViewIOS } from 'react-native';
import { render } from 'react-dom';
import { Notifications } from 'expo';
export default  class NotificationScreen extends Component {
    constructor(props){
        super(props)
        this.state={
            userid:firebase.auth().currentUser.email,
            allnotifications:[]
        }

    }
    getnotifications=()=>{
        this.requestref=db.collection("all_notifications").where("notification_status","==","unread").where("targeted_user_id",'==',this.state.userid)
        .onSnapshot((Snapshot)=>{
            var allnotifications=[]
            Snapshot.docs.map((doc)=>{
                var notification=doc.data()
                notification["doc_id"]=doc.id
                allnotifications.push(notification)
            });
            this.setState({
                allnotifications:allnotifications
            })
        });
    }
}
componentDidMount(){
    this.getnotifications();
}
keyExtractor=(item,index)=>index.toString(
    renderitem=({item,index})=>{
        return(
            <ListItem
                key={index}
                leftElement={<Icon name="book" type="font-awesome" color='#696969'/>}
                title={item.book_name}
                titleStyle={{color:'black',fontWeight:'bold'}}
                subtitle={item.message}
                bottomDivider
                />
           
        )
    }
)
render(){
    return(
        <View style={styles.container}>
            <View style={{flex:0.1}}>
        <MyHeader title={"notifications"} navigation={this.props.navigation}/> 
        </View>
        <View style={{flex:0.9}}>
            {
                this.state.allnotifications.length===0
                ?(
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:25}}>You have no new notifications </Text>
                        </View>
                )
                :(
                    <FlatList 
                    keyExtractor={this.keyExtractor}
                    data={this.state.allnotifications}
                    renderItem={this.renderItem}
            />
                )
            }
            
        </View>
        </View>
    )
}}
const styles=StyleSheet.create({
    container:{flex:1}
})