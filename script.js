// DOM Elements for both modes
const singleModeBtn = document.getElementById('singleModeBtn');
const comparisonModeBtn = document.getElementById('comparisonModeBtn');
const singleMode = document.getElementById('singleMode');
const comparisonMode = document.getElementById('comparisonMode');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeIcon = document.getElementById('themeIcon');

// Initialize variables
let delay = 100;
let currentMode = 'single';

// Color configurations
const colors = {
    light: {
        background: '#e74c3c',
        comparing: 'yellow',
        sorted: 'green',
        pivot: 'blue'
    },
    dark: {
        background: '#3498db',
        comparing: '#f1c40f',
        sorted: '#2ecc71',
        pivot: '#9b59b6'
    }
};

// Mode switching
function switchMode(mode) {
    currentMode = mode;

    if (mode === 'single') {
        singleMode.classList.remove('hidden');
        comparisonMode.classList.add('hidden');
        singleModeBtn.classList.add('active');
        comparisonModeBtn.classList.remove('active');
        generateArray();

        // Ensure practice mode is hidden when switching back to single mode
        if (window.interactiveSorting) {
            const practiceContainer = document.getElementById('interactive-container');
            if (practiceContainer) practiceContainer.classList.add('hidden');
            window.interactiveSorting.isActive = false;
        }

    } else if (mode === 'comparison') {
        singleMode.classList.add('hidden');
        comparisonMode.classList.remove('hidden');
        singleModeBtn.classList.remove('active');
        comparisonModeBtn.classList.add('active');
        generateArrays();

        // Ensure practice mode is deactivated when switching to comparison mode
        if (window.interactiveSorting) {
            const practiceContainer = document.getElementById('interactive-container');
            if (practiceContainer) practiceContainer.classList.add('hidden');
            window.interactiveSorting.isActive = false;
        }
    }
}

// Add these event listeners after the existing ones in script.js
singleModeBtn.addEventListener('click', () => switchMode('single'));
comparisonModeBtn.addEventListener('click', () => switchMode('comparison'));

// Also add algorithm selection event listener for single mode
document.getElementById('algorithmSelect').addEventListener('change', (e) => {
    updateSingleAlgorithmInfo(e.target.value);
});

document.getElementById('algorithmSelect').addEventListener('change', (e) => {
    if (window.tutorial) tutorial.updateForAlgorithm(e.target.value);
    if (window.codeViewer) codeViewer.updateForAlgorithm(e.target.value);
});

// Theme handling
function getColors() {
    return document.body.classList.contains('dark-mode') ? colors.dark : colors.light;
}

function initializeTheme() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    themeIcon.textContent = darkMode ? '☀️' : '🌙';
}

function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeIcon.textContent = isDarkMode ? '☀️' : '🌙';
}

// Metrics class
class SortMetrics {
    constructor(visualizerId) {
        this.comparisons = 0;
        this.swaps = 0;
        this.visualizerId = visualizerId;
    }

    incrementComparisons() {
        this.comparisons++;
        this.updateDisplay();
    }

    incrementSwaps() {
        this.swaps++;
        this.updateDisplay();
    }

    reset() {
        this.comparisons = 0;
        this.swaps = 0;
        this.updateDisplay();
    }

    updateDisplay() {
        const suffix = this.visualizerId === 'single' ? '-single' : this.visualizerId;
        document.getElementById(`comparisons${suffix}`).innerText = this.comparisons;
        document.getElementById(`swaps${suffix}`).innerText = this.swaps;
    }
}

// Create metrics instances
const metricsSingle = new SortMetrics('single');
const metrics1 = new SortMetrics(1);
const metrics2 = new SortMetrics(2);

// Array generation functions
function generateArray() {
    const container = document.getElementById('array-single');
    generateArrayInContainer(container);
}

function generateArrays() {
    generateArrayInContainer(document.getElementById('array1'));
    generateArrayInContainer(document.getElementById('array2'));
}

function generateArrayInContainer(container) {
    container.innerHTML = '';
    const sizeSlider = currentMode === 'single' ? 
        document.getElementById('arraySize') :
        document.getElementById('arraySize-comparison');
    const size = parseInt(sizeSlider.value);
    const maxHeight = 200;
    
    const containerWidth = container.clientWidth;
    const margin = 2;
    const barWidth = Math.max(4, Math.floor((containerWidth / size) - (2 * margin)));
    
    for (let i = 0; i < size; i++) {
        const height = Math.floor(Math.random() * maxHeight) + 10;
        const bar = document.createElement('div');
        bar.style.height = `${height}px`;
        bar.style.width = `${barWidth}px`;
        bar.style.margin = `0 ${margin}px`;
        bar.classList.add('bar');
        bar.setAttribute('data-value', height);
        container.appendChild(bar);
    }
}

