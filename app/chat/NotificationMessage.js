import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
  Text
} from 'react-native'
import { changeEmojiText } from '@sishu/react-native-easy-chat-ui/app/chat/utils'
const { width } = Dimensions.get('window')


export default class NotificationMessage extends PureComponent {
  render () {
    const { isSelf, message, messageErrorIcon, isOpen, rightMessageBackground, leftMessageBackground, reSendMessage, chatType } = this.props
    return (
      <View
        style={[isSelf ? styles.right : styles.left, {flex:1}]}
        collapsable={false}
        ref={(e) => (this[`item_${this.props.rowId}`] = e)}
      >

        <TouchableOpacity
          style={{flex:1}}
          activeOpacity={1}
          disabled={isOpen}
          onPress={() => {
            this.props.onMessagePress('notification', parseInt(this.props.rowId), message)
          }}
        >
          <View style={[styles.container, { backgroundColor: leftMessageBackground },isSelf?styles.marginSelf:styles.marginOther]}>
            <Text style={{color:'#E7B05F',fontSize: 16, marginBottom:10}}>群公告</Text>
            <Text>{message.content}</Text>
          </View>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10}}>
          {!isSelf
            ? null
            : message.sendStatus === undefined
              ? null
              : message.sendStatus === 0
                ? <ActivityIndicator />
                : message.sendStatus < 0
                  ? <TouchableOpacity
                    disabled={false}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (message.sendStatus === -2) {
                        reSendMessage(message)
                      }
                    }}>
                    {messageErrorIcon}
                  </TouchableOpacity>
                  : null
          }
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({

  container: {
    flex:1,
    paddingHorizontal:10,
    borderRadius: 12,
    paddingTop:10,
    paddingBottom:15,
    minHeight: 20,
  },

  marginSelf:{
    marginRight:11,
    marginLeft:50,
  },

  marginOther:{
    marginRight:50,
    marginLeft:11,
  },

  subEmojiStyle: {
    width: 25,
    height: 25
  },
  triangle: {
    width: 0,
    height: 0,
    zIndex: 999,
    borderWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderColor: '#fff',
    marginTop: 16
  },
  left_triangle: {
    borderLeftWidth: 0,
    borderRightWidth: Platform.OS === 'android' ? 6 : 10,
    marginLeft: 5
  },
  right_triangle: {
    borderRightWidth: 0,
    borderLeftWidth: Platform.OS === 'android' ? 6 : 10,
    borderColor: '#a0e75a',
    marginRight: 5
  },
  right: {
    flexDirection: 'row-reverse',
  },
  left: {
    flexDirection: 'row',
  }
})
