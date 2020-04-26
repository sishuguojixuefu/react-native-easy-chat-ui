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


export default class NotificationMessage extends PureComponent {
  render() {
    const { isSelf, message, messageErrorIcon, isOpen, rightMessageBackground, leftMessageBackground, reSendMessage, chatType } = this.props
    return (
      <View
        style={[isSelf ? styles.right : styles.left, { flex: 1 }]}
        collapsable={false}
        ref={(e) => (this[`item_${this.props.rowId}`] = e)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          disabled={isOpen}
          onLongPress={() => {
            this.props.onMessageLongPress(this[`item_${this.props.rowId}`], 'notification', parseInt(this.props.rowId), '', message)
          }}
          onPress={() => {
            this.props.onMessagePress('notification', parseInt(this.props.rowId), message)
          }}
        >
          <View style={[styles.container, { backgroundColor: leftMessageBackground }, isSelf ? styles.marginSelf : styles.marginOther]}>
            <View style={{ flexDirection: 'row' }}>
              <Image style={{ width: 20, height: 20, marginRight: 10 }} source={require('./images/notice.png')}></Image><Text style={{ color: '#FF5656', fontSize: 16, marginBottom: 10 }}>群公告</Text>
            </View>
            <Text style={{ lineHeight: 20, color: '#4a4a4a', fontSize: 15 }} >@所有人</Text>
            <Text style={{ lineHeight: 20, color: '#4a4a4a', fontSize: 15 }} numberOfLines={3}>{message.content}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}><Text style={{ color: '#9b9b9b', fontSize: 12 }}>查看详情</Text><Image style={{ width: 12, height: 12, marginRight: 10 }} source={require('./images/arrow.png')}></Image></View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 15,
    minHeight: 20,
  },

  marginSelf: {
    marginRight: 11,
    marginLeft: 50,
  },

  marginOther: {
    marginRight: 50,
    marginLeft: 11,
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
