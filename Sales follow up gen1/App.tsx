
import React, { useState, useCallback } from 'react';
import { FollowUpScenario, Channel } from './types';
import { generateFollowUpMessage } from './services/geminiService';

const App: React.FC = () => {
  const [scenario, setScenario] = useState<FollowUpScenario>(FollowUpScenario.PROPOSAL_SENT);
  const [channel, setChannel] = useState<Channel>(Channel.EMAIL);
  const [daysSinceReply, setDaysSinceReply] = useState<number>(3);
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setCopySuccess(false);
    try {
      const generatedText = await generateFollowUpMessage(scenario, channel, daysSinceReply, additionalContext);
      setMessage(generatedText);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = useCallback(() => {
    if (!message) return;
    navigator.clipboard.writeText(message).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    });
  }, [message]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full border border-blue-100">
            Industry: IT Services and Marketing
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Follow-Up Generator
          </h1>
          <p className="text-gray-500 text-lg">
            Create professional, pressure-free follow-up messages in seconds.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Scenario Dropdown */}
            <div>
              <label htmlFor="scenario" className="block text-sm font-semibold text-gray-700 mb-2">
                Follow-up Scenario
              </label>
              <select
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value as FollowUpScenario)}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              >
                {Object.values(FollowUpScenario).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel Dropdown */}
            <div>
              <label htmlFor="channel" className="block text-sm font-semibold text-gray-700 mb-2">
                Channel
              </label>
              <select
                id="channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value as Channel)}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              >
                {Object.values(Channel).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Days Since Last Reply Input */}
            <div className="md:col-span-1">
              <label htmlFor="days" className="block text-sm font-semibold text-gray-700 mb-2">
                Days since last reply
              </label>
              <input
                id="days"
                type="number"
                min="1"
                value={daysSinceReply}
                onChange={(e) => setDaysSinceReply(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800"
              />
            </div>

            {/* Additional Context Input */}
            <div className="md:col-span-3">
              <label htmlFor="context" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional context (optional)
              </label>
              <textarea
                id="context"
                rows={1}
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="e.g. Proposal sent on 12 Aug, client asked for time..."
                className="w-full h-12 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 resize-none overflow-hidden"
                style={{ height: '3rem' }}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className={`w-full h-12 font-semibold text-white rounded-lg transition-all flex items-center justify-center
              ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              'Generate Message'
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Result Text Area */}
          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Generated Message
            </label>
            <div className="relative group">
              <textarea
                readOnly
                value={message}
                placeholder="Your message will appear here..."
                className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none resize-none text-gray-800 font-normal leading-relaxed"
              />
              {message && (
                <button
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 active:scale-95 transition-all shadow-sm flex items-center gap-2"
                >
                  {copySuccess ? (
                    <>
                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Copied. Ready to send.
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                      Copy message
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-xs">
            Powered by Gemini AI • Tailored for IT & Marketing Sales
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
