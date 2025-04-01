document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const numberInput = document.getElementById("numberInput");
  const binaryInputDisplay = document.getElementById("binaryInputDisplay");
  const controlsContainer = document.querySelector(".controls");
  const operationButtons = controlsContainer.querySelectorAll("button");
  const operandInputContainer = document.getElementById(
    "operandInputContainer"
  );
  const operandInput = document.getElementById("operandInput");
  const operandLabel = document.getElementById("operandLabel");
  const resultOperationDisplay = document.getElementById(
    "resultOperationDisplay"
  );
  const resultDecimalDisplay = document.getElementById("resultDecimalDisplay");
  const resultBinaryDisplay = document.getElementById("resultBinaryDisplay");
  const resultOriginalBinaryDisplay = document.getElementById(
    "resultOriginalBinaryDisplay"
  );
  const explanationTitle = document.getElementById("explanationTitle");
  const explanationText = document.getElementById("explanationText");
  const explanationUsecases = document.getElementById("explanationUsecases");
  const explanationCode = document.getElementById("explanationCode");
  const themeToggle = document.getElementById("themeToggle");

  // --- State ---
  let currentNumber = parseInt(numberInput.value, 10) || 0;
  let currentOperand = parseInt(operandInput.value, 10) || 0;
  let currentOperation = null; // Holds the operator string e.g., '<<'
  let currentActiveButton = null;

  // --- Operation Explanations ---
  const explanations = {
    "<<": {
      name: "Left Shift (<<)",
      description:
        "Shifts all bits of the first operand to the left by the number of positions specified by the second operand. New bits shifted in on the right are always zero. Effectively multiplies the number by 2 raised to the power of the shift amount (discarding bits shifted off the left).",
      usecases: "Fast multiplication by powers of 2, manipulating bitmasks.",
      codeSample: (a, b) =>
        `let num = ${a};\nlet shiftAmount = ${b};\nlet result = num << shiftAmount; // ${
          a << b
        }`,
    },
    ">>": {
      name: "Sign-Propagating Right Shift (>>)",
      description:
        "Shifts all bits of the first operand to the right by the number of positions specified by the second operand. Bits shifted off the right are discarded. Copies of the leftmost bit (the sign bit) are shifted in from the left, preserving the sign of the original number.",
      usecases:
        "Fast division by powers of 2 (maintaining sign), sign extension.",
      codeSample: (a, b) =>
        `let num = ${a};\nlet shiftAmount = ${b};\nlet result = num >> shiftAmount; // ${
          a >> b
        }`,
    },
    ">>>": {
      name: "Zero-Fill Right Shift (>>>)",
      description:
        "Shifts all bits of the first operand to the right by the number of positions specified by the second operand. Bits shifted off the right are discarded. Zeros are always shifted in from the left, regardless of the sign bit. The result is always non-negative.",
      usecases:
        "Working with bit patterns where sign is irrelevant, ensuring a non-negative result after shifting, common in hashing algorithms or graphics.",
      codeSample: (a, b) =>
        `let num = ${a};\nlet shiftAmount = ${b};\nlet result = num >>> shiftAmount; // ${
          a >>> b
        }`,
    },
    "&": {
      name: "Bitwise AND (&)",
      description:
        "Compares each bit of the first operand to the corresponding bit of the second operand. If both bits are 1, the corresponding result bit is set to 1. Otherwise, the result bit is set to 0.",
      usecases:
        "Checking if a specific bit (flag) is set, clearing specific bits (masking).",
      codeSample: (a, b) =>
        `let numA = ${a};\nlet numB = ${b};\nlet result = numA & numB; // ${
          a & b
        }`,
    },
    "|": {
      name: "Bitwise OR (|)",
      description:
        "Compares each bit of the first operand to the corresponding bit of the second operand. If either bit is 1, the corresponding result bit is set to 1. Otherwise, the result bit is set to 0.",
      usecases: "Setting specific bits (flags), combining permission flags.",
      codeSample: (a, b) =>
        `let numA = ${a};\nlet numB = ${b};\nlet result = numA | numB; // ${
          a | b
        }`,
    },
    "^": {
      name: "Bitwise XOR (^)",
      description:
        "Compares each bit of the first operand to the corresponding bit of the second operand. If the bits are different, the corresponding result bit is set to 1. If the bits are the same, the result bit is set to 0.",
      usecases:
        "Toggling specific bits (flags), simple encryption/hashing, swapping variables without a temporary variable.",
      codeSample: (a, b) =>
        `let numA = ${a};\nlet numB = ${b};\nlet result = numA ^ numB; // ${
          a ^ b
        }`,
    },
    "~": {
      name: "Bitwise NOT (~)",
      description:
        "Inverts all the bits of the operand. Each 1 becomes a 0, and each 0 becomes a 1. This is a unary operation (takes only one operand). Note that ~x is equivalent to -(x + 1).",
      usecases: "Creating bitmasks, inverting all flags.",
      codeSample: (a) => `let num = ${a};\nlet result = ~num; // ${~a}`,
    },
  };

  // --- Helper Functions ---
  function decToBinary32(dec) {
    // Use >>> 0 to treat the number as an unsigned 32-bit integer for binary conversion
    // This correctly handles negative numbers in two's complement format for display.
    return (dec >>> 0).toString(2).padStart(32, "0");
  }

  function createGraphicalBinary(binaryString) {
    const binaryGraphical = document.createElement("div");
    binaryGraphical.classList.add("binary-graphical");

    let bitCount = 0; // Counter for bits in the current group

    for (let i = 0; i < binaryString.length; i++) {
      // Add a separator before every 8 bits, except the first group
      if (bitCount === 0 && i !== 0) {
        const separator = document.createElement("div");
        separator.classList.add("separator");
        binaryGraphical.appendChild(separator);
      }

      const bit = document.createElement("div");
      bit.classList.add("bit");
      bit.textContent = binaryString[i];
      if (binaryString[i] === "1") {
        bit.classList.add("one");
      }
      binaryGraphical.appendChild(bit);

      bitCount++;

      if (bitCount === 8) {
        bitCount = 0; // Reset the counter for the next group
      }
    }
    return binaryGraphical;
  }

  function updateBinaryInputDisplay() {
    const binary = decToBinary32(currentNumber);
    const graphicalBinary = createGraphicalBinary(binary);

    // Clear previous content
    while (binaryInputDisplay.firstChild) {
      binaryInputDisplay.removeChild(binaryInputDisplay.firstChild);
    }

    binaryInputDisplay.appendChild(graphicalBinary);
  }

  function updateResultDisplay(op, operand, result) {
    let opString = "";
    if (op === "~") {
      opString = `${op} ${currentNumber}`;
    } else {
      opString = `${currentNumber} ${op} ${operand}`;
    }
    resultOperationDisplay.textContent = `Operation: ${opString}`;
    resultDecimalDisplay.textContent = result;

    // Create and display graphical binary representations
    const originalBinary = decToBinary32(currentNumber);
    const resultBinary = decToBinary32(result);

    const originalBinaryGraphical = createGraphicalBinary(originalBinary);
    const resultBinaryGraphical = createGraphicalBinary(resultBinary);

    // Clear previous content
    while (resultOriginalBinaryDisplay.firstChild) {
      resultOriginalBinaryDisplay.removeChild(
        resultOriginalBinaryDisplay.firstChild
      );
    }
    while (resultBinaryDisplay.firstChild) {
      resultBinaryDisplay.removeChild(resultBinaryDisplay.firstChild);
    }

    // Append the new graphical representations
    resultOriginalBinaryDisplay.appendChild(originalBinaryGraphical);
    resultBinaryDisplay.appendChild(resultBinaryGraphical);
  }

  function updateExplanation(op) {
    const details = explanations[op];
    if (details) {
      explanationTitle.textContent = details.name;
      explanationText.textContent = details.description;
      explanationUsecases.textContent = details.usecases;
      if (op === "~") {
        explanationCode.textContent = details.codeSample(currentNumber);
      } else {
        explanationCode.textContent = details.codeSample(
          currentNumber,
          currentOperand
        );
      }
    } else {
      explanationTitle.textContent = "Operation Details";
      explanationText.textContent = "Select an operation above.";
      explanationUsecases.textContent = "";
      explanationCode.textContent = "";
    }
  }

  function performOperation() {
    if (!currentOperation) return; // No operation selected

    let result;
    const num = currentNumber; // Use the current state
    const operand = currentOperand; // Use the current state

    switch (currentOperation) {
      case "<<":
        result = num << operand;
        break;
      case ">>":
        result = num >> operand;
        break;
      case ">>>":
        result = num >>> operand;
        break;
      case "&":
        result = num & operand;
        break;
      case "|":
        result = num | operand;
        break;
      case "^":
        result = num ^ operand;
        break;
      case "~":
        result = ~num;
        break; // Unary
      default:
        result = "N/A";
    }

    if (result !== "N/A") {
      updateResultDisplay(currentOperation, operand, result);
      updateExplanation(currentOperation); // Refresh explanation with current numbers
    }
  }

  function setActiveButton(button) {
    if (currentActiveButton) {
      currentActiveButton.classList.remove("active");
    }
    if (button) {
      button.classList.add("active");
      currentActiveButton = button;
    } else {
      currentActiveButton = null;
    }
  }

  function handleOperationButtonClick(event) {
    const button = event.target;
    const op = button.dataset.op;
    const operandType = button.dataset.operandType; // 'shift', 'logical', 'unary'

    currentOperation = op; // Set the current operation
    setActiveButton(button); // Highlight the button

    // Show/hide and label the second operand input
    if (operandType === "unary") {
      operandInputContainer.style.display = "none";
    } else {
      operandInputContainer.style.display = "block";
      if (operandType === "shift") {
        operandLabel.textContent = "Shift by:";
      } else {
        // logical
        operandLabel.textContent = "With:";
      }
      // Ensure currentOperand is up-to-date when showing the input
      currentOperand = parseInt(operandInput.value, 10) || 0;
    }

    // Perform the calculation immediately
    performOperation();
  }

  // --- Event Listeners ---
  numberInput.addEventListener("input", () => {
    currentNumber = parseInt(numberInput.value, 10);
    // Handle NaN case (e.g., empty input)
    if (isNaN(currentNumber)) {
      currentNumber = 0;
    }
    updateBinaryInputDisplay();
    // Recalculate if an operation is already selected
    if (currentOperation) {
      performOperation();
    }
  });

  operandInput.addEventListener("input", () => {
    currentOperand = parseInt(operandInput.value, 10);
    // Handle NaN or negative shift/operand values (often want non-negative)
    if (isNaN(currentOperand) || currentOperand < 0) {
      currentOperand = 0;
      operandInput.value = 0; // Correct input visually if invalid
    }
    // Recalculate if an operation is selected that uses the operand
    if (currentOperation && currentOperation !== "~") {
      performOperation();
    }
  });

  operationButtons.forEach((button) => {
    button.addEventListener("click", handleOperationButtonClick);
  });

  // --- Theme Toggler ---
  function applyTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-mode");
      themeToggle.textContent = "☀️"; // Sun icon for light mode
    } else {
      document.body.classList.remove("dark-mode");
      themeToggle.textContent = "🌓"; // Moon icon for dark mode
    }
  }

  themeToggle.addEventListener("click", () => {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    const newTheme = isDarkMode ? "dark" : "light";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // --- Initial Setup ---
  // Load saved theme or use system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);

  // Initial display updates
  updateBinaryInputDisplay();
  // Optionally select a default operation on load?
  // operationButtons[0].click(); // Example: Click the first button (Left Shift)
});
