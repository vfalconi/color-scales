const { readFileSync, writeFileSync } = require('fs');
const { globSync } = require('glob');
const readmeContents = readFileSync('./README.md', 'utf8');

const clearPreviousScales = (str) => {
	let lines = str.split("\n");
	const scalesHeadingPosition = lines.indexOf('## The scales');

	for (let i = scalesHeadingPosition + 1; i <= lines.length; i++) {
		delete lines[i];
	}

	lines = lines.filter(n => n);

	lines.push("");

	return lines;
};

const buildScales = (str) => {
	const cleanLines = clearPreviousScales(readmeContents);
	const scaleFiles = globSync('./scales/**/*.json').map(file => {
		return JSON.parse(readFileSync(file, 'utf8'));
	});
	const scales = scaleFiles.map(scale => {
		const tiles = `<li style="width:100px;height:100px;background-color:${scale.base};"><span style="font-family: monospace; background-color: #000; color: #fff;">${scale.base}</span></li>${Object.keys(scale.thresholds).map(thresholdKey => `<li style="width:100px;height:100px;background-color:${scale.thresholds[thresholdKey]};"><span style="font-family: monospace; background-color: #000; color: #fff;">${scale.thresholds[thresholdKey]}</span></li>`).flat()}`;
		const listWrapper = `<ol style="display: flex;">${tiles}</ol>`;
		return `<h3>${scale.name}</h3>${listWrapper}`;
	});
	const scalesHeadingPosition = cleanLines.indexOf('## The scales');
	cleanLines.splice((scalesHeadingPosition + 1), 0, scales);
	return cleanLines.flat().join("\n");
};

writeFileSync('./README.md', buildScales(readmeContents), 'utf8');
