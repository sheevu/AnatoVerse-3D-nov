import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Upload,
  Camera,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  X,
  Scan,
  RefreshCw,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { TestRow, OrganKey } from '../../types';
import { parseMedicalDocument } from '../../services/aiScanner';
import { ORGANS } from '../../services/medicalRules';
import { SAMPLE_REPORTS } from '../../services/sampleReports';

interface QuickScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyReport: (rows: TestRow[], title?: string) => void;
}

export function QuickScanModal({ isOpen, onClose, onApplyReport }: QuickScanModalProps) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'hi' ? 'hi' : 'en';

  const [isScanning, setIsScanning] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [extractedRows, setExtractedRows] = useState<TestRow[] | null>(null);
  const [reportTitle, setReportTitle] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'camera' | 'samples' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessFile = async (file: File) => {
    setIsScanning(true);
    setOcrStatus(lang === 'hi' ? 'दस्तावेज़ स्कैन हो रहा है...' : 'Scanning medical document with OCR...');
    try {
      const result = await parseMedicalDocument(file, file.name, (msg) => setOcrStatus(msg));
      setReportTitle(file.name.replace(/\.[^/.]+$/, ''));
      setExtractedRows(result.rows);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
      setOcrStatus('');
    }
  };

  const handleProcessPastedText = async () => {
    if (!pastedText.trim()) return;
    setIsScanning(true);
    setOcrStatus('Parsing medical text...');
    try {
      const result = await parseMedicalDocument(pastedText, 'Pasted Lab Report');
      setReportTitle('Pasted Lab Report');
      setExtractedRows(result.rows);
    } catch (err) {
      console.error('Text parsing error:', err);
    } finally {
      setIsScanning(false);
      setOcrStatus('');
    }
  };

  const handleLoadSample = (idx: number) => {
    const sample = SAMPLE_REPORTS[idx];
    setReportTitle(sample.title);
    setExtractedRows(sample.rows.map((r, i) => ({ ...r, id: `sample-${Date.now()}-${i}` })));
  };

  const handleApply = () => {
    if (extractedRows && extractedRows.length > 0) {
      onApplyReport(extractedRows, reportTitle || 'Scanned Lab Report');
      onClose();
    }
  };

  const criticalCount = extractedRows?.filter((r) => r.status === 'high' || r.status === 'low').length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Scan className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'मेडिकल रिपोर्ट स्कैन व OCR' : 'Scan Medical Report & OCR'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                  Deep Vision
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'hi'
                  ? 'अपनी किसी भी लैब रिपोर्ट (PDF, फोटो, टेक्स्ट) को 3D मॉडल पर मैप करें'
                  : 'Deeply scan any lab report (PDF, Image, Text) and map biomarkers directly to 3D anatomy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Tabs */}
        {!extractedRows && (
          <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'upload' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload PDF/Image</span>
            </button>
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'camera' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Photo</span>
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'paste' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paste Text</span>
            </button>
            <button
              onClick={() => setActiveTab('samples')}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                activeTab === 'samples' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Preset Samples</span>
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {isScanning ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-pulse">
                <RefreshCw className="w-8 h-8 animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">Processing Document with Neural OCR...</h4>
                <p className="text-xs text-slate-400 max-w-sm font-mono">{ocrStatus || 'Extracting biomarkers...'}</p>
              </div>
            </div>
          ) : extractedRows ? (
            <div className="space-y-4">
              {/* Scan Summary Banner */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-sm">{reportTitle}</h4>
                  <p className="text-[11px] text-slate-400">
                    Extracted {extractedRows.length} clinical biomarkers
                  </p>
                </div>
                {criticalCount > 0 ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-950/80 border border-red-600 text-red-200 text-xs font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                    <span>{criticalCount} Critical Biomarkers</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>All Within Range</span>
                  </div>
                )}
              </div>

              {/* Extracted Biomarker List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {extractedRows.map((row) => {
                  const organ = row.organ ? ORGANS[row.organ] : null;
                  const isAbnormal = row.status === 'high' || row.status === 'low';
                  return (
                    <div
                      key={row.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                        isAbnormal
                          ? 'bg-red-950/30 border-red-800/80 text-red-200'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {organ && (
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: organ.color }}
                            title={organ.nameEn}
                          />
                        )}
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            <span>{row.name}</span>
                            {organ && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-normal">
                                {organ.nameEn.split(' ')[0]}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Reference: {row.range} {row.unit}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-black text-sm text-white">
                          {row.value} <span className="text-xs font-normal text-slate-400">{row.unit}</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                            row.status === 'high'
                              ? 'bg-red-900 text-red-200'
                              : row.status === 'low'
                              ? 'bg-amber-900 text-amber-200'
                              : 'bg-emerald-950 text-emerald-300'
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <button
                  onClick={() => setExtractedRows(null)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all"
                >
                  Scan Another Report
                </button>
                <button
                  onClick={handleApply}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg flex items-center gap-1.5 transition-all"
                >
                  <span>Highlight on 3D Body</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'upload' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-900/60 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProcessFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-white">
                    Click to upload or drag & drop lab report
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Supports high-resolution PDF, PNG, JPG, or photographed reports
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                    <span>PDF</span> • <span>PNG</span> • <span>JPG</span> • <span>WEBP</span>
                  </div>
                </div>
              )}

              {activeTab === 'camera' && (
                <div
                  onClick={() => cameraInputRef.current?.click()}
                  className="border-2 border-dashed border-cyan-800/80 hover:border-cyan-500 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-950/40 hover:bg-slate-900/60 group"
                >
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProcessFile(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-white">Take a Photo of Paper Report</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Direct camera capture with automatic text normalization & contrast enhancement
                  </p>
                </div>
              )}

              {activeTab === 'paste' && (
                <div className="space-y-3">
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste medical report lines or values here...&#10;e.g.&#10;Fasting Blood Glucose 142 mg/dL 70-99 High&#10;Serum Creatinine 1.5 mg/dL 0.7-1.3 High&#10;Total Cholesterol 245 mg/dL <200 High"
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    onClick={handleProcessPastedText}
                    disabled={!pastedText.trim()}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract Biomarkers & Correlate Organs</span>
                  </button>
                </div>
              )}

              {activeTab === 'samples' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SAMPLE_REPORTS.map((rep, idx) => (
                    <button
                      key={`sample-${idx}`}
                      onClick={() => handleLoadSample(idx)}
                      className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-all space-y-1 hover:border-emerald-500/60 group"
                    >
                      <div className="font-bold text-xs text-white group-hover:text-emerald-300">
                        {rep.title}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between">
                        <span>{rep.labName}</span>
                        <span className="font-mono text-emerald-400">{rep.rows.length} Tests</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
