import { useDisclosure } from '@chakra-ui/react';
import { useEffectOnce } from 'usehooks-ts';
import ShareLinkModal from './index';

describe('<ShareLinkModal />', () => {
	function Disclosure() {
		const disclosure = useDisclosure();

		useEffectOnce(() => {
			disclosure.onOpen();
		});

		return <ShareLinkModal {...disclosure} />
	}

	beforeEach(() => {
		cy.viewport(800, 800);
		cy.mountWithProviders(<Disclosure />);

		cy.wait(500); // Wait for the modal to open
	});

	it('renders', () => {
		cy
			.findByText('ShareLinkModal.title')
			.should('be.visible'); // Check that the title is visible

		cy
			.get('.chakra-input')
			.should('contain.value', window.location.origin); // Check that the input is readonly

		cy
			.findByText('ShareLinkModal.copyButton')
			.should('be.visible'); // Check that the copy button is visible

		cy
			.findByText('ShareLinkModal.doneButton')
			.should('be.visible') // Check that the close button is visible
	});

	it('shows toast after coping', () => {
		cy
			.findByText('ShareLinkModal.copyButton')
			.click(); // Click the copy button

		cy.wait(800); // Wait for the toast to appear
		cy
			.findByText('ShareLinkModal.copySuccess')
			.should('be.visible'); // Check that the success toast is visible
	});

	it('closes after clicking the done button', () => {
		cy
			.findByText('ShareLinkModal.doneButton')
			.click(); // Click the done button

		cy
			.findByText('ShareLinkModal.title')
			.should('not.exist'); // Check that the modal is closed
	});
})