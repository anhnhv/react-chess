import React, { useState, useEffect } from 'react';
import darkBG from './../../assets/squares/gray-dark.svg';
import lightBG from './../../assets/squares/gray-light.svg';
import Piece from './../piece';
import './style.css';

import Chess from './../../core/chess';

const Board = () => {
  const [ map, setMap ] = useState(null);
  const [ chess, setChess ] = useState(null);
  const [ selectedCell, setSelectedCell ] = useState(null);

  useEffect(() => {
    const defaultMap = [
      ['p', 'p', 'k', 'q', '', '', '', ''],
      ['p', 'p', '', '', '', '', 'k', 'q'],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['', '', '', '', '', '', '', ''],
      ['P', 'P', 'K', 'Q', '', '', '', ''],
      ['P', 'P', '', '', '', '', 'K', 'Q'],
    ];
    setMap(defaultMap);

    setChess(new Chess(defaultMap));
  }, []);

  const getPiece = (x, y) => {
    return map[x][y];
  }

  const select = (x, y) => {

  }

  const selectCell = (x, y) => {
    if (selectedCell) {
      const moved = chess.move(selectedCell, { x, y });

      if (moved) {
        setMap(chess.currentState);
        setSelectedCell(null);
      }
    } else if (getPiece(x, y)) {
      setSelectedCell({ x, y });
    } else {
      setSelectedCell(null);
    }
  }

  return (
    <div>
      {
        map && map.map((row, rowIndex) => {
          return (
            <div key={`row-${rowIndex}`} style={{ display: 'flex' }}>
              {
                row.map((cell, colIndex) => {
                  const background = (colIndex + rowIndex) % 2 === 1 ? darkBG : lightBG;
                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={{ background: `url(${background})` }}
                      onClick={() => selectCell(rowIndex, colIndex)}
                      className={`cell ${(selectedCell && selectedCell.x === rowIndex && selectedCell.y === colIndex) ? 'selected' : ''}`}
                    >
                      <Piece piece={cell} />
                    </div>
                  )
                })
              }
            </div>
          )
        })
      }
    </div>
  );
}

export default Board;
