import { useEffect, useState } from 'react'

const EasterEgg = () => {
  const [score, setScore] = useState(0)

  useEffect(() => {
    let board: number[][] = []
    let currentPiece: any
    let localScore = 0
    let gameInterval: NodeJS.Timeout | null = null
    
    const ROWS = 20
    const COLS = 10
    
    const pieces = [
      [[1, 1, 1, 1]], // I
      [[1, 1, 1], [0, 1, 0]], // T
      [[1, 1], [1, 1]], // O
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 1, 0], [0, 1, 1]], // Z
      [[1, 1, 1], [1, 0, 0]], // L
      [[1, 1, 1], [0, 0, 1]]  // J
    ]
    
    function createEmptyBoard() {
      return Array.from({length: ROWS}, () => Array(COLS).fill(0))
    }
    
    function drawBoard() {
      const tetrisBoard = document.getElementById('tetris')
      if (!tetrisBoard) return
      
      tetrisBoard.innerHTML = ''
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const cell = document.createElement('div')
          cell.classList.add('tetris-cell')
          if (board[r][c]) {
            cell.classList.add('filled')
          }
          tetrisBoard.appendChild(cell)
        }
      }
    }
    
    function drawPiece() {
      currentPiece.shape.forEach((row: number[], r: number) => {
        row.forEach((value: number, c: number) => {
          if (value) {
            board[currentPiece.y + r][currentPiece.x + c] = value
          }
        })
      })
    }
    
    function undrawPiece() {
      currentPiece.shape.forEach((row: number[], r: number) => {
        row.forEach((value: number, c: number) => {
          if (value) {
            board[currentPiece.y + r][currentPiece.x + c] = 0
          }
        })
      })
    }
    
    function resetPiece() {
      const pieceIndex = Math.floor(Math.random() * pieces.length)
      currentPiece = {
        shape: pieces[pieceIndex],
        x: Math.floor(COLS / 2) - Math.floor(pieces[pieceIndex][0].length / 2),
        y: 0
      }
      if (collision()) {
        if (gameInterval) clearInterval(gameInterval)
        alert('Game Over! Your score: ' + localScore)
        board = createEmptyBoard()
        drawBoard()
      }
    }
    
    function collision() {
      return currentPiece.shape.some((row: number[], r: number) => {
        return row.some((value: number, c: number) => {
          if (value) {
            const newX = currentPiece.x + c
            const newY = currentPiece.y + r
            return (
              newX < 0 ||
              newX >= COLS ||
              newY >= ROWS ||
              (board[newY] && board[newY][newX])
            )
          }
          return false
        })
      })
    }
    
    function clearRows() {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r].every(value => value)) {
          board.splice(r, 1)
          board.unshift(Array(COLS).fill(0))
          localScore += 10
          setScore(localScore)
        }
      }
    }
    
    function moveDown() {
      undrawPiece()
      currentPiece.y++
      if (collision()) {
        currentPiece.y--
        drawPiece()
        clearRows()
        resetPiece()
      } else {
        drawPiece()
      }
      drawBoard()
    }
    
    function movePiece(x: number, y: number) {
      undrawPiece()
      currentPiece.x += x
      currentPiece.y += y
      if (collision()) {
        currentPiece.x -= x
        currentPiece.y -= y
      }
      drawPiece()
      drawBoard()
    }
    
    function rotatePiece() {
      undrawPiece()
      const prevShape = currentPiece.shape
      currentPiece.shape = currentPiece.shape[0].map((_: any, index: number) => 
        currentPiece.shape.map((row: number[]) => row[index]).reverse()
      )
    
      if (collision()) {
        for (let shift of [-1, 1, -2, 2]) {
          currentPiece.x += shift
          if (!collision()) {
            drawPiece()
            drawBoard()
            return
          }
          currentPiece.x -= shift
        }
        currentPiece.shape = prevShape
      }
      drawPiece()
      drawBoard()
    }
    
    function control(event: KeyboardEvent) {
      if (event.keyCode === 37) {
        movePiece(-1, 0)
      } else if (event.keyCode === 39) {
        movePiece(1, 0)
      } else if (event.keyCode === 40) {
        movePiece(0, 1)
      } else if (event.keyCode === 38) {
        rotatePiece()
      }
    }
    
    function gameLoop() {
      moveDown()
    }
    
    const startGame = () => {
      localScore = 0
      setScore(0)
      board = createEmptyBoard()
      resetPiece()
      drawBoard()
      if (gameInterval) clearInterval(gameInterval)
      gameInterval = setInterval(gameLoop, 500)
    }
    
    const startButton = document.getElementById('startGame')
    if (startButton) {
      startButton.addEventListener('click', startGame)
    }
    
    document.addEventListener('keydown', control)
    
    // Initialize empty board
    board = createEmptyBoard()
    drawBoard()

    return () => {
      if (gameInterval) clearInterval(gameInterval)
      document.removeEventListener('keydown', control)
      if (startButton) {
        startButton.removeEventListener('click', startGame)
      }
    }
  }, [])

  return (
    <>
      <style>{`
        #tetris {
          border: 2px solid #333;
          background-color: #fff;
          display: grid;
          grid-template-columns: repeat(10, 30px);
          grid-template-rows: repeat(20, 30px);
          margin: 20px auto;
          width: 300px;
          height: 600px;
        }
        .tetris-cell {
          width: 30px;
          height: 30px;
          border: 1px solid #ccc;
        }
        .tetris-cell.filled {
          background-color: #3498db;
        }
      `}</style>
      
      <div className="container mt-5 text-center">
        <h1>🎉 Tetris Game!</h1>
        <p className="lead">Gratulerer! Du fant påskeegget! 🥚</p>
        <div id="tetris"></div>
        <button id="startGame" className="btn btn-success mb-3">Start Game</button>
        <p className="mt-3 fw-bold">Score: {score}</p>
        <div className="mt-3">
          <p><strong>Controls:</strong></p>
          <p>← → : Move | ↓ : Speed up | ↑ : Rotate</p>
        </div>
      </div>
    </>
  )
}

export default EasterEgg
