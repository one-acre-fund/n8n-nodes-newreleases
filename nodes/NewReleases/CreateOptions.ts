import { INodeProperties } from 'n8n-workflow';

export const createOptions: INodeProperties[] = [
	// name
	{
		displayName: 'Project Name',
		name: 'name',
		type: 'string',
		default: '',
		description: 'User-friendly name',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},

	// email_notification
	{
		displayName: 'Email_notification',
		name: 'email_notification',
		type: 'options',
		default: 'none',
		description: 'Email Notification Frequency',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Account Default',
				value: 'default',
			},
			{
				name: 'Daily',
				value: 'daily',
			},
			{
				name: 'Hourly',
				value: 'hourly',
			},
			{
				name: 'None',
				value: 'none',
			},
			{
				name: 'Weekly',
				value: 'weekly',
			},
		],
	},

	// exclude_prereleases
	{
		displayName: 'Exclude Pre-Releases?',
		name: 'exclude_prereleases',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},

	// exclude_updated
	{
		displayName: 'Exclude Updated?',
		name: 'exclude_updated',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},

	// note
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
	},

	{
		displayName: 'Exclude Version Regex',
		name: 'exclude_version_regexp',
		type: 'fixedCollection',
		placeholder: 'Add New Exclusion Regex',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		default: [],
		options: [
			{
				name: 'exclusion',
				displayName: 'Exclusion Regex',
				values: [
					{
						displayName: 'Regex',
						name: 'value',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Include?',
						name: 'inverse',
						type: 'boolean',
						default: false,
						description: 'Whether to use the regex as an inclusion mask',
					},
				],
			},
		],
	},

	// TODO: These require using IDs rather than free text, so we'd need to look them up...
	// {
	// 	displayName: 'Advanced Options',
	// 	name: 'createOptions',
	// 	type: 'collection',
	// 	default: {},
	// 	displayOptions: {
	// 		show: {
	// 			resource: ['project'],
	// 			operation: ['create'],
	// 		},
	// 	},
	// 	options: [
	// 		// slack_channels
	// 		{
	// 			displayName: 'Slack Channels',
	// 			name: 'slack_channels',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// telegram_chats
	// 		{
	// 			displayName: 'Telegram Chats',
	// 			name: 'telegram_chats',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// discord_channels
	// 		{
	// 			displayName: 'Discord Channels',
	// 			name: 'discord_channels',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// hangouts_chat_webhooks
	// 		{
	// 			displayName: 'Hangouts Chat Webhooks',
	// 			name: 'hangouts_chat_webhooks',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// microsoft_teams_webhooks
	// 		{
	// 			displayName: 'Microsoft Teams Webhooks',
	// 			name: 'microsoft_teams_webhooks',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// mattermost_webhooks
	// 		{
	// 			displayName: 'Mattermost Webhooks',
	// 			name: 'mattermost_webhooks',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// rocketchat_webhooks
	// 		{
	// 			displayName: 'Rocketchat Webhooks',
	// 			name: 'rocketchat_webhooks',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// matrix_rooms
	// 		{
	// 			displayName: 'Matrix Rooms',
	// 			name: 'matrix_rooms',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		// webhooks
	// 		{
	// 			displayName: 'Webhooks',
	// 			name: 'webhooks',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Notification Channel',
	// 			},
	// 			default: '',
	// 		},

	// 		{
	// 			displayName: 'Tags',
	// 			name: 'tags',
	// 			type: 'string',
	// 			typeOptions: {
	// 				multipleValues: true,
	// 				multipleValueButtonText: 'Add Tag',
	// 			},
	// 			default: '',
	// 		},
	// 	],
	// },
];
