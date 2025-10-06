"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Slide } from "../../animation/Slide";

interface ArrayElement {
  value: number;
  index: number;
  state: 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'current';
}

interface AlgorithmStep {
  array: ArrayElement[];
  description: string;
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  pivot?: number;
  current?: number;
}

type SortingAlgorithm = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';
type PathfindingAlgorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs';
type VisualizationType = 'sorting' | 'pathfinding' | 'tree' | 'graph';

interface AlgorithmInfo {
  name: string;
  timeComplexity: string;
  spaceComplexity: string;
  description: string;
  bestCase: string;
  worstCase: string;
}

const ALGORITHM_INFO: Record<SortingAlgorithm, AlgorithmInfo> = {
  bubble: {
    name: "Bubble Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
    bestCase: "O(n)",
    worstCase: "O(n²)"
  },
  selection: {
    name: "Selection Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Finds the minimum element and places it at the beginning. Repeats for the remaining unsorted portion.",
    bestCase: "O(n²)",
    worstCase: "O(n²)"
  },
  insertion: {
    name: "Insertion Sort",
    timeComplexity: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Builds the final sorted array one item at a time by inserting each element into its correct position.",
    bestCase: "O(n)",
    worstCase: "O(n²)"
  },
  merge: {
    name: "Merge Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "Divides the array into halves, sorts them separately, then merges the sorted halves.",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)"
  },
  quick: {
    name: "Quick Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    description: "Selects a pivot element and partitions the array around it, then recursively sorts the sub-arrays.",
    bestCase: "O(n log n)",
    worstCase: "O(n²)"
  },
  heap: {
    name: "Heap Sort",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    description: "Builds a max heap from the array, then repeatedly extracts the maximum element.",
    bestCase: "O(n log n)",
    worstCase: "O(n log n)"
  }
};

// Pathfinding grid cell
interface GridCell {
  x: number;
  y: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isPath: boolean;
  isVisited: boolean;
  distance: number;
  previous?: GridCell;
}

