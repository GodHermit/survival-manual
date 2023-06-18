import {
	MdBeachAccess,
	MdConstruction,
	MdDoNotStep,
	MdExplore,
	MdFlag,
	MdFormatListNumbered,
	MdGrass,
	MdHealing,
	MdHomeRepairService,
	MdInfo,
	MdNightShelter,
	MdOutlineSecurity,
	MdPalette,
	MdPeople,
	MdPets,
	MdPower,
	MdPsychology,
	MdReport,
	MdRestaurantMenu,
	MdRowing,
	MdSailing,
	MdSentimentVeryDissatisfied,
	MdSevereCold,
	MdSmartphone,
	MdSunny,
	MdWaterDrop,
	MdWhatshot
} from 'react-icons/md';

//TODO: add hrefs

const menuItems = [
	{
		label: 'Знайомство',
		icon: <MdInfo />,
		href: '/'
	},
	{
		label: 'Психологія',
		icon: <MdPsychology />,
		href: '/psychology'
	},
	{
		label: 'Електроенергія',
		icon: <MdPower />,
		href: '/power'
	},
	{
		label: 'Планування',
		icon: <MdFormatListNumbered />,
		href: '/planning'
	},
	{
		label: 'Набори',
		icon: <MdHomeRepairService />,
		href: '/kits'
	},
	{
		label: 'Програми',
		icon: <MdSmartphone />,
		href: '/apps'
	},
	{
		label: 'Базова медицина',
		icon: <MdHealing />,
		href: '/medicine'
	},
	{
		label: 'Укриття',
		icon: <MdNightShelter />,
		href: '/shelter'
	},
	{
		label: 'Вода',
		icon: <MdWaterDrop />,
		href: '/water'
	},
	{
		label: 'Вогонь',
		icon: <MdWhatshot />,
		href: '/fire'
	},
	{
		label: 'Їжа',
		icon: <MdRestaurantMenu />,
		href: '/food'
	},
	{
		label: 'Рослини',
		icon: <MdGrass />,
		href: '/plants'
	},
	{
		label: 'Отруйні рослини',
		icon: <MdSentimentVeryDissatisfied />,
		href: '/pants-poisonous'
	},
	{
		label: 'Тварини',
		icon: <MdPets />,
		href: '/animals'
	},
	{
		label: 'Інструменти',
		icon: <MdConstruction />,
		href: '/tools'
	},
	{
		label: 'Пустеля',
		icon: <MdSunny />,
		href: '/desert'
	},
	{
		label: 'Тропіки',
		icon: <MdBeachAccess />,
		href: '/tropical'
	},
	{
		label: 'Холод',
		icon: <MdSevereCold />,
		href: '/cold'
	},
	{
		label: 'Море',
		icon: <MdSailing />,
		href: '/sea'
	},
	{
		label: 'Водна переправа', // Water crossing
		icon: <MdRowing />,
		href: '/water-crossing'
	},
	{
		label: 'Пошук напрямку',
		icon: <MdExplore />,
		href: '/find-direction'
	},
	{
		label: 'Техногенна небезпека',
		icon: <MdReport />,
		href: '/man-made-hazards'
	},
	{
		label: 'Самозахист',
		icon: <MdOutlineSecurity />,
		href: '/self-defense'
	},
	{
		label: 'Сигналізування',
		icon: <MdFlag />,
		href: '/signaling'
	},
	{
		label: 'Ворожі території',
		icon: <MdDoNotStep />,
		href: '/hostile-areas'
	},
	{
		label: 'Камуфляж',
		icon: <MdPalette />,
		href: '/camouflage'
	},
	{
		label: 'Люди',
		icon: <MdPeople />,
		href: '/people'
	},
	{
		type: 'divider',
	},
	{
		type: 'groupName',
		label: 'Додатково'
	},

	{
		label: 'Мультитул',
		href: '/multitool'
	},
	{
		label: 'Комахи і членистоногі',
		href: '/insects-and-arthropods'
	},
	{
		label: 'Риба і молюски',
		href: '/fish-and-mollusks'
	},
	{
		label: 'Мотузки і вузли',
		href: '/ropes-and-knots'
	},
	{
		label: 'FAQ',
		href: '/faq'
	}
];

export default menuItems;