// Start visualization functions
function startVisualization() {
    const algorithm = document.getElementById('algorithmSelect').value;
    const bars = document.querySelectorAll('#array-single .bar');
    const speedSlider = document.getElementById('speed');
    delay = 1000 - (speedSlider.value * 9.9);

    console.log('Selected algorithm:', algorithm);
    console.log('Bars:', bars);
    console.log('Speed delay:', delay);

    if (bars.length === 0) {
        console.error('No bars generated for sorting.');
        return;
    }

    metricsSingle.reset();
    document.getElementById('time-single').innerText = '0';

    const startTime = performance.now();
    runAlgorithm(algorithm, bars, 'single', startTime).catch(error => {
        console.error('Error during visualization:', error);
    });
}

window.startVisualization = startVisualization;

function startComparison() {
    const algorithm1 = document.getElementById('algorithm1').value;
    const algorithm2 = document.getElementById('algorithm2').value;
    const array1Bars = document.querySelectorAll('#array1 .bar');
    const array2Bars = document.querySelectorAll('#array2 .bar');

    metrics1.reset();
    metrics2.reset();
    
    document.getElementById('time1').innerText = '0';
    document.getElementById('time2').innerText = '0';

    const start1 = performance.now();
    const start2 = performance.now();

    Promise.all([
        runAlgorithm(algorithm1, array1Bars, 1, start1),
        runAlgorithm(algorithm2, array2Bars, 2, start2)
    ]).catch(error => console.error('Sorting error:', error));
}

// Algorithm execution
async function runAlgorithm(algorithmName, bars, visualizer, startTime) {
    try {
        if (algorithmName === 'bubbleSort') {
            await bubbleSort(bars, visualizer);
        } else if (algorithmName === 'quickSort') {
            await quickSort(bars, 0, bars.length - 1, visualizer);
        } else if (algorithmName === 'mergeSort') {
            await mergeSort(bars, 0, bars.length - 1, visualizer);
        }
        
        const endTime = performance.now();
        const suffix = visualizer === 'single' ? '-single' : visualizer;
        document.getElementById(`time${suffix}`).innerText = 
            (endTime - startTime).toFixed(2);
    } catch (error) {
        console.error(`Error in algorithm ${visualizer}:`, error);
    }
}

// Bubble Sort Implementation
async function bubbleSort(bars, visualizer) {
    const metrics = visualizer === 'single' ? metricsSingle : 
                   visualizer === 1 ? metrics1 : metrics2;
    const currentColors = getColors();

    for (let i = 0; i < bars.length; i++) {
        for (let j = 0; j < bars.length - i - 1; j++) {
            const bar1 = bars[j];
            const bar2 = bars[j + 1];

            metrics.incrementComparisons();

            bar1.style.background = currentColors.comparing;
            bar2.style.background = currentColors.comparing;

            await new Promise(resolve => setTimeout(resolve, delay));

            const val1 = parseInt(bar1.getAttribute('data-value'));
            const val2 = parseInt(bar2.getAttribute('data-value'));

            if (val1 > val2) {
                swapBars(bar1, bar2);
                metrics.incrementSwaps();
            }

            bar1.style.background = currentColors.background;
            bar2.style.background = currentColors.background;
        }

        bars[bars.length - i - 1].style.background = currentColors.sorted;
    }
}

// Quick Sort Implementation
async function quickSort(bars, start, end, visualizer) {
    if (start >= end) return;

    const pivotIndex = await partition(bars, start, end, visualizer);
    await quickSort(bars, start, pivotIndex - 1, visualizer);
    await quickSort(bars, pivotIndex + 1, end, visualizer);

    if (start === 0 && end === bars.length - 1) {
        const currentColors = getColors();
        for (let i = 0; i < bars.length; i++) {
            bars[i].style.background = currentColors.sorted;
        }
    }
}

