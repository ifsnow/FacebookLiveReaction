// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';

import {
  Util,
} from '~/libs';

import {
  VIDEO_PLAYER_HEIGHT,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  IS_OVER_IPHONEX,
} from '~/Constants';

import {
  type ReactionType,
} from '~/stores/ReactionStore';

type Props = $ReadOnly<{|
  item: ReactionType,
  videoPlayerExpandingRate: number,
|}>;

type State = {|
  isPressed: boolean,
  isDeleted: boolean,
  shouldShowPhoto: boolean,
|};

const BUBBLE_HITSLOP = {
  left: 16,
  right: 16,
  top: 16,
  bottom: 16,
};

const CIRCLE_SIZE = Util.normalize(56);

export default class ReactionBubble extends PureComponent<Props, State> {
  _moveAnimationValue = new Animated.Value(1);

  _x: number;

  _y: number;

  _amplitude: number;

  _duration: number;

  constructor(props: Props) {
    super(props);

    this._x = WINDOW_WIDTH + Util.getRandom(CIRCLE_SIZE, CIRCLE_SIZE * 2);
    this._y = VIDEO_PLAYER_HEIGHT - Util.getRandom(CIRCLE_SIZE, CIRCLE_SIZE * 2);
    this._amplitude = Util.getRandom(4, 8);
    this._duration = Util.getRandom(3000, 5000);

    this._moveAnimationValue.addListener((callback) => {
      if (this.state.shouldShowPhoto && callback.value <= 0.6) {
        this.setState({
          shouldShowPhoto: false,
        });
      }
    });

    this.state = {
      isDeleted: false,
      isPressed: false,
      shouldShowPhoto: true,
    };
  }

  componentDidMount() {
    this._startMoveAnimation();
  }

  componentWillUnmount() {
    this._moveAnimationValue.removeAllListeners();
  }

  _startMoveAnimation() {
    Animated.timing(this._moveAnimationValue, {
      toValue: 0,
      duration: this._duration,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        isDeleted: true,
      });
    });
  }

  _onPress = () => {
    this.setState({
      isPressed: true,
    });
  }

  _getRenderVariables() {
    const {
      videoPlayerExpandingRate,
      item: {
        profileImage,
        reactionImage,
      },
    } = this.props;

    const {
      shouldShowPhoto,
      isPressed,
    } = this.state;

    const baseY = Math.max(0, ((WINDOW_HEIGHT - VIDEO_PLAYER_HEIGHT) * videoPlayerExpandingRate));
    const positionY = baseY + this._y - (IS_OVER_IPHONEX ? 30 : 12);
    const scaleAlpha = 0.15 * videoPlayerExpandingRate;

    const containerStyle = [
      styles.contaienr,
      {
        transform: [
          {
            translateX: this._moveAnimationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [-1 * CIRCLE_SIZE, this._x],
            }),
          },
          {
            translateY: this._moveAnimationValue.interpolate({
              inputRange: [0, 0.3, 0.7, 1],
              outputRange: [positionY, positionY + this._amplitude, positionY - this._amplitude, positionY],
            }),
          },
          isPressed ? {
            scale: this._moveAnimationValue.interpolate({
              inputRange: [0, 1],
              outputRange: [1.3, 1],
            }),
          } : {
            scale: this._moveAnimationValue.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [scaleAlpha + 0.5, scaleAlpha + 0.8, scaleAlpha + 1],
            }),
          },
        ],
        opacity: isPressed ? this._moveAnimationValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.6, 0.9],
        }) : 1,
      },
    ];

    const imageSource = shouldShowPhoto ? profileImage : reactionImage;
    const content = <Image source={imageSource} style={styles.icon} />;

    return {
      containerStyle,
      content,
    };
  }

  render() {
    if (this.state.isDeleted) {
      return null;
    }

    const {
      containerStyle,
      content,
    } = this._getRenderVariables();

    return (
      <TouchableWithoutFeedback onPress={this._onPress} hitSlop={BUBBLE_HITSLOP}>
        <Animated.View style={containerStyle}>
          {content}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  contaienr: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    elevation: 10,
  },
  icon: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
  },
});
