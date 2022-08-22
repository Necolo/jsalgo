export class SegmentTree<T> {
  tree: T[];

  constructor(
    public inputs: T[],
    public operation: (a: T, b: T) => T,
    public fallbackValue: T,
  ) {
    // init tree
    const len = inputs.length;
    const treeLen = 2 * Math.pow(2, Math.ceil(Math.log2(len))) - 1
    this.tree = new Array(treeLen).fill(fallbackValue);
    this._buildTree(0, len - 1, 0);
  }

  query(start: number, end: number) {
    return this._query(start, end, 0, this.inputs.length - 1, 0);
  }

  /* -------------------------------------------------------------------------- */
  /*                                local methods                               */
  /* -------------------------------------------------------------------------- */
  private _query(qLow: number, qHigh: number, low: number, high: number, pos: number) {
    if (qLow <= low && qHigh >= high) {
      return this.tree[pos];
    }
    if (qLow > high || qHigh < low) {
      return this.fallbackValue;
    }
    const mid = ~~((low + high) / 2);
    return this.operation(
      this._query(qLow, qHigh, low, mid, this._leftIndex(pos)),
      this._query(qLow, qHigh, mid + 1, high, this._rightIndex(pos)),
    );
  }

  private _buildTree(low: number, high: number, pos: number) {
    const { tree, inputs } = this;
    if (low === high) {
      tree[pos] = inputs[low];
      return;
    }
    const mid = ~~((low + high) / 2);
    const left = this._leftIndex(pos);
    const right = this._rightIndex(pos);
    this._buildTree(low, mid, left);
    this._buildTree(mid + 1, high, right);
    tree[pos] = this.operation(tree[left], tree[right]);
  }

  private _leftIndex(i: number) {
    return (2 * i) + 1;
  }

  private _rightIndex(i: number) {
    return (2 * i) + 2;
  }

  private _parentIndex(i: number) {
    return Math.floor((i - 1) / 2);
  }
}

export default SegmentTree;