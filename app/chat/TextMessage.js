import React, { PureComponent } from "react";
import { View, TouchableOpacity, ActivityIndicator, Platform, StyleSheet, Dimensions, Text } from "react-native";
import { changeEmojiText } from "./utils";
const { width } = Dimensions.get("window");

const PATTERNS = {
  url: /(https?:\/\/|www\.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)/i,
  phone: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,7}/,
  emoji: new RegExp("\\/\\{[a-zA-Z_]{1,14}\\}"),
};
export default class TextMessage extends PureComponent {
  render() {
    const {
      isSelf,
      message,
      messageErrorIcon,
      views,
      isOpen,
      rightMessageBackground,
      leftMessageBackground,
      reSendMessage,
      chatType,
    } = this.props;

    let textStyle = isSelf
      ? {
          backgroundColor: rightMessageBackground,
          borderTopRightRadius: 0,
        }
      : {
          backgroundColor: leftMessageBackground,
          borderTopLeftRadius: 0,
        };

    return (
      <View
        style={[isSelf ? styles.right : styles.left]}
        collapsable={false}
        ref={(e) => (this[`item_${this.props.rowId}`] = e)}
      >
        <View style={{ width: 6 }}></View>
        <TouchableOpacity
          activeOpacity={1}
          disabled={isOpen}
          onLongPress={() => {
            this.props.onMessageLongPress(
              this[`item_${this.props.rowId}`],
              "text",
              parseInt(this.props.rowId),
              changeEmojiText(this.props.message.content, "en").join(""),
              message
            );
          }}
          onPress={() => {
            this.props.onMessagePress(
              "text",
              parseInt(this.props.rowId),
              changeEmojiText(this.props.message.content, "en").join(""),
              message
            );
          }}
        >
          <View style={[styles.container, textStyle]}>{views}</View>
        </TouchableOpacity>
        {chatType !== "group" && isSelf && (
          <View style={{ justifyContent: "flex-end", marginRight: 4 }}>
            <Text style={{ textAlign: "right", fontSize: 13 }}>
              {this.props.lastReadAt && this.props.lastReadAt - message.time > 0 ? "已读" : "未读"}
            </Text>
          </View>
        )}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          {!isSelf ? null : message.sendStatus === undefined ? null : message.sendStatus === 0 ? (
            <ActivityIndicator />
          ) : message.sendStatus < 0 ? (
            <TouchableOpacity
              disabled={false}
              activeOpacity={0.7}
              onPress={() => {
                if (message.sendStatus === -2) {
                  reSendMessage(message);
                }
              }}
            >
              {messageErrorIcon}
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    maxWidth: width - 160,
    minHeight: 20,
  },

  subEmojiStyle: {
    width: 25,
    height: 25,
  },
  right: {
    flexDirection: "row-reverse",
  },
  left: {
    flexDirection: "row",
  },
});
