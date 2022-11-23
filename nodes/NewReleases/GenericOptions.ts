import { INodeProperties, INodePropertyOptions } from 'n8n-workflow';

export const providersList: INodePropertyOptions[] = [
	{
		value: 'nuget',
		name: '.NET NuGet',
	},
	{
		value: 'artifacthub',
		name: 'Artifact Hub',
	},
	{
		value: 'ecr-public',
		name: 'AWS ECR Public',
	},
	{
		value: 'bitbucket',
		name: 'Bitbucket',
	},
	{
		value: 'debian-gitlab',
		name: 'Debian GitLab',
	},
	{
		value: 'dockerhub',
		name: 'Docker Hub',
	},
	{
		value: 'hex',
		name: 'Erlang/Elixir Hex',
	},
	{
		value: 'freedesktop-gitlab',
		name: 'Freedesktop GitLab',
	},
	{
		value: 'github',
		name: 'GitHub',
	},
	{
		value: 'gitlab',
		name: 'GitLab',
	},
	{
		value: 'gnome-gitlab',
		name: 'GNOME GitLab',
	},
	{
		value: 'gcr',
		name: 'Google Container Registry',
	},
	{
		value: 'maven',
		name: 'Java Maven',
	},
	{
		value: 'kde-gitlab',
		name: 'KDE GitLab',
	},
	{
		value: 'npm',
		name: 'Node.js NPM',
	},
	{
		value: 'yarn',
		name: 'Node.js Yarn',
	},
	{
		value: 'cpan',
		name: 'Perl CPAN',
	},
	{
		value: 'packagist',
		name: 'PHP Packagist',
	},
	{
		value: 'pypi',
		name: 'Python PyPI',
	},
	{
		value: 'quay',
		name: 'Quay',
	},
	{
		value: 'gems',
		name: 'Ruby Gems',
	},
	{
		value: 'cargo',
		name: 'Rust Cargo',
	},
	{
		value: 'sourceforge',
		name: 'SourceForge',
	},
];

export const genericOptions: INodeProperties[] = [
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		default: 'github',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['create'],
			},
		},
		options: providersList,
	},
	{
		displayName: 'Provider',
		name: 'provider',
		type: 'options',
		default: '',
		displayOptions: {
			show: {
				resource: ['project'],
				operation: ['list'],
			},
		},
		options: [
			...providersList,
			{
				name: 'Any',
				value: '',
			},
		],
	},
];
