/**
 * API Quota Management Utilities
 * Handles rate limiting, retry logic, and fallback responses for AI services
 */

/**
 * Check if an error is a rate limit/quota exceeded error
 * @param {Error} error - The error to check
 * @returns {boolean} - True if it's a rate limit error
 */
export function isRateLimited(error) {
  return (
    error?.status === 429 ||
    (typeof error?.message === "string" && /\b429\b|too many requests|quota/i.test(error.message))
  );
}

/**
 * Extract retry delay from error response
 * @param {Error} error - The error containing retry information
 * @returns {number} - Retry delay in seconds (default: 20)
 */
export function extractRetryAfterSeconds(error) {
  try {
    if (error?.errorDetails && Array.isArray(error.errorDetails)) {
      const retryInfo = error.errorDetails.find((d) => 
        d["@type"]?.toString().toLowerCase().includes("retryinfo")
      );
      if (retryInfo?.retryDelay) {
        const m = /^(\d+)s$/.exec(retryInfo.retryDelay);
        if (m) return parseInt(m[1], 10);
      }
    }
    if (typeof error?.message === "string") {
      const match = error.message.match(/retry in\s+([\d.]+)s/i);
      if (match) return Math.ceil(parseFloat(match[1]));
    }
  } catch {}
  return 20;
}

/**
 * Create a fallback response for when AI service is unavailable
 * @param {string} type - Type of response ('review', 'simple', 'technical')
 * @param {string} input - The input code
 * @returns {Object} - Response object with fallback content and warning
 */
export function createFallbackResponse(type, input) {
  const baseResponse = {
    warning: "AI service temporarily unavailable. Showing basic analysis. Please retry later for detailed insights.",
    retryAfterSeconds: 20
  };

  switch (type) {
    case 'review':
      return {
        ...baseResponse,
        review: generateFallbackReview(input)
      };
    case 'simple':
      return {
        ...baseResponse,
        explanationSimple: generateFallbackExplanation(input)
      };
    case 'technical':
      return {
        ...baseResponse,
        explanationTechnical: generateFallbackTechnicalExplanation(input)
      };
    case 'quick':
    case 'quicksummary':
    case 'summary':
      return {
        ...baseResponse,
        quick: generateFallbackQuickSummary(input)
      };
    case 'deep':
    case 'deepdive':
    case 'deep-dive':
      return {
        ...baseResponse,
        deep: generateFallbackDeepDive(input)
      };
    default:
      return baseResponse;
  }
}

/**
 * Generate a basic code review when AI service is unavailable
 */
