
import React, { useEffect, useRef, memo, useState } from 'react';
import mermaid from 'mermaid';
import type { MermaidConfig } from 'mermaid'; // Import MermaidConfig type

interface MermaidDiagramProps {
  chartData: string;
  idSuffix?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chartData, idSuffix = '' }) => {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const componentId = useRef(`mermaid-component-${idSuffix || Math.random().toString(36).substring(2, 9)}`).current;
  const diagramContainerId = `mermaid-diagram-container-${componentId}`;

  const [displayError, setDisplayError] = useState<string | null>(null);
  const [rawChartDataForError, setRawChartDataForError] = useState<string | null>(null);

  // Centralized console logging function
  const consoleLog = (level: 'log' | 'warn' | 'error' | 'info', message: string, ...optionalParams: any[]) => {
    const logPrefix = `MERMAID_CONSOLE_LOG: [${componentId}]`;
    switch (level) {
      case 'log':
        console.log(`${logPrefix} ${message}`, ...optionalParams);
        break;
      case 'warn':
        console.warn(`${logPrefix} ${message}`, ...optionalParams);
        break;
      case 'error':
        console.error(`${logPrefix} ${message}`, ...optionalParams);
        break;
      case 'info':
        console.info(`${logPrefix} ${message}`, ...optionalParams);
        break;
    }
  };


  useEffect(() => {
    const currentMermaidRef = mermaidRef.current;
    setDisplayError(null);
    setRawChartDataForError(null);

    consoleLog('info', `Diagram update triggered. Chart data length: ${chartData?.length || 0}.`);

    if (!currentMermaidRef) {
      consoleLog('error', "Mermaid container ref (mermaidRef.current) is null. Cannot render.");
      setDisplayError("Mermaid container element not found in the DOM.");
      return;
    }

    currentMermaidRef.innerHTML = '';
    currentMermaidRef.removeAttribute('data-processed');

    if (!chartData || chartData.trim() === '') {
      consoleLog('info', "Chart data is empty. Rendering placeholder.");
      currentMermaidRef.innerHTML = '<p class="text-gray-500 italic text-center p-4">无依赖关系图数据可显示。</p>';
      return;
    }

    consoleLog('log', "FULL chartData being processed:", chartData); 

    if (chartData.startsWith("ErrorGeneratingGraph:")) {
      const errorMessageFromGemini = chartData.substring("ErrorGeneratingGraph:".length).trim();
      consoleLog('warn', `Gemini reported an error in graph generation: ${errorMessageFromGemini}`);
      currentMermaidRef.innerHTML =
        `<div class="text-center p-4">
           <p class="text-orange-600 font-semibold">助手报告生成图表时遇到问题：</p>
           <p class="text-sm text-orange-500 mt-1">${errorMessageFromGemini || '未提供具体错误信息。'}</p>
         </div>`;
      return;
    }

    const themeVariables = {
        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
        fontSize: '14px',
        background: '#FFFFFF', 
        primaryColor: '#F8F9FA', 
        primaryBorderColor: '#CED4DA',
        primaryTextColor: '#212529', 
        lineColor: '#6C757D', 
        textColor: '#343A40',
    };

    const mermaidConfig: MermaidConfig = {
        startOnLoad: false,
        theme: 'base',
        fontFamily: themeVariables.fontFamily,
        logLevel: 3, // Reduced log level to avoid console spam
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          useMaxWidth: true,
          curve: 'basis'
        },
        themeVariables: themeVariables,
        // Better support for international characters
        wrap: true,
        fontSize: 14,
    };

    consoleLog('info', "Initializing Mermaid with config:", mermaidConfig);

    try {
      mermaid.initialize(mermaidConfig);
      consoleLog('info', "Mermaid initialized successfully.");
    } catch (e) {
        const initError = e as Error;
        consoleLog('error', `Mermaid.js initialization failed: ${initError.message}`, initError);
        setDisplayError(`Mermaid.js 初始化失败: ${initError.message}`);
        setRawChartDataForError(chartData);
        currentMermaidRef.innerHTML = `<p class="text-red-600 p-4">Mermaid 初始化失败: ${initError.message}</p>`;
        return;
    }

    // Validate chart data before processing
    if (!chartData.trim().startsWith('graph ') && !chartData.trim().startsWith('flowchart ')) {
      consoleLog('warn', "Chart data doesn't start with 'graph' or 'flowchart'. This might cause rendering issues.");
      setDisplayError("图表定义格式可能不正确。Mermaid图表应以'graph'或'flowchart'开头。");
      setRawChartDataForError(chartData);
      currentMermaidRef.innerHTML = `<p class="text-orange-600 p-4">图表格式警告: 图表定义应以'graph'或'flowchart'开头</p>`;
      return;
    }

    currentMermaidRef.className = "mermaid";
    currentMermaidRef.innerHTML = chartData;

    consoleLog('info', "Calling mermaid.run() to render the diagram.");

    (async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Mermaid rendering timeout after 10 seconds')), 10000);
        });

        const renderPromise = mermaid.run({
            nodes: [currentMermaidRef],
            suppressErrors: false
        });

        await Promise.race([renderPromise, timeoutPromise]);
        consoleLog('info', "mermaid.run() completed.");

        const svgElement = currentMermaidRef.querySelector('svg');
        if (!svgElement) {
            consoleLog('warn', "mermaid.run() completed, but NO SVG element was found in the container. Diagram might be empty or invalid.");
            setDisplayError("图表已处理，但未生成可见的SVG内容。请检查图表定义。");
            setRawChartDataForError(chartData);
        } else {
            consoleLog('info', "SVG element found and rendered by Mermaid.");
            svgElement.style.maxWidth = '100%';
            svgElement.style.height = 'auto';

            const foreignObjects = svgElement.querySelectorAll('foreignObject');
            consoleLog('info', `SUCCESS: Found ${foreignObjects.length} <foreignObject> elements (HTML labels).`);

            if (foreignObjects.length > 0) {
              const firstForeignObjectHTML = foreignObjects[0].outerHTML;
              consoleLog('log', `CRITICAL_DEBUG: OuterHTML of the FIRST foreignObject element:`, firstForeignObjectHTML);
              // Ensure this specific log format is maintained if it's being parsed or expected externally
              console.log(`MERMAID_CONSOLE_LOG: [${componentId}] CRITICAL_DEBUG: OuterHTML of the FIRST foreignObject (logged to main console): ${firstForeignObjectHTML}`);
            } else {
               consoleLog('warn', "No <foreignObject> elements found. HTML labels might not be in use or failed. Check 'htmlLabels' config and diagram syntax.");
            }

            const textElements = svgElement.querySelectorAll('text');
            consoleLog('info', `Found ${textElements.length} standard SVG <text> elements.`);
            if (textElements.length > 0) {
                 consoleLog('log', `DEBUG: OuterHTML of the FIRST SVG <text> element:`, textElements[0].outerHTML);
            }

            if (foreignObjects.length === 0 && textElements.length === 0) {
                consoleLog('warn', "CRITICAL_WARNING: No text found via <foreignObject> or <text> elements. Labels might be missing or invisible. If text is still not visible, check the 'CRITICAL_DEBUG' log for foreignObject's outerHTML in the BROWSER'S MAIN CONSOLE (F12). If it's empty or small, the issue is likely with label text in chartData OR Mermaid internal error (check logLevel 5 output).");
            }
        }
      } catch (e) {
        const runError = e as Error;
        consoleLog('error', `Error during mermaid.run(): ${runError.message}`, runError);
        setDisplayError(`渲染依赖关系图时出错 (mermaid.run): ${runError.message}`);
        setRawChartDataForError(chartData);

        // Clear any existing content and add error message
        if (currentMermaidRef) {
          currentMermaidRef.innerHTML = '';
          const errorDiv = document.createElement('div');
          errorDiv.className = 'text-red-600 p-2 font-semibold text-center';
          errorDiv.textContent = `Mermaid.run() Error: ${runError.message}. Check diagram syntax.`;
          currentMermaidRef.appendChild(errorDiv);
        }
      }
    })();

  }, [chartData, componentId]); 

  // Fallback text-based diagram when Mermaid fails
  const renderFallbackDiagram = () => {
    if (!rawChartDataForError) return null;

    try {
      // Extract node information from Mermaid syntax for fallback display
      const lines = rawChartDataForError.split(';').filter(line => line.trim());
      const nodes = new Set<string>();
      const connections: Array<{from: string, to: string}> = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('-->')) {
          const [from, to] = trimmed.split('-->').map(s => s.trim());
          const fromNode = from.replace(/[[\]"]/g, '');
          const toNode = to.replace(/[[\]"]/g, '');
          nodes.add(fromNode);
          nodes.add(toNode);
          connections.push({from: fromNode, to: toNode});
        } else if (trimmed.includes('[') && trimmed.includes(']')) {
          const nodeMatch = trimmed.match(/(\w+)\["([^"]+)"\]/);
          if (nodeMatch) {
            nodes.add(nodeMatch[2]);
          }
        }
      });

      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">依赖关系图 (文本版本)</h4>
          <div className="space-y-2">
            {Array.from(nodes).map((node, index) => (
              <div key={index} className="p-2 bg-white rounded border border-blue-200">
                <span className="font-medium text-blue-700">{node}</span>
              </div>
            ))}
            {connections.length > 0 && (
              <div className="mt-3">
                <h5 className="font-medium text-blue-700 mb-2">连接关系:</h5>
                {connections.map((conn, index) => (
                  <div key={index} className="text-sm text-blue-600">
                    {conn.from} → {conn.to}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } catch (e) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">无法解析图表结构以显示文本版本</p>
        </div>
      );
    }
  };

  return (
    <div className="w-full my-3">
      <div
        ref={mermaidRef}
        id={diagramContainerId}
        className="mermaid-diagram-container w-full p-3 bg-white border border-gray-300 rounded-lg shadow overflow-auto flex justify-center items-center min-h-[200px]"
        aria-label="Dependency Diagram"
      >
        {/* Content will be injected by Mermaid or error messages */}
      </div>
      {displayError && (
         <div className="mt-2 p-3 border border-red-300 bg-red-50 rounded text-sm">
            <p className="font-semibold text-red-700">图表渲染错误信息：</p>
            <p className="text-red-600 whitespace-pre-wrap">{displayError}</p>
            {rawChartDataForError && (
                <details className="mt-2 text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">查看导致错误的图表定义 (Mermaid 语法)</summary>
                    <pre className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap text-red-500">{rawChartDataForError}</pre>
                </details>
            )}
            {/* Show fallback diagram when there's an error */}
            <div className="mt-3">
              {renderFallbackDiagram()}
            </div>
        </div>
      )}
    </div>
  );
};

export default memo(MermaidDiagram);
