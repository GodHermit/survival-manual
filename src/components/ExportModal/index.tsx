import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch, UseDisclosureReturn, useToast } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { SupportedFormat, downloadFile, getBlob } from './export';

export default function ExportModal(props: UseDisclosureReturn) {
	const [format, setFormat] = useState<SupportedFormat>('html');
	const [exportType, setExportType] = useState('current');
	const [embeddedMedia, setEmbeddedMedia] = useState<boolean>(true);
	const t = useTranslations('ExportModal');
	const tError = useTranslations('pageError');
	const locale = useLocale();
	const toast = useToast();
	const pathname = usePathname();

	const handleExport = async () => {
		try {
			const res = await fetch(`/api/articles?locale=${locale}&metadataOnly`);
			const articles = await res.json();

			switch (exportType) {
				case 'current':
					const pathnameWithoutLocale = pathname === `/${locale}` ? '/' : pathname.replace(`/${locale}`, '');
					const currentArticle = articles.find((article: ArticleMetadata) => article.slug === pathnameWithoutLocale);

					const filename = currentArticle.filename;
					const file = await getBlob(filename, format, embeddedMedia);
					downloadFile(
						file, // Blob
						filename.replace(
							filename.split('.').slice(-1), // Get the extension
							format // Replace the extension with the new one
						)
					);
					break;
				case 'all-in-one':
					throw new Error('NOT_IMPLEMENTED');
					break;
				case 'all-separated':
					throw new Error('NOT_IMPLEMENTED');
					break;
				default:
					throw new Error('NOT_SUPPORTED');
			}

			// If there is an error toast, close it
			if (toast.isActive('export-error')) {
				toast.close('export-error');
			}
		} catch (error) {
			if (toast.isActive('export-error')) {
				return;
			}
			toast({
				id: 'export-error',
				position: 'top',
				status: 'error',
				title: tError('title'),
			});
		}

		props.onClose();
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
							onChange={e => setExportType(e.target.value)}
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
							onChange={e => setFormat(e.target.value as SupportedFormat)}
						>
							<option value='html'>HTML</option>
							<option value='md'>Markdown</option>
							<option value='pdf'>PDF</option>
						</Select>
					</FormControl>
					{format === 'html' && (
						<FormControl
							display='flex'
							alignItems='center'
							justifyContent='space-between'
							mb={1}
						>
							<FormLabel m={0}>{t('embeddedMedia.label')}</FormLabel>
							<Switch
								isChecked={embeddedMedia}
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
					<Button colorScheme='blue' onClick={handleExport}>{t('confirmButton')}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}