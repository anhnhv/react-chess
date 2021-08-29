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

  useEffect(() => {
    const defaultMap = [
      ['r', 'n', 'b', 'k', 'q', '', 'n', 'r'],
      ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
      ['', '', '', '', '', 'B', '', ''],
      ['', '', '', '', '', 'Q', '', ''],
      ['', '', 'b', 'N', '', '', '', ''],
      ['', '', '', '', 'P', '', 'P', ''],
      ['P', 'P', 'P', 'P', '', 'P', '', 'P'],
      ['R', 'N', '', '', 'K', 'B', '', 'R'],
    ];
    setMap(defaultMap);

    setChess(new Chess(defaultMap));
  }, []);

  const getPiece = (x, y) => {
    return map[x][y];
  }

  const getValidDestinations = (from) => {
    const destinations = chess.getValidDestinations(from);
    console.log('from', from);
    console.log('destinations', destinations);
    if (destinations) {
      setPoints(destinations);
    } else {
      setPoints([]);
    }
  }

  const selectCell = (x, y) => {
    if (getPiece(x, y)) {
      setSelectedCell({ x, y });
      getValidDestinations({ x, y });
    } else if (selectedCell) {
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