async function partition(bars, start, end, visualizer) {
    const metrics = visualizer === 'single' ? metricsSingle : 
                   visualizer === 1 ? metrics1 : metrics2;
    const currentColors = getColors();
    const pivotValue = parseInt(bars[end].getAttribute('data-value'));
    bars[end].style.background = currentColors.pivot;
    let pivotIndex = start;

    for (let i = start; i < end; i++) {
        metrics.incrementComparisons();

        bars[i].style.background = currentColors.comparing;
        await new Promise(resolve => setTimeout(resolve, delay));

        const currentValue = parseInt(bars[i].getAttribute('data-value'));

        if (currentValue < pivotValue) {
            swapBars(bars[i], bars[pivotIndex]);
            metrics.incrementSwaps();
            pivotIndex++;
        }

        bars[i].style.background = currentColors.background;
    }

    swapBars(bars[pivotIndex], bars[end]);
    metrics.incrementSwaps();
    bars[end].style.background = currentColors.background;
    bars[pivotIndex].style.background = currentColors.sorted;

    return pivotIndex;
}

// Merge Sort Implementation
async function mergeSort(bars, start, end, visualizer) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(bars, start, mid, visualizer);
    await mergeSort(bars, mid + 1, end, visualizer);
    await merge(bars, start, mid, end, visualizer);
}

async function merge(bars, start, mid, end, visualizer) {
    const metrics = visualizer === 'single' ? metricsSingle : 
                   visualizer === 1 ? metrics1 : metrics2;
    const currentColors = getColors();
    const tempArray = [];
    let left = start, right = mid + 1;

    while (left <= mid && right <= end) {
        metrics.incrementComparisons();

        bars[left].style.background = currentColors.comparing;
        bars[right].style.background = currentColors.comparing;

        await new Promise(resolve => setTimeout(resolve, delay));

        const leftValue = parseInt(bars[left].getAttribute('data-value'));
        const rightValue = parseInt(bars[right].getAttribute('data-value'));

        if (leftValue < rightValue) {
            tempArray.push(leftValue);
            metrics.incrementSwaps();
            bars[left].style.background = currentColors.background;
            left++;
        } else {
            tempArray.push(rightValue);
            metrics.incrementSwaps();
            bars[right].style.background = currentColors.background;
            right++;
        }
    }

    while (left <= mid) {
        metrics.incrementSwaps();
        tempArray.push(parseInt(bars[left].getAttribute('data-value')));
        bars[left].style.background = currentColors.background;
        left++;
    }

    while (right <= end) {
        metrics.incrementSwaps();
        tempArray.push(parseInt(bars[right].getAttribute('data-value')));
        bars[right].style.background = currentColors.background;
        right++;
    }

    for (let i = start; i <= end; i++) {
        const newValue = tempArray[i - start];
        bars[i].style.height = `${newValue}px`;
        bars[i].setAttribute('data-value', newValue);
        metrics.incrementSwaps();
        bars[i].style.background = currentColors.sorted;

        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

function attachComparisonListeners() {
    const arraySizeSlider = document.getElementById('arraySize-comparison');
    const arraySizeDisplay = document.getElementById('arraySizeValue-comparison');
    if (arraySizeSlider && arraySizeDisplay) {
        arraySizeSlider.addEventListener('input', () => {
            console.log(`Comparison array size changed to: ${arraySizeSlider.value}`);
            arraySizeDisplay.textContent = arraySizeSlider.value;
            if (currentMode === 'comparison') generateArrays();
        });
    } else {
        console.warn('Comparison array size slider or display not found.');
    }

    const speedSlider = document.getElementById('speed-comparison');
    const speedDisplay = document.getElementById('speedValue-comparison');
    if (speedSlider && speedDisplay) {
        speedSlider.addEventListener('input', () => {
            console.log(`Comparison speed changed to: ${speedSlider.value}`);
            speedDisplay.textContent = speedSlider.value;
            if (currentMode === 'comparison') {
                delay = 1000 - (speedSlider.value * 9.9);
            }
        });
    } else {
        console.warn('Comparison speed slider or display not found.');
    }
}

document.getElementById('comparisonModeBtn').addEventListener('click', () => {
    console.log('Switching to comparison mode.');
    attachComparisonListeners(); // Attach listeners when switching to comparison mode
});

// Helper function to swap bars
function swapBars(bar1, bar2) {
    const tempHeight = bar1.style.height;
    const tempValue = bar1.getAttribute('data-value');

    bar1.style.height = bar2.style.height;
    bar1.setAttribute('data-value', bar2.getAttribute('data-value'));

    bar2.style.height = tempHeight;
    bar2.setAttribute('data-value', tempValue);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initializeTheme();
    console.log('Theme initialized.');

    // Set the initial mode
    switchMode('single');
    console.log('Switched to single mode.');

    // Initialize speed slider for single mode
    const speedSlider = document.getElementById('speed');
    const speedDisplay = document.getElementById('speedValue');
    if (speedSlider && speedDisplay) {
        speedDisplay.textContent = speedSlider.value; // Set display to slider value
        delay = 1000 - (speedSlider.value) * 9.9;
        console.log(`Speed slider initialized with value: ${speedSlider.value}`);
    }

    // Initialize speed and array size sliders for comparison mode
    ['arraySize', 'arraySize-comparison', 'speed', 'speed-comparison'].forEach(id => {
        const slider = document.getElementById(id);
        const valueDisplay = document.getElementById(`${id}Value`);
        if (slider && valueDisplay) {
            console.log(`Attaching event listener to slider: ${id}`);
            slider.addEventListener('input', () => {
                valueDisplay.textContent = slider.value; // Update display
                console.log(`Slider ${id} updated to value: ${slider.value}`);
                if (id === 'arraySize' && currentMode === 'single') {
                    generateArray();
                    console.log('Generated array for single mode.');
                } else if (id === 'arraySize-comparison' && currentMode === 'comparison') {
                    generateArrays();
                    console.log('Generated arrays for comparison mode.');
                } else if (id === 'speed' && currentMode === 'single') {
                    delay = 1000 - (slider.value * 9.9);
                    console.log(`Adjusted speed delay for single mode to: ${delay}`);
                } else if (id === 'speed-comparison' && currentMode === 'comparison') {
                    delay = 1000 - (slider.value * 9.9);
                    console.log(`Adjusted speed delay for comparison mode to: ${delay}`);
                }
            });
        } else {
            console.warn(`Slider or value display not found for ID: ${id}`);
        }
    });

    // Start Visualization button listener
    const startButton = document.getElementById('startVisualizationBtn');
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Start Visualization button clicked.');
            startVisualization();
        });
    } else {
        console.error('Start Visualization button not found.');
    }
});


