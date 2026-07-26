'use strict';
// Firework Simulator v2 (adapted for background use)
(function(){
if (window.__FW_LOADED__) return;
window.__FW_LOADED__ = true;

const IS_MOBILE = window.innerWidth <= 640;
const IS_DESKTOP = window.innerWidth > 800;
const IS_HEADER = false;
const IS_HIGH_END_DEVICE = (() => {
	const hwConcurrency = navigator.hardwareConcurrency;
	if (!hwConcurrency) return false;
	const minCount = window.innerWidth <= 1024 ? 4 : 8;
	return hwConcurrency >= minCount;
})();
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 4320;
const GRAVITY = 0.9;
let simSpeed = 1;
function getDefaultScaleFactor() { if (IS_MOBILE) return 0.9; return 1; }
let stageW, stageH;
let quality = 1, isLowQuality = false, isNormalQuality = true, isHighQuality = false;
const QUALITY_LOW = 1, QUALITY_NORMAL = 2, QUALITY_HIGH = 3;
const SKY_LIGHT_NONE = 0, SKY_LIGHT_DIM = 1, SKY_LIGHT_NORMAL = 2;
const COLOR = { Red:'#ff0043', Green:'#14fc56', Blue:'#1e7fff', Purple:'#e60aff', Gold:'#ffbf36', White:'#ffffff' };
const INVISIBLE = '_INVISIBLE_';
const PI_2 = Math.PI * 2;
const PI_HALF = Math.PI * 0.5;
const trailsStage = new Stage('trails-canvas');
const mainStage = new Stage('main-canvas');
const stages = [trailsStage, mainStage];

function fullscreenEnabled() { return fscreen.fullscreenEnabled; }
function isFullscreen() { return !!fscreen.fullscreenElement; }

const store = {
	_listeners: new Set(),
	_dispatch(prev) { this._listeners.forEach(l => l(this.state, prev)); },
	state: {
		paused: true, soundEnabled: false, menuOpen: false, openHelpTopic: null, fullscreen: false,
		config: {
			quality: String(IS_HIGH_END_DEVICE ? QUALITY_HIGH : QUALITY_NORMAL),
			shell: 'Random',
			size: IS_DESKTOP ? '3' : '2',
			autoLaunch: true, finale: false,
			skyLighting: SKY_LIGHT_NORMAL + '',
			hideControls: true, longExposure: false,
			scaleFactor: getDefaultScaleFactor()
		}
	},
	setState(next) { this.state = Object.assign({}, this.state, next); this._dispatch(this.state); },
	subscribe(l) { this._listeners.add(l); }
};

function togglePause(t) {
	const paused = store.state.paused;
	const nv = typeof t === 'boolean' ? t : !paused;
	if (paused !== nv) store.setState({ paused: nv });
}

function updateConfig() {
	store.setState({ config: Object.assign({}, store.state.config) });
	configDidUpdate();
}
function configDidUpdate() {
	quality = qualitySelector();
	isLowQuality = quality === QUALITY_LOW;
	isNormalQuality = quality === QUALITY_NORMAL;
	isHighQuality = quality === QUALITY_HIGH;
	if (skyLightingSelector() === SKY_LIGHT_NONE) {
		appNodes.canvasContainer.style.backgroundColor = '#000';
	}
	Spark.drawWidth = quality === QUALITY_HIGH ? 0.75 : 1;
}
const isRunning = (s=store.state) => !s.paused && !s.menuOpen;
const qualitySelector = () => +store.state.config.quality;
const shellNameSelector = () => store.state.config.shell;
const shellSizeSelector = () => +store.state.config.size;
const finaleSelector = () => store.state.config.finale;
const skyLightingSelector = () => +store.state.config.skyLighting;
const scaleFactorSelector = () => store.state.config.scaleFactor;

const appNodes = {
	stageContainer: document.querySelector('.firework-scene .stage-container'),
	canvasContainer: document.querySelector('.firework-scene .canvas-container')
};

const COLOR_NAMES = Object.keys(COLOR);
const COLOR_CODES = COLOR_NAMES.map(n => COLOR[n]);
const COLOR_CODES_W_INVIS = [...COLOR_CODES, INVISIBLE];
const COLOR_TUPLES = {};
COLOR_CODES.forEach(hex => { COLOR_TUPLES[hex] = { r: parseInt(hex.substr(1,2),16), g: parseInt(hex.substr(3,2),16), b: parseInt(hex.substr(5,2),16) }; });

function randomColorSimple() { return COLOR_CODES[Math.random()*COLOR_CODES.length|0]; }
let lastColor;
function randomColor(o) {
	const notSame = o && o.notSame, notColor = o && o.notColor, limitWhite = o && o.limitWhite;
	let c = randomColorSimple();
	if (limitWhite && c === COLOR.White && Math.random() < 0.6) c = randomColorSimple();
	if (notSame) while (c === lastColor) c = randomColorSimple();
	else if (notColor) while (c === notColor) c = randomColorSimple();
	lastColor = c;
	return c;
}
function whiteOrGold() { return Math.random() < 0.5 ? COLOR.Gold : COLOR.White; }
function makePistilColor(sc) { return (sc === COLOR.White || sc === COLOR.Gold) ? randomColor({ notColor: sc }) : whiteOrGold(); }

const crysanthemumShell = (size=1) => {
	const glitter = Math.random() < 0.25;
	const singleColor = Math.random() < 0.72;
	const color = singleColor ? randomColor({limitWhite:true}) : [randomColor(), randomColor({notSame:true})];
	const pistil = singleColor && Math.random() < 0.42;
	const pistilColor = pistil && makePistilColor(color);
	const secondColor = singleColor && (Math.random() < 0.2 || color === COLOR.White) ? pistilColor || randomColor({notColor:color, limitWhite:true}) : null;
	const streamers = !pistil && color !== COLOR.White && Math.random() < 0.42;
	let starDensity = glitter ? 1.1 : 1.25;
	if (isLowQuality) starDensity *= 0.8;
	if (isHighQuality) starDensity = 1.2;
	return { shellSize:size, spreadSize:300+size*100, starLife:900+size*200, starDensity, color, secondColor, glitter: glitter?'light':'', glitterColor: whiteOrGold(), pistil, pistilColor, streamers };
};
const ghostShell = (size=1) => {
	const shell = crysanthemumShell(size);
	shell.starLife *= 1.5;
	let ghostColor = randomColor({notColor: COLOR.White});
	shell.streamers = true;
	shell.color = INVISIBLE;
	shell.secondColor = ghostColor;
	shell.glitter = '';
	return shell;
};
const strobeShell = (size=1) => {
	const color = randomColor({limitWhite:true});
	return { shellSize:size, spreadSize:280+size*92, starLife:1100+size*200, starLifeVariation:0.4, starDensity:1.1, color, glitter:'light', glitterColor:COLOR.White, strobe:true, strobeColor: Math.random()<0.5?COLOR.White:null, pistil: Math.random()<0.5, pistilColor: makePistilColor(color) };
};
const palmShell = (size=1) => { const color = randomColor(); const thick = Math.random()<0.5; return { shellSize:size, color, spreadSize:250+size*75, starDensity:thick?0.15:0.4, starLife:1800+size*200, glitter: thick?'thick':'heavy' }; };
const ringShell = (size=1) => { const color = randomColor(); const pistil = Math.random()<0.75; return { shellSize:size, ring:true, color, spreadSize:300+size*100, starLife:900+size*200, starCount:2.2*PI_2*(size+1), pistil, pistilColor: makePistilColor(color), glitter: !pistil?'light':'', glitterColor: color===COLOR.Gold?COLOR.Gold:COLOR.White, streamers: Math.random()<0.3 }; };
const crossetteShell = (size=1) => { const color = randomColor({limitWhite:true}); return { shellSize:size, spreadSize:300+size*100, starLife:750+size*160, starLifeVariation:0.4, starDensity:0.85, color, crossette:true, pistil: Math.random()<0.5, pistilColor: makePistilColor(color) }; };
const floralShell = (size=1) => ({ shellSize:size, spreadSize:300+size*120, starDensity:0.12, starLife:500+size*50, starLifeVariation:0.5, color: Math.random()<0.65?'random':(Math.random()<0.15?randomColor():[randomColor(), randomColor({notSame:true})]), floral:true });
const fallingLeavesShell = (size=1) => ({ shellSize:size, color:INVISIBLE, spreadSize:300+size*120, starDensity:0.12, starLife:500+size*50, starLifeVariation:0.5, glitter:'medium', glitterColor: COLOR.Gold, fallingLeaves:true });
const willowShell = (size=1) => ({ shellSize:size, spreadSize:300+size*100, starDensity:0.6, starLife:3000+size*300, glitter:'willow', glitterColor: COLOR.Gold, color: INVISIBLE });
const crackleShell = (size=1) => { const color = Math.random()<0.75?COLOR.Gold:randomColor(); return { shellSize:size, spreadSize:380+size*75, starDensity: isLowQuality?0.65:1, starLife:600+size*100, starLifeVariation:0.32, glitter:'light', glitterColor: COLOR.Gold, color, crackle:true, pistil: Math.random()<0.65, pistilColor: makePistilColor(color) }; };
const horsetailShell = (size=1) => { const color = randomColor(); return { shellSize:size, horsetail:true, color, spreadSize:250+size*38, starDensity:0.9, starLife:2500+size*300, glitter:'medium', glitterColor: Math.random()<0.5?whiteOrGold():color, strobe: color===COLOR.White }; };

function randomShellName() { return Math.random()<0.5?'Crysanthemum':shellNames[(Math.random()*(shellNames.length-1)+1)|0]; }
function randomShell(size) { return shellTypes[randomShellName()](size); }
function shellFromConfig(size) { return shellTypes[shellNameSelector()](size); }
const fastShellBlacklist = ['Falling Leaves','Floral','Willow'];
function randomFastShell() { let n = randomShellName(); while (fastShellBlacklist.includes(n)) n = randomShellName(); return shellTypes[n]; }
const shellTypes = { 'Random': randomShell, 'Crackle': crackleShell, 'Crossette': crossetteShell, 'Crysanthemum': crysanthemumShell, 'Falling Leaves': fallingLeavesShell, 'Floral': floralShell, 'Ghost': ghostShell, 'Horse Tail': horsetailShell, 'Palm': palmShell, 'Ring': ringShell, 'Strobe': strobeShell, 'Willow': willowShell };
const shellNames = Object.keys(shellTypes);

function init() {
	togglePause(false);
	configDidUpdate();
}
function fitH(p) { const e=0.18; return (1-e*2)*p+e; }
function fitV(p) { return p*0.75; }
function getRandomShellSize() {
	const baseSize = shellSizeSelector();
	const maxVariance = Math.min(2.5, baseSize);
	const variance = Math.random() * maxVariance;
	const size = baseSize - variance;
	const height = maxVariance === 0 ? Math.random() : 1 - (variance/maxVariance);
	const centerOffset = Math.random()*(1-height*0.65)*0.5;
	const x = Math.random()<0.5 ? 0.5-centerOffset : 0.5+centerOffset;
	return { size, x: fitH(x), height: fitV(height) };
}
function seqRandomShell() {
	const s = getRandomShellSize();
	const shell = new Shell(shellFromConfig(s.size));
	shell.launch(s.x, s.height);
	let extra = shell.starLife;
	if (shell.fallingLeaves) extra = 4600;
	return 900 + Math.random()*600 + extra;
}
function seqTwoRandom() {
	const s1 = getRandomShellSize(), s2 = getRandomShellSize();
	const sh1 = new Shell(shellFromConfig(s1.size)), sh2 = new Shell(shellFromConfig(s2.size));
	const lo = Math.random()*0.2-0.1, ro = Math.random()*0.2-0.1;
	sh1.launch(0.3+lo, s1.height);
	setTimeout(() => sh2.launch(0.7+ro, s2.height), 100);
	let extra = Math.max(sh1.starLife, sh2.starLife);
	if (sh1.fallingLeaves || sh2.fallingLeaves) extra = 4600;
	return 900 + Math.random()*600 + extra;
}
function seqTriple() {
	const st = randomFastShell();
	const bs = shellSizeSelector();
	const ss = Math.max(0, bs-1.25);
	const off = Math.random()*0.08-0.04;
	const sh1 = new Shell(st(bs));
	sh1.launch(0.5+off, 0.7);
	setTimeout(() => { const o = Math.random()*0.08-0.04; new Shell(st(ss)).launch(0.2+o, 0.1); }, 1000+Math.random()*400);
	setTimeout(() => { const o = Math.random()*0.08-0.04; new Shell(st(ss)).launch(0.8+o, 0.1); }, 1000+Math.random()*400);
	return 4000;
}
const sequences = [seqRandomShell, seqTwoRandom, seqTriple];
let isFirstSeq = true;
function startSequence() {
	if (isFirstSeq) {
		isFirstSeq = false;
		const shell = new Shell(crysanthemumShell(shellSizeSelector()));
		shell.launch(0.5, 0.5);
		return 2400;
	}
	const r = Math.random();
	if (r < 0.6) return seqRandomShell();
	else if (r < 0.85) return seqTwoRandom();
	else return seqTriple();
}

function handleResize() {
	const w = window.innerWidth, h = window.innerHeight;
	const cw = Math.min(w, MAX_WIDTH);
	const ch = w <= 420 ? h : Math.min(h, MAX_HEIGHT);
	appNodes.stageContainer.style.width = cw+'px';
	appNodes.stageContainer.style.height = ch+'px';
	stages.forEach(s => s.resize(cw, ch));
	const sf = scaleFactorSelector();
	stageW = cw/sf;
	stageH = ch/sf;
}
handleResize();
window.addEventListener('resize', handleResize);

let currentFrame = 0, autoLaunchTime = 0;
function updateGlobals(ts, lag) {
	currentFrame++;
	if (store.state.config.autoLaunch) {
		autoLaunchTime -= ts;
		if (autoLaunchTime <= 0) autoLaunchTime = startSequence() * 1.25;
	}
}
function update(frameTime, lag) {
	if (!isRunning()) return;
	const timeStep = frameTime * simSpeed;
	const speed = simSpeed * lag;
	updateGlobals(timeStep, lag);
	const starDrag = 1 - (1-Star.airDrag)*speed;
	const starDragHeavy = 1 - (1-Star.airDragHeavy)*speed;
	const sparkDrag = 1 - (1-Spark.airDrag)*speed;
	const gAcc = timeStep/1000 * GRAVITY;
	COLOR_CODES_W_INVIS.forEach(color => {
		const stars = Star.active[color];
		for (let i=stars.length-1; i>=0; i--) {
			const star = stars[i];
			if (star.updateFrame === currentFrame) continue;
			star.updateFrame = currentFrame;
			star.life -= timeStep;
			if (star.life <= 0) { stars.splice(i,1); Star.returnInstance(star); }
			else {
				const burnRate = Math.pow(star.life/star.fullLife, 0.5);
				const burnRateInv = 1 - burnRate;
				star.prevX = star.x; star.prevY = star.y;
				star.x += star.speedX*speed; star.y += star.speedY*speed;
				if (!star.heavy) { star.speedX *= starDrag; star.speedY *= starDrag; }
				else { star.speedX *= starDragHeavy; star.speedY *= starDragHeavy; }
				star.speedY += gAcc;
				if (star.spinRadius) { star.spinAngle += star.spinSpeed*speed; star.x += Math.sin(star.spinAngle)*star.spinRadius*speed; star.y += Math.cos(star.spinAngle)*star.spinRadius*speed; }
				if (star.sparkFreq) {
					star.sparkTimer -= timeStep;
					while (star.sparkTimer < 0) {
						star.sparkTimer += star.sparkFreq*0.75 + star.sparkFreq*burnRateInv*4;
						Spark.add(star.x, star.y, star.sparkColor, Math.random()*PI_2, Math.random()*star.sparkSpeed*burnRate, star.sparkLife*0.8 + Math.random()*star.sparkLifeVariation*star.sparkLife);
					}
				}
				if (star.life < star.transitionTime) {
					if (star.secondColor && !star.colorChanged) {
						star.colorChanged = true; star.color = star.secondColor;
						stars.splice(i,1); Star.active[star.secondColor].push(star);
						if (star.secondColor === INVISIBLE) star.sparkFreq = 0;
					}
					if (star.strobe) star.visible = Math.floor(star.life/star.strobeFreq)%3 === 0;
				}
			}
		}
		const sparks = Spark.active[color];
		for (let i=sparks.length-1; i>=0; i--) {
			const sp = sparks[i];
			sp.life -= timeStep;
			if (sp.life <= 0) { sparks.splice(i,1); Spark.returnInstance(sp); }
			else { sp.prevX = sp.x; sp.prevY = sp.y; sp.x += sp.speedX*speed; sp.y += sp.speedY*speed; sp.speedX *= sparkDrag; sp.speedY *= sparkDrag; sp.speedY += gAcc; }
		}
	});
	render(speed);
}
function render(speed) {
	const { dpr } = mainStage;
	const width = stageW, height = stageH;
	const tc = trailsStage.ctx, mc = mainStage.ctx;
	if (skyLightingSelector() !== SKY_LIGHT_NONE) colorSky(speed);
	const sf = scaleFactorSelector();
	tc.scale(dpr*sf, dpr*sf); mc.scale(dpr*sf, dpr*sf);
	tc.globalCompositeOperation = 'source-over';
	tc.fillStyle = `rgba(0,0,0,${store.state.config.longExposure?0.0025:0.175*speed})`;
	tc.fillRect(0,0,width,height);
	mc.clearRect(0,0,width,height);
	while (BurstFlash.active.length) {
		const bf = BurstFlash.active.pop();
		const bg = tc.createRadialGradient(bf.x,bf.y,0,bf.x,bf.y,bf.radius);
		bg.addColorStop(0.024,'rgba(255,255,255,1)');
		bg.addColorStop(0.125,'rgba(255,160,20,0.2)');
		bg.addColorStop(0.32,'rgba(255,140,20,0.11)');
		bg.addColorStop(1,'rgba(255,120,20,0)');
		tc.fillStyle = bg;
		tc.fillRect(bf.x-bf.radius, bf.y-bf.radius, bf.radius*2, bf.radius*2);
		BurstFlash.returnInstance(bf);
	}
	tc.globalCompositeOperation = 'lighten';
	tc.lineWidth = Star.drawWidth;
	tc.lineCap = isLowQuality?'square':'round';
	mc.strokeStyle = '#fff'; mc.lineWidth = 1; mc.beginPath();
	COLOR_CODES.forEach(color => {
		const stars = Star.active[color];
		tc.strokeStyle = color; tc.beginPath();
		stars.forEach(s => { if (s.visible) { tc.moveTo(s.x,s.y); tc.lineTo(s.prevX,s.prevY); mc.moveTo(s.x,s.y); mc.lineTo(s.x-s.speedX*1.6, s.y-s.speedY*1.6); } });
		tc.stroke();
	});
	mc.stroke();
	tc.lineWidth = Spark.drawWidth; tc.lineCap = 'butt';
	COLOR_CODES.forEach(color => {
		const sparks = Spark.active[color];
		tc.strokeStyle = color; tc.beginPath();
		sparks.forEach(sp => { tc.moveTo(sp.x,sp.y); tc.lineTo(sp.prevX,sp.prevY); });
		tc.stroke();
	});
	tc.setTransform(1,0,0,1,0,0); mc.setTransform(1,0,0,1,0,0);
}
const currentSkyColor = { r:0,g:0,b:0 }, targetSkyColor = { r:0,g:0,b:0 };
function colorSky(speed) {
	const maxSat = skyLightingSelector()*15;
	const maxStarCount = 500;
	let total = 0;
	targetSkyColor.r = 0; targetSkyColor.g = 0; targetSkyColor.b = 0;
	COLOR_CODES.forEach(color => {
		const t = COLOR_TUPLES[color], c = Star.active[color].length;
		total += c;
		targetSkyColor.r += t.r*c; targetSkyColor.g += t.g*c; targetSkyColor.b += t.b*c;
	});
	const intensity = Math.pow(Math.min(1, total/maxStarCount), 0.3);
	const maxC = Math.max(1, targetSkyColor.r, targetSkyColor.g, targetSkyColor.b);
	targetSkyColor.r = targetSkyColor.r/maxC*maxSat*intensity;
	targetSkyColor.g = targetSkyColor.g/maxC*maxSat*intensity;
	targetSkyColor.b = targetSkyColor.b/maxC*maxSat*intensity;
	const cc = 10;
	currentSkyColor.r += (targetSkyColor.r-currentSkyColor.r)/cc*speed;
	currentSkyColor.g += (targetSkyColor.g-currentSkyColor.g)/cc*speed;
	currentSkyColor.b += (targetSkyColor.b-currentSkyColor.b)/cc*speed;
	appNodes.canvasContainer.style.backgroundColor = `rgb(${currentSkyColor.r|0}, ${currentSkyColor.g|0}, ${currentSkyColor.b|0})`;
}
mainStage.addEventListener('ticker', update);

function createParticleArc(start, arcLen, count, rand, pf) {
	const angleDelta = arcLen/count;
	const end = start+arcLen - (angleDelta*0.5);
	if (end > start) { for (let a=start; a<end; a=a+angleDelta) pf(a + Math.random()*angleDelta*rand); }
	else { for (let a=start; a>end; a=a+angleDelta) pf(a + Math.random()*angleDelta*rand); }
}
function createBurst(count, pf, startAngle=0, arcLen=PI_2) {
	const R = 0.5*Math.sqrt(count/Math.PI);
	const C = 2*R*Math.PI;
	const C_HALF = C/2;
	for (let i=0; i<=C_HALF; i++) {
		const ringAngle = i/C_HALF * PI_HALF;
		const ringSize = Math.cos(ringAngle);
		const partsPerFull = C*ringSize;
		const partsPerArc = partsPerFull*(arcLen/PI_2);
		const angleInc = PI_2/partsPerFull;
		const angleOffset = Math.random()*angleInc + startAngle;
		const maxRand = angleInc*0.33;
		for (let i=0; i<partsPerArc; i++) {
			const rand = Math.random()*maxRand;
			let angle = angleInc*i + angleOffset + rand;
			pf(angle, ringSize);
		}
	}
}
function crossetteEffect(star) {
	const sa = Math.random()*PI_HALF;
	createParticleArc(sa, PI_2, 4, 0.5, angle => { Star.add(star.x, star.y, star.color, angle, Math.random()*0.6+0.75, 600); });
}
function floralEffect(star) {
	const count = 12 + 6*quality;
	createBurst(count, (angle, sm) => { Star.add(star.x, star.y, star.color, angle, sm*2.4, 1000+Math.random()*300, star.speedX, star.speedY); });
	BurstFlash.add(star.x, star.y, 46);
}
function fallingLeavesEffect(star) {
	createBurst(7, (angle, sm) => {
		const ns = Star.add(star.x, star.y, INVISIBLE, angle, sm*2.4, 2400+Math.random()*600, star.speedX, star.speedY);
		ns.sparkColor = COLOR.Gold; ns.sparkFreq = 144/quality; ns.sparkSpeed = 0.28; ns.sparkLife = 750; ns.sparkLifeVariation = 3.2;
	});
	BurstFlash.add(star.x, star.y, 46);
}
function crackleEffect(star) {
	const count = isHighQuality?32:16;
	createParticleArc(0, PI_2, count, 1.8, angle => { Spark.add(star.x, star.y, COLOR.Gold, angle, Math.pow(Math.random(),0.45)*2.4, 300+Math.random()*200); });
}

class Shell {
	constructor(opts) {
		Object.assign(this, opts);
		this.starLifeVariation = opts.starLifeVariation || 0.125;
		this.color = opts.color || randomColor();
		this.glitterColor = opts.glitterColor || this.color;
		if (!this.starCount) {
			const d = opts.starDensity || 1;
			const s = this.spreadSize/54;
			this.starCount = Math.max(6, s*s*d);
		}
	}
	launch(position, launchHeight) {
		const width = stageW, height = stageH;
		const hpad = 60, vpad = 50, minHeightPct = 0.45;
		const minHeight = height - height*minHeightPct;
		const lx = position*(width - hpad*2) + hpad;
		const ly = height;
		const by = minHeight - (launchHeight*(minHeight - vpad));
		const ld = ly - by;
		const lv = Math.pow(ld*0.04, 0.64);
		const comet = this.comet = Star.add(lx, ly, typeof this.color==='string' && this.color!=='random' ? this.color : COLOR.White, Math.PI, lv*(this.horsetail?1.2:1), lv*(this.horsetail?100:400));
		comet.heavy = true;
		comet.spinRadius = 0.32 + Math.random()*0.53;
		comet.sparkFreq = 32/quality;
		if (isHighQuality) comet.sparkFreq = 8;
		comet.sparkLife = 320; comet.sparkLifeVariation = 3;
		if (this.glitter === 'willow' || this.fallingLeaves) { comet.sparkFreq = 20/quality; comet.sparkSpeed = 0.5; comet.sparkLife = 500; }
		if (this.color === INVISIBLE) comet.sparkColor = COLOR.Gold;
		if (Math.random() > 0.4 && !this.horsetail) { comet.secondColor = INVISIBLE; comet.transitionTime = Math.pow(Math.random(),1.5)*700 + 500; }
		comet.onDeath = c => this.burst(c.x, c.y);
	}
	burst(x, y) {
		const speed = this.spreadSize/96;
		let color, onDeath, sparkFreq, sparkSpeed, sparkLife;
		let sparkLifeVariation = 0.25;
		if (this.crossette) onDeath = crossetteEffect;
		if (this.crackle) onDeath = crackleEffect;
		if (this.floral) onDeath = floralEffect;
		if (this.fallingLeaves) onDeath = fallingLeavesEffect;
		if (this.glitter === 'light') { sparkFreq=400; sparkSpeed=0.3; sparkLife=300; sparkLifeVariation=2; }
		else if (this.glitter === 'medium') { sparkFreq=200; sparkSpeed=0.44; sparkLife=700; sparkLifeVariation=2; }
		else if (this.glitter === 'heavy') { sparkFreq=80; sparkSpeed=0.8; sparkLife=1400; sparkLifeVariation=2; }
		else if (this.glitter === 'thick') { sparkFreq=16; sparkSpeed=isHighQuality?1.65:1.5; sparkLife=1400; sparkLifeVariation=3; }
		else if (this.glitter === 'streamer') { sparkFreq=32; sparkSpeed=1.05; sparkLife=620; sparkLifeVariation=2; }
		else if (this.glitter === 'willow') { sparkFreq=120; sparkSpeed=0.34; sparkLife=1400; sparkLifeVariation=3.8; }
		if (sparkFreq) sparkFreq = sparkFreq/quality;
		const starFactory = (angle, sm) => {
			const stdISpeed = this.spreadSize/1800;
			const s = Star.add(x, y, color || randomColor(), angle, sm*speed, this.starLife + Math.random()*this.starLife*this.starLifeVariation, this.horsetail ? this.comet && this.comet.speedX : 0, this.horsetail ? this.comet && this.comet.speedY : -stdISpeed);
			if (this.secondColor) { s.transitionTime = this.starLife*(Math.random()*0.05+0.32); s.secondColor = this.secondColor; }
			if (this.strobe) { s.transitionTime = this.starLife*(Math.random()*0.08+0.46); s.strobe = true; s.strobeFreq = Math.random()*20+40; if (this.strobeColor) s.secondColor = this.strobeColor; }
			s.onDeath = onDeath;
			if (this.glitter) { s.sparkFreq = sparkFreq; s.sparkSpeed = sparkSpeed; s.sparkLife = sparkLife; s.sparkLifeVariation = sparkLifeVariation; s.sparkColor = this.glitterColor; s.sparkTimer = Math.random()*s.sparkFreq; }
		};
		if (typeof this.color === 'string') {
			color = this.color === 'random' ? null : this.color;
			if (this.ring) {
				const rsa = Math.random()*Math.PI;
				const rsq = Math.pow(Math.random(),2)*0.85+0.15;
				createParticleArc(0, PI_2, this.starCount, 0, angle => {
					const isx = Math.sin(angle)*speed*rsq;
					const isy = Math.cos(angle)*speed;
					const ns = Math.sqrt(isx*isx+isy*isy);
					const na = Math.atan2(isx, isy) + rsa;
					const s = Star.add(x, y, color, na, ns, this.starLife + Math.random()*this.starLife*this.starLifeVariation);
					if (this.glitter) { s.sparkFreq = sparkFreq; s.sparkSpeed = sparkSpeed; s.sparkLife = sparkLife; s.sparkLifeVariation = sparkLifeVariation; s.sparkColor = this.glitterColor; s.sparkTimer = Math.random()*s.sparkFreq; }
				});
			} else createBurst(this.starCount, starFactory);
		} else if (Array.isArray(this.color)) {
			if (Math.random()<0.5) {
				const start = Math.random()*Math.PI, start2 = start+Math.PI, arc = Math.PI;
				color = this.color[0]; createBurst(this.starCount, starFactory, start, arc);
				color = this.color[1]; createBurst(this.starCount, starFactory, start2, arc);
			} else { color = this.color[0]; createBurst(this.starCount/2, starFactory); color = this.color[1]; createBurst(this.starCount/2, starFactory); }
		}
		if (this.pistil) { new Shell({ spreadSize: this.spreadSize*0.5, starLife: this.starLife*0.6, starLifeVariation: this.starLifeVariation, starDensity: 1.4, color: this.pistilColor, glitter:'light', glitterColor: this.pistilColor===COLOR.Gold?COLOR.Gold:COLOR.White }).burst(x,y); }
		if (this.streamers) { new Shell({ spreadSize: this.spreadSize*0.9, starLife: this.starLife*0.8, starLifeVariation: this.starLifeVariation, starCount: Math.floor(Math.max(6, this.spreadSize/45)), color: COLOR.White, glitter:'streamer' }).burst(x,y); }
		BurstFlash.add(x, y, this.spreadSize/4);
	}
}

const BurstFlash = { active:[], _pool:[], _new(){return{};}, add(x,y,r){ const i=this._pool.pop()||this._new(); i.x=x;i.y=y;i.radius=r; this.active.push(i); return i;}, returnInstance(i){ this._pool.push(i); } };
function createParticleCollection() { const c={}; COLOR_CODES_W_INVIS.forEach(color => c[color]=[]); return c; }
const Star = {
	drawWidth:3, airDrag:0.98, airDragHeavy:0.992,
	active: createParticleCollection(), _pool:[],
	_new(){return{};},
	add(x,y,color,angle,speed,life,sx,sy) {
		const i = this._pool.pop() || this._new();
		i.visible = true; i.heavy = false; i.x = x; i.y = y; i.prevX = x; i.prevY = y;
		i.color = color; i.speedX = Math.sin(angle)*speed + (sx||0); i.speedY = Math.cos(angle)*speed + (sy||0);
		i.life = life; i.fullLife = life; i.spinAngle = Math.random()*PI_2; i.spinSpeed = 0.8; i.spinRadius = 0;
		i.sparkFreq = 0; i.sparkSpeed = 1; i.sparkTimer = 0; i.sparkColor = color; i.sparkLife = 750;
		i.sparkLifeVariation = 0.25; i.strobe = false;
		this.active[color].push(i);
		return i;
	},
	returnInstance(i) { if (i.onDeath) i.onDeath(i); i.onDeath = null; i.secondColor = null; i.transitionTime = 0; i.colorChanged = false; this._pool.push(i); }
};
const Spark = {
	drawWidth:0, airDrag:0.9,
	active: createParticleCollection(), _pool:[],
	_new(){return{};},
	add(x,y,color,angle,speed,life) {
		const i = this._pool.pop() || this._new();
		i.x = x; i.y = y; i.prevX = x; i.prevY = y; i.color = color;
		i.speedX = Math.sin(angle)*speed; i.speedY = Math.cos(angle)*speed; i.life = life;
		this.active[color].push(i);
		return i;
	},
	returnInstance(i) { this._pool.push(i); }
};

init();
})();
