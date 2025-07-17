module.exports = {
  name: 'minesweeper',
  execute(message, args) {
    const size = 5;
    const bombs = 5;

    // Initialize grid
    let grid = Array.from({ length: size }, () => Array(size).fill(0));

    // Place bombs
    let placed = 0;
    while (placed < bombs) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * size);
      if (grid[row][col] !== 'B') {
        grid[row][col] = 'B';
        placed++;
      }
    }

    // Calculate numbers
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1]
    ];

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (grid[r][c] === 'B') continue;
        let count = 0;
        for (const [dx, dy] of directions) {
          const nr = r + dx;
          const nc = c + dy;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && grid[nr][nc] === 'B') {
            count++;
          }
        }
        grid[r][c] = count;
      }
    }

    // Convert to emoji-based message
    const emojiGrid = grid.map(row =>
      row.map(cell => {
        if (cell === 'B') return '💣';
        if (cell === 0) return '⬜';
        return `||${cell}||`;
      }).join(' ')
    ).join('\n');

    message.channel.send(`Minesweeper:\n${emojiGrid}`);
  }
};