darkModeToggle.addEventListener('click', toggleDarkMode);

// Handle array size changes for both modes
['arraySize', 'arraySize-comparison'].forEach(id => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(`${id}Value`);
    if (slider && valueDisplay) {
        console.log(`Attaching listener to slider: ${id}`); // Debugging log
        slider.addEventListener('input', () => {
            console.log(`Slider ${id} changed to value: ${slider.value}`); // Log slider value
            valueDisplay.textContent = slider.value; // Update display with the slider value
            if (id === 'arraySize' && currentMode === 'single') {
                console.log('Updating array for single mode');
                generateArray(); // Generate a new array in single mode
            } else if (id === 'arraySize-comparison' && currentMode === 'comparison') {
                console.log('Updating arrays for comparison mode');
                generateArrays(); // Generate new arrays in comparison mode
            }
        });
    } else {
        console.warn(`Slider or value display not found for ID: ${id}`); // Warn if elements are missing
    }
});

// Handle speed slider changes for both modes
['speed', 'speed-comparison'].forEach(id => {
    const slider = document.getElementById(id);
    const valueDisplay = document.getElementById(`${id}Value`);
    if (slider && valueDisplay) {
        console.log(`Attaching listener to speed slider: ${id}`); // Debugging log
        slider.addEventListener('input', () => {
            console.log(`Speed slider ${id} changed to value: ${slider.value}`); // Log slider value
            valueDisplay.textContent = slider.value; // Update display with the slider value
            if (id === 'speed' && currentMode === 'single') {
                console.log('Adjusting speed delay for single mode');
                delay = 1000 - (slider.value * 9.9); // Adjust delay for single mode
            } else if (id === 'speed-comparison' && currentMode === 'comparison') {
                console.log('Adjusting speed delay for comparison mode');
                delay = 1000 - (slider.value * 9.9); // Adjust delay for comparison mode
            }
        });
    } else {
        console.warn(`Speed slider or value display not found for ID: ${id}`); // Warn if elements are missing
    }
});


// Window resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (currentMode === 'single') {
            generateArray();
        } else {
            generateArrays();
        }
    }, 250);
});

// Initialize arrays on page load
generateArrays();