import React, { useState } from 'react';
import { Zap, Trophy, Footprints } from 'lucide-react';

export const RunningPaceTool: React.FC = () => {
  const [paceMin, setPaceMin] = useState<number>(5);
  const [paceSec, setPaceSec] = useState<number>(30);
  const [unit, setUnit] = useState<'km' | 'mile'>('km');
  const [heightCm, setHeightCm] = useState<number>(178);

  const totalPaceSeconds = paceMin * 60 + paceSec;

  const pacePerKmSec = unit === 'km' ? totalPaceSeconds : totalPaceSeconds / 1.60934;
  const pacePerMileSec = unit === 'mile' ? totalPaceSeconds : totalPaceSeconds * 1.60934;

  const speedKmh = 3600 / pacePerKmSec;
  const speedMph = 3600 / pacePerMileSec;

  const formatPace = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const formatFinishTime = (distKm: number) => {
    const totalSec = pacePerKmSec * distKm;
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = Math.round(totalSec % 60);

    if (hours > 0) {
      return `${hours}h ${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    }
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const runStrideCm = Math.round(heightCm * 0.72);
  const stepsPerKm = Math.round(100000 / runStrideCm);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 mb-3">
          <Zap className="h-3.5 w-3.5" />
          <span>Striid Running & Movement Suite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Race Pace & Stride Calculator
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-lg mx-auto">
          Convert pace, predict finish times for 5k to Marathon, and calculate biomechanical stride length.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-2">
              Target Running Pace
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">MINUTES</span>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={paceMin}
                  onChange={(e) => setPaceMin(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-center font-mono font-bold text-white text-lg"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold block mb-1">SECONDS</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={paceSec}
                  onChange={(e) => setPaceSec(Math.min(59, Math.max(0, Number(e.target.value))))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-center font-mono font-bold text-white text-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUnit('km')}
                className={`rounded-xl border p-2 text-xs font-bold transition-all ${
                  unit === 'km'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                / km
              </button>
              <button
                type="button"
                onClick={() => setUnit('mile')}
                className={`rounded-xl border p-2 text-xs font-bold transition-all ${
                  unit === 'mile'
                    ? 'border-blue-500 bg-blue-500/10 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400'
                }`}
              >
                / mile
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>Your Height:</span>
              <span className="text-blue-400 font-mono">{heightCm} cm</span>
            </div>
            <input
              type="range"
              min={140}
              max={210}
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Results */}
        <div className="md:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-slate-950/60 p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">PACE / KM</p>
              <p className="text-base font-black text-white mt-1">{formatPace(pacePerKmSec)}</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">PACE / MILE</p>
              <p className="text-base font-black text-white mt-1">{formatPace(pacePerMileSec)}</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">SPEED KM/H</p>
              <p className="text-base font-black text-blue-400 mt-1">{speedKmh.toFixed(1)} km/h</p>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl">
              <p className="text-[10px] text-slate-500 font-bold">SPEED MPH</p>
              <p className="text-base font-black text-blue-400 mt-1">{speedMph.toFixed(1)} mph</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
              <Trophy className="h-4 w-4 text-amber-400" />
              <span>Predicted Race Finish Times</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: '5K Parkrun', dist: 5 },
                { name: '10K Race', dist: 10 },
                { name: 'Half Marathon', dist: 21.0975 },
                { name: 'Full Marathon', dist: 42.195 },
              ].map((race) => (
                <div key={race.name} className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
                  <p className="text-[11px] font-bold text-slate-400">{race.name}</p>
                  <p className="text-sm font-black text-white mt-1">{formatFinishTime(race.dist)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600/10 text-blue-400 font-bold">
                <Footprints className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-white">Estimated Running Stride: {runStrideCm} cm</p>
                <p className="text-slate-400 text-[11px]">~{stepsPerKm.toLocaleString()} steps per km (~{(stepsPerKm * 1.609).toFixed(0)} steps / mile)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
