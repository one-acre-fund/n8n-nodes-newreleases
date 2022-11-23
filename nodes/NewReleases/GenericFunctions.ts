import _ from 'lodash';

import { IExecuteFunctions, ILoadOptionsFunctions } from 'n8n-core';

import { IDataObject, IHookFunctions, IHttpRequestOptions, IWebhookFunctions } from 'n8n-workflow';

export async function newReleasesApiRequest(
	this: IExecuteFunctions | IWebhookFunctions | IHookFunctions | ILoadOptionsFunctions,
	option: IDataObject = {},
	// tslint:disable:no-any
): Promise<any> {
	const credentials = (await this.getCredentials('newReleasesCredentialsApi')) as IDataObject;

	const options: IHttpRequestOptions = {
		baseURL: 'https://api.newreleases.io',
		url: '',
		headers: {
			'X-Key': credentials.token,
		},
		json: true,
	};
	if (Object.keys(option)) {
		Object.assign(options, option);
	}

	const scrollValue = option.scroll as string;
	if (scrollValue) {
		let page = 1;
		let response: any[] = [];
		let fetchMore = true;
		while (fetchMore) {
			if (options.qs) {
				options.qs.page = page;
			} else {
				options.qs = { page };
			}

			const batch = await this.helpers.httpRequest(options);
			if (batch && batch[scrollValue] && batch[scrollValue].length) {
				response = response.concat(batch[scrollValue]);
			}
			// console.log('tick');

			fetchMore =
				batch &&
				batch.total_pages &&
				batch.total_pages > page &&
				(!option.maxPages || page < option.maxPages) &&
				(!option.scrollUntil || !_.some(batch[scrollValue], option.scrollUntil as Function));
			page++;
		}
		return response;
	} else {
		return await this.helpers.httpRequest(options);
	}
}
