import React, { useState, useCallback } from 'react';
import { PhaseProps } from '../../types';
import ActionButton from '../ActionButton';
import LoadingSpinner from '../LoadingSpinner';
import AgentResponseBlock from '../AgentResponseBlock';
import { renderDataNeedItem, renderSection, renderKeyValue, renderList } from '../RenderUtils';
import CollapsibleSection from '../CollapsibleSection';

const DataAssessmentPhase: React.FC<PhaseProps> = ({
  appState,
  updateState,
  advancePhase,
  getParsedOutput,
  handleDataAssessmentRequest,
}) => {
  const { isLoading, dataRequirementsOutput, userDataForAssessment, dataAssessmentOutput } = appState;
  const parsedOutput = getParsedOutput(dataAssessmentOutput);
  const parsedDataRequirementsReview = getParsedOutput(dataRequirementsOutput);
  
  const [currentYoutubeLink, setCurrentYoutubeLink] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      updateState({
        userDataForAssessment: {
          ...userDataForAssessment,
          files: Array.from(event.target.files),
        }
      });
    }
  };

  const removeFile = (fileName: string) => {
    updateState({
      userDataForAssessment: {
        ...userDataForAssessment,
        files: userDataForAssessment.files.filter(file => file.name !== fileName),
      }
    });
  };

  const addYoutubeLink = () => {
    if (currentYoutubeLink.trim() && !userDataForAssessment.youtubeLinks.includes(currentYoutubeLink.trim())) {
      try {
        // Basic URL validation
        new URL(currentYoutubeLink.trim());
        updateState({
          userDataForAssessment: {
            ...userDataForAssessment,
            youtubeLinks: [...userDataForAssessment.youtubeLinks, currentYoutubeLink.trim()],
          }
        });
        setCurrentYoutubeLink('');
      } catch (_) {
        alert("请输入有效的 YouTube 链接。");
      }
    }
  };
  
  const removeYoutubeLink = (linkToRemove: string) => {
    updateState({
      userDataForAssessment: {
        ...userDataForAssessment,
        youtubeLinks: userDataForAssessment.youtubeLinks.filter(link => link !== linkToRemove),
      }
    });
  };
  
  const isDataProvided = () => {
    return userDataForAssessment.textInput.trim() !== '' || 
           userDataForAssessment.files.length > 0 || 
           userDataForAssessment.youtubeLinks.length > 0;
  };

  const renderAssessmentReportItem = (item: any, index: number) => {
    let statusColor = 'text-gray-700';
    if (item.status === 'SUFFICIENT') statusColor = 'text-green-700';
    else if (item.status === 'INSUFFICIENT') statusColor = 'text-red-700';
    else if (item.status === 'PARTIALLY_ADDRESSABLE') statusColor = 'text-yellow-700';

    return (
      <CollapsibleSection
        key={item.componentId || index}
        title={<>组件 {item.componentId}: <span className={`font-semibold ${statusColor}`}>{item.status}</span></>}
        className="border-gray-300 bg-white"
        titleClassName="hover:bg-gray-50"
      >
        <div className="space-y-2">
          {renderKeyValue("评估说明", item.evaluationNotes)}
          {item.remainingNeeds && item.remainingNeeds.length > 0 && 
            renderKeyValue("剩余需求", renderList(item.remainingNeeds))
          }
        </div>
      </CollapsibleSection>
    );
  };

  return (
    <>
      {parsedDataRequirementsReview && parsedDataRequirementsReview.output && parsedDataRequirementsReview.output.dataNeeds ? (
        <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">回顾：数据需求</h3>
          <div className="space-y-4">
            {Array.isArray(parsedDataRequirementsReview.output.dataNeeds) ?
              parsedDataRequirementsReview.output.dataNeeds.map((item: any, index: number) => renderDataNeedItem(item, index)) :
              <p className="text-gray-500 italic">数据需求格式不正确。</p>
            }
          </div>
        </div>
      ) : dataRequirementsOutput && (
        <AgentResponseBlock jsonStringContent={dataRequirementsOutput} title="回顾：数据需求 (原始JSON)" />
      )}

      {!dataAssessmentOutput ? (
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor="userDataTextInput" className="block text-lg font-medium text-gray-800 mb-2">
              文本数据/信息（或描述可用数据）：
            </label>
            <textarea
              id="userDataTextInput"
              value={userDataForAssessment.textInput}
              onChange={(e) => updateState({ userDataForAssessment: { ...userDataForAssessment, textInput: e.target.value } })}
              className="w-full p-3 border border-gray-300 rounded-lg h-36 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="例如：已提供 NOAA 历史气候数据（2000-2020）。粘贴文本或描述数据。"
            />
          </div>

          <div>
            <label htmlFor="youtubeLinkInput" className="block text-lg font-medium text-gray-800 mb-2">
              YouTube 链接 (可选, 可添加多个)：
            </label>
            <div className="flex">
              <input
                type="url"
                id="youtubeLinkInput"
                value={currentYoutubeLink}
                onChange={(e) => setCurrentYoutubeLink(e.target.value)}
                className="flex-grow p-3 border border-gray-300 rounded-l-lg bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <button onClick={addYoutubeLink} className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">添加</button>
            </div>
            {userDataForAssessment.youtubeLinks.length > 0 && (
              <div className="mt-3 space-y-1">
                {userDataForAssessment.youtubeLinks.map((link, index) => (
                  <div key={index} className="text-sm text-blue-600 flex justify-between items-center bg-blue-50 p-1.5 rounded">
                    <a href={link} target="_blank" rel="noopener noreferrer" className="hover:underline truncate" title={link}>{link}</a>
                    <button onClick={() => removeYoutubeLink(link)} className="text-red-500 hover:text-red-700 text-xs ml-2 px-1">移除</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="fileUploadInput" className="block text-lg font-medium text-gray-800 mb-2">
              上传文件 (可选, 可选多个)：
            </label>
            <input
              type="file"
              id="fileUploadInput"
              multiple
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {userDataForAssessment.files.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-sm font-medium text-gray-700">已选择文件：</p>
                <ul className="list-disc list-inside pl-5">
                  {userDataForAssessment.files.map(file => (
                    <li key={file.name} className="text-sm text-gray-600 flex justify-between items-center">
                      <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
                      <button onClick={() => removeFile(file.name)} className="text-red-500 hover:text-red-700 text-xs ml-2">移除</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <ActionButton onClick={handleDataAssessmentRequest} disabled={isLoading || !isDataProvided()} className="w-full sm:w-auto">
            {isLoading ? <LoadingSpinner /> : "提交数据以供评估"}
          </ActionButton>
          {isLoading && isDataProvided() && (
             <div className="mt-4 p-4 flex items-center justify-center text-blue-600 bg-blue-50 rounded-lg shadow">
                <LoadingSpinner /> <span className="ml-3 text-md">助手正在评估数据...</span>
             </div>
            )}
        </div>
      ) : (
        <>
          <div className="mt-6 p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm space-y-3">
            <h4 className="text-lg font-semibold text-gray-700">您提供的数据/信息：</h4>
            {userDataForAssessment.textInput && <p><strong>文本：</strong><span className="whitespace-pre-line">{userDataForAssessment.textInput}</span></p>}
            {userDataForAssessment.youtubeLinks.length > 0 && (
              <div>
                <strong>YouTube 链接：</strong>
                <ul className="list-disc list-inside pl-5">
                  {userDataForAssessment.youtubeLinks.map((link, i) => <li key={i}><a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{link}</a></li>)}
                </ul>
              </div>
            )}
            {userDataForAssessment.files.length > 0 && (
              <div>
                <strong>已上传文件：</strong>
                <ul className="list-disc list-inside pl-5">
                  {userDataForAssessment.files.map(f => <li key={f.name}>{f.name} ({(f.size/1024).toFixed(2)} KB)</li>)}
                </ul>
              </div>
            )}
          </div>

          {parsedOutput && !parsedOutput.parseError && parsedOutput.output ? (
            <div className="space-y-4 mt-4">
              {parsedOutput.output.assessmentReport && Array.isArray(parsedOutput.output.assessmentReport) ?
                renderSection("评估报告", 
                  <div className="space-y-3">
                    {parsedOutput.output.assessmentReport.map(renderAssessmentReportItem)}
                  </div>
                ) :
                renderSection("评估报告", <p className="italic text-gray-500">评估报告格式不正确或为空。</p>)
              }
              {renderSection("总体充分性", parsedOutput.output.overallSufficiency)}
              {parsedOutput.output.nextStepsQuery && renderSection("后续步骤建议", <p className="text-blue-800 font-medium whitespace-pre-line">{parsedOutput.output.nextStepsQuery}</p>, "bg-blue-50 border-blue-200")}
            </div>
          ) : (
            dataAssessmentOutput && <AgentResponseBlock jsonStringContent={dataAssessmentOutput} title="助手数据充分性评估：" />
          )}
          <ActionButton
            onClick={advancePhase}
            disabled={isLoading || !dataAssessmentOutput}
            className="mt-8 w-full sm:w-auto"
          >
            {isLoading ? <LoadingSpinner/> : "了解评估并继续"}
          </ActionButton>
        </>
      )}
    </>
  );
};

export default DataAssessmentPhase;