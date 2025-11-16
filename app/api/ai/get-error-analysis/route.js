import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const input = (body?.input || "").toString();

    if (!input.trim()) {
      return NextResponse.json(
        { error: "Input error text is required" },
        { status: 400 }
      );
    }

    // Basic heuristic analysis (no Gemini)
    const text = input;
    let errorType = 'GeneralError';
    let language = 'General';
    let rootCause = 'Uncaught runtime error; validate inputs, state, and dependencies.';
    const fixes = [];

    if (/ReferenceError:|\bis not defined\b/i.test(text)) {
      errorType = 'ReferenceError';
      rootCause = 'Using an identifier before declaration or outside of scope.';
      fixes.push('Declare/import the missing symbol and check variable scope.');
    } else if (/TypeError:|Cannot (read|set) (property|properties) .* of (undefined|null)/i.test(text)) {
      errorType = 'TypeError';
      rootCause = 'Accessing a property on undefined/null due to missing data or incorrect assumptions.';
      fixes.push('Add null/undefined guards (optional chaining) and validate inputs.');
    } else if (/SyntaxError:|Unexpected token|Unexpected end of JSON|Invalid or unexpected token/i.test(text)) {
      errorType = 'SyntaxError';
      rootCause = 'Malformed syntax or invalid JSON encountered by the parser.';
      fixes.push('Fix syntax; validate JSON before parsing (try/catch).');
    } else if (/ENOENT|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|NetworkError|Failed to fetch/i.test(text)) {
      errorType = 'NetworkError';
      rootCause = 'Network or filesystem resource not reachable or missing.';
      fixes.push('Verify endpoint/host, credentials, timeouts, and network/firewall.');
    }

    if (/\bimport\s+.*from\b|module\.exports|require\(|at\s+.*\((?:[^)]+\.js|node:)/i.test(text)) {
      language = 'JavaScript';
    } else if (/Traceback \(most recent call last\):|File ".+\.py", line \d+|\bdef\s+\w+\(|None\b/i.test(text)) {
      language = 'Python';
    } else if (/Exception in thread|NullPointerException|public static void main|\.java:\d+/i.test(text)) {
      language = 'Java';
    }

    const summary = (input.split('\n').find(l => l.trim()) || `${errorType} in ${language}`).slice(0, 140);
    let explanation = {
      input_type: 'Error Message',
      error_type: errorType,
      language,
      root_cause: rootCause,
      summary_title: summary,
      suggested_fixes: fixes.length ? fixes : ['Add input validation and robust error handling.']
    };

    // Stack Exchange search using summary or raw input
    const searchQuery = summary || input;
    let stackOverflowResult = [];
    let stackOverflowAnswers = [];
    try {
      const resp = await fetch(
        `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=relevance&q=${encodeURIComponent(
          searchQuery
        )}&accepted=true&site=stackoverflow&key=${process.env.STACK_EXCHANGE_API || ''}`
      );
      const data = await resp.json();
      stackOverflowResult = data.items || [];

      // Fetch accepted answers
      const acceptedIds = (stackOverflowResult
        .map((q) => q.accepted_answer_id)
        .filter(Boolean)
        .slice(0, 5));
      
      if (acceptedIds.length > 0) {
        const answersResponse = await fetch(
          `https://api.stackexchange.com/2.3/answers/${acceptedIds.join(';')}?order=desc&sort=votes&site=stackoverflow&filter=withbody&key=${process.env.STACK_EXCHANGE_API || ''}`
        );
        const answersData = await answersResponse.json();
        stackOverflowAnswers = answersData.items || [];
      }

      // Enrich explanation from Stack Overflow if our heuristics are too generic
      const top = stackOverflowResult && stackOverflowResult[0];
      if (top) {
        const decode = (s) => s
          ?.replace(/&quot;/g, '"')
          ?.replace(/&#39;/g, "'")
          ?.replace(/&amp;/g, '&')
          ?.replace(/&lt;/g, '<')
          ?.replace(/&gt;/g, '>');
        const title = decode(top.title || '').trim();
        const tags = Array.isArray(top.tags) ? top.tags : [];

        if (!explanation.summary_title || /GeneralError|Error in General/i.test(explanation.summary_title)) {
          explanation.summary_title = title.slice(0, 140) || explanation.summary_title;
        }

        if (explanation.language === 'General') {
          if (tags.includes('javascript') || tags.includes('node.js') || tags.includes('reactjs') || /javascript|react|node/i.test(title)) {
            explanation.language = 'JavaScript';
          } else if (tags.includes('python') || /python/i.test(title)) {
            explanation.language = 'Python';
          } else if (tags.includes('java') || /java/i.test(title)) {
            explanation.language = 'Java';
          }
        }

        if (explanation.error_type === 'GeneralError') {
          if (/ReferenceError|\bis not defined\b/i.test(title)) explanation.error_type = 'ReferenceError';
          else if (/TypeError|not a function|is not iterable|Cannot (read|set) (property|properties) .* of (undefined|null)/i.test(title)) explanation.error_type = 'TypeError';
          else if (/SyntaxError|Unexpected token|Unexpected end of JSON|Invalid or unexpected token/i.test(title)) explanation.error_type = 'SyntaxError';
          else if (/ENOENT|ECONNREFUSED|ECONNRESET|ETIMEDOUT|ENOTFOUND|EAI_AGAIN|NetworkError|Failed to fetch/i.test(title)) explanation.error_type = 'NetworkError';
          else if (/DOMException|ServiceWorker|respondWith\(\)|SecurityError|AbortError|QuotaExceededError/i.test(title) || tags.includes('service-worker')) explanation.error_type = 'DOMException';
        }

        if (!explanation.root_cause || /Uncaught runtime error|validate inputs, state, and dependencies\./i.test(explanation.root_cause)) {
          if (/\bis not defined\b/i.test(title)) explanation.root_cause = 'Identifier used before declaration or outside scope.';
          else if (/Cannot (read|set) (property|properties) .* of (undefined|null)/i.test(title)) explanation.root_cause = 'Accessing property on undefined/null value.';
          else if (/Unexpected token|Unexpected end of JSON/i.test(title)) explanation.root_cause = 'Parser encountered malformed syntax/JSON.';
          else if (/Failed to fetch|ENOTFOUND|ECONN|ETIMEDOUT/i.test(title)) explanation.root_cause = 'Network/endpoint not reachable or timed out.';
          else if (/ServiceWorker|respondWith\(\)/i.test(title)) explanation.root_cause = 'Service Worker respondWith requires a valid Response; ensure you pass a Response/Promise<Response>.';
          else if (title) explanation.root_cause = `Related to: ${title}`;
        }
      }
    } catch (_) {
      stackOverflowResult = [];
      stackOverflowAnswers = [];
    }

    return NextResponse.json({
      explanation,
      stackOverflowResult,
      stackOverflowAnswers,
    });
  } catch (error) {
    console.error("get-error-analysis error:", error);
    return NextResponse.json(
      { error: "Failed to get error explanation" },
      { status: 500 }
    );
  }
}


