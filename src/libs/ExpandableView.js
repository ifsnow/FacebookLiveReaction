// @flow

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  Animated,
  PanResponder,
} from 'react-native';

import {
  IS_ANDROID,
} from '~/Constants';

type Props = $ReadOnly<{|
  min: number,
  max: number,
  children?: React$Element<any>,
  zIndex?: number,
  onExpand?: () => void,
  onContract?: () => void,
  onScroll?: (rate: number) => void,
  onScrollStart?: () => void,
|}>;

type State = {|
|};

export class ExpandableView extends PureComponent<Props, State> {
  _heightAnimatedValue = new Animated.Value(this.props.min);

  _lastHeight = this.props.min;

  _isExpanded = false;

  _panResponder;

  _viewRef = React.createRef<Class<Animated.View>>();

  static defaultProps = {
    zIndex: 100,
  };

  constructor(props: Props) {
    super(props);

    this._heightAnimatedValue.addListener((callback) => {
      this._lastHeight = callback.value;

      const {
        min,
        max,
        onScroll,
      } = this.props;

      if (onScroll) {
        const rate = Math.max(0, Math.min(1.0, (this._lastHeight - min) / (max - min)));
        onScroll(rate);
      }
    });

    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: this._onMoveShouldSetPanResponder,
      onPanResponderGrant: this._onPanResponderGrant,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
      onPanResponderTerminate: this._onPanResponderRelease,
    });
  }

  componentWillUnmount() {
    this._heightAnimatedValue.removeAllListeners();
  }

  contract() {
    if (!this._isExpanded) {
      return;
    }

    this._isExpanded = false;

    this._takeReleaseAction(this.props.min);
  }

  _onMoveShouldSetPanResponder = (event, gestureState) => {
    const { dy } = gestureState;

    if (Math.abs(dy) < 4) {
      return false;
    }

    if ((this._isExpanded && dy >= 0) || (!this._isExpanded && dy <= 0)) {
      return false;
    }

    this.props.onScrollStart && this.props.onScrollStart();

    return true;
  }

  _onPanResponderGrant = () => {
    const offset = this._isExpanded
      ? Math.max(this.props.max, this._lastHeight)
      : Math.min(this.props.min, this._lastHeight);

    this._heightAnimatedValue.setOffset(offset);

    this._viewRef.current && this._viewRef.current.setNativeProps(IS_ANDROID ? {
      elevation: this.props.zIndex,
    } : {
      zIndex: this.props.zIndex,
    });
  }

  _onPanResponderMove = (event, gestureState) => {
    this._heightAnimatedValue.setValue(gestureState.dy);
  }

  _onPanResponderRelease = (event, gestureState) => {
    this._heightAnimatedValue.flattenOffset();

    const {
      dy,
    } = gestureState;

    let toValue = 0;

    if (this._isExpanded) {
      if (dy < -60) {
        toValue = this.props.min;
        this._isExpanded = false;
      } else {
        toValue = this.props.max;
      }
    } else if (dy > 60) {
      toValue = this.props.max;
      this._isExpanded = true;
    } else {
      toValue = this.props.min;
    }

    this._takeReleaseAction(toValue);
  }

  _takeReleaseAction(toValue: number) {
    Animated.timing(this._heightAnimatedValue, {
      toValue,
      duration: 300,
    }).start(this._onAfterRelease);
  }

  _onAfterRelease = () => {
    if (this._isExpanded) {
      this.props.onExpand && this.props.onExpand();
    } else {
      this._viewRef.current && this._viewRef.current.setNativeProps(IS_ANDROID ? {
        elevation: 1,
      } : {
        zIndex: 1,
      });

      this.props.onContract && this.props.onContract();
    }
  }

  render() {
    return (
      <Animated.View
        ref={this._viewRef}
        style={[styles.container, { height: this._heightAnimatedValue }]}
        {...this._panResponder.panHandlers}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
});
