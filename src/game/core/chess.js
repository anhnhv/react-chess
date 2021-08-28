const PEICE = {
  KING: 'KING',
}

const CHAR = {
  K: PEICE.KING
}

class Chess {
  constructor(state) {
    this.currentState = state;
  }

  valid(from, to) {
    const toPiece = this.getPiece(to);
    const fromPiece = this.getPiece(from);

    if (toPiece.name === PEICE.KING) {
      return false;
    }

    if (fromPiece.color === toPiece.color) {
      return false;
    }

    return true;
  }

  charToName(char) {
    return char ? CHAR[char.toUpperCase()] : '';
  }

  getPiece({ x, y }) {
    const char = this.currentState[x][y];
    return {
      char,
      name: this.charToName(char),
      color: !char ? '' : char.toUpperCase() === char ? 'w' : 'b'
    }
  }

  move(from, to) {
    if (!this.valid(from, to)) {
      return false;
    }

    this.currentState[to.x][to.y] = this.currentState[from.x][from.y];
    this.currentState[from.x][from.y] = '';

    return true;
  }
}

export default Chess;