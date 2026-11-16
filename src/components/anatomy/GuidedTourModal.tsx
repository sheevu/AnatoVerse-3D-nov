import React, { useState, useEffect } from 'react';
import { OrganKey } from '../../types';
import { ORGANS } from '../../services/medicalRules';
import { playOrganClickChime } from '../../utils/audioChime';
import {
  Compass,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  X,
  Volume2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export interface TourStation {
  id: string;
  organKey: OrganKey | null;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  subtitleHi: string;
  bodyEn: string;
  bodyHi: string;
  cameraAngle: 'front' | 'back' | 'left' | 'right' | 'top';
  highlightedSystems: string[];
  ayurvedaCorrelateEn: string;
  ayurvedaCorrelateHi: string;
}

export const ANATOMY_TOUR_STATIONS: TourStation[] = [
  {
    id: 'skeletal_foundation',
    organKey: null,
    titleEn: '1. The Human Architecture & Skeleton',
    titleHi: '1. मानव संरचना और कंकाल तंत्र',
    subtitleEn: 'Osteological Armature & Axial Framework',
    subtitleHi: 'अस्थि ढांचा और अक्षीय कंकाल',
    bodyEn:
      'The adult human skeleton comprises 206 bones, forming the primary biomechanical scaffolding for organ protection, hematopoiesis (blood cell production in bone marrow), and calcium homeostasis.',
    bodyHi:
      'वयस्क मानव कंकाल में 206 हड्डियां होती हैं, जो अंगों की सुरक्षा, अस्थि मज्जा में रक्त निर्माण और खनिज संतुलन के लिए मुख्य संरचना बनाती हैं।',
    cameraAngle: 'front',
    highlightedSystems: ['skeletal'],
    ayurvedaCorrelateEn: 'Asthi Dhatu (Bone tissue governed by Vata Dosha)',
    ayurvedaCorrelateHi: 'अस्थि धातु (वात दोष द्वारा नियंत्रित)',
  },
  {
    id: 'cardiovascular_engine',
    organKey: 'heart',
    titleEn: '2. The Cardiovascular Engine (Heart & Great Vessels)',
    titleHi: '2. कार्डियोवास्कुलर इंजन (हृदय और महाधमनी)',
    subtitleEn: 'Systemic Hemodynamics & Myocardial Perfusion',
    subtitleHi: 'रक्त प्रवाह गतिशीलता और हृदय की मांसपेशियां',
    bodyEn:
      'Pumping approximately 5 liters of blood per minute through 100,000 kilometers of blood vessels, the four-chambered heart delivers oxygenated erythrocytes to every organ via the ascending and descending aorta.',
    bodyHi:
      'प्रति मिनट लगभग 5 लीटर रक्त को 1,00,000 किलोमीटर लंबी रक्त वाहिकाओं में पंप करते हुए, चार कक्षों वाला हृदय पूरे शरीर में ऑक्सीजन युक्त रक्त पहुंचाता है।',
    cameraAngle: 'front',
    highlightedSystems: ['cardiovascular'],
    ayurvedaCorrelateEn: 'Hridaya: Seat of Prana Vayu and Sadhaka Pitta',
    ayurvedaCorrelateHi: 'हृदय: प्राण वायु और साधक पित्त का प्रमुख केंद्र',
  },
  {
    id: 'respiratory_axis',
    organKey: 'lungs',
    titleEn: '3. The Respiratory Axis (Bilateral Lungs)',
    titleHi: '3. श्वसन तंत्र (फेफड़े और वायुमार्ग)',
    subtitleEn: 'Alveolar Gas Exchange & Acid-Base Buffer',
    subtitleHi: 'वायुकोशीय गैस विनिमय और अम्ल-क्षार संतुलन',
    bodyEn:
      'With over 300 million micro-alveoli providing an internal surface area of 70 square meters, the lungs exchange oxygen and carbon dioxide while dynamically regulating blood pH.',
    bodyHi:
      '30 करोड़ से अधिक सूक्ष्म वायुकोषों के साथ, फेफड़े 70 वर्ग मीटर का आंतरिक क्षेत्रफल प्रदान करते हैं जो ऑक्सीजन अवशोषण और रक्त pH संतुलन को नियंत्रित करता है।',
    cameraAngle: 'front',
    highlightedSystems: ['respiratory'],
    ayurvedaCorrelateEn: 'Phupphusa: Associated with Udana Vayu and Avalambaka Kapha',
    ayurvedaCorrelateHi: 'फुप्फुस: उदान वायु और अवलंबक कफ से संबंधित',
  },
  {
    id: 'metabolic_core',
    organKey: 'liver',
    titleEn: '4. The Metabolic Laboratory (Liver & Digestion)',
    titleHi: '4. चयापचय प्रयोगशाला (यकृत और पाचन)',
    subtitleEn: 'Hepatic Detoxification, Bile & Glycogen Synthesis',
    subtitleHi: 'विषहरण, पित्त रस निर्माण और ग्लाइकोजन भंडारण',
    bodyEn:
      'Weighing ~1.5 kg, the liver is the body’s metabolic powerhouse, executing over 500 chemical operations including lipid synthesis, amino acid deamination, glucose storage, and pharmaceutical breakdown.',
    bodyHi:
      'लगभग 1.5 किलोग्राम वजन का यकृत शरीर की सबसे बड़ी ग्रंथि है, जो 500 से अधिक रासायनिक कार्यों को संभालता है, जिसमें विषहरण और पित्त का निर्माण शामिल है।',
    cameraAngle: 'front',
    highlightedSystems: ['digestive'],
    ayurvedaCorrelateEn: 'Yakrit: Primary seat of Ranjaka Pitta & Rakta Dhatu formation',
    ayurvedaCorrelateHi: 'यकृत: रंजक पित्त और रक्त धातु निर्माण का मुख्य स्थल',
  },
  {
    id: 'renal_filtration',
    organKey: 'kidneys',
    titleEn: '5. Renal Filtration & Homeostasis (Kidneys & Ureters)',
    titleHi: '5. गुर्दे और मूत्र प्रणाली (रक्त शोधन)',
    subtitleEn: 'Glomerular Filtration Rate & Electrolyte Regulation',
    subtitleHi: 'ग्लोमेरुलर निस्पंदन और इलेक्ट्रोलाइट संतुलन',
    bodyEn:
      'Each kidney houses ~1 million microscopic nephrons that filter 180 liters of blood plasma daily, eliminating urea, creatinine, and metabolic wastes while regulating blood pressure via the renin-angiotensin axis.',
    bodyHi:
      'प्रत्येक गुर्दे में लगभग 10 लाख नेफ्रॉन होते हैं जो प्रतिदिन 180 लीटर रक्त प्लाज्मा को छानते हैं और अपशिष्ट उत्पादों को मूत्र के रूप में बाहर निकालते हैं।',
    cameraAngle: 'back',
    highlightedSystems: ['urinary'],
    ayurvedaCorrelateEn: 'Vrikka: Governed by Apana Vayu & Medovaha Srotas',
    ayurvedaCorrelateHi: 'वृक्क: अपान वायु और मेदोवह स्रोतस से संचालित',
  },
  {
    id: 'neural_command',
    organKey: 'brain',
    titleEn: '6. The Master Command Center (Brain & Cranial Axis)',
    titleHi: '6. केंद्रीय नियंत्रण केंद्र (मस्तिष्क और तंत्रिका तंत्र)',
    subtitleEn: '86 Billion Neurons, Cognition & Autonomic Homeostasis',
    subtitleHi: '86 अरब न्यूरॉन्स, चेतना और स्वायत्त नियंत्रण',
    bodyEn:
      'Consuming 20% of the body’s resting energy, the human brain coordinates sensory perception, voluntary motor action, autonomic heart rate/respiration, endocrine signaling, and memory.',
    bodyHi:
      'शरीर की 20% ऊर्जा की खपत करने वाला मस्तिष्क, संवेदी अनुभव, स्मृति, विचार, और सभी अंगों की स्वायत्त गतिविधियों का सर्वोच्च नियंत्रण केंद्र है।',
    cameraAngle: 'top',
    highlightedSystems: ['nervous'],
    ayurvedaCorrelateEn: 'Shiras / Majja Dhatu: Seat of Tarpaka Kapha & Prana',
    ayurvedaCorrelateHi: 'शिरस / मज्जा धातु: तर्पक कफ और प्राण का मूल स्थान',
  },
];

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOrgan: (organ: OrganKey | null) => void;
  onSelectAngle: (angle: 'front' | 'back' | 'left' | 'right' | 'top') => void;
  lang?: string;
}

