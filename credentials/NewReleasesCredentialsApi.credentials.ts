import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class NewReleasesCredentialsApi implements ICredentialType {
	name = 'newReleasesCredentialsApi';
	displayName = 'New(releases) Credentials API';
	properties: INodeProperties[] = [
		{
			displayName: 'API Token (generate it at https://newreleases.io/settings/api-keys)',
			name: 'token',
			default: '',
			type: 'string',
			typeOptions: {
				password: true,
			},
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Key': '={{$credentials.token}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.newreleases.io',
			url: '/v1/projects',
		},
	};
}