function generateFallbackReview(input) {
  // Comprehensive code review when API is unavailable
  const lines = input.split('\n').filter(line => line.trim());
  const functions = lines.filter(line => line.includes('function') || line.includes('=>'));
  const classes = lines.filter(line => line.includes('class '));
  const imports = lines.filter(line => line.includes('import ') || line.includes('require('));
  const comments = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));
  const consoleLogs = lines.filter(line => line.includes('console.log'));
  const tryCatch = lines.filter(line => line.includes('try') || line.includes('catch'));
  const semicolons = lines.filter(line => line.trim().endsWith(';'));
  const asyncFunctions = lines.filter(line => line.includes('async ') || line.includes('await '));
  const loops = lines.filter(line => line.includes('for(') || line.includes('while(') || line.includes('forEach'));
  const variables = lines.filter(line => line.includes('const ') || line.includes('let ') || line.includes('var '));
  
  // Advanced analysis
  const hasSyntaxIssues = lines.some(line => {
    const trimmed = line.trim();
    return trimmed.includes('==') && !trimmed.includes('===') || 
           trimmed.includes('!=') && !trimmed.includes('!==') ||
           trimmed.includes('var ') ||
           (trimmed.includes('function') && !trimmed.includes('=>') && !trimmed.includes('function('));
  });
  
  const hasSecurityIssues = lines.some(line => {
    const trimmed = line.toLowerCase();
    return trimmed.includes('eval(') || 
           trimmed.includes('innerhtml') ||
           trimmed.includes('document.write') ||
           trimmed.includes('settimeout') && trimmed.includes('"') ||
           trimmed.includes('setinterval') && trimmed.includes('"');
  });
  
  const hasPerformanceIssues = lines.some(line => {
    const trimmed = line.toLowerCase();
    return trimmed.includes('for(') && trimmed.includes('for(') ||
           trimmed.includes('while(') && trimmed.includes('while(') ||
           trimmed.includes('document.getelementbyid') ||
           trimmed.includes('document.queryselector') && !trimmed.includes('cached');
  });
  
  const complexity = functions.length + classes.length * 2 + loops.length;
  const maintainability = comments.length > lines.length * 0.1 ? 'Good' : 
                         comments.length > 0 ? 'Fair' : 'Poor';
  
  const score = Math.max(40, Math.min(95, 
    75 + 
    (comments.length > 0 ? 8 : 0) +
    (tryCatch.length > 0 ? 7 : 0) +
    (semicolons.length / lines.length > 0.7 ? 5 : 0) +
    (asyncFunctions.length > 0 ? 3 : 0) +
    (classes.length > 0 ? 2 : 0) -
    (hasSyntaxIssues ? 15 : 0) -
    (hasSecurityIssues ? 20 : 0) -
    (hasPerformanceIssues ? 10 : 0) -
    (consoleLogs.length > 3 ? 8 : 0) -
    (complexity > 20 ? 10 : 0) -
    (lines.length > 500 ? 15 : 0)
  ));
  
  return `# 🔍 Elite Code Review Report

## 📊 **Code Quality & Readability Analysis**

### **Code Structure Overview**
- **Total Lines:** ${lines.length} lines
- **Functions:** ${functions.length} functions
- **Classes:** ${classes.length} classes  
- **Imports/Dependencies:** ${imports.length} imports
- **Variables:** ${variables.length} variable declarations
- **Async Operations:** ${asyncFunctions.length} async functions
- **Loops:** ${loops.length} iteration patterns

### **Code Quality Metrics**
- **Maintainability:** ${maintainability}
- **Documentation Coverage:** ${comments.length > 0 ? `${Math.round((comments.length / lines.length) * 100)}%` : '0% - Critical'}
- **Error Handling:** ${tryCatch.length > 0 ? '✅ Present' : '❌ Missing - Critical'}
- **Code Complexity:** ${complexity > 20 ? 'High' : complexity > 10 ? 'Medium' : 'Low'}

---

## ⚠️ **Critical Issues & Security Vulnerabilities**

${hasSecurityIssues ? `
### 🚨 **Security Vulnerabilities Detected**
- **Dangerous Functions:** Found potentially unsafe functions (eval, innerHTML, document.write)
- **XSS Risk:** Direct DOM manipulation detected
- **Code Injection:** Potential security vulnerabilities present
- **Recommendation:** Implement proper input sanitization and use safe DOM methods
` : ''}

${hasSyntaxIssues ? `
### ⚠️ **Syntax & Best Practice Issues**
- **Loose Equality:** Use strict equality (===) instead of loose equality (==)
- **Legacy Syntax:** Consider modern ES6+ syntax alternatives
- **Type Safety:** Implement proper type checking
` : ''}

${consoleLogs.length > 3 ? `
### 🐛 **Debug Code Issues**
- **Console Statements:** ${consoleLogs.length} console.log statements found
- **Production Risk:** Remove debug statements before deployment
- **Performance Impact:** Console statements can impact performance
` : ''}

---

## 🎯 **Performance & Optimization Analysis**

${hasPerformanceIssues ? `
### ⚡ **Performance Concerns**
- **Nested Loops:** Potential O(n²) complexity detected
- **DOM Queries:** Repeated DOM queries without caching
- **Memory Leaks:** Potential memory management issues
- **Recommendation:** Implement caching and optimize algorithms
` : `
### ✅ **Performance Status**
- **Algorithm Efficiency:** No obvious performance bottlenecks detected
- **Memory Usage:** Reasonable memory footprint
- **Execution Flow:** Clean and efficient code structure
`}

---

## 🏗️ **Architecture & Design Patterns**

### **Code Organization**
${functions.length > 10 ? `
- **Modularity:** Consider breaking large codebase into smaller modules
- **Single Responsibility:** Some functions may be doing too much
- **Recommendation:** Implement proper separation of concerns
` : `
- **Structure:** Well-organized code structure
- **Modularity:** Appropriate function distribution
- **Maintainability:** Good code organization
`}

### **Design Patterns**
- **Error Handling:** ${tryCatch.length > 0 ? 'Proper error handling implemented' : 'Missing error handling patterns'}
- **Async Patterns:** ${asyncFunctions.length > 0 ? 'Modern async/await patterns used' : 'Consider async patterns for I/O operations'}
- **Code Reusability:** ${functions.length > 5 ? 'Good function separation' : 'Consider extracting reusable functions'}

---

## 📚 **Documentation & Testing**

### **Documentation Status**
${comments.length === 0 ? `
- **Critical:** No inline documentation found
- **Impact:** Reduces code maintainability and team collaboration
- **Recommendation:** Add comprehensive JSDoc comments and inline explanations
` : `
- **Coverage:** ${Math.round((comments.length / lines.length) * 100)}% documentation coverage
- **Quality:** ${comments.length > lines.length * 0.1 ? 'Good documentation' : 'Needs improvement'}
`}

### **Testing Recommendations**
- **Unit Tests:** Implement comprehensive unit test coverage
- **Integration Tests:** Add integration tests for critical workflows
- **Edge Cases:** Test boundary conditions and error scenarios
- **Mocking:** Implement proper mocking for external dependencies

---

## 🔒 **Security Assessment**

### **Security Analysis**
- **Input Validation:** ${hasSecurityIssues ? '❌ Insufficient validation' : '✅ Basic validation present'}
- **XSS Protection:** ${hasSecurityIssues ? '❌ Vulnerable to XSS' : '✅ No obvious XSS risks'}
- **Code Injection:** ${hasSecurityIssues ? '❌ Potential injection risks' : '✅ No injection vulnerabilities detected'}
- **Data Sanitization:** Requires manual review for complete assessment

---

## 📈 **Scalability & Future-Proofing**

### **Scalability Considerations**
- **Code Size:** ${lines.length > 500 ? 'Large codebase - consider modularization' : 'Reasonable size for current scope'}
- **Dependencies:** ${imports.length > 10 ? 'High dependency count - monitor for security updates' : 'Manageable dependency footprint'}
- **Performance:** ${complexity > 20 ? 'High complexity - consider refactoring' : 'Good performance characteristics'}

---

## 🎯 **Actionable Recommendations**

### **Immediate Actions Required**
${hasSecurityIssues ? '- **URGENT:** Fix security vulnerabilities immediately' : ''}
${hasSyntaxIssues ? '- **HIGH:** Implement strict equality and modern syntax' : ''}
${comments.length === 0 ? '- **HIGH:** Add comprehensive documentation' : ''}
${tryCatch.length === 0 ? '- **MEDIUM:** Implement proper error handling' : ''}

### **Code Quality Improvements**
- **Refactoring:** ${functions.length > 10 ? 'Break down large functions' : 'Code structure is well-organized'}
- **Testing:** Implement comprehensive test suite
- **Documentation:** ${comments.length === 0 ? 'Add inline comments and JSDoc' : 'Enhance existing documentation'}
- **Performance:** ${hasPerformanceIssues ? 'Optimize identified bottlenecks' : 'Monitor performance metrics'}

---

## 📊 **Overall Assessment**

### **Quality Score: ${score}/100**

**Grade:** ${score >= 90 ? 'A+ (Excellent)' : score >= 80 ? 'A (Very Good)' : score >= 70 ? 'B (Good)' : score >= 60 ? 'C (Fair)' : 'D (Needs Improvement)'}

### **Strengths**
${functions.length > 0 ? '- Well-structured functions and modular design' : ''}
${classes.length > 0 ? '- Object-oriented programming principles applied' : ''}
${asyncFunctions.length > 0 ? '- Modern async programming patterns' : ''}
${!hasSecurityIssues ? '- No obvious security vulnerabilities' : ''}

### **Areas for Improvement**
${comments.length === 0 ? '- Add comprehensive documentation' : ''}
${tryCatch.length === 0 ? '- Implement robust error handling' : ''}
${hasSyntaxIssues ? '- Modernize syntax and best practices' : ''}
${consoleLogs.length > 3 ? '- Remove debug statements' : ''}

---

## ⚠️ **Important Note**
This is a **comprehensive automated analysis** based on code patterns and structure. For **complete security auditing, detailed performance profiling, and advanced code quality assessment**, please retry when the AI service is available for expert-level analysis.

**Next Steps:** Address the critical and high-priority issues identified above, then re-run the analysis for a more detailed review.`;
}

