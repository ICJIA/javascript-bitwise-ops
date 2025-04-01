# JavaScript Bitwise Operations Demo

Interactive demonstration of JavaScript bitwise operations. It allows users to input a number, select a bitwise operation, and see the result in both decimal and binary formats. It also provides explanations and use cases for each operation.

Bitwise operations are fundamental in programming, especially in low-level programming, performance optimization, and algorithmic challenges.

## Features

- Interactive demonstration of bitwise operations
- Clear explanations of each operation
- Visual representation of binary numbers

## Bitwise Operations Demonstrated

This demo showcases the following operations:

- **Left Shift (<<):** Shifts all bits of the operand to the left by a specified number of positions. Effectively multiplies the number by 2 raised to the power of the shift amount.
  - Use Cases: Fast multiplication by powers of 2, bit field manipulation.
- **Sign-Propagating Right Shift (>>):** Shifts all bits of the operand to the right by a specified number of positions. The sign bit is preserved. Effectively divides the number by 2 raised to the power of the shift amount, while preserving the sign.
  - Use Cases: Fast division by powers of 2 (maintaining sign), sign extension.
- **Zero-Fill Right Shift (>>>):** Shifts all bits of the operand to the right by a specified number of positions. Zeros are shifted in from the left, regardless of the sign bit.
  - Use Cases: Logical right shift, ensuring a non-negative result.
- **Bitwise AND (&):** Performs a bitwise AND operation between two operands. The resulting bit is 1 only if both corresponding bits in the operands are 1.
  - Use Cases: Checking if a specific bit is set, masking bits.
- **Bitwise OR (|):** Performs a bitwise OR operation between two operands. The resulting bit is 1 if either of the corresponding bits in the operands is 1.
  - Use Cases: Setting specific bits, combining flags.
- **Bitwise XOR (^):** Performs a bitwise XOR (exclusive OR) operation between two operands. The resulting bit is 1 if the corresponding bits in the operands are different.
  - Use Cases: Toggling bits, simple encryption, detecting changes.
- **Bitwise NOT (~):** Inverts all the bits of the operand. Each 1 becomes 0, and each 0 becomes 1.
  - Use Cases: Creating masks, inverting logic.

## How to Use

1.  Enter an integer in the input field.
2.  Select a bitwise operation from the available buttons.
3.  The result will be displayed in both decimal and binary formats, along with an explanation of the operation.

## Project Structure

- `index.html`: Main HTML file
- `style.css`: CSS file for styling
- `script.js`: JavaScript file for logic
- `README.md`: This file
- `LICENSE`: Contains the MIT license information
- `.gitignore`: Specifies intentionally untracked files that Git should ignore
- `.nvmrc`: Specifies the Node.js version

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
