// @flow

import { Dimensions, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const { width: WINDOW_WIDTH, height } = Dimensions.get('window');

const IS_ANDROID = Platform.OS === 'android';

const IS_IOS = !IS_ANDROID;

const IS_OVER_IPHONEX = IS_IOS && !Platform.isPad && !Platform.isTVOS && height >= 812;

const WINDOW_HEIGHT = height;

const VIDEO_PLAYER_HEIGHT = parseInt(WINDOW_HEIGHT * 0.625, 10);

const COMMENTS_HEIGHT = WINDOW_HEIGHT - VIDEO_PLAYER_HEIGHT;

const WITH_NOTCH = DeviceInfo.hasNotch();

const REACTIONS = {
  LIKE: require('./assets/reaction-like.png'),
  LOVE: require('./assets/reaction-love.png'),
  HAHA: require('./assets/reaction-haha.png'),
  WOW: require('./assets/reaction-wow.png'),
};

export {
  IS_ANDROID,
  IS_IOS,
  IS_OVER_IPHONEX,
  REACTIONS,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  VIDEO_PLAYER_HEIGHT,
  COMMENTS_HEIGHT,
  WITH_NOTCH,
};
