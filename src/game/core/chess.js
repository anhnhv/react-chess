const PIECE = {
  KING: 'KING',
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  KNIGHT: 'KNIGHT',
  QUEEN: 'QUEEN',
  ROOK: 'ROOK',
}

const CHAR = {
  K: PIECE.KING,
  P: PIECE.PAWN,
  B: PIECE.BISHOP,
  N: PIECE.KNIGHT,
  Q: PIECE.QUEEN,
  R: PIECE.ROOK,
}

class Chess {
  constructor({ state, bottomSide = 'w', turn = 'w' }) {
    this.currentState = this._getState(state);
    this.bottomSide = bottomSide;
    this.turn = turn;
    this.king = {};
    this.checkedBy = null;

    this.currentState.forEach((row, x) => {
      row.forEach((p, y) => {
        const piece = this.getPiece({ x, y });
        if (piece.name === PIECE.KING) {
          this.king[piece.color] = { x, y };
        }
      });
    });
  }

  _toggleTurn() {
    this.turn = this.turn === 'w' ? 'b' : 'w';
  }

  _getState(state) {
    return state.map(state => [ ...state ]);
  }

  getCurrentState() {
    return this._getState(this.currentState);
  }

  valid(from, to) {
    const toPiece = this.getPiece(to);
    const fromPiece = this.getPiece(from);

    if (toPiece.name === PIECE.KING) {
      return false;
    }

    if (fromPiece.color === toPiece.color) {
      return false;
    }

    const destinations = this.getValidDestinations(from);
    return destinations.findIndex(destination => destination.x === to.x && destination.y === to.y) !== -1;
  }

  charToName(char) {
    return char ? CHAR[char.toUpperCase()] : '';
  }

  getPiece({ x, y }) {
    const char = this.currentState[x] ? this.currentState[x][y] : undefined;
    if (!char) {
      return {};
    }

    return {
      char,
      name: this.charToName(char),
      color: !char ? '' : char.toUpperCase() === char ? 'w' : 'b'
    }
  }

  isValidCoor({ x, y }) {
    return x <= 7 && y <= 7 && x >= 0 && y >= 0;
  }

  isSameSide(piece1, piece2) {
    return piece1.name && piece2.name && piece1.color === piece2.color;
  }

  getValidDestinations({ x, y }) {
    const selectedPiece = this.getPiece({ x, y });
    if (!selectedPiece) {
      return [];
    }

    let destinations = [];
    switch (selectedPiece.name) {
      case PIECE.PAWN: {
        if (selectedPiece.color === this.bottomSide) {
          destinations = [{ x: x - 1, y }, { x: x - 2, y }];
        } else {
          destinations = [{ x: x + 1, y }, { x: x + 2, y }];
        }
        break;
      }

      case PIECE.KNIGHT: {
        destinations = this._jump(['knight'], { x, y }, 1);
        break;
      }

      case PIECE.KING: {
        destinations = this._jump(['diagonal', 'horizontal', 'vertical'], { x, y }, 1);
        break;
      }

      case PIECE.QUEEN: {
        destinations = this._jump(['diagonal', 'horizontal', 'vertical'], { x, y });
        break;
      }

      case PIECE.BISHOP: {
        destinations = this._jump(['diagonal'], { x, y });
        break;
      }

      case PIECE.ROOK: {
        destinations = this._jump(['horizontal', 'vertical'], { x, y });
        break;
      }
    }

    destinations = destinations.filter(destination => {
      const toPiece = this.getPiece(destination);
      return this.isValidCoor(destination) &&
        toPiece.name !== PIECE.KING &&
        selectedPiece.color !== toPiece.color;
    });

    // Not checked if move
    destinations = destinations.filter(destination => {
      const tmpState = this._getState(this.currentState);
      this.currentState[destination.x][destination.y] = this.currentState[x][y];
      this.currentState[x][y] = '';

      const valid = !this.isChecked(selectedPiece.color);
      this.currentState = this._getState(tmpState);
      return valid;
    });

    return destinations;
  }

  move(from, to) {
    const fromPiece = this.getPiece(from);
    console.log('turn', this.turn);
    console.log('move', fromPiece);
    if (!fromPiece.name || fromPiece.color !== this.turn || !this.valid(from, to)) {
      return false;
    }

    this.currentState[to.x][to.y] = this.currentState[from.x][from.y];
    this.currentState[from.x][from.y] = '';

    this._toggleTurn();
    console.log('next turn', this.turn);
    this.checkedBy = this.isChecked(fromPiece.color) ? fromPiece.color : null;
    console.log('this.checkedBy', this.checkedBy);
    return true;
  }

