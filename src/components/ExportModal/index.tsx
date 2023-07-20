import { selectArticlesState } from '@/_store/slices/articlesSlice';
import { Box, Button, FormControl, FormLabel, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Switch, Tooltip, UseDisclosureReturn, useToast } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdInfo } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { ExportFormat, ExportType } from './export';

export default function ExportModal(props: UseDisclosureReturn) {
	const [format, setFormat] = useState<ExportFormat>('html');
	const [exportType, setExportType] = useState<ExportType>('current');
	const [embeddedMedia, setEmbeddedMedia] = useState<boolean>(true);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const articlesState = useSelector(selectArticlesState);
	const t = useTranslations();
	const locale = useLocale();
	const toast = useToast();
	const pathname = usePathname();

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
		setIsExporting(false);
	};

	const handleExport = () => {
		// If articles are still loading, don't do anything
		if (articlesState.isLoading) {
			return;
		}

		// If user is already exporting, don't do anything
		if (isExporting) {
			return;
		}

		try {
			setIsExporting(true);
			console.log(typeof useTranslations);
			const pathnameWithoutLocale = pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '');
			import('./export').then(module => {
				module.exportArticles(exportType, format, {
					articles: articlesState.articlesMetadata,
					embeddedMedia,
					locale,
					currentArticleSlug: pathnameWithoutLocale,
					translator: (namespace: Parameters<typeof useTranslations>[0]) => t(namespace),
					callback: () => {
						setIsExporting(false);
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
								value={exportType}
								onChange={e => setExportType(e.target.value as ExportType)}
							>
								<option value='current'>{t('ExportModal.exportType.current')}</option>
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
								value={format}
								onChange={e => setFormat(e.target.value as ExportFormat)}
							>
								<option value='html'>HTML</option>
								<option value='md'>Markdown</option>
								<option value='pdf'>PDF</option>
							</Select>
						</Skeleton>
					</FormControl>
					{(format === 'html' || format === 'md') && (
						<FormControl
							display='flex'
							alignItems='center'
							mb={1}
							isDisabled={exportType === 'all-separated' || articlesState.isLoading}
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
										isDisabled={exportType === 'all-separated'}
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
									isChecked={embeddedMedia && exportType !== 'all-separated'}
									onChange={e => setEmbeddedMedia(e.target.checked)}
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
						isDisabled={isExporting}
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
							isLoading={isExporting}
						>
							{t('ExportModal.confirmButton')}
						</Button>
					</Skeleton>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}