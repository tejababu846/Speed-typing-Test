class SpeedTypingGame {
    constructor() {
        // DOM element references
        this.quoteDisplay = document.getElementById("quoteDisplay");
        this.timer = document.getElementById("timer");
        this.userInput = document.getElementById("quoteInput");
        this.result = document.getElementById("result");
        this.submitBtn = document.getElementById("submitBtn");
        this.resetBtn = document.getElementById("resetBtn");
        this.startBtn = document.getElementById("startBtn");
        this.spinner = document.getElementById("spinner");

        // API endpoint for fetching random quotes
        this.url = "https://apis.ccbp.in/random-quote";

        // Game state variables
        this.counter = 0;
        this.intervalId = null;

        // Initialize the game
        this.init();
    }

    async fetchRandomQuote() {
        try {
            const response = await fetch(this.url);
            if (!response.ok) {
                throw new Error("Failed to fetch quote. Please try again later.");
            }
            const jsonData = await response.json();
            if (!jsonData.content) {
                throw new Error("Received empty quote from server. Please try again later.");
            }
            this.quoteDisplay.textContent = jsonData.content;
        } catch (error) {
            console.error("Error fetching random quote:", error.message);
            this.result.textContent = "Failed to fetch quote. Please try again later.";
        }
    }

    startTimer() {
        this.counter = 0;
        this.timer.textContent = this.counter;
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.counter++;
            this.timer.textContent = this.counter;
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.intervalId);
        this.intervalId = null;
    }

    resetGame() {
        this.stopTimer();
        this.counter = 0;
        this.timer.textContent = this.counter;
        this.spinner.classList.remove("d-none");
        this.fetchRandomQuote();
        this.userInput.value = "";
        this.result.textContent = "";
        this.clearInputHighlight();
        this.spinner.classList.add("d-none");
    }

    submitResult() {
        this.spinner.classList.add("d-none");
        if (!this.intervalId) {
            // Display Bootstrap modal
            $('#startGameModal').modal('show');
            return;
        }

        const userInputValue = this.userInput.value;
        const correctQuote = this.quoteDisplay.textContent;

        if (userInputValue.toLowerCase() === correctQuote.toLowerCase()) {
            this.stopTimer();
            this.result.textContent = `Congratulations! You typed the quote in ${this.timer.textContent} seconds.`;
        } else {
            this.result.textContent = "Incorrect quote. Please try again.";
            this.highlightIncorrectInput(userInputValue, correctQuote);
        }
    }

    highlightIncorrectInput(userInput, correctQuote) {
        const userInputWords = userInput.split(" ");
        const correctQuoteWords = correctQuote.split(" ");

        let html = "";
        for (let i = 0; i < userInputWords.length; i++) {
            const userWord = userInputWords[i];
            const correctWord = correctQuoteWords[i];

            if (userWord === correctWord) {
                html += userWord + " ";
            } else {
                html += `<span class="incorrect-word">${userWord}</span> `;
            }
        }

        this.userInput.innerHTML = html;
    }


    clearInputHighlight() {
        this.userInput.innerHTML = "";
    }

    startGame() {
        if (this.intervalId) {
            return;
        }
        this.startTimer();
    }

    init() {
        this.startBtn.addEventListener("click", () => this.startGame());
        this.resetBtn.addEventListener("click", () => this.resetGame());
        this.submitBtn.addEventListener("click", () => this.submitResult());
        this.fetchRandomQuote();

        // Event listener for input field
        this.userInput.addEventListener("input", () => {
            if (!this.intervalId) {
                // Display Bootstrap modal
                $('#startGameModal').modal('show');
                this.userInput.value = ""; // Clear input field
            } else {
                // Clear input highlighting on new input
                this.clearInputHighlight();
                // Highlight incorrect words after space bar press
                if (this.userInput.value.endsWith(" ")) {
                    const userInputValue = this.userInput.value.trim(); // Remove trailing space
                    const correctQuote = this.quoteDisplay.textContent;
                    this.highlightIncorrectInput(userInputValue, correctQuote);
                }
            }
        });
    }
}

new SpeedTypingGame();
