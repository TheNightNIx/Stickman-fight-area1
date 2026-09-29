/**
 * Procedural Web Audio Sound Engine for Stick Arena
 * Fully self-contained, zero external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playJump() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.12);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  public playDoubleJump() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, t);
    osc.frequency.exponentialRampToValueAtTime(520, t + 0.14);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.15);
  }

  public playPunch() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.09);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.1);
  }

  public playSword() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Metallic slash chime + noise
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(540, t);
    osc.frequency.exponentialRampToValueAtTime(180, t + 0.15);

    oscGain.gain.setValueAtTime(0.2, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  public playGunShot() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.08);

    gain.gain.setValueAtTime(0.28, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.09);
  }

  public playRocketLaunch() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(350, t + 0.2);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.25);
  }

  public playExplosion() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.45);

    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  }

  public playRope() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.16);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.17);
  }

  public playAxe() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Heavy low woosh
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(75, t + 0.16);

    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.19);

    // Metallic blade ring
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(900, t + 0.03);
    osc2.frequency.exponentialRampToValueAtTime(260, t + 0.15);

    gain2.gain.setValueAtTime(0.18, t + 0.03);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t + 0.03);
    osc2.stop(t + 0.16);
  }

  public playMagnet() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.linearRampToValueAtTime(240, t + 0.1);
    osc.frequency.linearRampToValueAtTime(180, t + 0.2);

    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  public playPowerUp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [261.63, 329.63, 392.0, 523.25]; // C E G C
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.05);

      gain.gain.setValueAtTime(0.18, t + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.05);
      osc.stop(t + idx * 0.05 + 0.13);
    });
  }

  public playHit() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.1);

    gain.gain.setValueAtTime(0.22, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.11);
  }

  public playDeath() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.35);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  public playEventAlert() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [440, 554, 659].forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      gain.gain.setValueAtTime(0.2, t + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t + idx * 0.08);
      osc.stop(t + idx * 0.08 + 0.22);
    });
  }

  public playRouletteTick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(700, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.04);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  public playButton() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.exponentialRampToValueAtTime(720, t + 0.06);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  public playVictory() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [
      { f: 392, d: 0.15 }, // G
      { f: 523.25, d: 0.15 }, // C
      { f: 659.25, d: 0.15 }, // E
      { f: 783.99, d: 0.4 }, // G
    ];

    let curr = t;
    notes.forEach((n) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, curr);

      gain.gain.setValueAtTime(0.25, curr);
      gain.gain.exponentialRampToValueAtTime(0.001, curr + n.d);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(curr);
      osc.stop(curr + n.d + 0.02);
      curr += n.d;
    });
  }

  public playInfect() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.3);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.32);
  }

  // ==================== BACKGROUND MUSIC (BGM) ====================
  public musicEnabled: boolean = true;
  public musicVolume: number = 0.35;
  private bgmPlaying: boolean = false;
  private bgmIntervalId: number | null = null;
  private bgmMasterGain: GainNode | null = null;
  private bgmStep: number = 0;
  private nextNoteTime: number = 0;

  public initBGM() {
    if (!this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain = this.ctx.createGain();
      this.bgmMasterGain.gain.setValueAtTime(this.musicEnabled ? this.musicVolume : 0, this.ctx.currentTime);
      this.bgmMasterGain.connect(this.ctx.destination);
    }
  }

  public startBGM() {
    if (this.bgmPlaying) return;
    this.initContext();
    if (!this.ctx) return;
    this.initBGM();

    this.bgmPlaying = true;
    this.nextNoteTime = this.ctx.currentTime + 0.05;
    this.bgmStep = 0;

    // Scheduler tick every 40ms to schedule ahead
    this.bgmIntervalId = window.setInterval(() => {
      this.scheduleBGM();
    }, 40);
  }

  public stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmIntervalId !== null) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
  }

  public toggleBGM(): boolean {
    this.musicEnabled = !this.musicEnabled;
    if (this.bgmMasterGain && this.ctx) {
      this.bgmMasterGain.gain.setValueAtTime(
        this.musicEnabled ? this.musicVolume : 0,
        this.ctx.currentTime
      );
    }
    if (this.musicEnabled && !this.bgmPlaying) {
      this.startBGM();
    }
    return this.musicEnabled;
  }

  public setMusicVolume(val: number) {
    this.musicVolume = Math.max(0, Math.min(1, val));
    if (this.bgmMasterGain && this.ctx && this.musicEnabled) {
      this.bgmMasterGain.gain.setValueAtTime(this.musicVolume, this.ctx.currentTime);
    }
  }

  private scheduleBGM() {
    if (!this.bgmPlaying || !this.ctx || !this.bgmMasterGain) return;

    // Tempo: 130 BPM -> 16th note = 60 / 130 / 4 = 0.1153846s
    const secondsPer16th = 0.1153846;
    const scheduleAheadTime = 0.25;

    // 128-Step Dynamic Bassline (D Minor / F Major Pentatonic Stickman Theme)
    // 8 full bars of rich variety, zero boring repetition
    const bassPatterns128 = [
      // Bar 1 (Steps 0-15): D Minor punchy groove
      146.83, 0, 146.83, 0, 146.83, 0, 174.61, 0, 146.83, 0, 146.83, 174.61, 196.00, 0, 174.61, 0,
      // Bar 2 (Steps 16-31): Bb Major to C Major drive
      116.54, 0, 116.54, 0, 116.54, 146.83, 174.61, 0, 130.81, 0, 130.81, 0, 164.81, 0, 196.00, 220.00,
      // Bar 3 (Steps 32-47): D Minor rising power
      146.83, 0, 146.83, 146.83, 174.61, 0, 196.00, 0, 220.00, 0, 196.00, 0, 174.61, 0, 146.83, 0,
      // Bar 4 (Steps 48-63): G Minor to A Minor turnaround
      98.00, 0, 98.00, 130.81, 146.83, 0, 174.61, 0, 110.00, 0, 110.00, 146.83, 164.81, 0, 220.00, 196.00,
      // Bar 5 (Steps 64-79): Funky slap breakdown
      146.83, 146.83, 0, 146.83, 293.66, 0, 174.61, 0, 146.83, 0, 130.81, 0, 116.54, 0, 130.81, 0,
      // Bar 6 (Steps 80-95): Syncopated chromatic bounce
      116.54, 0, 146.83, 0, 174.61, 0, 196.00, 174.61, 130.81, 0, 164.81, 0, 196.00, 0, 220.00, 0,
      // Bar 7 (Steps 96-111): Epic Climactic Chorus (F to C to Dm)
      174.61, 0, 174.61, 0, 220.00, 0, 261.63, 0, 130.81, 0, 130.81, 0, 196.00, 0, 261.63, 0,
      // Bar 8 (Steps 112-127): Grand Finale Roll leading back to Bar 1
      116.54, 0, 116.54, 146.83, 174.61, 0, 196.00, 0, 110.00, 146.83, 164.81, 196.00, 220.00, 246.94, 261.63, 277.18,
    ];

    // 128-Step Melodic Lead (Catchy, energetic, memorable stickman hero battle melody)
    const leadNotes128 = [
      // Bar 1: Heroic Intro Call
      293.66, 0, 349.23, 0, 440.00, 0, 392.00, 0, 349.23, 0, 293.66, 0, 261.63, 0, 293.66, 0,
      // Bar 2: Response & Arp Flourish
      349.23, 0, 440.00, 0, 523.25, 0, 440.00, 392.00, 349.23, 392.00, 440.00, 0, 523.25, 0, 587.33, 0,
      // Bar 3: High Energy Battle Hook
      587.33, 0, 523.25, 0, 440.00, 0, 392.00, 0, 440.00, 0, 523.25, 0, 587.33, 659.25, 587.33, 0,
      // Bar 4: Cascading Turnaround
      523.25, 0, 440.00, 0, 392.00, 0, 349.23, 0, 329.63, 0, 349.23, 0, 392.00, 0, 440.00, 0,
      // Bar 5: Funky Octave Bounces
      293.66, 587.33, 0, 293.66, 587.33, 0, 523.25, 0, 466.16, 0, 392.00, 0, 440.00, 0, 349.23, 0,
      // Bar 6: Playful Syncopations
      392.00, 0, 440.00, 0, 466.16, 0, 523.25, 0, 587.33, 0, 523.25, 0, 440.00, 0, 392.00, 349.23,
      // Bar 7: Climax Euphoric Chorus
      698.46, 0, 659.25, 0, 587.33, 0, 523.25, 0, 587.33, 0, 659.25, 0, 698.46, 0, 783.99, 0,
      // Bar 8: Dramatic Final Descent & Resolution
      880.00, 0, 783.99, 0, 698.46, 0, 587.33, 0, 523.25, 440.00, 392.00, 349.23, 293.66, 0, 0, 0,
    ];

    // Chords on bar boundaries (Hz root, third, fifth)
    const chordPadBars: Record<number, number[]> = {
      0: [146.83, 220.00, 349.23],   // Dm (D, A, F)
      16: [116.54, 174.61, 233.08],  // Bb (Bb, F, D)
      32: [146.83, 220.00, 349.23],  // Dm
      48: [98.00, 146.83, 196.00],   // Gm
      64: [146.83, 220.00, 293.66],  // Dm
      80: [130.81, 196.00, 261.63],  // C
      96: [174.61, 261.63, 349.23],  // F
      112: [110.00, 164.81, 220.00], // A
    };

    while (this.nextNoteTime < this.ctx.currentTime + scheduleAheadTime) {
      const t = this.nextNoteTime;
      const step = this.bgmStep % 128;

      if (this.musicEnabled) {
        // 1. Kick Drum (tight, punchy 808 drop)
        const isKickBeat =
          step % 8 === 0 || // Beats 0, 8, 16...
          (step % 16 === 10) || // Syncopated funk kick
          (step >= 120 && step % 2 === 0); // Fast drum build roll at end of 128-step phrase

        if (isKickBeat) {
          const kickOsc = this.ctx.createOscillator();
          const kickGain = this.ctx.createGain();
          kickOsc.type = 'sine';
          kickOsc.frequency.setValueAtTime(155, t);
          kickOsc.frequency.exponentialRampToValueAtTime(36, t + 0.08);

          kickGain.gain.setValueAtTime(0.35, t);
          kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

          kickOsc.connect(kickGain);
          kickGain.connect(this.bgmMasterGain);
          kickOsc.start(t);
          kickOsc.stop(t + 0.1);
        }

        // 2. Snare Drum (crisp acoustic-style clack with dual-tone snap)
        const isSnareBeat = step % 8 === 4 || (step >= 124);
        if (isSnareBeat) {
          const snareOsc = this.ctx.createOscillator();
          const snareGain = this.ctx.createGain();
          snareOsc.type = 'triangle';
          snareOsc.frequency.setValueAtTime(240, t);
          snareOsc.frequency.exponentialRampToValueAtTime(75, t + 0.07);

          snareGain.gain.setValueAtTime(0.22, t);
          snareGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          snareOsc.connect(snareGain);
          snareGain.connect(this.bgmMasterGain);
          snareOsc.start(t);
          snareOsc.stop(t + 0.09);
        }

        // 3. Hi-Hat (fluttering chiptune rhythm)
        const isHatBeat = step % 2 === 1 || step % 4 === 2;
        if (isHatBeat) {
          const hatOsc = this.ctx.createOscillator();
          const hatGain = this.ctx.createGain();
          hatOsc.type = 'sawtooth';
          hatOsc.frequency.setValueAtTime(step % 4 === 2 ? 8800 : 10500, t);

          hatGain.gain.setValueAtTime(step % 4 === 2 ? 0.07 : 0.04, t);
          hatGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

          hatOsc.connect(hatGain);
          hatGain.connect(this.bgmMasterGain);
          hatOsc.start(t);
          hatOsc.stop(t + 0.045);
        }

        // 4. Bassline (warm, driving synth bass)
        const bassFreq = bassPatterns128[step];
        if (bassFreq > 0) {
          const bassOsc = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bassOsc.type = 'sawtooth';
          bassOsc.frequency.setValueAtTime(bassFreq, t);

          bassGain.gain.setValueAtTime(0.19, t);
          bassGain.gain.exponentialRampToValueAtTime(0.001, t + secondsPer16th * 0.88);

          bassOsc.connect(bassGain);
          bassGain.connect(this.bgmMasterGain);
          bassOsc.start(t);
          bassOsc.stop(t + secondsPer16th);
        }

        // 5. Melodic Lead Hook (smooth arcade vibrato chiptune)
        const leadFreq = leadNotes128[step];
        if (leadFreq > 0) {
          const leadOsc = this.ctx.createOscillator();
          const leadGain = this.ctx.createGain();
          leadOsc.type = 'square';
          leadOsc.frequency.setValueAtTime(leadFreq, t);
          // Subtle vibrato shimmer
          leadOsc.frequency.linearRampToValueAtTime(leadFreq * 1.008, t + secondsPer16th * 0.4);
          leadOsc.frequency.linearRampToValueAtTime(leadFreq, t + secondsPer16th * 0.7);

          leadGain.gain.setValueAtTime(0.08, t);
          leadGain.gain.exponentialRampToValueAtTime(0.001, t + secondsPer16th * 0.82);

          leadOsc.connect(leadGain);
          leadGain.connect(this.bgmMasterGain);
          leadOsc.start(t);
          leadOsc.stop(t + secondsPer16th * 0.85);
        }

        // 6. Lush Atmosphere Pad on bar beginnings
        if (chordPadBars[step]) {
          const chord = chordPadBars[step];
          chord.forEach((freq) => {
            const padOsc = this.ctx!.createOscillator();
            const padGain = this.ctx!.createGain();
            padOsc.type = 'triangle';
            padOsc.frequency.setValueAtTime(freq, t);

            padGain.gain.setValueAtTime(0.035, t);
            padGain.gain.exponentialRampToValueAtTime(0.001, t + secondsPer16th * 14);

            padOsc.connect(padGain);
            padGain.connect(this.bgmMasterGain!);
            padOsc.start(t);
            padOsc.stop(t + secondsPer16th * 15);
          });
        }
      }

      this.nextNoteTime += secondsPer16th;
      this.bgmStep++;
    }
  }
}

export const sounds = new SoundEngine();
