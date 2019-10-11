// @flow

import React, { PureComponent, Fragment } from 'react';
import {
  StyleSheet, View, Keyboard, StatusBar,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import {
  VideoPlayer, Comments, CommentForm, Reactions,
} from '~/views';

import CommentStore, { type CommentType } from '~/stores/CommentStore';

import ReactionStore, { type ReactionType } from '~/stores/ReactionStore';

import { Util } from '~/libs';

import { IS_ANDROID, IS_IOS, WITH_NOTCH } from '~/Constants';

import { GetNewComment, MakeNewReaction } from '~/FakeData';

type Props = $ReadOnly<{||}>;

type State = {|
  comments: Array<CommentType>,
  reactions: Array<ReactionType>,
  videoPlayerExpandingRate: number,
|};

export default class App extends PureComponent<Props, State> {
  _addFakeCommentTimeoutID: ?TimeoutID;

  _addFakeReactionTimeoutID: ?TimeoutID;

  constructor(props: Props) {
    super(props);

    this.state = {
      comments: [],
      reactions: [],
      videoPlayerExpandingRate: 0,
    };
  }

  componentWillUnmount() {
    this._stopAddingFakeComment();
    this._stopAddingFakeReaction();
  }

  _onLoadVideoPlayer = () => {
    this._addFakeComment();
    setTimeout(this._addFakeReaction, 1000);
  };

  _addFakeComment = () => {
    const newComment = GetNewComment();
    if (!newComment) {
      return;
    }

    this.setState({
      comments: CommentStore.add(newComment),
    });

    this._addFakeCommentTimeoutID = setTimeout(
      this._addFakeComment,
      Util.getRandom(500, 1000),
    );
  };

  _stopAddingFakeComment() {
    if (this._addFakeCommentTimeoutID) {
      clearTimeout(this._addFakeCommentTimeoutID);
      this._addFakeCommentTimeoutID = null;
    }
  }

  _addFakeReaction = () => {
    const { comments } = this.state;

    const commentsWithoutReaction = comments.filter(
      comment => comment.reactionImage === 0,
    );
    let targetComment = null;

    if (commentsWithoutReaction.length > 0) {
      targetComment = Util.getRandomInArray(commentsWithoutReaction);
    } else {
      const lastReactionProfileImages = this.state.reactions
        .slice(-5)
        .map(reaction => reaction.profileImage);
      const unReactionComments = comments.filter(
        comment => lastReactionProfileImages.indexOf(comment.profileImage) === -1,
      );
      targetComment = Util.getRandomInArray(unReactionComments);
    }

    if (targetComment) {
      const reaction = {
        ...MakeNewReaction(),
        profileImage: targetComment.profileImage,
      };

      targetComment.reactionImage = reaction.reactionImage;

      this.setState({
        comments: CommentStore.update(targetComment),
        reactions: ReactionStore.add(reaction),
      });
    }

    this._addFakeReactionTimeoutID = setTimeout(
      this._addFakeReaction,
      Util.getRandom(300, 600),
    );
  };

  _stopAddingFakeReaction() {
    if (this._addFakeReactionTimeoutID) {
      clearTimeout(this._addFakeReactionTimeoutID);
      this._addFakeReactionTimeoutID = null;
    }
  }

  _onScrollVideoPlayer = (rate: number) => {
    this.setState({ videoPlayerExpandingRate: rate });
  };

  _onScrollStartVideoPlayer = () => {
    Keyboard.dismiss();
  };

  renderStatusBar = () => {
    if (IS_ANDROID || (IS_IOS && !WITH_NOTCH)) {
      return <StatusBar hidden />;
    }
    if (IS_IOS && WITH_NOTCH) {
      return (
        <StatusBar
          // translucent
          backgroundColor="#000"
          barStyle="light-content"
        />
      );
    }
    return null;
  };

  renderChildren = () => {
    const { videoPlayerExpandingRate } = this.state;
    return (
      <Fragment>
        <Fragment>{this.renderStatusBar()}</Fragment>
        <VideoPlayer
          onLoad={this._onLoadVideoPlayer}
          onScroll={this._onScrollVideoPlayer}
          onScrollStart={this._onScrollStartVideoPlayer}
        />

        <Comments
          items={this.state.comments}
          videoPlayerExpandingRate={videoPlayerExpandingRate}
        />

        <CommentForm videoPlayerExpandingRate={videoPlayerExpandingRate} />

        <Reactions
          items={this.state.reactions}
          videoPlayerExpandingRate={videoPlayerExpandingRate}
        />
      </Fragment>
    );
  };

  renderMainContent = () => {
    if (IS_IOS && WITH_NOTCH) {
      return (
        <SafeAreaView
          forceInset={{ top: 'always', bottom: 'never' }}
          style={styles.safeAreaContainer}
        >
          {this.renderChildren()}
        </SafeAreaView>
      );
    }
    return <View style={styles.container}>{this.renderChildren()}</View>;
  };

  render() {
    return this.renderMainContent();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
});
