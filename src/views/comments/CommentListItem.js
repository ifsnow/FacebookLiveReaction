// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';

import {
  type CommentType,
} from '~/stores/CommentStore';

import {
  Text,
  Util,
} from '~/libs';

type Props = $ReadOnly<{|
  data: CommentType,
|}>;

type State = {|
  reactionImage: number,
  updateReaction: () => void,
|};

export default class CommentListItem extends PureComponent<Props, State> {
  _updateReactionTimeoutID: ?TimeoutID;

  state = {
    reactionImage: 0,
    updateReaction: this._updateReaction.bind(this),
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { reactionImage } = nextProps.data;

    if (reactionImage !== prevState.reactionImage) {
      prevState.updateReaction();
    }

    return null;
  }

  componentWillUnmount() {
    this._updateReactionTimeoutID && clearTimeout(this._updateReactionTimeoutID);
  }

  _updateReaction() {
    this._updateReactionTimeoutID = setTimeout(() => {
      this._updateReactionTimeoutID = null;

      this.setState({
        reactionImage: this.props.data.reactionImage,
      });
    }, 1000);
  }

  render() {
    const {
      name,
      message,
      profileImage,
    } = this.props.data;

    const {
      reactionImage,
    } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.photoGroup}>
          <Image source={profileImage} style={styles.photo} />
          {reactionImage !== 0 && <Image source={reactionImage} style={styles.reaction} />}
        </View>

        <View style={styles.contentGroup}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },

  photoGroup: {
    width: 40,
    height: 40,
  },
  photo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  reaction: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: 0,
    bottom: 0,
    zIndex: 2,
  },

  contentGroup: {
    paddingLeft: 6,
  },
  name: {
    fontSize: Util.normalize(16),
    fontWeight: '600',
    color: '#4a4a4a',
  },
  message: {
    fontSize: Util.normalize(15),
    color: '#272727',
  },
});