export function GuidedTourModal({
  isOpen,
  onClose,
  onSelectOrgan,
  onSelectAngle,
  lang = 'en',
}: GuidedTourModalProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStation = ANATOMY_TOUR_STATIONS[currentStepIndex];

  // Navigate to step
  const goToStep = (index: number) => {
    if (index < 0 || index >= ANATOMY_TOUR_STATIONS.length) return;
    setCurrentStepIndex(index);
    const station = ANATOMY_TOUR_STATIONS[index];
    onSelectOrgan(station.organKey);
    onSelectAngle(station.cameraAngle);
    playOrganClickChime(560 + index * 40);
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([15]);
    }
  };

  // Auto-play timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < ANATOMY_TOUR_STATIONS.length - 1) {
          goToStep(currentStepIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 7000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex]);

  // Activate station when tour opens
  useEffect(() => {
    if (isOpen) {
      const station = ANATOMY_TOUR_STATIONS[currentStepIndex];
      onSelectOrgan(station.organKey);
      onSelectAngle(station.cameraAngle);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-cyan-500/30 p-5 sm:p-6 text-white shadow-2xl relative space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 shadow-sm">
              <Compass className="w-4 h-4 animate-spin" />
            </span>
            <div>
              <h3 className="font-black text-sm tracking-tight text-white flex items-center gap-2">
                <span>{lang === 'hi' ? '3D एनाटॉमी निर्देशित यात्रा' : 'Guided 3D Anatomy Tour'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  {currentStepIndex + 1} / {ANATOMY_TOUR_STATIONS.length}
                </span>
              </h3>
              <p className="text-[11px] text-cyan-300/80">
                {lang === 'hi' ? currentStation.subtitleHi : currentStation.subtitleEn}
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

        {/* Station Title & Scientific Explanation */}
        <div className="space-y-2">
          <h4 className="text-base font-black text-white">
            {lang === 'hi' ? currentStation.titleHi : currentStation.titleEn}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'hi' ? currentStation.bodyHi : currentStation.bodyEn}
          </p>

          {/* Ayurveda Correlation Demarcation */}
          <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/50 text-[11px] text-teal-200 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <div>
              <strong className="text-teal-300">
                {lang === 'hi' ? 'आयुर्वेद सहसंबंध:' : 'Ayurvedic Correlate:'}
              </strong>{' '}
              {lang === 'hi'
                ? currentStation.ayurvedaCorrelateHi
                : currentStation.ayurvedaCorrelateEn}
            </div>
          </div>
        </div>

        {/* Step Progress Indicators */}
        <div className="grid grid-cols-6 gap-1.5 py-1">
          {ANATOMY_TOUR_STATIONS.map((st, i) => (
            <button
              key={st.id}
              onClick={() => goToStep(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStepIndex
                  ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,229,255,0.6)]'
                  : i < currentStepIndex
                  ? 'bg-emerald-500/60'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Interactive Controls Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                isPlaying
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              onClick={() => goToStep(0)}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Restart Tour"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentStepIndex === 0}
              onClick={() => goToStep(currentStepIndex - 1)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-bold flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentStepIndex < ANATOMY_TOUR_STATIONS.length - 1 ? (
              <button
                onClick={() => goToStep(currentStepIndex + 1)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg shadow-cyan-950"
              >
                <span>Next Station</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish Tour</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
