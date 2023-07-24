import JSZip from 'jszip';
import path from 'path';

type ExportType = 'current' | 'all-in-one' | 'all-separated';
type ExportFormat = 'html' | 'md';

function execTest(
	exportType: ExportType,
	exportFormat: ExportFormat,
	embeddedMedia: boolean,
	fileAssertionOptions?: {
		filename: string;
		fixtureFilename: string;
	}
) {
	cy
		.get('@exportType')
		.should('have.value', exportType);

	cy
		.get('@exportFormat')
		.should('have.value', exportFormat);

	cy
		.get('@exportEmbeddedMedia')
		.should(embeddedMedia ? 'be.checked' : 'not.be.checked');

	cy
		.get('@exportButton')
		.click(); // Click on export button

	cy
		.readFile(
			path.join(Cypress.config('downloadsFolder'), fileAssertionOptions?.filename ?? '1. Introduction.html'),
			{
				timeout: 10000,
			}
		)
		.as('exportedFile');

	cy
		.fixture(`exportArticles/${exportFormat}/${fileAssertionOptions?.fixtureFilename ?? '1. Introduction.html'}`)
		.then((file) => {
			cy
				.get('@exportedFile')
				.should(
					'include',
					exportFormat === 'html' ? file.replaceAll(/\t|\n|\r/g, '') : file.replaceAll(/\r/g, '')
				);
		});
};

function exportConfig(
	exportType: ExportType,
	exportFormat: ExportFormat,
	embeddedMedia: boolean
) {
	cy
		.get('@exportType')
		.select(exportType)
		.should('have.value', exportType);

	cy
		.get('@exportFormat')
		.select(exportFormat)
		.should('have.value', exportFormat);

	if (!embeddedMedia) {
		cy
			.get('@exportEmbeddedMedia')
			.parent()
			.click(); // Uncheck the embedded media option
	}

	cy
		.get('@exportEmbeddedMedia')
		.should(embeddedMedia ? 'be.checked' : 'not.be.checked');
}

describe('Export articles', () => {
	beforeEach(() => {
		cy.task('deleteFolder', Cypress.config('downloadsFolder')) // Delete the downloads folder before each test

		cy
			.intercept('/api/articles?locale=en&metadataOnly=true', {
				fixture: 'articles.json',
			})
			.as('getArticles'); // Intercept the request to get the articles

		cy
			.intercept('/api/articlesMedia?locale=en', {
				body: ['/wiki/assets/media.jpg'],
			})

		cy
			.intercept('/wiki/en/1.%20Introduction.md', {
				fixture: 'wiki/1. Introduction.md'
			});

		cy
			.intercept('/wiki/assets/media.jpg', {
				fixture: 'wiki/media.jpg'
			});

		cy.visit('/en'); // Visit the home page

		cy
			.wait('@getArticles')
			.its('response.statusCode')
			.should('eq', 200); // Wait for the request to finish

		cy
			.get('button[aria-label="More options"]')
			.click(); // Open more options menu

		cy
			.findAllByRole('menuitem')
			.findAllByText('Export')
			.parent()
			.click(); // Click on export option

		cy.wait(500); // Wait for the modal to open

		cy
			.get('header')
			.findByText('Export')
			.parent()
			.as('exportModal')
			.should('be.visible')
			.and('have.css', 'opacity', '1'); // Check that the modal is visible

		cy
			.findByLabelText('Export type')
			.as('exportType'); // Get the export type select

		cy
			.findByLabelText('File format')
			.as('exportFormat'); // Get the export format select

		cy
			.findByLabelText('Embed media')
			.as('exportEmbeddedMedia'); // Get the export embedded media checkbox

		cy
			.get('@exportModal')
			.find('button')
			.contains('Export')
			.as('exportButton') // Get the export button
			.should('not.be.disabled');
	});

	it('Test default values', () => {
		cy
			.get('@exportType')
			.should('have.value', 'current');

		cy
			.get('@exportFormat')
			.should('have.value', 'html');

		cy
			.get('@exportEmbeddedMedia')
			.should('be.checked');
	});

	context('Export current article', () => {
		afterEach(() => {
			cy.task('deleteFolder', Cypress.config('downloadsFolder')) // Delete the downloads folder after each test
		});

		const exportType = 'current';
		const exportFormats: ExportFormat[] = ['html', 'md'];

		for (const exportFormat of exportFormats) {
			context(`As ${exportFormat}`, () => {
				it('With embedded media', () => {
					exportConfig(exportType, exportFormat, true);

					execTest(exportType, exportFormat, true, {
						filename: `1. Introduction.${exportFormat}`,
						fixtureFilename: `1. Introduction.media.${exportFormat}`,
					});
				});

				it('Without embedded media', () => {
					exportConfig(exportType, exportFormat, false);

					execTest(exportType, exportFormat, false, {
						filename: `1. Introduction.${exportFormat}`,
						fixtureFilename: `1. Introduction.${exportFormat}`,
					});
				});
			});
		}
	});

	context('Export all articles in one file', () => {
		afterEach(() => {
			cy.task('deleteFolder', Cypress.config('downloadsFolder')) // Delete the downloads folder after each test
		});

		const exportType = 'all-in-one';
		const exportFormats: ExportFormat[] = ['html', 'md'];

		for (const exportFormat of exportFormats) {
			context(`As ${exportFormat}`, () => {
				it('With embedded media', () => {
					exportConfig(exportType, exportFormat, true);

					execTest(exportType, exportFormat, true, {
						filename: `Survival Manual.${exportFormat}`,
						fixtureFilename: `Survival Manual.media.${exportFormat}`,
					});
				});

				it('Without embedded media', () => {
					exportConfig(exportType, exportFormat, false);

					execTest(exportType, exportFormat, false, {
						filename: `Survival Manual.${exportFormat}`,
						fixtureFilename: `Survival Manual.${exportFormat}`,
					});
				});
			});
		}
	});

	context('Export all articles separated (in archive)', () => {
		afterEach(() => {
			cy.task('deleteFolder', Cypress.config('downloadsFolder')) // Delete the downloads folder after each test
		});

		const exportType = 'all-separated';
		const exportFormats: ExportFormat[] = ['html', 'md'];

		for (const exportFormat of exportFormats) {

			it(`As archive with .${exportFormat} files`, () => {
				cy
					.get('@exportType')
					.select(exportType)
					.should('have.value', exportType);

				cy
					.get('@exportFormat')
					.select(exportFormat)
					.should('have.value', exportFormat);

				cy
					.get('@exportEmbeddedMedia')
					.should('not.be.checked')
					.and('be.disabled');

				cy
					.get('@exportButton')
					.click(); // Click on export button

				cy
					.readFile(
						path.join(Cypress.config('downloadsFolder'), 'Survival manual.zip'),
						null,
						{
							timeout: 10000,
						}
					)
					.then((file) => {
						const expectedFiles = [
							`1. Introduction.${exportFormat}`,
							'assets/',
							'assets/media.jpg'
						];
						JSZip.loadAsync(file).then(async (zip) => {
							expect(zip.files).to.have.all.keys(expectedFiles);
						});
					});
			});
		}
	});
});