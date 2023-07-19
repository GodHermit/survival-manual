import { Box, Button, FormControl, FormLabel, Icon, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, Tooltip, UseDisclosureReturn, useToast } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { MdInfo } from 'react-icons/md';
import { ExportFormat, ExportType } from './export';

export default function ExportModal(props: UseDisclosureReturn) {
	const [format, setFormat] = useState<ExportFormat>('html');
	const [exportType, setExportType] = useState<ExportType>('current');
	const [embeddedMedia, setEmbeddedMedia] = useState<boolean>(true);
	const [isExporting, setIsExporting] = useState<boolean>(false);
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
		try {
			setIsExporting(true);
			console.log(typeof useTranslations);
			const pathnameWithoutLocale = pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '');
			import('./export').then(module => {
				module.exportArticles(exportType, format, {
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
						<FormLabel>{t('ExportModal.exportType.label')}</FormLabel>
						<Select
							value={exportType}
							onChange={e => setExportType(e.target.value as ExportType)}
						>
							<option value='current'>{t('ExportModal.exportType.current')}</option>
							<option value='all-in-one'>{t('ExportModal.exportType.allInOne')}</option>
							<option value='all-separated'>{t('ExportModal.exportType.allSeparated')}</option>
						</Select>
					</FormControl>
					<FormControl mb={6}>
						<FormLabel>{t('ExportModal.format.label')}</FormLabel>
						<Select
							value={format}
							onChange={e => setFormat(e.target.value as ExportFormat)}
						>
							<option value='html'>HTML</option>
							<option value='md'>Markdown</option>
							<option value='pdf'>PDF</option>
						</Select>
					</FormControl>
					{(format === 'html' || format === 'md') && (
						<FormControl
							display='flex'
							alignItems='center'
							mb={1}
							isDisabled={exportType === 'all-separated'}
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
							<Switch
								ml='auto'
								isChecked={embeddedMedia && exportType !== 'all-separated'}
								onChange={e => setEmbeddedMedia(e.target.checked)}
							/>
						</FormControl>
					)}
				</ModalBody>
				<ModalFooter
					display='flex'
					justifyContent='space-between'
				>
					<Button onClick={props.onClose}>{t('ExportModal.cancelButton')}</Button>
					<Button
						colorScheme='blue'
						onClick={handleExport}
						isLoading={isExporting}
					>{t('ExportModal.confirmButton')}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}