import { Divider, LinkBox, LinkOverlay, Text, VStack, Button, useBreakpoint, IconButton, Tooltip } from '@chakra-ui/react';
import menuItems from './menu';
import NextLink from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavState, setSideNav } from '../sideNavSlice';
import { usePathname } from 'next/navigation';

export default function SideNavMenu() {
	const pathname = usePathname();
	const state = useSelector(selectSideNavState);
	const dispatch = useDispatch();
	const breakpoint = useBreakpoint({ ssr: false });

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
								onClick={!isDesktop ? () => dispatch(setSideNav({isOpen: false})): undefined}
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