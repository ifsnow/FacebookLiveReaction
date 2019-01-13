// @flow

import { Dimensions } from 'react-native';

const DEVICE_SCALE = Math.min(480, Dimensions.get('window').width) / 414;

export const Util = {
  getRandom(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  getRandomInArray(arr: Array<any>) {
    const index = this.getRandom(0, arr.length - 1);
    return arr[index];
  },

  normalize(size: number) {
    return Math.round(DEVICE_SCALE * size);
  },
};
