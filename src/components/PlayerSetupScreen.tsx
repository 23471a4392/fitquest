import React, { useState } from 'react';
import type { BMICategory, FitnessGoal, PlayerProfile } from '../types/game';
import { calculateBMI, getBMICategory, getBMICategoryMeta } from '../utils/gameLogic';
import { MEDICAL_DISCLAIMER_TEXT } from '../data/gameConstants';
import { User, Activity, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';

interface PlayerSetupScreenProps {
  initialProfile: PlayerProfile | null;
  onComplete: (profile: PlayerProfile) => void;
  onBack: () => void;
}

export const PlayerSetupScreen: React.FC<PlayerSetupScreenProps> = ({
  initialProfile,
  onComplete,
  onBack,
}) => {
  const [name, setName] = useState(initialProfile?.name || '');
  const [age, setAge] = useState<number | string>(initialProfile?.age || 26);
  const [gender, setGender] = useState(initialProfile?.gender || 'Prefer not to say');
  const [heightCm, setHeightCm] = useState<number | string>(initialProfile?.heightCm || 172);
  const [currentWeightKg, setCurrentWeightKg] = useState<number | string>(initialProfile?.currentWeightKg || 78);
  const [targetWeightKg, setTargetWeightKg] = useState<number | string>(initialProfile?.targetWeightKg || 68);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(initialProfile?.fitnessGoal || 'weight_loss');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time BMI
  const numHeight = Number(heightCm) || 0;
  const numWeight = Number(currentWeightKg) || 0;
  const numTargetWeight = Number(targetWeightKg) || 0;

  const currentBMI = calculateBMI(numWeight, numHeight);
  const targetBMI = calculateBMI(numTargetWeight, numHeight);
  const bmiCategory: BMICategory = getBMICategory(currentBMI);
  const meta = getBMICategoryMeta(bmiCategory);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Please enter your runner name.';
    const numAge = Number(age);
    if (!numAge || numAge < 8 || numAge > 110) newErrors.age = 'Please enter a realistic age (8 - 110).';
    if (!numHeight || numHeight < 90 || numHeight > 250) newErrors.height = 'Please enter a valid height in cm (90 - 250).';
    if (!numWeight || numWeight < 30 || numWeight > 300) newErrors.weight = 'Please enter a valid weight in kg (30 - 300).';
    if (!numTargetWeight || numTargetWeight < 30 || numTargetWeight > 300) {
      newErrors.targetWeight = 'Please enter a valid target weight in kg (30 - 300).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const profile: PlayerProfile = {
      name: name.trim(),
      age: numAge,
      gender,
      heightCm: numHeight,
      currentWeightKg: numWeight,
      targetWeightKg: numTargetWeight,
      fitnessGoal,
      initialBMI: currentBMI,
      initialBMICategory: bmiCategory,
    };

    onComplete(profile);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 px-4">
      <div className="bg-slate-900/90 border border-lime-500/35 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        {/* Title & Motto */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={14} />
            <span>Athletic Profile Registration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight">
            Customize Your Runner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-1">
            Input your stats to calibrate the real-time metabolic and weight simulation engine.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Section 1: Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Player Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Player Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400 transition ${
                    errors.name ? 'border-rose-500' : 'border-slate-800'
                  }`}
                  maxLength={24}
                />
                <User size={16} className="absolute right-3.5 top-3 text-slate-500 pointer-events-none" />
              </div>
              {errors.name && <p className="text-rose-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Age *
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="26"
                min={8}
                max={110}
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400 transition ${
                  errors.age ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.age && <p className="text-rose-400 text-xs mt-1">{errors.age}</p>}
            </div>
          </div>

          {/* Gender (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Gender (Optional)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Male', 'Female', 'Prefer not to say'].map((g) => (
                <button
                  type="button"
                  key={g}
                  onClick={() => setGender(g)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                    gender === g
                      ? 'bg-lime-500/20 border-lime-500 text-lime-400 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Height & Weight Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Height cm */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Height (cm) *
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="172"
                min={90}
                max={250}
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400 transition ${
                  errors.height ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.height && <p className="text-rose-400 text-xs mt-1">{errors.height}</p>}
            </div>

            {/* Current Weight kg */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Weight (kg) *
              </label>
              <input
                type="number"
                step="0.5"
                value={currentWeightKg}
                onChange={(e) => setCurrentWeightKg(e.target.value)}
                placeholder="78"
                min={30}
                max={300}
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400 transition ${
                  errors.weight ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.weight && <p className="text-rose-400 text-xs mt-1">{errors.weight}</p>}
            </div>

            {/* Target Weight kg */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Weight (kg) *
              </label>
              <input
                type="number"
                step="0.5"
                value={targetWeightKg}
                onChange={(e) => setTargetWeightKg(e.target.value)}
                placeholder="68"
                min={30}
                max={300}
                className={`w-full bg-slate-950/80 border rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-lime-400 transition ${
                  errors.targetWeight ? 'border-rose-500' : 'border-slate-800'
                }`}
              />
              {errors.targetWeight && <p className="text-rose-400 text-xs mt-1">{errors.targetWeight}</p>}
            </div>
          </div>

          {/* Section 3: Fitness Goal */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Select Your Fitness Goal *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'weight_loss', label: 'Weight Loss', icon: '🔥', desc: 'Shed excess weight' },
                { id: 'maintain_weight', label: 'Maintain Weight', icon: '⚖️', desc: 'Hold healthy balance' },
                { id: 'fitness', label: 'Fitness & Stamina', icon: '⚡', desc: 'Build lean endurance' },
                { id: 'healthy_lifestyle', label: 'Healthy Lifestyle', icon: '🌱', desc: 'Long-term clean habits' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFitnessGoal(item.id as FitnessGoal)}
                  className={`p-3 rounded-xl text-left border flex flex-col justify-between transition ${
                    fitnessGoal === item.id
                      ? 'bg-lime-500/20 border-lime-400 text-lime-400 shadow-md ring-1 ring-lime-400'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="font-bold text-xs text-slate-200">{item.label}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live BMI Preview Card */}
          <div className="bg-slate-950/70 border border-lime-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-lime-500/20 border border-lime-500/40 flex items-center justify-center text-lime-400">
                <Activity size={24} />
              </div>
              <div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Initial BMI</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-slate-100">{currentBMI || '--'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${meta.badgeBg}`}>
                    {bmiCategory}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Target BMI</div>
                <div className="text-sm font-bold text-emerald-400">{targetBMI || '--'}</div>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-right">
                <div className="text-[11px] text-slate-400">Goal Delta</div>
                <div className="text-sm font-bold text-lime-400">
                  {numWeight && numTargetWeight
                    ? `${(numTargetWeight - numWeight > 0 ? '+' : '')}${(numTargetWeight - numWeight).toFixed(1)} kg`
                    : '--'}
                </div>
              </div>
            </div>
          </div>

          {/* Educational Disclaimer */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300/90 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed">
              <strong className="font-semibold text-amber-300">Screening Notice: </strong>
              {MEDICAL_DISCLAIMER_TEXT}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 hover:from-lime-400 hover:to-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 active:scale-98 transition"
            >
              <span>CONFIRM PROFILE & PLAY</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
