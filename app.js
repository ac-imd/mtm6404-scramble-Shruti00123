/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const words = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown", "black", "white"];

class ScrambleGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: shuffle(words),
      currentWord: "",
      scrambledWord: "",
      guess: "",
      points: 0,
      strikes: 0,
      passes: 3,
      message: "",
      gameOver: false
    };
  }

  componentDidMount() {
    this.loadGame();
  }

  loadGame = () => {
    const savedState = JSON.parse(localStorage.getItem('scrambleGameState'));
    if (savedState) {
      this.setState(savedState, () => {
        if (!this.state.currentWord) {
          this.nextWord();
        }
      });
    } else {
      this.nextWord();
    }
  }

  saveGame = () => {
    localStorage.setItem('scrambleGameState', JSON.stringify(this.state));
  }

  nextWord = () => {
    if (this.state.words.length === 0) {
      this.setState({ gameOver: true, message: "Game Over! You guessed all the words." });
      return;
    }
    const words = this.state.words.slice();
    const currentWord = words.pop();
    const scrambledWord = shuffle(currentWord);
    this.setState({ words, currentWord, scrambledWord, message: "" }, this.saveGame);
  }

  handleGuessChange = (event) => {
    this.setState({ guess: event.target.value });
  }

  handleGuessSubmit = (event) => {
    event.preventDefault();
    const { guess, currentWord, points, strikes } = this.state;
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      this.setState({
        points: points + 1,
        guess: "",
        message: "Correct!",
      });
      setTimeout(this.nextWord, 1000);
    } else {
      this.setState({
        strikes: strikes + 1,
        guess: "",
        message: "Incorrect!",
      }, () => {
        if (this.state.strikes >= 3) {
          this.setState({ gameOver: true, message: "Game Over! Maximum strikes reached." });
        }
        this.saveGame();
      });
    }
  }

  handlePass = () => {
    if (this.state.passes > 0) {
      this.setState((state) => ({
        passes: state.passes - 1,
        message: "Pass used.",
      }), this.nextWord);
    }
  }

  handleRestart = () => {
    this.setState({
      words: shuffle(words),
      currentWord: "",
      scrambledWord: "",
      guess: "",
      points: 0,
      strikes: 0,
      passes: 3,
      message: "",
      gameOver: false
    }, () => {
      this.nextWord();
      this.saveGame();
    });
  }

  render() {
    const { scrambledWord, guess, points, strikes, passes, message, gameOver } = this.state;
    return (
      <div>
        <h1>Scramble Game</h1>
        <p>Unscramble the word: <strong>{scrambledWord}</strong></p>
        <form onSubmit={this.handleGuessSubmit}>
          <input
            type="text"
            value={guess}
            onChange={this.handleGuessChange}
            disabled={gameOver}
          />
          <button type="submit" disabled={gameOver}>Guess</button>
        </form>
        <button onClick={this.handlePass} disabled={gameOver || passes <= 0}>Pass ({passes} left)</button>
        <p className="message">{message}</p>
        <p className="points">Points: {points}</p>
        <p className="strikes">Strikes: {strikes}</p>
        {gameOver && <button onClick={this.handleRestart}>Play Again</button>}
      </div>
    );
  }
}

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));