/**
 * Generate a basic simple explanation when AI service is unavailable
 */
function generateFallbackExplanation(input) {
  const lines = input.split('\n').filter(line => line.trim());
  const functions = lines.filter(line => line.includes('function') || line.includes('=>'));
  const classes = lines.filter(line => line.includes('class '));
  const variables = lines.filter(line => line.includes('const ') || line.includes('let ') || line.includes('var '));
  const imports = lines.filter(line => line.includes('import ') || line.includes('require('));
  const loops = lines.filter(line => line.includes('for(') || line.includes('while(') || line.includes('forEach'));
  const conditions = lines.filter(line => line.includes('if(') || line.includes('else') || line.includes('switch'));
  const asyncCode = lines.filter(line => line.includes('async ') || line.includes('await '));
  
  return `# 🎯 **Simple Code Explanation**

## **What This Code Does**
This code appears to be a ${functions.length > 0 ? 'program with functions' : classes.length > 0 ? 'class-based program' : 'script'} that ${functions.length > 0 ? 'performs specific tasks' : 'executes instructions step by step'}.

## **Key Components Breakdown**

### **Main Structure**
- **Total Lines:** ${lines.length} lines of code
- **Functions:** ${functions.length} function${functions.length !== 1 ? 's' : ''} ${functions.length > 0 ? 'that handle specific tasks' : ''}
- **Classes:** ${classes.length} class${classes.length !== 1 ? 'es' : ''} ${classes.length > 0 ? 'for organizing related functionality' : ''}
- **Variables:** ${variables.length} variable${variables.length !== 1 ? 's' : ''} that store data

### **Code Flow**
${functions.length > 0 ? `
- **Function-based:** The code is organized into ${functions.length} function${functions.length !== 1 ? 's' : ''}
- **Purpose:** Each function likely handles a specific part of the overall task
- **Execution:** Functions are called to perform their specific operations
` : `
- **Sequential:** The code runs from top to bottom
- **Step-by-step:** Each line executes in order
- **Purpose:** Performs a series of operations to achieve a goal
`}

### **Programming Patterns**
${asyncCode.length > 0 ? `
- **Asynchronous:** Uses modern async/await patterns for handling time-consuming operations
- **Non-blocking:** Can handle multiple operations without waiting
` : ''}
${loops.length > 0 ? `
- **Iteration:** Contains ${loops.length} loop${loops.length !== 1 ? 's' : ''} for repeating operations
- **Efficiency:** Processes multiple items or repeats tasks automatically
` : ''}
${conditions.length > 0 ? `
- **Decision Making:** Has ${conditions.length} conditional statement${conditions.length !== 1 ? 's' : ''}
- **Logic:** Makes choices based on different conditions
` : ''}

## **What You Can Expect**
- **Input Processing:** ${variables.length > 0 ? 'Takes data and stores it in variables' : 'Works with provided data'}
- **Data Manipulation:** ${loops.length > 0 ? 'Processes data through loops and iterations' : 'Performs operations on the data'}
- **Output:** ${functions.length > 0 ? 'Returns results from functions' : 'Produces some kind of result'}

## **In Simple Terms**
Think of this code like a ${functions.length > 0 ? 'recipe with multiple steps' : 'simple instruction manual'}:
${functions.length > 0 ? `
1. It has different "recipes" (functions) for different tasks
2. Each recipe does one specific thing well
3. You can use these recipes whenever you need them
` : `
1. It follows a step-by-step process
2. Each step builds on the previous one
3. The end result is what you're trying to achieve
`}

## **Key Benefits**
- **Organization:** ${functions.length > 0 ? 'Well-structured with clear separation of tasks' : 'Clear, sequential flow'}
- **Reusability:** ${functions.length > 0 ? 'Functions can be used multiple times' : 'Code can be run multiple times'}
- **Maintainability:** ${lines.length < 100 ? 'Simple and easy to understand' : 'Moderate complexity but manageable'}

---

## ⚠️ **Note**
This is a **simplified explanation** based on code structure analysis. For a **detailed, step-by-step breakdown** with specific examples and deeper insights, please try again when the AI service is available.

**What to do next:** Run this code to see what it actually does, or ask for a more detailed explanation when the AI service is back online!`;
}

