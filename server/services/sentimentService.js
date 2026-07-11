const { spawn } = require("child_process");
const path = require("path");

const pythonExecutable = process.env.PYTHON_PATH || "python3";

const analyzeComments = (comments) => {
  return new Promise((resolve, reject) => {
    const pythonFile = path.join(__dirname, "../ml/inference/predict.py");

    const python = spawn(pythonExecutable, [pythonFile]);

    let stdout = "";
    let stderr = "";

    // -----------------------------
    // Collect Python Output
    // -----------------------------
    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    // -----------------------------
    // Collect Python Errors
    // -----------------------------
    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // -----------------------------
    // Send comments to Python
    // -----------------------------
    python.stdin.write(
      JSON.stringify({
        comments,
      }),
    );

    python.stdin.end();

    // -----------------------------
    // Python Finished
    // -----------------------------
    python.on("close", (code) => {
      console.log("\n========== PYTHON STDERR ==========");
      console.log(stderr);
      console.log("===================================\n");
      if (code !== 0) {
        return reject(new Error(stderr || `Python exited with code ${code}`));
      }

      try {
        const response = JSON.parse(stdout);

        if (!response.success) {
          return reject(new Error(response.error || "Prediction failed."));
        }

        resolve(response);
      } catch (err) {
        reject(new Error(`Invalid JSON returned from Python.\n${stdout}`));
      }
    });

    python.on("error", (err) => {
      reject(err);
    });
  });
};

module.exports = {
  analyzeComments,
};
