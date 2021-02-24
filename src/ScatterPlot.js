import React from 'react';
import { ResponsiveScatterPlot } from '@nivo/scatterplot';

function arrayFromOne(count) {
	return Array(count)
		.fill(0)
		.map((_, i) => i + 1);
}

const Scatterplot = ({ graphData, minAxis, totalChromosomes }) => (
	<>
		<div className="graph-container">
			{graphData.map(data => (
				<div key={data.id} className="legend-container">
					<span style={{ background: data.color }} className="legend"></span>
					<span>{data.id}</span>
				</div>
			))}
		</div>
		<ResponsiveScatterPlot
			animate={false}
			data={graphData}
			margin={{ top: 30, right: 90, bottom: 60, left: 90 }}
			xScale={{
				type: 'linear',
				min: 1,
				max: totalChromosomes + 1
			}}
			yScale={{
				type: 'linear',
				min: Math.floor(minAxis.minY) - 1,
				max: Math.ceil(minAxis.maxY) + 1
			}}
			useMesh={false}
			axisTop={null}
			axisRight={null}
			nodeSize={15}
			colors={graphData.map(c => c.color)}
			blendMode="multiply"
			tooltip={({ node }) => (
				<div className="tooltip-container">
					<div className="tooltip-data">
						<span
							className="node-color"
							style={{ background: node.style.color }}
						></span>
						<span>
							<strong>{node.data.serieId}: </strong>
							{node.data.tooltip}
						</span>
					</div>
					<div>
						<strong>Marker Position: </strong>
						{node.data.x}
					</div>
					<div>
						<strong>log10(p-value): </strong>
						{node.data.y}
					</div>
					<div>
						<strong>Chromosome: </strong>
						{node.data.chromosome}
					</div>
				</div>
			)}
			gridXValues={arrayFromOne(totalChromosomes)}
			axisBottom={{
				format: tick => (tick == 24 ? '' : tick),
				tickValues: totalChromosomes,
				orient: 'bottom',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: 'Chromosome',
				legendPosition: 'middle',
				legendOffset: 46
			}}
			axisLeft={{
				orient: 'left',
				tickSize: 5,
				tickPadding: 5,
				tickRotation: 0,
				legend: '-log10(p)',
				legendPosition: 'middle',
				legendOffset: -60
			}}
		/>
	</>
);

export default Scatterplot;