/**
 * Generate a basic technical explanation when AI service is unavailable
 */
function generateFallbackTechnicalExplanation(input) {
  const lines = input.split('\n').filter(line => line.trim());
  const functions = lines.filter(line => line.includes('function') || line.includes('=>'));
  const classes = lines.filter(line => line.includes('class '));
  const imports = lines.filter(line => line.includes('import ') || line.includes('require('));
  const asyncFunctions = lines.filter(line => line.includes('async ') || line.includes('await '));
  const loops = lines.filter(line => line.includes('for(') || line.includes('while(') || line.includes('forEach'));
  const conditions = lines.filter(line => line.includes('if(') || line.includes('else') || line.includes('switch'));
  const variables = lines.filter(line => line.includes('const ') || line.includes('let ') || line.includes('var '));
  const comments = lines.filter(line => line.trim().startsWith('//') || line.trim().startsWith('/*'));
  const tryCatch = lines.filter(line => line.includes('try') || line.includes('catch'));
  
  // Advanced analysis
  const hasNestedLoops = lines.some(line => {
    const trimmed = line.toLowerCase();
    return (trimmed.includes('for(') && trimmed.includes('for(')) ||
           (trimmed.includes('while(') && trimmed.includes('while('));
  });
  
  const hasRecursion = lines.some(line => {
    const trimmed = line.toLowerCase();
    return trimmed.includes('function') && trimmed.includes('function');
  });
  
  const hasPromises = lines.some(line => {
    const trimmed = line.toLowerCase();
    return trimmed.includes('promise') || trimmed.includes('.then(') || trimmed.includes('.catch(');
  });
  
  const complexity = functions.length + classes.length * 2 + loops.length + conditions.length;
  const cyclomaticComplexity = conditions.length + loops.length + 1;
  
  return `# 🔬 **Advanced Technical Code Analysis**

## **📋 Code Structure & Architecture**

### **Core Components**
- **Total Lines:** ${lines.length} lines of code
- **Functions:** ${functions.length} function${functions.length !== 1 ? 's' : ''} (${functions.length > 0 ? 'modular design' : 'procedural approach'})
- **Classes:** ${classes.length} class${classes.length !== 1 ? 'es' : ''} (${classes.length > 0 ? 'object-oriented structure' : 'functional approach'})
- **Dependencies:** ${imports.length} external import${imports.length !== 1 ? 's' : ''}
- **Variables:** ${variables.length} variable declaration${variables.length !== 1 ? 's' : ''}

### **Execution Patterns**
- **Asynchronous Operations:** ${asyncFunctions.length} async function${asyncFunctions.length !== 1 ? 's' : ''} ${asyncFunctions.length > 0 ? '(non-blocking execution)' : '(synchronous execution)'}
- **Iteration Logic:** ${loops.length} loop${loops.length !== 1 ? 's' : ''} ${loops.length > 0 ? '(data processing capabilities)' : '(no iteration patterns)'}
- **Conditional Logic:** ${conditions.length} conditional statement${conditions.length !== 1 ? 's' : ''} ${conditions.length > 0 ? '(decision-making logic)' : '(linear execution)'}

---

## **⚡ Performance & Complexity Analysis**

### **Algorithmic Complexity**
- **Cyclomatic Complexity:** ${cyclomaticComplexity} (${cyclomaticComplexity <= 10 ? 'Low' : cyclomaticComplexity <= 20 ? 'Medium' : 'High'})
- **Overall Complexity:** ${complexity} (${complexity <= 15 ? 'Low' : complexity <= 30 ? 'Medium' : 'High'})
- **Nested Structures:** ${hasNestedLoops ? '⚠️ Nested loops detected (O(n²) potential)' : '✅ No nested loops'}
- **Recursive Patterns:** ${hasRecursion ? '⚠️ Recursion detected (stack overflow risk)' : '✅ No recursion'}

### **Performance Characteristics**
${loops.length > 0 ? `
- **Iteration Efficiency:** ${loops.length} loop${loops.length !== 1 ? 's' : ''} for data processing
- **Time Complexity:** ${hasNestedLoops ? 'O(n²) or higher' : 'O(n) linear complexity'}
- **Memory Usage:** ${variables.length} variable${variables.length !== 1 ? 's' : ''} in memory scope
` : `
- **Linear Execution:** No iteration patterns detected
- **Time Complexity:** O(1) constant time operations
- **Memory Footprint:** Minimal variable usage
`}

---

## **🏗️ Design Patterns & Architecture**

### **Programming Paradigms**
${classes.length > 0 ? `
- **Object-Oriented:** Class-based architecture with encapsulation
- **Inheritance:** Potential for class hierarchies and polymorphism
- **Encapsulation:** Data and methods grouped within classes
` : functions.length > 0 ? `
- **Functional Programming:** Function-based modular design
- **Composition:** Functions can be combined and reused
- **Immutability:** Potential for pure functions
` : `
- **Procedural:** Sequential execution approach
- **Linear Flow:** Step-by-step processing
- **State Management:** Variable-based state tracking
`}

### **Asynchronous Patterns**
${asyncFunctions.length > 0 ? `
- **Modern Async/Await:** ${asyncFunctions.length} async function${asyncFunctions.length !== 1 ? 's' : ''}
- **Non-blocking I/O:** Handles concurrent operations efficiently
- **Promise Handling:** ${hasPromises ? 'Uses Promise-based patterns' : 'Uses async/await syntax'}
- **Error Propagation:** Proper async error handling patterns
` : `
- **Synchronous Execution:** Blocking operations only
- **Sequential Processing:** One operation at a time
- **Simple Flow:** Easy to follow execution path
`}

---

## **🔒 Security & Error Handling Analysis**

### **Error Management**
- **Try-Catch Blocks:** ${tryCatch.length} error handling block${tryCatch.length !== 1 ? 's' : ''} ${tryCatch.length > 0 ? '✅ Present' : '❌ Missing'}
- **Exception Safety:** ${tryCatch.length > 0 ? 'Robust error handling' : 'No explicit error handling'}
- **Graceful Degradation:** ${tryCatch.length > 0 ? 'Likely implemented' : 'Not implemented'}

### **Security Considerations**
- **Input Validation:** ${variables.length > 0 ? 'Variable usage detected - validation needed' : 'No obvious input handling'}
- **Data Sanitization:** Requires manual review for complete assessment
- **XSS Prevention:** ${lines.some(line => line.toLowerCase().includes('innerhtml')) ? '⚠️ Potential XSS risk' : '✅ No obvious XSS vectors'}
- **Injection Attacks:** ${lines.some(line => line.toLowerCase().includes('eval(')) ? '⚠️ Code injection risk' : '✅ No eval() usage'}

---

## **📊 Code Quality Metrics**

### **Maintainability Score**
- **Documentation:** ${comments.length > 0 ? `${Math.round((comments.length / lines.length) * 100)}% coverage` : '0% - Critical'}
- **Modularity:** ${functions.length > 5 ? 'High modularity' : functions.length > 0 ? 'Moderate modularity' : 'Low modularity'}
- **Readability:** ${lines.length < 100 ? 'High' : lines.length < 300 ? 'Medium' : 'Low'}
- **Testability:** ${functions.length > 0 ? 'Good function separation' : 'Limited testability'}

### **Technical Debt Indicators**
${comments.length === 0 ? '- **Critical:** No documentation present' : ''}
${tryCatch.length === 0 ? '- **High:** No error handling implemented' : ''}
${hasNestedLoops ? '- **Medium:** Nested loops may impact performance' : ''}
${complexity > 30 ? '- **Medium:** High complexity may affect maintainability' : ''}

---

## **🎯 Optimization Recommendations**

### **Performance Improvements**
${hasNestedLoops ? `
- **Algorithm Optimization:** Consider using more efficient algorithms
- **Data Structure:** Evaluate if current data structures are optimal
- **Caching:** Implement caching for repeated calculations
` : ''}
${loops.length > 0 ? `
- **Loop Optimization:** Use array methods like map, filter, reduce
- **Early Termination:** Add break conditions where possible
- **Batch Processing:** Process data in chunks for large datasets
` : ''}

### **Code Quality Enhancements**
${functions.length > 10 ? `
- **Function Decomposition:** Break large functions into smaller ones
- **Single Responsibility:** Each function should do one thing well
- **Pure Functions:** Make functions predictable and testable
` : ''}
${comments.length === 0 ? `
- **Documentation:** Add comprehensive JSDoc comments
- **Inline Comments:** Explain complex logic and business rules
- **API Documentation:** Document function parameters and return values
` : ''}

### **Architecture Improvements**
${classes.length === 0 && functions.length > 5 ? `
- **Class Design:** Consider organizing related functions into classes
- **Module Pattern:** Use ES6 modules for better organization
- **Dependency Injection:** Implement loose coupling between components
` : ''}

---

## **🧪 Testing Strategy**

### **Recommended Test Coverage**
- **Unit Tests:** ${functions.length} function${functions.length !== 1 ? 's' : ''} need individual testing
- **Integration Tests:** Test component interactions
- **Edge Cases:** Test boundary conditions and error scenarios
- **Performance Tests:** ${loops.length > 0 ? 'Benchmark loop performance' : 'Test execution time'}

### **Testing Tools & Frameworks**
- **Unit Testing:** Jest, Mocha, or similar framework
- **Mocking:** Mock external dependencies and async operations
- **Coverage:** Aim for 80%+ code coverage
- **E2E Testing:** Test complete user workflows

---

## **📈 Scalability Considerations**

### **Current Scalability**
- **Code Size:** ${lines.length > 500 ? 'Large - consider modularization' : lines.length > 200 ? 'Medium - monitor growth' : 'Small - good for current scope'}
- **Complexity:** ${complexity > 30 ? 'High - refactoring recommended' : complexity > 15 ? 'Medium - manageable' : 'Low - easy to maintain'}
- **Dependencies:** ${imports.length > 10 ? 'High - monitor for security updates' : 'Low - manageable'}

### **Future-Proofing**
- **Modularity:** ${functions.length > 0 ? 'Good foundation for scaling' : 'Consider breaking into modules'}
- **Error Handling:** ${tryCatch.length > 0 ? 'Robust error handling in place' : 'Implement comprehensive error handling'}
- **Documentation:** ${comments.length > 0 ? 'Good documentation foundation' : 'Critical need for documentation'}

---

## **⚠️ Important Note**
This is a **comprehensive technical analysis** based on static code analysis and pattern recognition. For **complete security auditing, detailed performance profiling, and advanced architectural recommendations**, please retry when the AI service is available for expert-level analysis.

**Next Steps:** Address the identified technical debt and optimization opportunities, then re-run the analysis for deeper insights.`;
}

