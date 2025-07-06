
import React from 'react';
import { JsonRenderer } from './AgentResponseBlock'; // Assuming JsonRenderer is exported
import CollapsibleSection from './CollapsibleSection';

// Helper to parse JSON, similar to App.tsx's getParsedOutput
const getParsedOutput = (jsonString: string): any | null => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.warn("RenderUtils: Failed to parse JSON string:", e, jsonString);
    return { parseError: true, originalString: jsonString }; // Consistent error object
  }
};

export const renderSection = (
  title: string,
  content: React.ReactNode,
  className: string = "bg-white",
  icon?: string
) => (
  <div className={`mt-4 p-4 sm:p-5 rounded-lg shadow border border-gray-200 ${className}`}>
    <div className="flex justify-between items-start">
      <h4 className="text-base sm:text-md font-semibold text-blue-700 mb-2 flex items-center">
        {icon && <span className="mr-2 text-lg">{icon}</span>}
        {title}
      </h4>
    </div>
    <div className="text-sm text-gray-700 space-y-1">{content}</div>
  </div>
);

export const renderKeyValue = (keyText: string, valueText: React.ReactNode) => (
  valueText || typeof valueText === 'boolean' || (typeof valueText === 'number' && !isNaN(valueText)) ? (
    <div className="py-1">
      <strong className="text-gray-600 font-medium">{keyText}：</strong>
      {typeof valueText === 'string' ? <span className="whitespace-pre-line">{valueText}</span> : valueText}
    </div>
  ) : null
);

export const renderList = (items: string[] | undefined, itemClassName: string = "") => (
  items && items.length > 0 ? (
    <ul className={`list-disc list-inside ml-4 mt-1 ${itemClassName ? 'flex flex-wrap gap-2' : ''}`}>
      {items.map((item, index) =>
        <li
          key={index}
          className={`${itemClassName || 'whitespace-pre-line'}`}
        >
          {item}
        </li>)}
    </ul>
  ) : <p className="text-gray-500 italic">无</p>
);

export const renderClassificationTags = (tags: string[] | undefined, onRemove?: (tagToRemove: string) => void, editable?: boolean) => {
  if (!tags || tags.length === 0) return <p className="text-gray-500 italic">未指定分类。</p>;
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {tags.map((tag, index) => (
        <span key={index} className={`px-2.5 py-1 text-xs font-medium rounded-full shadow-sm ${editable ? 'bg-sky-100 text-sky-700' : 'bg-blue-100 text-blue-700'}`}>
          {tag}
          {editable && onRemove && (
            <button
              onClick={() => onRemove(tag)}
              className="ml-1.5 text-sky-600 hover:text-sky-800 focus:outline-none"
              aria-label={`移除标签 ${tag}`}
            >
              &times;
            </button>
          )}
        </span>
      ))}
    </div>
  );
};

