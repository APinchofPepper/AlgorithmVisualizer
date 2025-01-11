class TutorialManager {
    constructor() {
        // Initialize properties
        this.currentStep = 0;
        this.tutorialActive = false;
        this.steps = {};

        // Initialize steps data
        this.initializeSteps();

        // Wait for DOM content to be loaded before setup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupTutorialUI());
        } else {
            this.setupTutorialUI();
        }
    }

    resetForModeChange(mode) {
        const codeViewerContainer = document.getElementById('code-viewer');
        if (mode === 'single') {
            // Keep the code viewer hidden unless explicitly opened by the user
            if (codeViewerContainer) codeViewerContainer.classList.add('hidden');
        } else {
            // Ensure the code viewer remains hidden in comparison mode
            if (codeViewerContainer) codeViewerContainer.classList.add('hidden');
        }
    }    
    
    updateForAlgorithm(algorithm) {
        this.currentStep = 0;
        this.showStep(this.currentStep);
    }    

    toggleTutorial() {
        this.tutorialActive = !this.tutorialActive;
        const content = document.getElementById('tutorial-content');
        
        if (this.tutorialActive) {
            content.classList.remove('hidden');
            this.showStep(this.currentStep);
        } else {
            content.classList.add('hidden');
            // Remove all highlights when exiting tutorial mode
            document.querySelectorAll('.highlight').forEach(el => {
                el.classList.remove('highlight');
            });
        }
    }

    initializeSteps() {
        this.steps = {
            bubbleSort: [
                {
                    title: "Understanding Bubble Sort",
                    content: "Bubble Sort has O(n²) time complexity. Watch how the number of comparisons grows quadratically as array size increases.",
                    highlight: ["comparisons"]
                },
                {
                    title: "Key Operations",
                    content: "Notice the two main operations: comparisons (yellow) and swaps (green). Each comparison checks if two elements need to be swapped.",
                    highlight: ["swaps", "comparisons"]
                }
            ],
            quickSort: [
                {
                    title: "Understanding Quick Sort",
                    content: "Quick Sort uses a divide-and-conquer strategy. Watch how it selects pivot elements and partitions the array.",
                    highlight: ["comparisons"]
                },
                {
                    title: "Pivot Selection",
                    content: "The blue element is the pivot. Elements are compared against the pivot and moved to their correct side.",
                    highlight: ["array"]
                }
            ],
            mergeSort: [
                {
                    title: "Understanding Merge Sort",
                    content: "Merge Sort divides the array into smaller subarrays and then merges them back in sorted order.",
                    highlight: ["array"]
                },
                {
                    title: "Merging Process",
                    content: "Watch how the algorithm compares and combines elements from two sorted subarrays.",
                    highlight: ["comparisons", "swaps"]
                }
            ]
        };
    }

    setupTutorialUI() {
        if (currentMode === 'single') {
            const educationalControls = document.querySelector('.educational-controls');
            if (!educationalControls) return;
            
            // Create tutorial container
            const tutorialContainer = document.createElement('div');
            tutorialContainer.id = 'tutorial-container';
            tutorialContainer.className = 'tutorial-container';
            
            // Create tutorial toggle button with proper structure
            const tutorialBtn = document.createElement('button');
            const iconSpan = document.createElement('span');
            iconSpan.textContent = '📚';
            iconSpan.className = 'button-icon';
            const textSpan = document.createElement('span');
            textSpan.textContent = 'Tutorial Mode';
            textSpan.className = 'button-text';
            tutorialBtn.appendChild(iconSpan);
            tutorialBtn.appendChild(textSpan);
            tutorialBtn.className = 'tutorial-btn';
            tutorialBtn.onclick = () => this.toggleTutorial();
    
            // Create tutorial content area
            const tutorialContent = document.createElement('div');
            tutorialContent.id = 'tutorial-content';
            tutorialContent.className = 'tutorial-content hidden';
    
            // Add button to educational controls
            educationalControls.appendChild(tutorialBtn);
            
            // Add tutorial content container to main container
            tutorialContainer.appendChild(tutorialContent);
            document.querySelector('.container').appendChild(tutorialContainer);
        }
    }

    showStep(stepIndex) {
        const currentAlgorithm = document.getElementById('algorithmSelect').value;
        const algorithmSteps = this.steps[currentAlgorithm];
        
        if (!algorithmSteps || stepIndex < 0 || stepIndex >= algorithmSteps.length) return;
        
        const content = document.getElementById('tutorial-content');
        const step = algorithmSteps[stepIndex];
        
        content.innerHTML = `
            <div class="tutorial-step">
                <h3>${step.title}</h3>
                <p>${step.content}</p>
                <div class="tutorial-navigation">
                    <button ${stepIndex === 0 ? 'disabled' : ''} 
                            onclick="tutorial.previousStep()">Previous</button>
                    <span>${stepIndex + 1}/${algorithmSteps.length}</span>
                    <button ${stepIndex === algorithmSteps.length - 1 ? 'disabled' : ''} 
                            onclick="tutorial.nextStep()">Next</button>
                </div>
            </div>
        `;

        this.currentStep = stepIndex;
        this.highlightElements(step.highlight);
    }

    nextStep() {
        const currentAlgorithm = document.getElementById('algorithmSelect').value;
        if (this.currentStep < this.steps[currentAlgorithm].length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    highlightElements(elements) {
        // Remove all existing highlights
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });

        // Add new highlights
        elements.forEach(elementType => {
            if (elementType === 'comparisons') {
                document.querySelectorAll('.metrics p:first-child').forEach(el => {
                    el.classList.add('highlight');
                });
            } else if (elementType === 'swaps') {
                document.querySelectorAll('.metrics p:nth-child(2)').forEach(el => {
                    el.classList.add('highlight');
                });
            } else if (elementType === 'array') {
                document.querySelectorAll('.array').forEach(el => {
                    el.classList.add('highlight');
                });
            }
        });
    }
}

