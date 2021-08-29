import React from 'react';

import Piece_p from './../../assets/pieces/b_pawn.svg';
import Piece_k from './../../assets/pieces/b_king.svg';
import Piece_q from './../../assets/pieces/b_queen.svg';
import Piece_b from './../../assets/pieces/b_bishop.svg';
import Piece_n from './../../assets/pieces/b_knight.svg';
import Piece_r from './../../assets/pieces/b_rook.svg';

import Piece_P from './../../assets/pieces/w_pawn.svg';
import Piece_K from './../../assets/pieces/w_king.svg';
import Piece_Q from './../../assets/pieces/w_queen.svg';
import Piece_B from './../../assets/pieces/w_bishop.svg';
import Piece_N from './../../assets/pieces/w_knight.svg';
import Piece_R from './../../assets/pieces/w_rook.svg';

const PIECES = {
  p: Piece_p,
  k: Piece_k,
  q: Piece_q,
  b: Piece_b,
  n: Piece_n,
  r: Piece_r,

  P: Piece_P,
  K: Piece_K,
  Q: Piece_Q,
  B: Piece_B,
  N: Piece_N,
  R: Piece_R,
};

const Cell = ({ piece }) => {
  const pieceIcon = PIECES[piece] || null;

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%', padding: '10%' }}>
      { pieceIcon && <img src={pieceIcon} style={{ width: '100%', height: '100%' }} />}
    </div>
  );
}

export default React.memo(Cell);
