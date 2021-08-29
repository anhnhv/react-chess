const PEICE = {
  KING: 'KING',
  PAWN: 'PAWN',
  BISHOP: 'BISHOP',
  KNIGHT: 'KNIGHT',
  QUEEN: 'QUEEN',
}

const CHAR = {
  K: PEICE.KING,
  P: PEICE.PAWN,
  B: PEICE.BISHOP,
  N: PEICE.KNIGHT,
  Q: PEICE.QUEEN,
}

class Chess {
  constructor(state, bottomSide = 'w') {
    this.currentState = state;
    this.bottomSide = bottomSide;
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

  getValidDestinations({ x, y }) {
    const piece = this.getPiece({ x, y });
    if (!piece) {
      return [];
    }

    let destinations = [];
    switch (piece.name) {
      case PEICE.PAWN: {
        if (piece.color === this.bottomSide) {
          destinations = [{ x: x - 1, y }, { x: x - 2, y }];
        } else {
          destinations = [{ x: x + 1, y }, { x: x + 2, y }];
        }
        break;
      }

      case PEICE.KNIGHT: {
        const rules = [ [-2,1], [-1,2], [1,2], [2,1], [2,-1], [1,-2], [-1,-2], [-2,-1] ];
        destinations = rules
          .map(rule => ({ x: x + rule[0], y: y + rule[1] }));
        break;
      }

      case PEICE.QUEEN: {
        [ [1,1], [-1,-1], [1,-1], [-1,1], [1,0], [-1,0], [0,1], [0,-1] ].forEach(math => {
          let index = 0;
          let breakOut = false;
          do {
            index++;
            const des = { x: x + index * math[0], y: y + index * math[1] };
            const piece = this.getPiece(des);
            if (piece.name || !this.isValidCoor(des)) {
              breakOut = true;
            } else {
              destinations.push(des);
            }
          } while (!breakOut);
        });
        break;
      }

      case PEICE.BISHOP: {
        let index = 0;
        let des1;
        let des2;
        // do {
        //   des1 = { x: index, y: y + x - index };
        //   des2 = { x: index, y: index++ + y - x };
        //   destinations.push(des1);
        //   destinations.push(des2);
        // }
        // while (![des1, des2].every(des => (des.x < 0 || des.x > 7) && (des.y < 0 || des.y > 7)));

        [ [1,1], [-1,-1], [1,-1], [-1,1] ].forEach(math => {
          let index = 0;
          let breakOut = false;
          do {
            index++;
            const des = { x: x + index * math[0], y: y + index * math[1] };
            const piece = this.getPiece(des);
            if (piece.name || !this.isValidCoor(des)) {
              breakOut = true;
            } else {
              destinations.push(des);
            }
          } while (!breakOut);
        });
        break;

        // let downDiagonalIndex = 0, upDiagonalIndex = 0;
        // let breakUp = false, breakDown = false;
        // do {
        //   if (!breakDown) {
        //     downDiagonalIndex++;
        //     const des = { x: x + downDiagonalIndex, y: y + downDiagonalIndex };
        //     const piece = this.getPiece(des);
        //     if (piece.name || des.x > 7 || des.y > 7) {
        //       breakDown = true;
        //     } else {
        //       destinations.push(des);
        //     }
        //   }
        //   if (!breakUp) {
        //     upDiagonalIndex++;
        //     const des = { x: x + upDiagonalIndex * -1, y: y + upDiagonalIndex * -1 };
        //     const piece = this.getPiece(des);
        //     if (piece.name || des.x < 0 || des.y < 0) {
        //       breakUp = true;
        //     } else {
        //       destinations.push(des);
        //     }
        //   }
        // } while (!breakDown || !breakUp);

        // downDiagonalIndex = 0; upDiagonalIndex = 0;
        // breakUp = false; breakDown = false;
        // do {
        //   if (!breakDown) {
        //     downDiagonalIndex++;
        //     const des = { x: x + downDiagonalIndex, y: y + downDiagonalIndex * -1 };
        //     const piece = this.getPiece(des);
        //     if (piece.name || des.x > 7 || des.y > 7) {
        //       breakDown = true;
        //     } else {
        //       destinations.push(des);
        //     }
        //   }
        //   if (!breakUp) {
        //     upDiagonalIndex++;
        //     const des = { x: x + upDiagonalIndex * -1, y: y + upDiagonalIndex };
        //     const piece = this.getPiece(des);
        //     if (piece.name || des.x < 0 || des.y < 0) {
        //       breakUp = true;
        //     } else {
        //       destinations.push(des);
        //     }
        //   }
        // } while (!breakDown || !breakUp);
        // break;
      }
    }

    destinations = destinations.filter(destination => {
      const toPiece = this.getPiece(destination);
      return destination.x >= 0 && destination.x <= 7 && destination.y >= 0 && destination.y <= 7
        && toPiece.name !== PEICE.KING && piece.color !== toPiece.color;
    });

    return destinations;
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