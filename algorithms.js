// algorithms.js
const algorithmInfo = {
    bubbleSort: {
        name: "Bubble Sort",
        timeComplexity: {
            best: "O(n)",
            average: "O(n²)",
            worst: "O(n²)",
            explanation: "Requires nested iterations over the array"
        },
        spaceComplexity: {
            value: "O(1)",
            explanation: "Only requires a constant amount of additional space"
        },
        useCases: [
            "Educational purposes",
            "Small datasets (< 1000 elements)",
            "Nearly sorted arrays",
            "Memory-constrained systems"
        ]
    },
    quickSort: {
        name: "Quick Sort",
        timeComplexity: {
            best: "O(n log n)",
            average: "O(n log n)",
            worst: "O(n²)",
            explanation: "Divides array into smaller sub-arrays"
        },
        spaceComplexity: {
            value: "O(log n)",
            explanation: "Requires stack space for recursion"
        },
        useCases: [
            "Large datasets",
            "General-purpose sorting",
            "Systems with good cache locality",
            "When average performance matters most"
        ]
    },
    mergeSort: {
        name: "Merge Sort",
        timeComplexity: {
            best: "O(n log n)",
            average: "O(n log n)",
            worst: "O(n log n)",
            explanation: "Always divides array into equal halves"
        },
        spaceComplexity: {
            value: "O(n)",
            explanation: "Requires additional array for merging"
        },
        useCases: [
            "Stable sorting required",
            "Linked list sorting",
            "External sorting",
            "Predictable performance needed"
        ]
    }
};

function updateSingleAlgorithmInfo(algorithmName) {
    const info = algorithmInfo[algorithmName];
    const infoSection = document.getElementById('algorithm-info-single');
    
    infoSection.innerHTML = `
        <div class="info-card">
            <h3>Time Complexity</h3>
            <div>
                <div class="complexity-item">
                    <span class="complexity-label">Best Case:</span>
                    <span class="complexity-value">${info.timeComplexity.best}</span>
                </div>
                <div class="complexity-item">
                    <span class="complexity-label">Average Case:</span>
                    <span class="complexity-value">${info.timeComplexity.average}</span>
                </div>
                <div class="complexity-item">
                    <span class="complexity-label">Worst Case:</span>
                    <span class="complexity-value">${info.timeComplexity.worst}</span>
                </div>
                <div class="space-note">${info.timeComplexity.explanation}</div>
            </div>
        </div>
        <div class="info-card">
            <h3>Space Complexity</h3>
            <div class="complexity-item">
                <span class="complexity-label">Space Required:</span>
                <span class="complexity-value">${info.spaceComplexity.value}</span>
            </div>
            <div class="space-note">${info.spaceComplexity.explanation}</div>
        </div>
        <div class="info-card">
            <h3>Best Use Cases</h3>
            <ul class="use-cases-list">
                ${info.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
            </ul>
        </div>
    `;
    
    infoSection.classList.remove('hidden');
}

function updateAlgorithmInfo(algorithmName) {
    const info = algorithmInfo[algorithmName];
    const infoSection = document.getElementById('algorithm-info');
    
    // Update time complexity
    const timeComplexityDiv = document.getElementById('timeComplexity');
    timeComplexityDiv.innerHTML = `
        <div class="complexity-item">
            <span class="complexity-label">Best Case:</span>
            <span class="complexity-value">${info.timeComplexity.best}</span>
        </div>
        <div class="complexity-item">
            <span class="complexity-label">Average Case:</span>
            <span class="complexity-value">${info.timeComplexity.average}</span>
        </div>
        <div class="complexity-item">
            <span class="complexity-label">Worst Case:</span>
            <span class="complexity-value">${info.timeComplexity.worst}</span>
        </div>
        <div class="space-note">${info.timeComplexity.explanation}</div>
    `;
    
    // Update space complexity
    const spaceComplexityDiv = document.getElementById('spaceComplexity');
    spaceComplexityDiv.innerHTML = `
        <div class="complexity-item">
            <span class="complexity-label">Space Required:</span>
            <span class="complexity-value">${info.spaceComplexity.value}</span>
        </div>
        <div class="space-note">${info.spaceComplexity.explanation}</div>
    `;
    
    // Update use cases
    const useCasesDiv = document.getElementById('useCases');
    useCasesDiv.innerHTML = `
        <ul class="use-cases-list">
            ${info.useCases.map(useCase => `<li>${useCase}</li>`).join('')}
        </ul>
    `;
    
    infoSection.classList.remove('hidden');
    
    // Update code viewer if it's visible
    if (window.codeViewer && !document.getElementById('code-viewer').classList.contains('hidden')) {
        window.codeViewer.updateCodeView();
    }
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Update for single mode
    const algorithmSelect = document.getElementById('algorithmSelect');
    algorithmSelect.addEventListener('change', (e) => {
        updateSingleAlgorithmInfo(e.target.value);
    });
    
    // Initialize with first algorithm's info
    updateSingleAlgorithmInfo(algorithmSelect.value);
    
    // Keep the existing comparison mode listeners
    const algorithm1Select = document.getElementById('algorithm1');
    const algorithm2Select = document.getElementById('algorithm2');
    
    algorithm1Select.addEventListener('change', (e) => {
        updateAlgorithmInfo(e.target.value);
    });
    
    algorithm2Select.addEventListener('change', (e) => {
        updateAlgorithmInfo(e.target.value);
    });
});