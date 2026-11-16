import React, { useState } from 'react';
import { OrganKey } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import { playOrganClickChime } from '../../utils/audioChime';
import {
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  X,
  Award,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  correctOrgan: OrganKey;
  options: OrganKey[];
  explanationEn: string;
  explanationHi: string;
  clinicalRelevanceEn: string;
  clinicalRelevanceHi: string;
}

export const ANATOMY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    questionEn: 'Which organ produces insulin and glucagon to maintain systemic blood glucose homeostasis?',
    questionHi: 'रक्त शर्करा (ग्लूकोज) के स्तर को नियंत्रित करने के लिए इंसुलिन और ग्लूकागन का उत्पादन कौन सा अंग करता है?',
    correctOrgan: 'pancreas',
    options: ['liver', 'pancreas', 'stomach', 'kidneys'],
    explanationEn: 'The pancreas houses the Islets of Langerhans, containing beta cells that secrete insulin and alpha cells that secrete glucagon.',
    explanationHi: 'अग्न्याशय में लैंगरहैंस के द्वीप समूह होते हैं, जिनकी बीटा कोशिकाएं इंसुलिन और अल्फा कोशिकाएं ग्लूकागन का स्राव करती हैं।',
    clinicalRelevanceEn: 'Key biomarkers: HbA1c, Fasting Blood Glucose, C-Peptide.',
    clinicalRelevanceHi: 'मुख्य जांच: HbA1c, खाली पेट रक्त शर्करा, सी-पेप्टाइड।',
  },
  {
    id: 'q2',
    questionEn: 'Which metabolic organ executes first-pass drug metabolism, detoxifies ammonia to urea, and secretes bile?',
    questionHi: 'कौन सा चयापचय अंग दवाओं का चयापचय करता है, अमोनिया को यूरिया में बदलता है और पित्त रस बनाता है?',
    correctOrgan: 'liver',
    options: ['stomach', 'kidneys', 'liver', 'intestines'],
    explanationEn: 'The liver is the primary metabolic organ of the body, performing over 500 chemical synthesis and detoxification tasks.',
    explanationHi: 'यकृत शरीर का मुख्य चयापचय अंग है, जो 500 से अधिक रासायनिक संश्लेषण और विषहरण कार्य करता है।',
    clinicalRelevanceEn: 'Key biomarkers: SGOT (AST), SGPT (ALT), Bilirubin, Alkaline Phosphatase.',
    clinicalRelevanceHi: 'मुख्य जांच: एसजीओटी (AST), एसजीपीटी (ALT), बिलीरुबिन, क्षारीय फॉस्फेटेज।',
  },
  {
    id: 'q3',
    questionEn: 'Which bilateral organs filter plasma via glomeruli and regulate blood pressure via the renin-angiotensin system?',
    questionHi: 'नेफ्रॉन द्वारा रक्त प्लाज्मा को छानने और रेनिन प्रणाली द्वारा रक्तचाप को नियंत्रित करने वाले अंग कौन से हैं?',
    correctOrgan: 'kidneys',
    options: ['lungs', 'kidneys', 'pancreas', 'heart'],
    explanationEn: 'The kidneys filter approximately 180 liters of fluid daily, balancing electrolytes, fluid volume, and producing erythropoietin.',
    explanationHi: 'गुर्दे प्रतिदिन लगभग 180 लीटर तरल पदार्थ को छानते हैं, इलेक्ट्रोलाइट्स और रक्तचाप को संतुलित रखते हैं।',
    clinicalRelevanceEn: 'Key biomarkers: Serum Creatinine, Blood Urea Nitrogen (BUN), eGFR.',
    clinicalRelevanceHi: 'मुख्य जांच: सीरम क्रिएटिनिन, ब्लड यूरिया नाइट्रोजन (BUN), eGFR।',
  },
  {
    id: 'q4',
    questionEn: 'Which primary respiratory organs contain over 300 million alveoli for oxygen and carbon dioxide diffusion?',
    questionHi: 'ऑक्सीजन और कार्बन डाइऑक्साइड के विनिमय के लिए 30 करोड़ से अधिक वायुकोष किस अंग में होते हैं?',
    correctOrgan: 'lungs',
    options: ['heart', 'lungs', 'brain', 'liver'],
    explanationEn: 'The bilateral lungs facilitate pulmonary gas exchange across the thin alveolar-capillary membrane with a surface area of ~70 m².',
    explanationHi: 'फेफड़े लगभग 70 वर्ग मीटर के विशाल आंतरिक क्षेत्रफल में ऑक्सीजन और कार्बन डाइऑक्साइड का त्वरित विनिमय करते हैं।',
    clinicalRelevanceEn: 'Key biomarkers: SpO2, Arterial Blood Gas (ABG), Spirometry FEV1/FVC.',
    clinicalRelevanceHi: 'मुख्य जांच: SpO2, धमनी रक्त गैस (ABG), स्पाइरोमेट्री।',
  },
  {
    id: 'q5',
    questionEn: 'Which muscular pump generates coronary and systemic systolic perfusion pressures to circulate oxygenated blood?',
    questionHi: 'पूरे शरीर में ऑक्सीजन युक्त रक्त प्रसारित करने के लिए सिस्टोलिक दबाव उत्पन्न करने वाला मांसपेशीय अंग कौन सा है?',
    correctOrgan: 'heart',
    options: ['brain', 'lungs', 'heart', 'liver'],
    explanationEn: 'The four-chambered heart beats ~100,000 times daily, ejecting cardiac output through the aorta into systemic capillary beds.',
    explanationHi: 'चार कक्षों वाला हृदय प्रतिदिन लगभग 1,00,000 बार धड़कता है और महाधमनी के माध्यम से पूरे शरीर में रक्त पंप करता है।',
    clinicalRelevanceEn: 'Key biomarkers: Troponin I/T, Lipid Profile, ECG Lead II, NT-proBNP.',
    clinicalRelevanceHi: 'मुख्य जांच: ट्रोपोनिन, लिपिड प्रोफाइल, ईसीजी, NT-proBNP।',
  },
];

