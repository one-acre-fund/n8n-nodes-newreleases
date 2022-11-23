import { IExecuteFunctions } from 'n8n-core';
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import * as _ from 'lodash';

import { newReleasesApiRequest } from './GenericFunctions';

import { createOptions } from './CreateOptions';
import { genericOptions } from './GenericOptions';

export class NewReleases implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'New(releases)',
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		documentationUrl: 'https://github.com/one-acre-fund/n8n-nodes-newreleases',
		name: 'newReleases',
		// eslint-disable-next-line n8n-nodes-base/node-class-description-icon-not-svg
		icon: 'file:newReleases.png',
		group: ['transform'],
		version: 1,
		description: 'A node to access project release informations',
		defaults: {
			name: 'New(releases)',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'newReleasesCredentialsApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Project',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Release',
						value: 'release',
						description: 'Get Project Release info',
					},
					{
						name: 'Project',
						value: 'project',
						description: 'Get Project info',
					},
				],
				default: 'release',
				required: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				required: true,
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['release'],
					},
				},
				default: 'list',
				options: [
					{
						name: 'List Project Releases',
						value: 'list',
						action: 'List project releases a release',
					},
					{
						name: 'Get Project Release',
						value: 'get',
						action: 'Get project release a release',
					},
					{
						name: 'Get Project Release Notes',
						value: 'notes',
						action: 'Get project release notes a release',
					},
				],
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['project'],
					},
				},
				default: 'list',
				options: [
					{
						name: 'Create Projects',
						value: 'create',
						action: 'Create a new project',
					},
					{
						name: 'Delete Project',
						value: 'delete',
						action: 'Delete project a project',
					},
					{
						name: 'Get Project',
						value: 'get',
						action: 'Get project a project',
					},
					{
						name: 'List Projects',
						value: 'list',
						action: 'List projects a project',
					},
					{
						name: 'Search Projects',
						value: 'search',
						action: 'Search projects a project',
					},
				],
			},
			...genericOptions,
			{
				displayName: 'Project',
				name: 'slug',
				type: 'string',
				default: '',
				description:
					'Can be either the project internal ID (e.g. pf4w494lbjsd3ydp5hnf4gsptw), or provider/name (e.g. github/n8n-io/n8n).',
				required: true,
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get', 'delete'],
					},
				},
			},
			{
				displayName: 'Project',
				name: 'slug',
				type: 'string',
				default: '',
				required: true,
				description:
					'Can be either the project internal ID (e.g. pf4w494lbjsd3ydp5hnf4gsptw), or provider/name (e.g. github/n8n-io/n8n).',
				displayOptions: {
					show: {
						resource: ['release'],
					},
				},
			},

			{
				displayName: 'Get Latest Release?',
				name: 'getLatestRelease',
				type: 'boolean',
				default: false,
				required: true,
				description:
					'Whether to fetch the most recent non-excluded release for this project? WARNING, this can cause the request to be quite slow',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['get'],
					},
				},
			},

			{
				displayName: 'Search String',
				name: 'search',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['search'],
					},
				},
			},
			{
				displayName: 'Order By',
				name: 'order',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['list'],
					},
				},
				default: 'updated',
				options: [
					{
						name: 'Date Updated',
						value: 'updated',
					},
					{
						name: 'Date Added',
						value: 'added',
					},
					{
						name: 'Name',
						value: 'name',
					},
				],
			},
			{
				displayName: 'Reverse',
				name: 'reverse',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['project'],
						operation: ['list'],
					},
				},
				default: false,
			},
			{
				displayName: 'Release Name',
				name: 'release',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						resource: ['release'],
						operation: ['get', 'notes'],
					},
				},
			},
			{
				displayName: 'Max Pages',
				name: 'maxPages',
				type: 'number',
				default: 50,
				description:
					'Maximum pages to fetch from New(releases) API. Each page returns up to 10 results.',
				displayOptions: {
					show: {
						resource: ['release'],
						operation: ['list'],
					},
				},
			},

			...createOptions,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		// tslint:disable-next-line: no-any
		let returnData: any[] = [];
		// tslint:disable-next-line: no-any
		let responseData: any;
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		if (resource === 'project') {
			// *********************************************************************
			//                             Project
			// *********************************************************************

			if (operation === 'list') {
				// ----------------------------------
				//          Project::list
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const provider = this.getNodeParameter('provider', i, null) as string;
					const order = this.getNodeParameter('order', i, null) as string;
					const tag = this.getNodeParameter('tag', i, null) as string;
					const reverse = this.getNodeParameter('reverse', i, false) as boolean;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/${provider || ''}`,
						qs: {
							...(order && { order }),
							...(tag && { tag }),
							...(reverse && { reverse }),
						},
						scroll: 'projects',
					});

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'get') {
				// ----------------------------------
				//          Project::get
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const slug = this.getNodeParameter('slug', i, null) as string;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/${slug}`,
					});

					if (responseData && this.getNodeParameter('getLatestRelease', i, false)) {
						const projectReleases = await newReleasesApiRequest.call(this, {
							url: `/v1/projects/${slug}/releases`,
							scroll: 'releases',
							// tslint:disable-next-line: no-any
							scrollUntil: (release: any) => !release.is_excluded,
							maxPages: 50,
						});

						if (projectReleases) {
							responseData.latest_release = _.last(
								_.sortBy(_.reject(projectReleases, 'is_excluded'), 'date'),
							);
						}
					}

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'search') {
				// ----------------------------------
				//          Project::search
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const search = this.getNodeParameter('search', i, null) as string;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/search`,
						qs: {
							q: search,
						},
					});

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'delete') {
				// ----------------------------------
				//          Project::delete
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const slug = this.getNodeParameter('slug', i, null) as string;

					responseData = await newReleasesApiRequest.call(this, {
						method: 'DELETE',
						url: `/v1/projects/${slug}`,
					});

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'create') {
				// ----------------------------------
				//          Project::create
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const provider = this.getNodeParameter('provider', i, null) as string;
					const name = this.getNodeParameter('name', i, null) as string;
					// tslint:disable-next-line: variable-name
					const email_notification = this.getNodeParameter('email_notification', i, null) as string;
					// tslint:disable-next-line: variable-name
					const exclude_prereleases = this.getNodeParameter(
						'exclude_prereleases',
						i,
						false,
					) as boolean;
					// tslint:disable-next-line: variable-name
					const exclude_updated = this.getNodeParameter('exclude_updated', i, false) as boolean;
					const note = this.getNodeParameter('note', i, null) as string;

					// const createOptions = this.getNodeParameter('createOptions', i, null) as IDataObject;

					// tslint:disable-next-line: variable-name
					const exclude_version_regexp = // tslint:disable-next-line: no-any
						(this.getNodeParameter('exclude_version_regexp', i, { exclusion: [] }) as any)[
							'exclusion'
						];

					const body = {
						name,
						provider,
						email_notification,
						exclude_prereleases,
						exclude_updated,
						note,
						exclude_version_regexp,
					};

					responseData = await newReleasesApiRequest.call(this, {
						method: 'POST',
						url: `/v1/projects`,
						body,
					});

					returnData = returnData.concat(responseData);
				}
			}
		}

		if (resource === 'release') {
			if (operation === 'list') {
				// ----------------------------------
				//          Release::list
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const slug = this.getNodeParameter('slug', i, null) as string;
					const maxPages = this.getNodeParameter('maxPages', i, 0) as number;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/${slug}/releases`,
						scroll: 'releases',
						maxPages,
					});

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'get') {
				// ----------------------------------
				//          Release::get
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const slug = this.getNodeParameter('slug', i, null) as string;
					const release = this.getNodeParameter('release', i, null) as string;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/${slug}/releases/${release}`,
					});

					returnData = returnData.concat(responseData);
				}
			}

			if (operation === 'notes') {
				// ----------------------------------
				//          Release::notes
				// ----------------------------------
				for (let i = 0; i < items.length; i++) {
					const slug = this.getNodeParameter('slug', i, null) as string;
					const release = this.getNodeParameter('release', i, null) as string;

					responseData = await newReleasesApiRequest.call(this, {
						url: `/v1/projects/${slug}/releases/${release}/note`,
					});

					returnData = returnData.concat(responseData);
				}
			}
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
