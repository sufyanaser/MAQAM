export interface AudioAnalysisResult {
  bpm: number;
  key: string;
  confidence: number;
}

const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const MAJOR_PROFILE = [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88];
const MINOR_PROFILE = [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17];

const mixToMono = (buffer: AudioBuffer): Float32Array => {
  const durationLimit = Math.min(buffer.length, Math.floor(buffer.sampleRate * 180));
  const mono = new Float32Array(durationLimit);
  const channels = Math.min(buffer.numberOfChannels, 2);

  for (let channel = 0; channel < channels; channel += 1) {
    const data = buffer.getChannelData(channel);
    for (let index = 0; index < durationLimit; index += 1) {
      mono[index] += data[index] / channels;
    }
  }

  return mono;
};

const detectTempo = (samples: Float32Array, sampleRate: number): number => {
  const targetRate = 11025;
  const stride = Math.max(1, Math.floor(sampleRate / targetRate));
  const reducedRate = sampleRate / stride;
  const reducedLength = Math.floor(samples.length / stride);
  const reduced = new Float32Array(reducedLength);

  for (let index = 0; index < reducedLength; index += 1) {
    let sum = 0;
    for (let offset = 0; offset < stride; offset += 1) {
      sum += Math.abs(samples[index * stride + offset] ?? 0);
    }
    reduced[index] = sum / stride;
  }

  const frameSize = 1024;
  const hopSize = 256;
  const frameCount = Math.max(0, Math.floor((reduced.length - frameSize) / hopSize));
  if (frameCount < 16) return 0;

  const onset = new Float32Array(frameCount);
  let baseline = 0;
  let previousEnergy = 0;

  for (let frame = 0; frame < frameCount; frame += 1) {
    const start = frame * hopSize;
    let energy = 0;
    for (let index = 0; index < frameSize; index += 1) {
      const value = reduced[start + index];
      energy += value * value;
    }
    energy = Math.sqrt(energy / frameSize);
    baseline = baseline === 0 ? energy : baseline * 0.96 + energy * 0.04;
    onset[frame] = Math.max(0, energy - Math.max(baseline, previousEnergy * 0.82));
    previousEnergy = energy;
  }

  const hopSeconds = hopSize / reducedRate;
  let bestBpm = 0;
  let bestScore = -Infinity;

  for (let bpm = 55; bpm <= 200; bpm += 1) {
    const exactLag = 60 / bpm / hopSeconds;
    const centerLag = Math.round(exactLag);
    let score = 0;
    let normA = 0;
    let normB = 0;

    for (let frame = centerLag + 1; frame < onset.length - 1; frame += 1) {
      const current = onset[frame];
      const delayed = (
        onset[frame - centerLag - 1] * 0.2
        + onset[frame - centerLag] * 0.6
        + onset[frame - centerLag + 1] * 0.2
      );
      score += current * delayed;
      normA += current * current;
      normB += delayed * delayed;
    }

    const normalized = score / Math.sqrt(Math.max(normA * normB, Number.EPSILON));
    if (normalized > bestScore) {
      bestScore = normalized;
      bestBpm = bpm;
    }
  }

  if (bestBpm > 170) bestBpm = Math.round(bestBpm / 2);
  if (bestBpm < 68 && bestBpm > 0) bestBpm *= 2;
  return bestBpm;
};

const goertzelPower = (samples: Float32Array, sampleRate: number, frequency: number): number => {
  const omega = 2 * Math.PI * frequency / sampleRate;
  const coefficient = 2 * Math.cos(omega);
  let previous = 0;
  let previousPrevious = 0;

  for (let index = 0; index < samples.length; index += 1) {
    const current = samples[index] + coefficient * previous - previousPrevious;
    previousPrevious = previous;
    previous = current;
  }

  return previousPrevious * previousPrevious
    + previous * previous
    - coefficient * previous * previousPrevious;
};

const profileScore = (chroma: number[], profile: number[], tonic: number): number => {
  const chromaMean = chroma.reduce((sum, value) => sum + value, 0) / chroma.length;
  const profileMean = profile.reduce((sum, value) => sum + value, 0) / profile.length;
  let numerator = 0;
  let chromaEnergy = 0;
  let profileEnergy = 0;

  for (let degree = 0; degree < 12; degree += 1) {
    const chromaValue = chroma[(degree + tonic) % 12] - chromaMean;
    const profileValue = profile[degree] - profileMean;
    numerator += chromaValue * profileValue;
    chromaEnergy += chromaValue * chromaValue;
    profileEnergy += profileValue * profileValue;
  }

  return numerator / Math.sqrt(Math.max(chromaEnergy * profileEnergy, Number.EPSILON));
};

const detectKey = (samples: Float32Array, sampleRate: number): { key: string; confidence: number } => {
  const windowSize = 8192;
  const windowCount = Math.min(24, Math.max(6, Math.floor(samples.length / windowSize)));
  const chroma = Array.from({ length: 12 }, () => 0);

  for (let windowIndex = 0; windowIndex < windowCount; windowIndex += 1) {
    const center = Math.floor((windowIndex + 0.5) * samples.length / windowCount);
    const start = Math.max(0, Math.min(samples.length - windowSize, center - Math.floor(windowSize / 2)));
    const windowed = new Float32Array(windowSize);

    for (let index = 0; index < windowSize; index += 1) {
      const hann = 0.5 - 0.5 * Math.cos(2 * Math.PI * index / (windowSize - 1));
      windowed[index] = (samples[start + index] ?? 0) * hann;
    }

    for (let midi = 36; midi <= 95; midi += 1) {
      const frequency = 440 * Math.pow(2, (midi - 69) / 12);
      const power = goertzelPower(windowed, sampleRate, frequency);
      chroma[midi % 12] += Math.log1p(power) / Math.sqrt(frequency);
    }
  }

  const candidates: Array<{ score: number; tonic: number; mode: 'Major' | 'Minor' }> = [];
  for (let tonic = 0; tonic < 12; tonic += 1) {
    candidates.push({ score: profileScore(chroma, MAJOR_PROFILE, tonic), tonic, mode: 'Major' });
    candidates.push({ score: profileScore(chroma, MINOR_PROFILE, tonic), tonic, mode: 'Minor' });
  }
  candidates.sort((a, b) => b.score - a.score);

  const best = candidates[0];
  const second = candidates[1];
  const confidence = Math.max(0, Math.min(1, (best.score - second.score + 0.12) / 0.35));
  return {
    key: `${NOTE_NAMES[best.tonic]} ${best.mode}`,
    confidence,
  };
};

export const analyzeAudioFile = async (file: File): Promise<AudioAnalysisResult> => {
  const context = new AudioContext();
  try {
    const bytes = await file.arrayBuffer();
    const buffer = await context.decodeAudioData(bytes.slice(0));
    const mono = mixToMono(buffer);
    if (mono.length < buffer.sampleRate * 2) {
      throw new Error('الملف قصير جداً. استخدم مقطعاً مدته ثانيتان على الأقل.');
    }

    const bpm = detectTempo(mono, buffer.sampleRate);
    const keyResult = detectKey(mono, buffer.sampleRate);
    if (!bpm) throw new Error('تعذر استخراج الإيقاع من هذا الملف.');

    return {
      bpm,
      key: keyResult.key,
      confidence: keyResult.confidence,
    };
  } finally {
    await context.close();
  }
};
