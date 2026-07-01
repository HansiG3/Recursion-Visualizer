# 🌳 Recursion Visualizer

An interactive tool that helps users understand recursion by automatically generating a recursion tree from C++ recursive programs. The project parses source code, instruments recursive functions, records execution traces, and visualizes the complete recursion tree with function calls and return values.

---

## ✨ Features

- 🔍 Parses C++ source code using **Tree-sitter**
- ⚙️ Automatically instruments recursive functions
- 📊 Captures:
  - Function calls
  - Function arguments
  - Return values
  - Parent-child call relationships
- 🌲 Generates an interactive recursion tree
- 🎯 Helps visualize recursive execution step-by-step
- 🧠 Useful for learning, debugging, and teaching recursion

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js
- **Parser:** Tree-sitter (C++)
- **Language:** C++
- **Visualization:** JavaScript Tree Renderer

---

## 📂 Project Structure

```
Recursion-Visualizer/
│
├── parser/              # Parses C++ code using Tree-sitter
├── instrument/          # Instruments recursive functions
├── runtime/             # Runtime tracing utilities
├── visualizer/          # Builds recursion tree visualization
├── examples/            # Sample recursive programs
├── trace.hpp            # Tracing helper functions
├── app.js
├── package.json
└── README.md
```

---

## ⚙️ How It Works

```
        C++ Source Code
               │
               ▼
      Tree-sitter Parser
               │
               ▼
      Abstract Syntax Tree
               │
               ▼
      Automatic Instrumentation
               │
               ▼
      Compile & Execute
               │
               ▼
       Execution Trace
               │
               ▼
     Interactive Recursion Tree
```

---

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/HansiG3/Recursion-Visualizer.git
cd Recursion-Visualizer
```

### Install dependencies

```bash
npm install
```

---

## ▶️ Usage

1. Add your recursive C++ program.
2. Run the instrumenter.

```bash
node app.js
```

3. Compile the generated C++ file.

```bash
g++ instrumented.cpp -o output
```

4. Execute the program.

```bash
./output
```

5. Open the generated visualization in your browser.

---

## 📖 Example

### Input

```cpp
int fact(int n)
{
    if(n == 1)
        return 1;

    return n * fact(n - 1);
}
```

### Generated Recursion Tree

```
fact(4)
│
├── fact(3)
│   ├── fact(2)
│   │   ├── fact(1)
│   │   └── returns 1
│   └── returns 2
└── returns 24
```

---

## 🎯 Applications

- Learning recursion
- Debugging recursive algorithms
- Competitive programming
- Data Structures & Algorithms education
- Understanding recursion trees

---


## 🔮 Future Enhancements

- Support for mutual recursion
- Support for multiple recursive functions
- Animated recursion execution
- Export visualization as PNG/PDF
- Step-by-step execution controls
- Support for Python and Java

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature-name
```

3. Commit your changes

```bash
git commit -m "Add feature"
```

4. Push to your branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Hansi Gupta**

- GitHub: https://github.com/HansiG3
- LinkedIn: *(Add your LinkedIn profile here)*