class CodeViewer {
    constructor() {
        // Initialize properties
        this.currentAlgorithm = '';
        this.activeTab = 'pseudo';
        
        // Initialize algorithms data
        this.algorithms = {
            bubbleSort: {
                name: "Bubble Sort",
                pseudocode: `procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped := true
            end if
        end for
        n := n - 1
    until not swapped
end procedure`,
                javascript: `async function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Swap elements
                [arr[j], arr[j + 1]] = 
                    [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}`
            },
            quickSort: {
                name: "Quick Sort",
                pseudocode: `procedure quickSort(A, low, high)
    if low < high then
        pivot := partition(A, low, high)
        quickSort(A, low, pivot - 1)
        quickSort(A, pivot + 1, high)
    end if
end procedure`,
                javascript: `async function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivot = await partition(arr, low, high);
        await quickSort(arr, low, pivot - 1);
        await quickSort(arr, pivot + 1, high);
    }
    return arr;
}`
            },
            mergeSort: {
                name: "Merge Sort",
                pseudocode: `procedure mergeSort(A, low, high)
    if low < high then
        mid := floor((low + high) / 2)
        mergeSort(A, low, mid)
        mergeSort(A, mid + 1, high)
        merge(A, low, mid, high)
    end if
end procedure`,
                javascript: `async function mergeSort(arr, start, end) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(arr, start, mid);
    await mergeSort(arr, mid + 1, end);
    await merge(arr, start, mid, end);
}`
            }
        };

        // Wait for DOM content to be loaded before setup
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupCodeViewer());
        } else {
            this.setupCodeViewer();
        }
    }

    resetForModeChange(mode) {
        const codeViewerContainer = document.getElementById('code-viewer');
        if (mode === 'single') {
            // Keep the code viewer hidden unless explicitly opened by the user
            if (codeViewerContainer) codeViewerContainer.classList.add('hidden');
        } else {
            // Ensure the code viewer remains hidden in comparison mode
            if (codeViewerContainer) codeViewerContainer.classList.add('hidden');
        }
    }    
    
    updateForAlgorithm(algorithm) {
        this.currentAlgorithm = algorithm;
        if (!document.getElementById('code-viewer').classList.contains('hidden')) {
            this.updateCodeView();
        }
    }    

    setupCodeViewer() {
        // Only add code viewer in single mode
        if (currentMode === 'single') {
            const educationalControls = document.querySelector('.educational-controls');
            if (!educationalControls) return;
            
            // Create code viewer container
            const codeViewerContainer = document.createElement('div');
            codeViewerContainer.id = 'code-viewer';
            codeViewerContainer.className = 'code-viewer hidden';
            
            // Create code toggle button with proper structure
            const codeToggleBtn = document.createElement('button');
            const iconSpan = document.createElement('span');
            iconSpan.textContent = '⌨️';
            iconSpan.className = 'button-icon';
            const textSpan = document.createElement('span');
            textSpan.textContent = 'View Code';
            textSpan.className = 'button-text';
            codeToggleBtn.appendChild(iconSpan);
            codeToggleBtn.appendChild(textSpan);
            codeToggleBtn.className = 'code-btn';
            codeToggleBtn.onclick = () => this.toggleCodeView();
            
            // Add button to educational controls
            educationalControls.appendChild(codeToggleBtn);
            
            // Add code viewer container to main container
            document.querySelector('.container').appendChild(codeViewerContainer);
            
            // Add algorithm change listener
            document.getElementById('algorithmSelect').addEventListener('change', (e) => {
                this.currentAlgorithm = e.target.value;
                if (!document.getElementById('code-viewer').classList.contains('hidden')) {
                    this.updateCodeView();
                }
            });
            
            this.currentAlgorithm = document.getElementById('algorithmSelect').value;
        }
    }

    toggleCodeView() {
        const codeViewer = document.getElementById('code-viewer');
        const isHidden = codeViewer.classList.toggle('hidden');
        
        if (!isHidden) {
            this.updateCodeView();
        }
    }

    updateCodeView() {
        const codeViewer = document.getElementById('code-viewer');
        const algorithm = document.getElementById('algorithmSelect').value;
        
        codeViewer.innerHTML = `
            <div class="code-container">
                <div class="code-section">
                    <h3>${this.algorithms[algorithm].name}</h3>
                    <div class="code-tabs">
                        <button class="${this.activeTab === 'pseudo' ? 'active' : ''}"
                                onclick="codeViewer.showCode('pseudo')">Pseudocode</button>
                        <button class="${this.activeTab === 'js' ? 'active' : ''}"
                                onclick="codeViewer.showCode('js')">JavaScript</button>
                    </div>
                    <pre id="code-display" class="code-display"></pre>
                </div>
            </div>
        `;
        
        this.showCode(this.activeTab);
    }

    showCode(type) {
        const algorithm = document.getElementById('algorithmSelect').value;
        const codeElement = document.getElementById('code-display');
        
        this.activeTab = type;
        
        const code = type === 'pseudo' ? 
            this.algorithms[algorithm].pseudocode : 
            this.algorithms[algorithm].javascript;
        
        codeElement.textContent = code;
        
        // Update active tab styling
        const tabButtons = document.querySelectorAll('.code-tabs button');
        tabButtons.forEach(button => {
            button.classList.toggle('active', 
                (button.textContent.toLowerCase() === 'pseudocode' && type === 'pseudo') ||
                (button.textContent.toLowerCase() === 'javascript' && type === 'js')
            );
        });
    }
}

// Export for use in main script
window.tutorial = new TutorialManager();
window.codeViewer = new CodeViewer();