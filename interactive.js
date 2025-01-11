class InteractiveSorting {
    constructor() {
        this.currentAlgorithm = '';
        this.currentStep = 0;
        this.selectedBar = null;
        this.isActive = false;
        this.gameRules = {
            bubbleSort: {
                name: "Bubble Sort Practice",
                instructions: "Compare adjacent elements and swap them if they're in the wrong order. Start from the left.",
                validator: (index1, index2) => {
                    // Only allow swaps of adjacent elements, left to right
                    return index2 === index1 + 1;
                },
                isCorrectSwap: (val1, val2) => val1 > val2,
                hint: "Focus on comparing adjacent pairs and swap them if the left is larger than the right."
            },
            quickSort: {
                name: "Quick Sort Practice",
                instructions: "Pick a pivot (last element) and partition the array. Move elements smaller than pivot to the left.",
                validator: (index1, index2, bars) => {
                    // Allow moves relative to the pivot (last element)
                    const pivotValue = parseInt(bars[bars.length - 1].getAttribute('data-value'));
                    return true; // More complex validation would be needed for true quicksort
                },
                isCorrectSwap: (val1, val2, bars) => {
                    const pivotValue = parseInt(bars[bars.length - 1].getAttribute('data-value'));
                    return (val1 < pivotValue && val2 > pivotValue);
                },
                hint: "Compare elements with the pivot (highlighted in blue). Move smaller elements to the left."
            },
            mergeSort: {
                name: "Merge Sort Practice",
                instructions: "Practice merging two sorted halves. Pick elements in ascending order.",
                validator: (index1, index2, bars) => {
                    // Allow moves within sorted subsections
                    const mid = Math.floor(bars.length / 2);
                    return true; // Simplified for demonstration
                },
                isCorrectSwap: (val1, val2, bars) => {
                    return val1 < val2; // Simplified for demonstration
                },
                hint: "Compare elements from both halves and place the smaller one first."
            }
        };
        
        this.setupInteractiveMode();
    }

    setupInteractiveMode() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeUI();
    
                // Listen for algorithm changes
                const algorithmSelect = document.getElementById('algorithmSelect');
                if (algorithmSelect) {
                    algorithmSelect.addEventListener('change', () => this.updateForNewAlgorithm());
                }
            });
        } else {
            this.initializeUI();
    
            // Listen for algorithm changes
            const algorithmSelect = document.getElementById('algorithmSelect');
            if (algorithmSelect) {
                algorithmSelect.addEventListener('change', () => this.updateForNewAlgorithm());
            }
        }
    }

    updateForNewAlgorithm() {
        if (this.isActive) {
            console.log("Updating practice mode for new algorithm.");
            this.startInteractiveMode(); // Reinitialize the practice mode
        }
    }    
    
    initializeUI() {
        const educationalControls = document.querySelector('.educational-controls');
        if (!educationalControls) return;
    
        // Create interactive mode button
        const interactiveBtn = document.createElement('button');
        interactiveBtn.innerHTML = '<span class="game-icon">🎮</span> Practice Mode';
        interactiveBtn.className = 'interactive-btn';
        interactiveBtn.onclick = () => this.toggleInteractiveMode();
        
        // Insert button into educational controls
        educationalControls.appendChild(interactiveBtn);
    
        // Create game container (add this after the button)
        const gameContainer = document.createElement('div');
        gameContainer.id = 'interactive-container';
        gameContainer.className = 'interactive-container hidden';
        document.querySelector('.container').appendChild(gameContainer);
    }

    toggleInteractiveMode() {
        this.isActive = !this.isActive;
        const container = document.getElementById('interactive-container');
        
        if (this.isActive) {
            this.startInteractiveMode();
            container.classList.remove('hidden');
        } else {
            this.cleanup();
            container.classList.add('hidden');
        }
    }

    startInteractiveMode() {
        const algorithm = document.getElementById('algorithmSelect').value;
        this.currentAlgorithm = algorithm;
        const rules = this.gameRules[algorithm];
    
        if (!rules) {
            console.error("No rules defined for the selected algorithm:", algorithm);
            return;
        }
        
        // Setup game interface
        const container = document.getElementById('interactive-container');
        container.innerHTML = `
            <div class="game-header">
                <h3>${rules.name}</h3>
                <p class="instructions">${rules.instructions}</p>
            </div>
            <div class="game-array" id="practice-array"></div>
            <div class="feedback-area">
                <p class="hint hidden">${rules.hint}</p>
                <p class="feedback"></p>
            </div>
            <div class="game-controls">
                <button onclick="interactiveSorting.showHint()">Show Hint</button>
                <button onclick="interactiveSorting.checkProgress()">Check Progress</button>
                <button onclick="interactiveSorting.resetPractice()">Reset</button>
            </div>
        `;
    
        // Generate practice array
        this.generatePracticeArray();
        this.addBarListeners();
    }    

    generatePracticeArray() {
        const container = document.getElementById('practice-array');
        const size = 6; // Smaller size for practice
        const maxHeight = 200;
        
        container.innerHTML = '';
        
        for (let i = 0; i < size; i++) {
            const height = Math.floor(Math.random() * maxHeight) + 10;
            const bar = document.createElement('div');
            bar.style.height = `${height}px`;
            bar.style.width = '40px'; // Wider bars for better interaction
            bar.style.margin = '0 5px';
            bar.classList.add('bar', 'interactive-bar');
            bar.setAttribute('data-value', height);
            bar.setAttribute('data-index', i);
            container.appendChild(bar);
        }
    }

    addBarListeners() {
        const bars = document.querySelectorAll('.interactive-bar');
        bars.forEach(bar => {
            bar.addEventListener('click', (e) => this.handleBarClick(e));
        });
    }

    handleBarClick(e) {
        const clickedBar = e.target;
        
        if (!this.selectedBar) {
            // First bar selected
            this.selectedBar = clickedBar;
            clickedBar.classList.add('selected');
        } else if (this.selectedBar === clickedBar) {
            // Deselect if clicking same bar
            this.selectedBar.classList.remove('selected');
            this.selectedBar = null;
        } else {
            // Second bar selected - attempt swap
            const index1 = parseInt(this.selectedBar.getAttribute('data-index'));
            const index2 = parseInt(clickedBar.getAttribute('data-index'));
            const val1 = parseInt(this.selectedBar.getAttribute('data-value'));
            const val2 = parseInt(clickedBar.getAttribute('data-value'));
            
            if (this.validateMove(index1, index2, val1, val2)) {
                this.swapBars(this.selectedBar, clickedBar);
                this.showFeedback(true, "Good move!");
            } else {
                this.showFeedback(false, "Try again! Remember the rules of " + this.gameRules[this.currentAlgorithm].name);
            }
            
            this.selectedBar.classList.remove('selected');
            this.selectedBar = null;
        }
    }

    validateMove(index1, index2, val1, val2) {
        const rules = this.gameRules[this.currentAlgorithm];
        const bars = document.querySelectorAll('.interactive-bar');
        return rules.validator(index1, index2, Array.from(bars)) && 
               rules.isCorrectSwap(val1, val2, Array.from(bars));
    }

    swapBars(bar1, bar2) {
        const tempHeight = bar1.style.height;
        const tempValue = bar1.getAttribute('data-value');
        
        bar1.style.height = bar2.style.height;
        bar1.setAttribute('data-value', bar2.getAttribute('data-value'));
        
        bar2.style.height = tempHeight;
        bar2.setAttribute('data-value', tempValue);
    }

    showFeedback(isCorrect, message) {
        const feedback = document.querySelector('.feedback');
        feedback.textContent = message;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'feedback';
        }, 2000);
    }

    showHint() {
        const hint = document.querySelector('.hint');
        hint.classList.remove('hidden');
        setTimeout(() => hint.classList.add('hidden'), 3000);
    }

    checkProgress() {
        const bars = document.querySelectorAll('.interactive-bar');
        let isSorted = true;
        
        for (let i = 0; i < bars.length - 1; i++) {
            const current = parseInt(bars[i].getAttribute('data-value'));
            const next = parseInt(bars[i + 1].getAttribute('data-value'));
            if (current > next) {
                isSorted = false;
                break;
            }
        }
        
        this.showFeedback(isSorted, 
            isSorted ? "Congratulations! The array is sorted!" : "Not quite sorted yet. Keep trying!"
        );
    }

    resetPractice() {
        this.generatePracticeArray();
        this.addBarListeners();
        this.selectedBar = null;
    }

    cleanup() {
        this.selectedBar = null;
        this.currentStep = 0;
    }
}

// Export for use in main script
window.interactiveSorting = new InteractiveSorting();