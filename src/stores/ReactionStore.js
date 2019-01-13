// @flow

export const REACTION_KIND = {
  LIKE: 'LIKE',
  LOVE: 'LOVE',
  HAHA: 'HAHA',
  WOW: 'WOW',
};

export type ReactionKindType = $Keys<typeof REACTION_KIND>;

type ReactionAddType = $ReadOnly<{|
  kind: ReactionKindType,
  profileImage: any,
  reactionImage: any,
|}>;

export type ReactionType = $ReadOnly<{|
  id: number,
  ...ReactionAddType,
|}>;

class ReactionStore {
  _items: Array<ReactionType> = [];

  _lastId: number = 0;

  add(item: ReactionAddType): Array<ReactionType> {
    this._items = this._items.slice(-20).concat({
      id: ++this._lastId,
      ...item,
    });

    return this._items;
  }

  get items() {
    return this._items;
  }
}

export default new ReactionStore();