interface AnatomyQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrgan: (organ: OrganKey) => void;
  lang?: string;
}

export function AnatomyQuizModal({
  isOpen,
  onClose,
  onSelectOrgan,
  lang = 'en',
}: AnatomyQuizModalProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<OrganKey | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const q = ANATOMY_QUIZ_QUESTIONS[currentIdx];

  const handleChoose = (organ: OrganKey) => {
    if (selectedAnswer) return; // prevent re-clicking
    setSelectedAnswer(organ);
    onSelectOrgan(organ);

    const isCorrect = organ === q.correctOrgan;
    if (isCorrect) {
      setScore((s) => s + 1);
      playOrganClickChime(880);
    } else {
      playOrganClickChime(320);
    }

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.(isCorrect ? [25, 50, 25] : [60]);
    }
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    if (currentIdx < ANATOMY_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-emerald-500/30 p-5 sm:p-6 text-white shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 shadow-sm">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-black text-sm tracking-tight text-white flex items-center gap-2">
                <span>{lang === 'hi' ? 'इंटरैक्टिव एनाटॉमी क्विज़' : 'Interactive Anatomy Quiz'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  {showResult ? 'Complete' : `${currentIdx + 1} / ${ANATOMY_QUIZ_QUESTIONS.length}`}
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Score: {score} / {ANATOMY_QUIZ_QUESTIONS.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showResult ? (
          <>
            {/* Question Card */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-100 leading-snug">
                {lang === 'hi' ? q.questionHi : q.questionEn}
              </p>

              {/* 4 Interactive Option Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {q.options.map((key) => {
                  const meta = ORGANS[key];
                  const isChosen = selectedAnswer === key;
                  const isCorrect = key === q.correctOrgan;

                  let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-emerald-500/50';
                  if (selectedAnswer) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400';
                    } else if (isChosen) {
                      btnStyle = 'bg-red-950 border-red-600 text-red-200';
                    } else {
                      btnStyle = 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleChoose(key)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between font-bold text-xs transition-all ${btnStyle}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: meta.color }}
                        />
                        <span>{lang === 'hi' ? meta.nameHi : meta.nameEn}</span>
                      </div>
                      {selectedAnswer && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {selectedAnswer && isChosen && !isCorrect && (
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation card revealed after answering */}
            {selectedAnswer && (
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clinical Rationale</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {lang === 'hi' ? q.explanationHi : q.explanationEn}
                </p>
                <div className="pt-1 text-[10px] text-cyan-300/80 font-mono">
                  {lang === 'hi' ? q.clinicalRelevanceHi : q.clinicalRelevanceEn}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-400">
                Clicking an option isolates & highlights that organ in 3D
              </span>

              {selectedAnswer && (
                <button
                  onClick={nextQuestion}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-950 animate-in fade-in"
                >
                  <span>{currentIdx < ANATOMY_QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Score'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        ) : (
          /* Result Card */
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="inline-flex p-4 rounded-3xl bg-emerald-950/70 border border-emerald-500 text-emerald-400 shadow-2xl">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-white">
                {score >= 4 ? 'Clinical Excellence!' : 'Quiz Completed!'}
              </h4>
              <p className="text-xs text-slate-300">
                You scored <strong className="text-emerald-400 text-base">{score}</strong> out of {ANATOMY_QUIZ_QUESTIONS.length} on Human Anatomy & Biomarkers
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={restartQuiz}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Try Again</span>
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950"
              >
                Return to 3D Anatomy
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
