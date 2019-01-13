// @flow

import React, { PureComponent } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native';

import {
  COMMENTS_HEIGHT,
  IS_OVER_IPHONEX,
} from '~/Constants';

import {
  type CommentType,
} from '~/stores/CommentStore';

import CommentListItem from './CommentListItem';

type Props = $ReadOnly<{|
  items: $ReadOnlyArray<CommentType>,
  videoPlayerExpandingRate: number,
|}>;

type State = {|
  itemCount: number,
  scrollToBottom: () => void,
|};

export class Comments extends PureComponent<Props, State> {
  _listRef = React.createRef();

  _keyExtractor = item => `CommentListItem-${item.id}`;

  _renderItem = ({ item }) => <CommentListItem data={item} />

  state = {
    itemCount: 0,
    scrollToBottom: this._scrollToBottom.bind(this),
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const itemCount = nextProps.items.length;

    if (prevState.itemCount !== itemCount) {
      prevState.scrollToBottom();

      return {
        itemCount,
      };
    }

    return null;
  }

  _scrollToBottom() {
    setTimeout(() => this._listRef.current && this._listRef.current.scrollToEnd(), 200);
  }

  _getRenderVariables() {
    const {
      videoPlayerExpandingRate,
    } = this.props;

    const containerStyle = [styles.container];
    const containerProps = {};

    if (videoPlayerExpandingRate > 0) {
      containerStyle.push({
        transform: [{
          scale: 1 + (videoPlayerExpandingRate * 0.15),
        }],
        opacity: Math.max(0.3, 1.0 - videoPlayerExpandingRate),
      });

      containerProps.pointerEvents = 'none';
    }

    return {
      containerStyle,
      containerProps,
    };
  }

  render() {
    const {
      containerStyle,
      containerProps,
    } = this._getRenderVariables();

    return (
      <View style={containerStyle} {...containerProps}>
        <FlatList
          ref={this._listRef}
          data={this.props.items}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          pinchGestureEnabled={false}
          nestedScrollEnabled
          contentContainerStyle={styles.listContent}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: COMMENTS_HEIGHT,
    backgroundColor: '#efefef',
    paddingBottom: IS_OVER_IPHONEX ? 74 : 54,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
});
