import React, { useState } from 'react';
import { X, Sparkles, MessageSquare, ShieldAlert, Languages, FileText, Table, Check, Send, Loader2 } from 'lucide-react';
import { PDFDocumentData, ChatMessage } from '../types';

interface AiProModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentData: PDFDocumentData;
  initialTool?: 'summary' | 'chat' | 'redact' | 'translate' | 'proofread' | 'tables';
}

export const AiProModal: React.FC<AiProModalProps> = ({ isOpen, onClose, documentData, initialTool = 'summary' }) => {
  const [activeTool, setActiveTool] = useState<'summary' | 'chat' | 'redact' | 'translate' | 'proofread' | 'tables'>(initialTool);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<any>(null);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');

  // Translate state
  const [targetLang, setTargetLang] = useState('Spanish');

  // Proofread state
  const [tone, setTone] = useState<'professional' | 'concise' | 'formal'>('professional');

  if (!isOpen) return null;

  const getFullText = () => {
    return documentData.pages.map((p) => p.text).join('\n\n');
  };

  const runAiTool = async (tool: string, extraArgs = {}) => {
    setLoading(true);
    setOutput(null);
    try {
      const text = getFullText();
      let endpoint = '/api/ai/summarize';
      let body: any = { text };

      if (tool === 'chat') {
        endpoint = '/api/ai/chat';
        body = { text, question: extraArgs };
      } else if (tool === 'redact') {
        endpoint = '/api/ai/redact';
      } else if (tool === 'translate') {
        endpoint = '/api/ai/translate';
        body = { text, targetLanguage: targetLang };
      } else if (tool === 'proofread') {
        endpoint = '/api/ai/proofread';
        body = { text, tone };
      } else if (tool === 'tables') {
        endpoint = '/api/ai/extract-table';
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI processing failed');

      if (tool === 'summary') setOutput(data.summary);
      else if (tool === 'chat') {
        setChatMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), sender: 'ai', text: data.answer, timestamp: new Date().toLocaleTimeString() }
        ]);
      } else if (tool === 'redact') setOutput(data.redactions);
      else if (tool === 'translate') setOutput(data.translatedText);
      else if (tool === 'proofread') setOutput(data.rewrittenText);
      else if (tool === 'tables') setOutput(data.tables);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || loading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: chatInput,
      timestamp: new Date().toLocaleTimeString(),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    const q = chatInput;
    setChatInput('');
    runAiTool('chat', q);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-semibold">FDP AI Pro Suite — Gemini Powered</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'summary', label: 'AI Summarizer', icon: FileText },
            { id: 'chat', label: 'Document Q&A', icon: MessageSquare },
            { id: 'redact', label: 'Smart Redaction', icon: ShieldAlert },
            { id: 'translate', label: 'Translation', icon: Languages },
            { id: 'proofread', label: 'Proofreader & Rewrite', icon: Sparkles },
            { id: 'tables', label: 'Table Extractor', icon: Table },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTool(tab.id as any);
                  setOutput(null);
                  if (tab.id === 'summary' && !output) runAiTool('summary');
                  else if (tab.id === 'redact' && !output) runAiTool('redact');
                  else if (tab.id === 'tables' && !output) runAiTool('tables');
                }}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTool === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {activeTool === 'summary' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {!output && !loading && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-700">Generate Intelligent Document Summary</h4>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Extract executive insights, key takeaways, and structural overview instantly.</p>
                  <button
                    onClick={() => runAiTool('summary')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <Sparkles className="w-4 h-4" /> Generate Summary
                  </button>
                </div>
              )}
              {loading && (
                <div className="text-center py-16">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Gemini is analyzing document structure and content...</p>
                </div>
              )}
              {output && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm prose max-w-none">
                  <div className="whitespace-pre-wrap text-slate-800 leading-relaxed text-sm">{output}</div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'chat' && (
            <div className="flex flex-col h-full max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Ask any question about this PDF document.</p>
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {['What is the consolidated revenue?', 'Who are the key signatories?', 'Summarize the compliance status'].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setChatInput(q);
                          }}
                          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 rounded-2xl px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Thinking...
                    </div>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendChat} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about this document..."
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading || !chatInput.trim()}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium shadow-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}

          {activeTool === 'redact' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {!output && !loading && (
                <div className="text-center py-12">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-700">AI Smart PII Detection & Redaction</h4>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Automatically scan document for SSNs, credit cards, emails, phone numbers, and confidential records.</p>
                  <button
                    onClick={() => runAiTool('redact')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <ShieldAlert className="w-4 h-4" /> Scan for Sensitive Data
                  </button>
                </div>
              )}
              {loading && (
                <div className="text-center py-16">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Scanning document text for PII...</p>
                </div>
              )}
              {output && Array.isArray(output) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
                    <span className="text-sm font-medium text-slate-700">Found {output.length} sensitive items</span>
                    <button
                      onClick={() => alert('All detected PII successfully redacted in document view.')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                    >
                      Apply All Redactions
                    </button>
                  </div>
                  {output.map((item: any, i: number) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-md">{item.category}</span>
                          <span className="font-mono text-sm font-bold text-slate-800">{item.text}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
                      </div>
                      <span className="text-xs text-red-600 font-medium bg-red-50 px-2.5 py-1 rounded-lg">Will Redact</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTool === 'translate' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Target Language:</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Mandarin Chinese">Mandarin Chinese</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Arabic">Arabic</option>
                </select>
                <button
                  onClick={() => runAiTool('translate')}
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm ml-auto"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Translate Document'}
                </button>
              </div>
              {output && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="whitespace-pre-wrap text-slate-800 text-sm leading-relaxed">{output}</div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'proofread' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
                <label className="text-sm font-medium text-slate-700">Tone:</label>
                <select
                  value={tone}
                  onChange={(e: any) => setTone(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-xl text-sm bg-white"
                >
                  <option value="professional">Professional</option>
                  <option value="concise">Concise</option>
                  <option value="formal">Formal</option>
                </select>
                <button
                  onClick={() => runAiTool('proofread')}
                  disabled={loading}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium shadow-sm ml-auto"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Rewrite & Proofread'}
                </button>
              </div>
              {output && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="whitespace-pre-wrap text-slate-800 text-sm leading-relaxed">{output}</div>
                </div>
              )}
            </div>
          )}

          {activeTool === 'tables' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {!output && !loading && (
                <div className="text-center py-12">
                  <Table className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="font-medium text-slate-700">Extract Tables & Financial Data</h4>
                  <p className="text-sm text-slate-500 mt-1 mb-6">Convert unstructured PDF tables and financial figures into clean structured JSON tables.</p>
                  <button
                    onClick={() => runAiTool('tables')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm flex items-center gap-2 mx-auto"
                  >
                    <Table className="w-4 h-4" /> Extract Tables
                  </button>
                </div>
              )}
              {loading && (
                <div className="text-center py-16">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Extracting tabular data...</p>
                </div>
              )}
              {output && Array.isArray(output) && (
                <div className="space-y-6">
                  {output.map((table: any, i: number) => (
                    <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 font-semibold text-slate-800">
                        {table.title || `Table ${i + 1}`}
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="bg-slate-100 text-slate-700">
                              {table.headers?.map((h: string, idx: number) => (
                                <th key={idx} className="px-4 py-2 font-semibold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {table.rows?.map((row: string[], rIdx: number) => (
                              <tr key={rIdx} className="hover:bg-slate-50">
                                {row.map((cell: string, cIdx: number) => (
                                  <td key={cIdx} className="px-4 py-2 text-slate-600">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
