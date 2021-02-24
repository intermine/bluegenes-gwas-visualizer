import React, { useEffect, useState } from 'react';
import { queryData } from './query';
import Scatterplot from './ScatterPlot';
import colors from './color.constant';
import Loading from './Loading';

const RootContainer = ({ serviceUrl, entity }) => {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [graphData, setGraphData] = useState([]);
	const [minAxis, setminAxis] = useState({});

	useEffect(() => {
		const isResult = !!entity.GWASResult;
		const value = isResult ? entity.GWASResult.value : entity.GWAS.value;
		queryData({
			serviceUrl: serviceUrl,
			ids: !Array.isArray(value) ? [value] : value,
			isResult
		})
			.then(data => {
				setData(data);
				setLoading(false);
			})
			.catch(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!data.length) return;

		const obj = {};
		let minX = Number.MAX_SAFE_INTEGER,
			minY = minX,
			maxX = Number.MIN_SAFE_INTEGER,
			maxY = maxX,
			index = 0;

		const parseResult = r => {
			if (!r.associatedGenes || !r.pValue) return;
			r.associatedGenes.forEach(c => {
				if (!c.chromosome || !c.chromosomeLocation) return;
				const { primaryIdentifier, length } = c.chromosome;
				const { start } = c.chromosomeLocation;
				if (!obj[r.phenotype])
					obj[r.phenotype] = {
						id: r.phenotype,
						data: [],
						color: colors[index++ % colors.length]
					};
				const allDigits = primaryIdentifier.match(/\d+/g) || [];
				const xAxisVal = allDigits.length
					? Number(allDigits[allDigits.length - 1])
					: 23; // If it's not a number, it's X or Y.
				const x = xAxisVal + start / length;
				const y = -1 * Math.log10(r.pValue);
				minX = Math.min(x, minX);
				minY = Math.min(y, minY);
				maxX = Math.max(x, maxX);
				maxY = Math.max(y, maxY);
				obj[r.phenotype].data.push({
					x,
					y,
					chromosome: primaryIdentifier
				});
			});
		};

		/* See query.js for why the soymineQuery has been omitted.
    const parseSoymineResult = r => {
      if (
        !r.marker ||
        !r.pValue ||
        !r.marker.chromosome ||
        !r.marker.chromosomeLocation
      )
        return;
      const { primaryIdentifier } = r.phenotype;
      const { chromosome, chromosomeLocation } = r.marker;
      if (!obj[primaryIdentifier])
        obj[primaryIdentifier] = {
          id: primaryIdentifier,
          data: [],
          color: colors[index++]
        };
      const allDigits = chromosome.secondaryIdentifier.match(/\d+/g) || [];
      const xAxisVal = allDigits.length
        ? Number(allDigits[allDigits.length - 1])
        : 0;
      const x = xAxisVal + chromosomeLocation.start / chromosome.length;
      const y = -1 * Math.log10(r.pValue);
      minX = Math.min(x, minX);
      minY = Math.min(y, minY);
      maxX = Math.max(x, maxX);
      maxY = Math.max(y, maxY);
      obj[primaryIdentifier].data.push({
        x,
        y,
        tooltip: r.marker && r.marker.primaryIdentifier
      });
    };
    */

		if (data[0].results) {
			// GWAS query was run.
			data.forEach(d => {
				d.results.forEach(parseResult);
			});
		} else {
			// GWASResult query was run.
			data.forEach(parseResult);
		}

		setGraphData([...Object.values(obj)]);
		setminAxis({ minX, minY, maxX, maxY });
	}, [data]);

	return (
		<div className="rootContainer">
			{graphData.length ? (
				<div className="graph">
					<Scatterplot
						graphData={graphData}
						minAxis={minAxis}
						// If you're going to use this visualization for organisms other
						// than humans, you'll want to set totalChromosomes dynamically.
						totalChromosomes={23}
					/>
				</div>
			) : loading ? (
				<Loading />
			) : (
				<h4>No data found</h4>
			)}
		</div>
	);
};

export default RootContainer;
