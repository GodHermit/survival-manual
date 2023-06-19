// import {
// 	MdBeachAccess,
// 	MdConstruction,
// 	MdDoNotStep,
// 	MdExplore,
// 	MdFlag,
// 	MdFormatListNumbered,
// 	MdGrass,
// 	MdHealing,
// 	MdHomeRepairService,
// 	MdInfo,
// 	MdNightShelter,
// 	MdOutlineSecurity,
// 	MdPalette,
// 	MdPeople,
// 	MdPets,
// 	MdPower,
// 	MdPsychology,
// 	MdReport,
// 	MdRestaurantMenu,
// 	MdRowing,
// 	MdSailing,
// 	MdSentimentVeryDissatisfied,
// 	MdSevereCold,
// 	MdSmartphone,
// 	MdSunny,
// 	MdWaterDrop,
// 	MdWhatshot
// } from 'react-icons/md';

import { getArticles } from '@/_lib/articles';
import { As, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons/lib';
import * as MdIcons from 'react-icons/md'

export interface MenuItem {
	label: string;
	icon?: JSX.Element;
	href?: string;
	type?: 'divider' | 'groupName';
}

// const menuItems: MenuItem[] = [
// 	{
// 		label: 'Знайомство',
// 		icon: <MdInfo />,
// 		href: '/'
// 	},
// 	{
// 		label: 'Психологія',
// 		icon: <MdPsychology />,
// 		href: '/psychology'
// 	},
// 	{
// 		label: 'Електроенергія',
// 		icon: <MdPower />,
// 		href: '/power'
// 	},
// 	{
// 		label: 'Планування',
// 		icon: <MdFormatListNumbered />,
// 		href: '/planning'
// 	},
// 	{
// 		label: 'Набори',
// 		icon: <MdHomeRepairService />,
// 		href: '/kits'
// 	},
// 	{
// 		label: 'Програми',
// 		icon: <MdSmartphone />,
// 		href: '/apps'
// 	},
// 	{
// 		label: 'Базова медицина',
// 		icon: <MdHealing />,
// 		href: '/medicine'
// 	},
// 	{
// 		label: 'Укриття',
// 		icon: <MdNightShelter />,
// 		href: '/shelter'
// 	},
// 	{
// 		label: 'Вода',
// 		icon: <MdWaterDrop />,
// 		href: '/water'
// 	},
// 	{
// 		label: 'Вогонь',
// 		icon: <MdWhatshot />,
// 		href: '/fire'
// 	},
// 	{
// 		label: 'Їжа',
// 		icon: <MdRestaurantMenu />,
// 		href: '/food'
// 	},
// 	{
// 		label: 'Рослини',
// 		icon: <MdGrass />,
// 		href: '/plants'
// 	},
// 	{
// 		label: 'Отруйні рослини',
// 		icon: <MdSentimentVeryDissatisfied />,
// 		href: '/pants-poisonous'
// 	},
// 	{
// 		label: 'Тварини',
// 		icon: <MdPets />,
// 		href: '/animals'
// 	},
// 	{
// 		label: 'Інструменти',
// 		icon: <MdConstruction />,
// 		href: '/tools'
// 	},
// 	{
// 		label: 'Пустеля',
// 		icon: <MdSunny />,
// 		href: '/desert'
// 	},
// 	{
// 		label: 'Тропіки',
// 		icon: <MdBeachAccess />,
// 		href: '/tropical'
// 	},
// 	{
// 		label: 'Холод',
// 		icon: <MdSevereCold />,
// 		href: '/cold'
// 	},
// 	{
// 		label: 'Море',
// 		icon: <MdSailing />,
// 		href: '/sea'
// 	},
// 	{
// 		label: 'Водна переправа', // Water crossing
// 		icon: <MdRowing />,
// 		href: '/water-crossing'
// 	},
// 	{
// 		label: 'Пошук напрямку',
// 		icon: <MdExplore />,
// 		href: '/find-direction'
// 	},
// 	{
// 		label: 'Техногенна небезпека',
// 		icon: <MdReport />,
// 		href: '/man-made-hazards'
// 	},
// 	{
// 		label: 'Самозахист',
// 		icon: <MdOutlineSecurity />,
// 		href: '/self-defense'
// 	},
// 	{
// 		label: 'Сигналізування',
// 		icon: <MdFlag />,
// 		href: '/signaling'
// 	},
// 	{
// 		label: 'Ворожі території',
// 		icon: <MdDoNotStep />,
// 		href: '/hostile-areas'
// 	},
// 	{
// 		label: 'Камуфляж',
// 		icon: <MdPalette />,
// 		href: '/camouflage'
// 	},
// 	{
// 		label: 'Люди',
// 		icon: <MdPeople />,
// 		href: '/people'
// 	},
// 	{
// 		type: 'divider',
// 		label: 'divider'
// 	},
// 	{
// 		type: 'groupName',
// 		label: 'Додатково'
// 	},

// 	{
// 		label: 'Мультитул',
// 		href: '/multitool'
// 	},
// 	{
// 		label: 'Комахи і членистоногі',
// 		href: '/insects-and-arthropods'
// 	},
// 	{
// 		label: 'Риба і молюски',
// 		href: '/fish-and-mollusks'
// 	},
// 	{
// 		label: 'Мотузки і вузли',
// 		href: '/ropes-and-knots'
// 	},
// 	{
// 		label: 'FAQ',
// 		href: '/faq'
// 	}
// ];

export default function getSideNavMenuItems(locale: string = 'en'): Promise<MenuItem[]> {

	return new Promise<MenuItem[]>(
		async (resolve, reject) => {
			try {
				const articles = await getArticles(locale);
				resolve(articles.map((article) => ({
					label: article.metadata.name as string,
					icon: <Icon as={MdIcons[article.metadata.icon]} />,
					href: `${article.metadata.slug}`
				})));
			} catch (error) {
				reject(error);
			}
		}
	);
};