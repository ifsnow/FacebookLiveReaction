// @flow

import React, { PureComponent } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';

import Video from 'react-native-video';

import { ExpandableView } from '~/libs';

import { VIDEO_PLAYER_HEIGHT, WINDOW_HEIGHT, WITH_NOTCH, IS_IOS } from '~/Constants';

const isIphoneX = IS_IOS && WITH_NOTCH;

type Props = $ReadOnly<{|
  onScroll: (rate: number) => void,
  onScrollStart: () => void,
  onLoad: () => void,
|}>;

type State = {|
  isLoading: boolean,
|};

export class VideoPlayer extends PureComponent<Props, State> {
  state = {
    isLoading: true,
  };

  _onLoadVideo = () => {
    this.setState(
      {
        isLoading: false,
      },
      this.props.onLoad,
    );
  };

  render() {
    return (
      <ExpandableView
        min={VIDEO_PLAYER_HEIGHT}
        max={WINDOW_HEIGHT}
        zIndex={9}
        onScroll={this.props.onScroll}
        onScrollStart={this.props.onScrollStart}
      >
        <View style={styles.container}>
          <Video
            source={require('~/assets/video.mp4')}
            style={styles.video}
            fullscreenAutorotate={false}
            repeat
            resizeMode="cover"
            onLoad={this._onLoadVideo}
            playWhenInactive
          />

          {this.state.isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#a1a1a1" />
            </View>
          )}
        </View>
      </ExpandableView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    position: 'absolute',
    top: isIphoneX ? 44 : 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: isIphoneX ? 44 : 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