export default function AlgorithmVisualizer() {
  // State management
  const [activeTab, setActiveTab] = useState<VisualizationType>('sorting');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  
  // Generate random array
  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 10,
        index: i,
        state: 'default'
      });
    }
    return newArray;
  }, [arraySize]);

  const [array, setArray] = useState<ArrayElement[]>(() => generateArray());

  // Sorting Algorithms Implementation
  const bubbleSort = (arr: ArrayElement[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Compare step
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            state: idx === j || idx === j + 1 ? 'comparing' : 
                   idx >= n - i ? 'sorted' : 'default'
          })),
          description: `Comparing elements at positions ${j} and ${j + 1}`,
          comparing: [j, j + 1]
        });

        if (workingArray[j].value > workingArray[j + 1].value) {
          // Swap step
          [workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]];
          steps.push({
            array: workingArray.map((el, idx) => ({
              ...el,
              state: idx === j || idx === j + 1 ? 'swapping' : 
                     idx >= n - i ? 'sorted' : 'default'
            })),
            description: `Swapping elements ${workingArray[j + 1].value} and ${workingArray[j].value}`,
            swapping: [j, j + 1]
          });
        }
      }
      
      // Mark element as sorted
      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          state: idx >= n - i - 1 ? 'sorted' : 'default'
        })),
        description: `Element ${workingArray[n - i - 1].value} is in its final position`,
        sorted: [n - i - 1]
      });
    }

    // Final step - all sorted
    steps.push({
      array: workingArray.map(el => ({ ...el, state: 'sorted' })),
      description: "Array is completely sorted!",
      sorted: workingArray.map((_, idx) => idx)
    });

    return steps;
  };

  const selectionSort = (arr: ArrayElement[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      
      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          state: idx < i ? 'sorted' : idx === i ? 'current' : 'default'
        })),
        description: `Finding minimum element in unsorted portion (starting from position ${i})`,
        current: i
      });

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            state: idx < i ? 'sorted' : 
                   idx === minIdx ? 'pivot' : 
                   idx === j ? 'comparing' : 'default'
          })),
          description: `Comparing element at position ${j} with current minimum at position ${minIdx}`,
          comparing: [j, minIdx]
        });

        if (workingArray[j].value < workingArray[minIdx].value) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        [workingArray[i], workingArray[minIdx]] = [workingArray[minIdx], workingArray[i]];
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            state: idx <= i ? 'sorted' : 'default'
          })),
          description: `Swapping minimum element ${workingArray[i].value} to position ${i}`,
          swapping: [i, minIdx]
        });
      }
    }

    steps.push({
      array: workingArray.map(el => ({ ...el, state: 'sorted' })),
      description: "Array is completely sorted!",
      sorted: workingArray.map((_, idx) => idx)
    });

    return steps;
  };

  const insertionSort = (arr: ArrayElement[]): AlgorithmStep[] => {
    const steps: AlgorithmStep[] = [];
    const workingArray = [...arr];
    const n = workingArray.length;

    for (let i = 1; i < n; i++) {
      const key = workingArray[i];
      let j = i - 1;

      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          state: idx < i ? 'sorted' : idx === i ? 'current' : 'default'
        })),
        description: `Inserting element ${key.value} into sorted portion`,
        current: i
      });

      while (j >= 0 && workingArray[j].value > key.value) {
        steps.push({
          array: workingArray.map((el, idx) => ({
            ...el,
            state: idx <= i ? (idx === j || idx === j + 1 ? 'comparing' : 'sorted') : 'default'
          })),
          description: `Moving element ${workingArray[j].value} one position right`,
          comparing: [j, j + 1]
        });

        workingArray[j + 1] = workingArray[j];
        j--;
      }
      
      workingArray[j + 1] = key;
      
      steps.push({
        array: workingArray.map((el, idx) => ({
          ...el,
          state: idx <= i ? 'sorted' : 'default'
        })),
        description: `Element ${key.value} placed in correct position`,
        sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
      });
    }

    steps.push({
      array: workingArray.map(el => ({ ...el, state: 'sorted' })),
      description: "Array is completely sorted!",
      sorted: workingArray.map((_, idx) => idx)
    });

    return steps;
  };

  // Get sorting steps based on algorithm
  const getSortingSteps = useCallback((algorithm: SortingAlgorithm, arr: ArrayElement[]) => {
    switch (algorithm) {
      case 'bubble':
        return bubbleSort(arr);
      case 'selection':
        return selectionSort(arr);
      case 'insertion':
        return insertionSort(arr);
      case 'merge':
        // Simplified merge sort for demo
        return bubbleSort(arr); // TODO: Implement full merge sort
      case 'quick':
        // Simplified quick sort for demo
        return bubbleSort(arr); // TODO: Implement full quick sort
      case 'heap':
        // Simplified heap sort for demo
        return bubbleSort(arr); // TODO: Implement full heap sort
      default:
        return [];
    }
  }, []);

  // Animation control
  const runAlgorithm = useCallback(async () => {
    setIsRunning(true);
    setIsPaused(false);
    setCurrentStep(0);
    
    const algorithmSteps = getSortingSteps(selectedAlgorithm, array);
    setSteps(algorithmSteps);
    
    for (let i = 0; i < algorithmSteps.length; i++) {
      if (!isRunning) break;
      
      setCurrentStep(i);
      setArray(algorithmSteps[i].array);
      
      await new Promise(resolve => setTimeout(resolve, 1100 - speed * 10));
    }
    
    setIsRunning(false);
  }, [array, selectedAlgorithm, speed, getSortingSteps, isRunning]);

  const resetArray = useCallback(() => {
    setArray(generateArray());
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [generateArray]);

  // Generate new array when size changes
  useEffect(() => {
    resetArray();
  }, [arraySize, resetArray]);

  // Get color for array elements based on state
  const getElementColor = (state: ArrayElement['state']) => {
    switch (state) {
      case 'comparing':
        return 'bg-yellow-500';
      case 'swapping':
        return 'bg-red-500';
      case 'sorted':
        return 'bg-green-500';
      case 'pivot':
        return 'bg-purple-500';
      case 'current':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400 dark:bg-gray-600';
    }
  };

  const currentAlgorithmInfo = ALGORITHM_INFO[selectedAlgorithm];

  return (
    <section id="algorithm-section" className="mt-32 max-w-7xl">
      <Slide delay={0.17}>
        <div className="mb-8">
          <h2 className="text-4xl mb-4 font-bold tracking-tight">
            Algorithm Visualizer
          </h2>
          <p className="dark:text-zinc-400 text-zinc-600 max-w-4xl">
            Interactive demonstrations of fundamental algorithms and data structures. 
            Watch sorting algorithms in action, explore pathfinding techniques, and understand algorithm complexity.
          </p>
        </div>
      </Slide>

      {/* Tab Navigation */}
      <Slide delay={0.25}>
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            {[
              { id: 'sorting', label: 'Sorting Algorithms', icon: '📊' },
              { id: 'pathfinding', label: 'Pathfinding', icon: '🗺️' },
              { id: 'tree', label: 'Tree Structures', icon: '🌳' },
              { id: 'graph', label: 'Graph Theory', icon: '🕸️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as VisualizationType)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-color text-white'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Slide>

      {/* Sorting Algorithms Tab */}
      {activeTab === 'sorting' && (
        <div className="space-y-6">
          {/* Controls */}
          <Slide delay={0.35}>
            <div className="grid lg:grid-cols-2 gap-6 mb-6">
              {/* Algorithm Selection & Controls */}
              <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  Algorithm Controls
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Algorithm
                    </label>
                    <select
                      value={selectedAlgorithm}
                      onChange={(e) => setSelectedAlgorithm(e.target.value as SortingAlgorithm)}
                      disabled={isRunning}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                    >
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                      <option value="insertion">Insertion Sort</option>
                      <option value="merge">Merge Sort (Coming Soon)</option>
                      <option value="quick">Quick Sort (Coming Soon)</option>
                      <option value="heap">Heap Sort (Coming Soon)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Array Size: {arraySize}
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={arraySize}
                      onChange={(e) => setArraySize(Number(e.target.value))}
                      disabled={isRunning}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                      Speed: {speed}%
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={runAlgorithm}
                      disabled={isRunning}
                      className="flex-1 bg-primary-color text-white py-2 px-4 rounded-md hover:bg-secondary-color disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isRunning ? '🔄 Running...' : '▶️ Start'}
                    </button>
                    
                    <button
                      onClick={resetArray}
                      disabled={isRunning}
                      className="flex-1 bg-zinc-500 text-white py-2 px-4 rounded-md hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      🔄 Reset
                    </button>
                  </div>
                </div>
              </div>

              {/* Algorithm Information */}
              <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                  {currentAlgorithmInfo.name}
                </h3>
                
                <div className="space-y-3 text-sm">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {currentAlgorithmInfo.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Time Complexity:</span>
                      <br />
                      <span className="text-orange-600 dark:text-orange-400 font-mono">
                        {currentAlgorithmInfo.timeComplexity}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Space Complexity:</span>
                      <br />
                      <span className="text-blue-600 dark:text-blue-400 font-mono">
                        {currentAlgorithmInfo.spaceComplexity}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Best Case:</span>
                      <br />
                      <span className="text-green-600 dark:text-green-400 font-mono">
                        {currentAlgorithmInfo.bestCase}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-900 dark:text-zinc-100">Worst Case:</span>
                      <br />
                      <span className="text-red-600 dark:text-red-400 font-mono">
                        {currentAlgorithmInfo.worstCase}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Slide>

          {/* Visualization */}
          <Slide delay={0.45}>
            <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  Visualization
                </h3>
                
                {steps.length > 0 && (
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Step {currentStep + 1} of {steps.length}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-4 mb-6 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 dark:bg-gray-600 rounded"></div>
                  <span>Default</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Swapping</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>Pivot</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Sorted</span>
                </div>
              </div>

              {/* Array Visualization */}
              <div className="mb-4" style={{ height: '320px' }}>
                <div className="flex items-end justify-center h-full gap-1 overflow-x-auto pb-4">
                  {array.map((element, index) => (
                    <div
                      key={`${element.index}-${element.value}`}
                      className={`flex-shrink-0 transition-all duration-300 ${getElementColor(element.state)} rounded-t-md relative`}
                      style={{
                        height: `${element.value}px`,
                        width: Math.max(20, 400 / arraySize),
                        minWidth: '8px'
                      }}
                    >
                      {arraySize <= 20 && (
                        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-zinc-600 dark:text-zinc-400">
                          {element.value}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Step Description */}
              {steps.length > 0 && (
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-md">
                  <p className="text-sm text-zinc-700 dark:text-zinc-300">
                    <span className="font-semibold">Step {currentStep + 1}:</span> {steps[currentStep]?.description}
                  </p>
                </div>
              )}
            </div>
          </Slide>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'sorting' && (
        <Slide delay={0.35}>
          <div className="dark:bg-primary-bg bg-white border dark:border-zinc-800 border-zinc-200 rounded-lg p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
              Coming Soon
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              {activeTab === 'pathfinding' && "Interactive pathfinding algorithms including Dijkstra, A*, BFS, and DFS"}
              {activeTab === 'tree' && "Binary trees, AVL trees, red-black trees, and tree traversal algorithms"}
              {activeTab === 'graph' && "Graph representation, topological sorting, and network analysis algorithms"}
            </p>
            <div className="text-6xl mb-4">
              {activeTab === 'pathfinding' && "🗺️"}
              {activeTab === 'tree' && "🌳"}
              {activeTab === 'graph' && "🕸️"}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              These advanced visualizations are currently in development and will showcase complex algorithm implementations.
            </p>
          </div>
        </Slide>
      )}
    </section>
  );
}