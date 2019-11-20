import React, { PureComponent } from 'react'
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Dimensions,
  Text,
  Image
} from 'react-native'
import { changeEmojiText } from '@sishu/react-native-easy-chat-ui/app/chat/utils'
const { width } = Dimensions.get('window')

const getFileSize = size => {
  const kb = size / 1024
  const mb = kb / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)}K`
  }
  return `${mb.toFixed(1)}M`
}

const PATTERNS = {
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  emoji: new RegExp('\\/\\{[a-zA-Z_]{1,14}\\}')
}
export default class TextMessage extends PureComponent {
  render () {
    const { isSelf, message, messageErrorIcon, isOpen, rightMessageBackground, leftMessageBackground, reSendMessage, chatType } = this.props
    return (
      <View
        style={[isSelf ? styles.right : styles.left,{flex:1}]}
        collapsable={false}
        ref={(e) => (this[`item_${this.props.rowId}`] = e)}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={{flex:1}}
          disabled={isOpen}
          onLongPress={() => {
            this.props.onMessageLongPress(this[`item_${this.props.rowId}`], 'file', parseInt(this.props.rowId), message.content.uri, message)
          }}
          onPress={() => {
            this.props.onMessagePress('file', parseInt(this.props.rowId), message.content.uri, message)
          }}
        >
          <View style={[styles.container, { backgroundColor: leftMessageBackground },isSelf?styles.marginSelf:styles.marginOther]}>
            <View style={{flexDirection:'row', flex:1, justifyContent:'space-between'}}>
              <View style={{flex:1,justifyContent:'space-between'}}>
                <Text numberOfLines={1}>{message.content.fileName}</Text>
                <Text>{getFileSize(message.content.size)}</Text>
              </View>
              <Image style={{width:40,height:40}} source={require('./images/file.png')}/>
            </View>
          </View>
          {chatType !== 'group' && isSelf && (
            <Text style={{ textAlign: 'right', fontSize: 13 }}>
              {this.props.lastReadAt && this.props.lastReadAt - message.time > 0 ? '已读' : '未读'}
            </Text>
          )}
        </TouchableOpacity>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
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
    borderRadius: 5,
    padding:10,
    minHeight: 20,
  },

  marginSelf:{
    marginRight:11,
    marginLeft:11,
  },

  marginOther:{
    marginRight:11,
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