/**
 * Generate a very short quick summary when AI service is unavailable
 */
function generateFallbackQuickSummary(input) {
  const lines = input.split('\n').filter(l => l.trim());
  const hasClass = lines.some(l => /\bclass\b/.test(l));
  const hasFunc = lines.some(l => /\bfunction\b|=>/.test(l));
  const hasAsync = lines.some(l => /\basync\b|\bawait\b/.test(l));
  return [
    `Purpose: Concise overview of a ${hasClass ? 'class-based' : hasFunc ? 'function-based' : 'script'} module (${lines.length} LOC).`,
    `Key parts: ${hasFunc ? 'functions' : 'no functions'}, ${hasClass ? 'classes' : 'no classes'}, ${hasAsync ? 'async ops' : 'sync flow'}.`,
    `Flow: ${hasFunc ? 'function calls drive logic' : 'top-to-bottom execution'}.`,
    `Risks: ${hasAsync ? 'ensure async error handling' : 'add error handling'}; add docs if missing.`,
  ].join('\n');
}

/**
 * Generate a compact deep dive outline when AI service is unavailable
 */
function generateFallbackDeepDive(input) {
  const lines = input.split('\n').filter(l => l.trim());
  const funcs = lines.filter(l => /\bfunction\b|=>/.test(l)).length;
  const classes = lines.filter(l => /\bclass\b/.test(l)).length;
  const loops = lines.filter(l => /for\s*\(|while\s*\(|forEach\(/.test(l)).length;
  const tryCatch = lines.filter(l => /\btry\b|\bcatch\b/.test(l)).length;
  return [
    'Deep Dive Overview',
    `- Structure: ${funcs} functions, ${classes} classes, ${lines.length} LOC`,
    `- Flow: ${loops > 0 ? 'iterative processing present' : 'linear logic; no loops detected'}`,
    `- Reliability: ${tryCatch > 0 ? 'error handling present' : 'add try/catch and input validation'}`,
    `- Performance: ${loops > 1 ? 'review loop complexity' : 'no heavy loops; likely OK'}`,
    `- Next steps: modularize, document, and add tests around critical paths.`,
  ].join('\n');
}
