import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { runCode, submitCode } from "../../services/compilerService";

const languageTemplates = {
  javascript: `function findLargest(numbers) {
  return Math.max(...numbers);
}

console.log(findLargest([10, 25, 7, 40, 18]));`,
  python: `def find_largest(numbers):
    return max(numbers)

print(find_largest([10, 25, 7, 40, 18]))`,
  java: `public class Main {
    public static int findLargest(int[] numbers) {
        int largest = numbers[0];
        for (int number : numbers) {
            if (number > largest) largest = number;
        }
        return largest;
    }

    public static void main(String[] args) {
        System.out.println(findLargest(new int[]{10, 25, 7, 40, 18}));
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int findLargest(int numbers[], int size) {
    int largest = numbers[0];
    for (int index = 1; index < size; index++) {
        if (numbers[index] > largest) largest = numbers[index];
    }
    return largest;
}

int main() {
    int numbers[] = {10, 25, 7, 40, 18};
    cout << findLargest(numbers, 5) << endl;
    return 0;
}`,
};

const languageNames = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

function Compiler() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languageTemplates.javascript);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateCode = () => {
    if (!code.trim()) return "Error: Code is missing. Add code in the editor, click Debug Code, then Run Code.";
    if (language === "javascript") {
      try {
        Function(`"use strict";${code}`);
      } catch (error) {
        return `Syntax error: ${error.message}\n\nFix the code in the editor and click Debug Code again.`;
      }
    }
    if (language === "java" && (!/class\s+Main\b/.test(code) || !/static\s+void\s+main\s*\(/.test(code))) {
      return "Error: Java code must contain class Main and public static void main(String[] args).\n\nFix the code in the editor and click Debug Code again.";
    }
    if (language === "cpp" && !/\bmain\s*\(/.test(code)) return "Error: C++ code must contain a main() function.\n\nFix the code in the editor and click Debug Code again.";
    if (language === "python" && !/[\w.)\]]/.test(code.trim())) return "Error: Python code is incomplete.\n\nFix the code in the editor and click Debug Code again.";
    return "Debug passed: no missing code or syntax errors found.";
  };

  const handleDebug = () => setOutput(validateCode());

  const runJavaScript = () => {
    const lines = [];
    const originalLog = console.log;
    console.log = (...values) => lines.push(values.map((value) => String(value)).join(" "));
    try {
      Function(`"use strict";${code}`)();
      setOutput(lines.join("\n") || "Code ran successfully with no output.");
    } catch (error) {
      setOutput(`Runtime error: ${error.message}\n\nFix the code in the editor and click Run Code again.`);
    } finally {
      console.log = originalLog;
    }
  };

  const handleRun = async () => {
    const validation = validateCode();
    if (validation.startsWith("Error") || validation.startsWith("Syntax error")) {
      setOutput(validation);
      return;
    }
    setRunning(true);
    if (language === "javascript") {
      runJavaScript();
      setRunning(false);
      return;
    }
    try {
      const { data } = await runCode({ language, code });
      setOutput(data.output || data.message || "Code ran successfully with no output.");
    } catch (error) {
      setOutput(`Compiler error: ${error.response?.data?.message || error.response?.data?.error || error.message}\n\nFix the code in the editor and click Run Code again.`);
    } finally {
      setRunning(false);
    }
  };

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(languageTemplates[nextLanguage]);
    setOutput("");
  };

  const handleSubmit = async () => {
    if (!code.trim()) { setOutput("Error: Code is missing."); return; }
    setSubmitting(true);
    try {
      await submitCode({ language, code, questionTitle: "Find Largest Number", output, status: "submitted" });
      setOutput((current) => `${current ? `${current}\n\n` : ""}Submission saved to your history.`);
    } catch (error) {
      setOutput(`Submission error: ${error.response?.data?.message || error.message}`);
    } finally { setSubmitting(false); }
  };

  return (
    <div className="page">
      <Navbar />
      <section className="page-heading">
        <div className="container">
          <h1>Online Code Practice</h1>
          <p>IntervueX career platform</p>
        </div>
      </section>
      <main className="section">
        <div className="container">

<div className="profile-grid">
  <div className="card">
    <h3>Choose Language</h3>
    <select className="form-control" value={language} onChange={handleLanguageChange} aria-label="Programming language"><option value="javascript">JavaScript</option><option value="python">Python</option><option value="java">Java</option><option value="cpp">C++</option></select>
    <h3 style={{marginTop:"20px"}}>Problem</h3>
    <p>Write a program to find the largest number in an array.</p>
    <p><strong>Input:</strong> [10, 25, 7, 40, 18]</p>
    <p><strong>Expected Output:</strong> 40</p>
  </div>
  <div className="card">
    <h3>{languageNames[language]} Code Editor</h3>
    <textarea className="code-box" value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" aria-label="Code editor" />
    <div className="hero-actions" style={{marginTop:"15px"}}><button className="button button-outline" type="button" onClick={handleDebug} disabled={running || submitting}>Debug Code</button><button className="button button-primary" type="button" onClick={handleRun} disabled={running || submitting}>{running ? "Running..." : "Run Code"}</button><button className="button button-outline" type="button" onClick={handleSubmit} disabled={running || submitting}>{submitting ? "Submitting..." : "Save Submission"}</button></div>
    <div className="code-output" role="status"><strong>Output</strong><pre>{output || "Run your code to see the output."}</pre></div>
  </div>
</div>

        </div>
      </main>

    </div>
  );
}
export default Compiler;
