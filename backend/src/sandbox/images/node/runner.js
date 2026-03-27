
const fs = require("fs");
const { execSync } = require("child_process");
const { json } = require("stream/consumers");


let responseObject = {
    passedCount: 0,
    failedCount: 0,
    totalCount: 0,
    passed: false,
    runtimeMs: 0,
    error: null
}
try {
    const testCases = JSON.parse(fs.readFileSync("testcases.json", "utf-8"));
    const userCode = fs.readFileSync("solution.js", "utf-8");

    let passed = true;
    let results = [];

    const start = Date.now()

    for (const key in testCases) {
        const { input, expectedOutput } = testCases[key];

        // parse input from db (input type is JSON string)
        const parsedInput = JSON.parse(input)
        // create temp execution file
        const wrappedCode = `
        ${userCode}
        const input = ${JSON.stringify(parsedInput)};
        const result = solution(input);
        console.log(JSON.stringify(result));
        `;

        fs.writeFileSync("temp_exec.js", wrappedCode);

        const output = execSync(`node temp_exec.js`, {timeout: 3000}).toString().trim();

        const testPassed = JSON.stringify(JSON.parse(output)) == JSON.stringify(JSON.parse(expectedOutput));

        if (!testPassed) passed = false;

        results.push({
            input,
            expectedOutput,
            actualOutput: output,
            passed: testPassed
        });
    }
    responseObject.runtimeMs  = Date.now() - start;
    results.forEach(r => {
        responseObject.totalCount++
        if(r.passed == true){
            responseObject.passedCount++
        }else if(r.passed == false){
            responseObject.failedCount++
        }
    })
    if(responseObject.totalCount === responseObject.passedCount){
        responseObject.passed = true
    }

    console.log(JSON.stringify(responseObject))
    
    

} catch (err) {
    responseObject.error = err.message
    console.log(JSON.stringify(responseObject))
    
}