export const renderDecompositionStructure = (decomposition: any[] | undefined) => {
  if (!decomposition || !Array.isArray(decomposition) || decomposition.length === 0) {
    return <p className="text-gray-500 italic">未提供问题分解结构。</p>;
  }
  return (
    <div className="space-y-3">
      {decomposition.map((l1Item: any, index: number) => (
        <CollapsibleSection
          key={index}
          title={
            <span className="font-semibold text-sky-800 text-md">
              {l1Item.componentId} - {l1Item.title}
            </span>
          }
          className="border-sky-300 bg-sky-50 hover:shadow-md transition-shadow"
          titleClassName="hover:bg-sky-100"
        >
          <p className="text-sm text-gray-700 mt-1 mb-2 whitespace-pre-line">{l1Item.description}</p>
          {l1Item.subComponents && l1Item.subComponents.length > 0 && (
            <div className="mt-2.5 pt-2 pl-4 border-l-2 border-sky-200 space-y-2">
              <h6 className="text-sm font-medium text-slate-700">子组件：</h6>
              {l1Item.subComponents.map((l2Item: any, subIndex: number) => (
                <div key={subIndex} className="p-2.5 rounded-md bg-slate-100 border border-slate-300 hover:border-slate-400 transition-colors">
                  <p className="font-medium text-slate-800 text-sm">
                    {l2Item.componentId} - {l2Item.title}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{l2Item.description}</p>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>
      ))}
    </div>
  );
};

export const renderDataNeedItem = (item: any, index: number) => {
  const category = item.category?.toUpperCase() || 'UNKNOWN';
  let categoryBgColor = 'bg-gray-200';
  let categoryTextColor = 'text-gray-800';
  let borderColor = 'border-gray-300';
  let bgColor = 'bg-gray-50';

  switch (category) {
    case 'CRITICAL':
      categoryBgColor = 'bg-red-200';
      categoryTextColor = 'text-red-800';
      borderColor = 'border-red-300';
      bgColor = 'bg-red-50';
      break;
    case 'IMPORTANT':
      categoryBgColor = 'bg-yellow-200';
      categoryTextColor = 'text-yellow-800';
      borderColor = 'border-yellow-300';
      bgColor = 'bg-yellow-50';
      break;
    case 'USEFUL':
      categoryBgColor = 'bg-green-200';
      categoryTextColor = 'text-green-800';
      borderColor = 'border-green-300';
      bgColor = 'bg-green-50';
      break;
    case 'OPTIONAL':
      categoryBgColor = 'bg-sky-200';
      categoryTextColor = 'text-sky-800';
      borderColor = 'border-sky-300';
      bgColor = 'bg-sky-50';
      break;
  }

  const cardClasses = `p-4 rounded-lg shadow ${borderColor} ${bgColor} hover:shadow-md transition-shadow duration-150`;
  
  return (
    <div key={index} className={cardClasses}>
      <div className="flex justify-between items-start mb-1">
        <h5 className={`text-md font-semibold ${category === 'CRITICAL' ? 'text-red-700' : (category === 'IMPORTANT' ? 'text-yellow-700' : (category === 'USEFUL' ? 'text-green-700' : (category === 'OPTIONAL' ? 'text-sky-700' : 'text-gray-800')))}`}>{item.dataElement}</h5>
        <span className={`px-2.5 py-0.5 text-xs font-semibold ${categoryBgColor} ${categoryTextColor} rounded-full`}>{item.category}</span>
      </div>
      {renderKeyValue("参数", item.parameters)}
      {renderKeyValue("数据源指导", item.sourceGuidance)}
      {item.mapsToComponent && item.mapsToComponent.length > 0 && (
        <div className="mt-2">
          <strong className="text-gray-600 font-medium text-sm">关联组件：</strong>
          {renderList(item.mapsToComponent, "px-2 py-0.5 text-xs bg-gray-200 text-gray-700 rounded-full mr-1 mb-1 inline-block")}
        </div>
      )}
    </div>
  );
};

export const renderReviewSection = (title: string, jsonString: string, fieldsToShow: {key: string, label: string}[], customRenderers?: { [key: string]: (data: any) => React.ReactNode } ) => {
    const parsed = getParsedOutput(jsonString);
    if (!parsed || parsed.parseError || !parsed.output) {
      if (jsonString && (parsed?.parseError || !parsed?.output) ) {
         return (
             <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
                <p className="text-red-600 italic">无法解析回顾内容或回顾内容为空。</p>
                {parsed?.parseError && <pre className="text-xs text-red-500 whitespace-pre-wrap mt-2">{parsed.originalString}</pre>}
            </div>
        );
      }
      return null;
    }

    if (fieldsToShow.length === 0) {
        return (
             <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
                <JsonRenderer data={parsed.output} />
            </div>
        );
    }
    
    const contentToRender = fieldsToShow.map(field => {
        const value = parsed.output?.[field.key];
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return null;
        
        if (customRenderers && customRenderers[field.key]) {
            return renderKeyValue(field.label, customRenderers[field.key](value));
        }
        if (Array.isArray(value)) {
            if (field.key === 'problemClassification') {
                 return renderKeyValue(field.label, renderClassificationTags(value));
            }
            return renderKeyValue(field.label, renderList(value));
        }
        return renderKeyValue(field.label, value);
    }).filter(Boolean);

    if (contentToRender.length === 0) {
        return (
             <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
                <p className="text-gray-500 italic">此部分无可用摘要信息。</p>
            </div>
        );
    }

    return (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
            {contentToRender}
        </div>
    );
  };

export const readFileAsText = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string | null);
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsText(file);
  });
};

export const renderHierarchicalListItem = (item: any, index: number, titleKey: string, contentKeys: {label: string, dataKey: string, isList?: boolean, isRawJson?: boolean}[]) => {
  if (!item) return null;
  const title = item[titleKey] || `项目 ${index + 1}`;
  
  return (
    <CollapsibleSection
      key={item.id || item.criterionName || item.componentId || index}
      title={<span className="font-semibold text-gray-800">{title}</span>}
      className="border-gray-300 bg-white"
      titleClassName="hover:bg-gray-50"
    >
      <div className="space-y-2 text-sm">
        {contentKeys.map(ck => {
          const value = item[ck.dataKey];
          if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
            return null; // Don't render if no value
          }
          if (ck.isRawJson) {
            return renderKeyValue(ck.label, <JsonRenderer data={value} />);
          }
          if (ck.isList) {
            return renderKeyValue(ck.label, renderList(Array.isArray(value) ? value : [String(value)]));
          }
          return renderKeyValue(ck.label, String(value));
        })}
      </div>
    </CollapsibleSection>
  );
};
