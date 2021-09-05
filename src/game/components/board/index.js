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
  const [ points, setPoints ] = useState([]);
  const [ turn, setTurn ] = useState(null);

  useEffect(() => {
    const defaultMap = [
      ['r', '', 'b', '', 'q', '', 'n', 'r'],
      ['', 'p', '', 'p', 'p', 'p', 'p', 'p'],
      ['n', '', 'p', '', '', 'B', '', ''],
      ['p', '', '', 'k', 'b', '', '', ''],
      ['', '', 'N', '', '', '', '', ''],
      ['', '', '', 'Q', 'P', '', 'P', ''],
      ['P', 'P', 'P', 'P', '', 'P', '', 'P'],
      ['R', 'N', '', '', 'K', 'B', '', 'R'],
    ];
    const currentTurn = 'b';
    setMap(defaultMap);
    setTurn(currentTurn);

    setChess(new Chess({
      state: defaultMap,
      turn: currentTurn,
    }));
  }, []);

  const getPiece = (x, y) => {
    const piece = map[x] ? map[x][y] : undefined;
    if (!piece) {
      return null;
    }

    return {
      piece,
      color: !piece ? null : piece === piece.toUpperCase() ? 'w' : 'b',
    }
  }

  const getValidDestinations = (from) => {
    const destinations = chess.getValidDestinations(from);
    if (destinations) {
      setPoints(destinations);
    } else {
      setPoints([]);
    }
  }

  const deselect = () => {
    setSelectedCell(null);
    setPoints([]);
  }

  const move = (from, to) => {
    const moved = chess.move(from, to);
    if (!moved) {
      return;
    }

    setMap(chess.getCurrentState());
    setSelectedCell(null);
    setPoints([]);
    setTurn(turn === 'w' ? 'b' : 'w');
  }

  const selectCell = (x, y) => {
    const piece = getPiece(x, y);

    if (selectedCell && piece && x === selectedCell.x && y === selectedCell.y) {
      deselect();
    } else if (piece && piece.color === turn) {
      setSelectedCell({ x, y });
      getValidDestinations({ x, y });
    } else if (selectedCell && piece && piece.color !== turn) {
      deselect();
    } else if (selectedCell) {
      move(selectedCell, { x, y });
    }
    //else if (!selectedCell && piece)

    return;

    if (piece && (!selectedCell || (selectedCell && getPiece({ x: selectedCell.x, y: selectedCell.y }).color === piece.color))) {
      setSelectedCell({ x, y });
      getValidDestinations({ x, y });
    } else
    if (selectedCell) {
      const slectedPiece = getPiece(x, y);
      //if (!piece)
      const moved = chess.move(selectedCell, { x, y });

      if (moved) {
        setMap(chess.currentState);
        setSelectedCell(null);
        setPoints([]);
      }
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
                row.map((piece, colIndex) => {
                  const background = (colIndex + rowIndex) % 2 === 1 ? darkBG : lightBG;
                  const point = points.findIndex(point => point.x === rowIndex && point.y === colIndex) !== -1;
                  const slected = selectedCell && selectedCell.x === rowIndex && selectedCell.y === colIndex;

                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      style={{ background: `url(${background})` }}
                      onClick={() => selectCell(rowIndex, colIndex)}
                      className={`
                        cell
                        ${slected ? 'selected' : ''}
                        ${point ? 'point' : ''}
                        ${piece ? 'piece' : ''}
                      `}
                    >
                      <div>
                        <Piece
                          piece={piece}
                        />
                      </div>
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
