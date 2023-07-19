import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, UseDisclosureReturn, useToast } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ExportFormat, ExportType } from './export';

export default function ExportModal(props: UseDisclosureReturn) {
	const [format, setFormat] = useState<ExportFormat>('md');
	const [exportType, setExportType] = useState<ExportType>('current');
	const [embeddedMedia, setEmbeddedMedia] = useState<boolean>(true);
	const [isExporting, setIsExporting] = useState<boolean>(false);
	const t = useTranslations('ExportModal');
	const tError = useTranslations('pageError');
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
			title: tError('title'),
		});
		setIsExporting(false);
	};

	const handleExport = () => {
		try {
			setIsExporting(true);
			const pathnameWithoutLocale = pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '');
			import('./export').then(module => {
				module.exportArticles(exportType, format, {
					embeddedMedia,
					locale,
					currentArticleSlug: pathnameWithoutLocale,
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
				<ModalHeader>{t('title')}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<FormControl mb={6}>
						<FormLabel>{t('exportType.label')}</FormLabel>
						<Select
							value={exportType}
							onChange={e => setExportType(e.target.value as ExportType)}
						>
							<option value='current'>{t('exportType.current')}</option>
							<option value='all-in-one'>{t('exportType.allInOne')}</option>
							<option value='all-separated'>{t('exportType.allSeparated')}</option>
						</Select>
					</FormControl>
					<FormControl mb={6}>
						<FormLabel>{t('format.label')}</FormLabel>
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
							justifyContent='space-between'
							mb={1}
							isDisabled={exportType === 'all-separated'}
						>
							<FormLabel m={0}>{t('embeddedMedia.label')}</FormLabel>
							{/* TODO: tooltip about file size increase */}
							<Switch
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
					<Button onClick={props.onClose}>{t('cancelButton')}</Button>
					<Button
						colorScheme='blue'
						onClick={handleExport}
						isLoading={isExporting}
					>{t('confirmButton')}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}