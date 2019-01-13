// @flow

import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Animated,
} from 'react-native';

import {
  IS_ANDROID,
  IS_OVER_IPHONEX,
} from '~/Constants';

type Props = $ReadOnly<{|
  videoPlayerExpandingRate: number,
|}>;

type State = {|
  keyboardHeight: number,
|};

const CONTAINER_HEIGHT = IS_OVER_IPHONEX ? 74 : 54;

const FORM_HEIGHT = 44;

export class CommentForm extends PureComponent<Props, State> {
  _keyboardShowListener;

  _keyboardHideListener;

  _textInputRef = React.createRef<Class<TextInput>>();

  state = {
    keyboardHeight: 0,
  };

  componentDidMount() {
    if (IS_ANDROID) {
      this._keyboardShowListener = Keyboard.addListener('keyboardDidShow', this._onKeyboardShow);
      this._keyboardHideListener = Keyboard.addListener('keyboardDidHide', this._onKeyboardHide);
    } else {
      this._keyboardShowListener = Keyboard.addListener('keyboardWillShow', this._onKeyboardShow);
      this._keyboardHideListener = Keyboard.addListener('keyboardWillHide', this._onKeyboardHide);
    }
  }

  componentWillUnmount() {
    this._keyboardShowListener && this._keyboardShowListener.remove();
    this._keyboardHideListener && this._keyboardHideListener.remove();
  }

  _onKeyboardShow = (e) => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    });
  }

  _onKeyboardHide = () => {
    this.setState({
      keyboardHeight: 0,
    });
  }

  _onEndEditing = () => {
    this._textInputRef.current && this._textInputRef.current.clear();
  }

  _onBlur = () => {
    Keyboard.dismiss();
  }

  _getRenderVariables() {
    const {
      videoPlayerExpandingRate,
    } = this.props;

    const {
      keyboardHeight,
    } = this.state;

    const containerStyle = [styles.container, keyboardHeight > 0 && { bottom: keyboardHeight }];

    if (keyboardHeight === 0 && IS_OVER_IPHONEX) {
      containerStyle.push(styles.containerIsOverIPhoneX);
    }

    if (videoPlayerExpandingRate > 0) {
      containerStyle.push({
        transform: [{
          translateY: CONTAINER_HEIGHT * videoPlayerExpandingRate,
        }],
        backgroundColor: 'transparent',
      });
    }

    return {
      containerStyle,
    };
  }

  render() {
    const {
      containerStyle,
    } = this._getRenderVariables();

    return (
      <Animated.View style={containerStyle}>
        <View style={styles.roundForm}>
          <TextInput
            ref={this._textInputRef}
            style={styles.textInput}
            allowFontScaling={false}
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={false}
            placeholder="Type your message.."
            onEndEditing={this._onEndEditing}
            onBlur={this._onBlur}
          />
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 12,
    backgroundColor: '#efefef',
    zIndex: 200,
    justifyContent: 'center',
  },
  containerIsOverIPhoneX: {
    justifyContent: 'flex-start',
    paddingTop: 6,
  },
  roundForm: {
    borderWidth: 1,
    borderColor: '#a0a0a0',
    borderRadius: 25,
    height: FORM_HEIGHT,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
