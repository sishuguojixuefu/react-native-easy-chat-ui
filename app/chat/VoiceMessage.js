import React, { PureComponent } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Text, ActivityIndicator, Dimensions, Platform } from "react-native";
const { width } = Dimensions.get("window");

export default class VoiceMessage extends PureComponent {
  constructor(props) {
    super(props);
    this.playTime = null;
    this.state = {
      loading: false,
      progress: 2,
    };
  }

  componentWillReceiveProps(next) {
    if (next.pressIndex === next.rowId) {
      this.setState({ loading: next.voiceLoading });
      if (next.voicePlaying) {
        this._play();
      } else {
        this.playTime && clearInterval(this.playTime);
        this.setState({ progress: 2 });
      }
    } else {
      this.setState({ loading: false, progress: 2 });
      this.playTime && clearInterval(this.playTime);
    }
  }

  _play() {
    this.playTime && clearInterval(this.playTime);
    let index = 0;
    const { progress } = this.state;
    if (progress === 2) index = 2;
    this.playTime = setInterval(() => {
      if (index === 2) {
        index = -1;
      }
      index += 1;
      this.setState({ progress: index });
    }, 400);
  }

  _renderIcon = () => {
    const { isSelf, voiceLeftIcon, voiceRightIcon } = this.props;
    const { progress } = this.state;
    if (isSelf) {
      if (voiceRightIcon) {
        return voiceRightIcon;
      } else {
        return (
          <Image
            source={
              progress === 0
                ? require("../source/image/voiceLeftOne.png")
                : progress === 1
                ? require("../source/image/voiceLeftTwo.png")
                : require("../source/image/voiceLeft.png")
            }
            resizeMode={"cover"}
            style={{
              width: 20,
              height: 20,
              transform: [{ rotate: "180deg" }],
            }}
          />
        );
      }
    } else {
      if (voiceLeftIcon) {
        return voiceLeftIcon;
      } else {
        return (
          <Image
            source={
              progress === 0
                ? require("../source/image/voiceLeftOne.png")
                : progress === 1
                ? require("../source/image/voiceLeftTwo.png")
                : require("../source/image/voiceLeft.png")
            }
            resizeMode={"cover"}
            style={{
              width: 20,
              height: 20,
            }}
          />
        );
      }
    }
  };

  componentWillUnmount() {
    this.playTime && clearInterval(this.playTime);
  }

  render() {
    const {
      message,
      messageErrorIcon,
      isSelf,
      isOpen,
      reSendMessage,
      leftMessageBackground,
      rightMessageBackground,
      voiceRightLoadingColor,
      voiceLeftLoadingColor,
      chatType,
    } = this.props;
    const { loading } = this.state;

    let textStyle = isSelf
      ? {
          backgroundColor: loading ? voiceRightLoadingColor : rightMessageBackground,
          borderTopRightRadius: 0,
        }
      : {
          backgroundColor: loading ? voiceLeftLoadingColor : leftMessageBackground,
          borderTopLeftRadius: 0,
        };

    return (
      <View style={[isSelf ? styles.right : styles.left]}>
        <View style={{ width: 6 }} />
        <View
          style={{ flexDirection: isSelf ? "row-reverse" : "row" }}
          collapsable={false}
          ref={(e) => (this[`item_${this.props.rowId}`] = e)}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isOpen}
            style={[styles.voiceArea, textStyle]}
            onPress={() => {
              this.props.savePressIndex(this.props.rowId);
              this.props.onMessagePress("voice", parseInt(this.props.rowId), message.content.uri, message);
            }}
            onLongPress={() => {
              this.props.onMessageLongPress(
                this[`item_${this.props.rowId}`],
                "voice",
                parseInt(this.props.rowId),
                message.content.uri,
                message
              );
            }}
          >
            <View
              style={[
                { maxWidth: width - 112, alignItems: "center" },
                { flexDirection: isSelf ? "row-reverse" : "row" },
              ]}
            >
              {this._renderIcon()}
              <Text
                style={{
                  marginLeft: isSelf ? 8 + (message.content.length > 1 ? message.content.length * 2 : 0) : 0,
                  marginRight: isSelf ? 0 : 8 + (message.content.length > 1 ? message.content.length * 2 : 0),
                  color: isSelf ? "#4a4a4a" : "#4a4a4a",
                }}
              >
                {`${message.content.length}"`}
              </Text>
            </View>
          </TouchableOpacity>
          {chatType !== "group" && isSelf && (
            <View style={{ justifyContent: "flex-end", marginRight: 4 }}>
              <Text style={{ textAlign: "right", fontSize: 13 }}>
                {this.props.lastReadAt && this.props.lastReadAt - message.time > 0 ? "已读" : "未读"}
              </Text>
            </View>
          )}
        </View>
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
  triangle: {
    width: 0,
    height: 0,
    zIndex: 999,
    borderWidth: 6,
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
  },
  left_triangle: {
    borderLeftWidth: 0,
    borderRightWidth: Platform.OS === "android" ? 6 : 10,
    marginLeft: 5,
  },
  right_triangle: {
    borderRightWidth: 0,
    borderLeftWidth: Platform.OS === "android" ? 6 : 10,
    borderColor: "#a0e75a",
    marginRight: 5,
  },
  right: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  voiceArea: {
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: width - 112,
    justifyContent: "center",
    minHeight: 40,
  },
});
