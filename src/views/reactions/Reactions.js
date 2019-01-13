// @flow

import React, { PureComponent } from 'react';

import ReactionBubble from './ReactionBubble';

import {
  type ReactionType,
} from '~/stores/ReactionStore';

type Props = $ReadOnly<{|
  items: $ReadOnlyArray<ReactionType>,
  videoPlayerExpandingRate: number,
|}>;

type State = {|
|};

export class Reactions extends PureComponent<Props, State> {
  render() {
    const emotionCircles: Array<any> = this.props.items.map(item => (
      <ReactionBubble
        key={`reaction-bubble-${item.id}`}
        item={item}
        videoPlayerExpandingRate={this.props.videoPlayerExpandingRate}
      />
    ));

    return emotionCircles;
  }
}
