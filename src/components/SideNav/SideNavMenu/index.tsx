import { selectArticlesState } from '@/_helpers/articlesSlice';
import { groupBy } from '@/_helpers/groupBy';
import { Button, Divider, Icon, IconButton, Spinner, Text, Tooltip, VStack, useBreakpoint } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import NextLink from 'next-intl/link';
import { usePathname } from 'next/navigation';
import { createElement, useEffect, useState } from 'react';
import * as MdIcons from 'react-icons/md';
import { MdReport } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavState, setSideNav } from '../sideNavSlice';

export interface SideNavMenuItem {
	label: string;
	icon?: JSX.Element;
	href?: string;
	type?: 'divider' | 'groupName';
}

/**
 * Object with all Material Design icons from 'react-icons' library.
 */
const MdIconsEntries = Object.fromEntries(Object.entries(MdIcons).map(([key, value]) => [key, value]));

/**
 * Prepares menu items from articles metadata.
 * @param articlesMetadata articles metadata
 * @returns menu items
 */
function prepareMenuItems(articlesMetadata: any[]): SideNavMenuItem[] {
	const menuItems: SideNavMenuItem[] = [];
	const groups = groupBy(articlesMetadata, article => article.groupName);

	var i = 0; // Counter for groups
	groups.forEach((articles, groupName) => {
		if (groupName) { // If groupName is not null
			menuItems.push({ // Add groupName as a menu item
				label: groupName,
				type: 'groupName'
			});
		}

		articles.forEach(article => { // Add articles as menu items
			menuItems.push({
				label: article.name as string,
				icon: article.icon ? createElement(MdIconsEntries[article.icon]) : undefined,
				href: `${article.slug}`
			});
		});

		if (i < groups.size - 1) { // If it's not the last group
			menuItems.push({ // Add divider
				label: '',
				type: 'divider'
			});
		}

		i++; // Increment counter
	});

	return menuItems;
}

export default function SideNavMenu() {
	const [menuItems, setMenuItems] = useState<SideNavMenuItem[]>([]);
	const pathname = usePathname();
	const state = useSelector(selectSideNavState);
	const articlesState = useSelector(selectArticlesState);
	const dispatch = useDispatch();
	const breakpoint = useBreakpoint({ ssr: false });
	const t = useTranslations();

	useEffect(() => {
		setMenuItems(prepareMenuItems(articlesState.articlesMetadata));
	}, [articlesState.articlesMetadata]);

	if (articlesState.isLoading) {
		return (
			<VStack
				h='100%'
				p={4}
				justifyContent='center'
				spacing={2}
			>
				<Spinner />
			</VStack>
		)
	}

	if (menuItems.length === 0) {
		return (
			<VStack
				h='100%'
				p={4}
				justifyContent='center'
				spacing={2}
			>
				<Icon
					as={MdReport}
					mb={4}
					fontSize='3xl'
				/>
				<Text
					fontWeight={600}
					color='gray.600'
				>
					{t('loadingError')}
				</Text>
				<Button
					variant='ghost'
					onClick={() => alert('TODO')} //TODO: Implement
				>
					{t('tryAgain')}
				</Button>
			</VStack>
		);
	}

	return (
		<VStack spacing={1} alignItems='flex-start'>
			{menuItems.map((item, i) => {
				const isDesktop = breakpoint !== 'base' && breakpoint !== 'sm';

				switch (item.type) {
					case 'divider':
						return (
							<Divider
								mt={1}
								mb={1}
								key={`${breakpoint}-${i}`}
							/>
						);
					case 'groupName':
						return ((isDesktop && state.isOpen) &&
							<Text
								fontSize='sm'
								fontWeight={600}
								color='gray.600'
								pl={2}
								pr={2}
								pb={1}
								key={`${breakpoint}-${i}`}
							>
								{item.label}
							</Text>
						);
					default:
						const isActive = pathname === item.href;

						if (isDesktop && !state.isOpen) {
							return (
								<Tooltip
									label={item.label}
									placement='right'
									key={`${breakpoint}-${i}`}
								>
									<IconButton
										as={NextLink}
										href={item.href || '/'}
										icon={item.icon || <Text>{item.label?.charAt(0)}</Text>}
										aria-label={item.label || ''}
										variant='ghost'
										w='100%'
										isActive={isActive}
									/>
								</Tooltip>
							);
						}

						return (
							<Button
								as={NextLink}
								href={item.href || '/'}
								key={`${breakpoint}-${i}`}
								onClick={!isDesktop ? () => dispatch(setSideNav({ isOpen: false })) : undefined}
								variant='ghost'
								leftIcon={item.icon}
								w='100%'
								justifyContent='flex-start'
								isActive={isActive}
							>
								{item.label}
							</Button>
						);
				};
			})}
		</VStack>
	);
}