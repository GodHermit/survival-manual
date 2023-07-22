import { selectArticlesState } from '@/_store/slices/articlesSlice';
import { Box, Button, FormControl, FormLabel, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Switch, Tooltip, UseDisclosureReturn, useToast } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useEffect, useReducer } from 'react';
import { MdInfo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ExportFormat, ExportType } from './export';

interface ExportModalState {
	format: ExportFormat;
	exportType: ExportType;
	embeddedMedia: boolean;
	isExporting: boolean;
	isCurrentArticleDefined: boolean;
}

const initialState: ExportModalState = {
	format: 'html',
	exportType: 'all-in-one',
	embeddedMedia: true,
	isExporting: false,
	isCurrentArticleDefined: false,
};

export default function ExportModal(props: UseDisclosureReturn) {
	const [state, setState] = useReducer((state: ExportModalState, newState: Partial<ExportModalState>) => ({
		...state,
		...newState,
	}), initialState);
	const articlesState = useSelector(selectArticlesState);
	const t = useTranslations();
	const locale = useLocale();
	const toast = useToast();
	const pathname = usePathname();
	const pathnameWithoutLocale = pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '');

	useEffect(() => {
		if (!articlesState.isLoading) {
			// If the current article is defined, set the export type to current
			if (
				articlesState.articlesMetadata.some( // Check if the current pathname is in the articles metadata
					article => article.slug === pathnameWithoutLocale
				)
			) {
				setState({
					exportType: 'current',
					isCurrentArticleDefined: true,
				});
			} else {
				setState({
					exportType: initialState.exportType,
					isCurrentArticleDefined: false
				});
			}
		}
	}, [articlesState.articlesMetadata, articlesState.isLoading, pathnameWithoutLocale]);

	const showErrorMessage = () => {
		if (toast.isActive('export-error')) {
			return;
		}
		toast({
			id: 'export-error',
			position: 'top',
			status: 'error',
			title: t('pageError.title'),
		});
		setState({ isExporting: false })
	};

	const handleExport = () => {
		// If articles are still loading, don't do anything
		if (articlesState.isLoading) {
			return;
		}

		// If user is already exporting, don't do anything
		if (state.isExporting) {
			return;
		}

		try {
			setState({ isExporting: true });

			import('./export').then(module => {
				module.exportArticles(state.exportType, state.format, {
					articles: articlesState.articlesMetadata,
					embeddedMedia: state.embeddedMedia,
					locale,
					currentArticleSlug: pathnameWithoutLocale,
					translator: (namespace: Parameters<typeof useTranslations>[0]) => t(namespace),
					callback: () => {
						setState({ isExporting: false });
						// props.onClose();
					}
				}).catch(error => {
					showErrorMessage();
				});
			});

			//If there is an error toast, close it
			if (toast.isActive('export-error')) {
				toast.close('export-error');
			}
		} catch (error) {
			showErrorMessage();
		}
	};

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			size={{
				base: 'xs',
				md: 'md',
			}}
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t('ExportModal.title')}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl mb={6}>
						<Skeleton
							fitContent
							isLoaded={!articlesState.isLoading}
						>
							<FormLabel>{t('ExportModal.exportType.label')}</FormLabel>
						</Skeleton>
						<Skeleton
							isLoaded={!articlesState.isLoading}
						>
							<Select
								value={state.exportType}
								onChange={e => setState({ exportType: e.target.value as ExportType })}
							>
								{state.isCurrentArticleDefined && (
									<option value='current'>{t('ExportModal.exportType.current')}</option>
								)}
								<option value='all-in-one'>{t('ExportModal.exportType.allInOne')}</option>
								<option value='all-separated'>{t('ExportModal.exportType.allSeparated')}</option>
							</Select>
						</Skeleton>
					</FormControl>
					<FormControl
						mb={6}
						isDisabled={articlesState.isLoading}
					>
						<Skeleton
							fitContent
							isLoaded={!articlesState.isLoading}
						>
							<FormLabel>{t('ExportModal.format.label')}</FormLabel>
						</Skeleton>
						<Skeleton
							isLoaded={!articlesState.isLoading}
						>
							<Select
								value={state.format}
								onChange={e => setState({ format: e.target.value as ExportFormat })}
							>
								<option value='html'>HTML</option>
								<option value='md'>Markdown</option>
							</Select>
						</Skeleton>
					</FormControl>
					{(state.format === 'html' || state.format === 'md') && (
						<FormControl
							display='flex'
							alignItems='center'
							mb={1}
							isDisabled={state.exportType === 'all-separated' || articlesState.isLoading}
						>
							<Skeleton
								fitContent
								isLoaded={!articlesState.isLoading}
							>
								<FormLabel
									display='flex'
									alignItems='center'
									m={0}
								>
									{t('ExportModal.embeddedMedia.label')}
									<Tooltip
										label={t('ExportModal.embeddedMedia.warningTooltip')}
										isDisabled={state.exportType === 'all-separated'}
									>
										<Box
											as='span'
											display='flex'
											alignItems='center'
											ml={2}
										>
											<Icon
												as={MdInfo}
											/>
										</Box>
									</Tooltip>
								</FormLabel>
							</Skeleton>
							<Skeleton
								fitContent
								isLoaded={!articlesState.isLoading}
								ml='auto'
							>

								<Switch
									isChecked={state.embeddedMedia && state.exportType !== 'all-separated'}
									onChange={e => setState({ embeddedMedia: e.target.checked })}
								/>
							</Skeleton>
						</FormControl>
					)}
				</ModalBody>
				<ModalFooter
					display='flex'
					justifyContent='space-between'
				>
					<Button
						onClick={props.onClose}
						isDisabled={state.isExporting}
					>
						{t('ExportModal.cancelButton')}
					</Button>
					<Skeleton
						fitContent
						isLoaded={!articlesState.isLoading}
						startColor='blue.50'
						endColor='blue.500'
						borderRadius='md'
					>
						<Button
							colorScheme='blue'
							onClick={handleExport}
							isLoading={state.isExporting}
						>
							{t('ExportModal.confirmButton')}
						</Button>
					</Skeleton>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}