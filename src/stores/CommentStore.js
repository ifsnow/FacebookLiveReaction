// @flow

export type CommentType = $ReadOnly<{|
  id: number,
  name: string,
  profileImage: any,
  message: string,
  reactionImage?: any,
|}>;

class CommentStore {
  _items: Array<CommentType> = [];

  add(comment: CommentType): Array<CommentType> {
    const commentItem = {
      ...comment,
      reactionImage: 0,
    };

    this._items = this._items.concat(commentItem);

    return this._items;
  }

  update(comment: CommentType): Array<CommentType> {
    this._items = this._items.map(item => (item.id === comment.id ? { ...comment } : item));

    return this._items;
  }

  get items() {
    return this._items;
  }
}

export default new CommentStore();
