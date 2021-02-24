/* We disabled this soymineQuery as to get the chromosome axis domain right,
 * we'd have to query for the organism and its count of chromosomes.
const soymineQuery = geneId => ({
	from: 'GWAS',
	select: [
		'results.study.primaryIdentifier',
		'results.phenotype.primaryIdentifier',
		'results.marker.primaryIdentifier',
		'results.pValue',
		'results.marker.chromosome.secondaryIdentifier',
		'results.marker.chromosomeLocation.start',
		'results.marker.chromosome.length'
	],
	joins: ['results.study', 'results.phenotype', 'results.marker'],
	where: [
		{
			path: 'id',
			op: 'ONE OF',
			values: geneId
		}
	]
});
*/

const humanMineQuery = geneId => ({
	from: 'GWAS',
	select: [
		'results.pValue',
		'results.phenotype',
		'results.associatedGenes.chromosomeLocation.start',
		'results.associatedGenes.chromosome.length',
		'results.associatedGenes.chromosome.primaryIdentifier',
		'results.associatedGenes.primaryIdentifier'
	],
	where: [
		{
			path: 'id',
			op: 'ONE OF',
			values: geneId
		}
	]
});

const queryData = ({ geneId, serviceUrl, imjsClient = imjs }) => {
	const service = new imjsClient.Service({
		root: serviceUrl
	});
	return new Promise((resolve, reject) => {
		service
			.records(humanMineQuery(geneId))
			.then(res => {
				// if (res.length === 0) reject('No data found!');
				resolve(res);
			})
			.catch(() => reject('No data found!'));
	});
};

export { queryData };