  _getUpDiagonal({ x, y }) {
    const coors = [];
    const diagonal = x + y;
    for (let i = 0; i <= diagonal; i++) {
      coors.push({ x: diagonal - i, y: i });
    }
    return coors;
  }

  /**
   *
   * @param {Array} direction [horizontal, vertical, diagonal, knight]
   */
  _jump(directions, from, maxStep) {
    const selectedPiece = this.getPiece(from);
    let rules = [];
    let destinations = [];

    if (directions.includes('diagonal')) {
      rules = rules.concat([ [1,1], [-1,-1], [1,-1], [-1,1] ]);
    }
    if (directions.includes('vertical')) {
      rules = rules.concat([ [1,0], [-1,0] ]);
    }
    if (directions.includes('horizontal')) {
      rules = rules.concat([ [0,1], [0,-1] ]);
    }
    if (directions.includes('knight')) {
      rules = rules.concat([ [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1] ]);
    }

    rules.forEach(math => {
      let index = 0;
      let breakOut = false;
      do {
        index++;
        const des = { x: from.x + index * math[0], y: from.y + index * math[1] };
        const piece = this.getPiece(des);

        if (this.isValidCoor(des) && !this.isSameSide(selectedPiece, piece)) {
          destinations.push(des);
        }
        if (piece.name || !this.isValidCoor(des) || (maxStep && maxStep === index)) {
          breakOut = true;
        }
      } while (!breakOut);
    });

    return destinations;
  }

  _getCoverPiecesInUpDiagonal({ x, y }) {
    let i = 1;
    let piece1;
    let piece2;

    do {
      if (piece1 === undefined) {
        const pieceCoor = { x: x + i, y: y - i };
        if (!this.isValidCoor(pieceCoor)) {
          piece1 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece1 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      if (piece2 === undefined) {
        const pieceCoor = { x: x - i, y: y + i };
        if (!this.isValidCoor(pieceCoor)) {
          piece2 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece2 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      i++;
    } while (piece1 === undefined || piece2 === undefined);

    return [piece1, piece2];
  }

  _getCoverPiecesInHorizontal({ x, y }) {
    let i = 1;
    let piece1;
    let piece2;

    do {
      if (piece1 === undefined) {
        const pieceCoor = { x, y: y - i };
        if (!this.isValidCoor(pieceCoor)) {
          piece1 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece1 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      if (piece2 === undefined) {
        const pieceCoor = { x, y: y + i };
        if (!this.isValidCoor(pieceCoor)) {
          piece2 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece2 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      i++;
    } while (piece1 === undefined || piece2 === undefined);

    return [piece1, piece2];
  }

  _getCoverPiecesInVertical({ x, y }) {
    let i = 1;
    let piece1;
    let piece2;

    do {
      if (piece1 === undefined) {
        const pieceCoor = { x: x - i, y };
        if (!this.isValidCoor(pieceCoor)) {
          piece1 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece1 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      if (piece2 === undefined) {
        const pieceCoor = { x: x + i, y };
        if (!this.isValidCoor(pieceCoor)) {
          piece2 = null;
        } else {
          const piece = this.getPiece(pieceCoor);
          if (piece.name) {
            piece2 = {
              piece,
              ...pieceCoor
            };
          }
        }
      }

      i++;
    } while (piece1 === undefined || piece2 === undefined);

    return [piece1, piece2];
  }

  isChecked(side) {
    const kingPosition = this.king[side];
    let checked = false;

    let covers = this._getCoverPiecesInUpDiagonal(kingPosition);
    covers = covers.concat(this._getCoverPiecesInHorizontal(kingPosition));
    covers = covers.concat(this._getCoverPiecesInVertical(kingPosition));

    for (let i = 0; i < covers.length; i++) {
      if (
        covers[i] &&
        covers[i].piece &&
        covers[i].piece.color !== side &&
        [PIECE.QUEEN, PIECE.BISHOP].includes(covers[i].piece.name)
      ) {
        checked = true;
        break;
      }
    }

    return checked;
  }
}

export default Chess;