export interface PacingTargets {
  easyPaceMinKm: string;
  marathonPaceMinKm: string;
  thresholdPaceMinKm: string;
  interval5kPaceMinKm: string;
  repetitionPaceMinKm: string;
}

export function calculateJackDanielsPaces(fiveKmTimeSeconds: number): PacingTargets {
  const fiveKmPaceSec = fiveKmTimeSeconds / 5;
  const easyPaceSec = fiveKmPaceSec * 1.32;
  const marathonPaceSec = fiveKmPaceSec * 1.16;
  const thresholdPaceSec = fiveKmPaceSec * 1.06;
  const intervalPaceSec = fiveKmPaceSec * 0.97;
  const repetitionPaceSec = fiveKmPaceSec * 0.90;

  const formatPace = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return mins + ':' + (s < 10 ? '0' : '') + s + ' /km';
  };

  return {
    easyPaceMinKm: formatPace(easyPaceSec),
    marathonPaceMinKm: formatPace(marathonPaceSec),
    thresholdPaceMinKm: formatPace(thresholdPaceSec),
    interval5kPaceMinKm: formatPace(intervalPaceSec),
    repetitionPaceMinKm: formatPace(repetitionPaceSec),
  };
}
