/**
 * d.velop n8n Integration
 *
 * Author: d.velop AG (phem)
 */

import type * as n8nWorkflow from 'n8n-workflow';
import { NodeApiError, JsonObject } from 'n8n-workflow';

const ACTION_MODE_STABLE = 'stable' as const;
const ACTION_MODE_VOLATILE = 'volatile' as const;

const STABLE_OPERATION = {
	GET_DOCUMENT: 'integrationplatform_integrationplatform_GET_DOCUMENT',
	GET_DOCUMENT_INFO: 'integrationplatform_integrationplatform_GET_DOCUMENT_INFO',
	GET_USER_INFO: 'integrationplatform_integrationplatform_GET_USER_INFO',
	CREATE_INBOUND_BATCH: 'integrationplatform_inbound_CreateInboundBatch',
} as const;

type StableOp = (typeof STABLE_OPERATION)[keyof typeof STABLE_OPERATION];

const showStableActionMode = {
	show: {
		actionMode: [ACTION_MODE_STABLE],
	},
};

const showVolatileActionMode = {
	show: {
		actionMode: [ACTION_MODE_VOLATILE],
	},
};

const showStableOperation = (operation: StableOp) => ({
	show: {
		actionMode: [ACTION_MODE_STABLE],
		operation: [operation],
	},
});

const showInboundSource = (source: 'binary' | 'string') => ({
	show: {
		actionMode: [ACTION_MODE_STABLE],
		operation: [STABLE_OPERATION.CREATE_INBOUND_BATCH],
		inbound_fileSource: [source],
	},
});

const createRepositoryProperty = (name: string, operation: StableOp): n8nWorkflow.INodeProperties => ({
	displayName: 'Repository',
	name,
	type: 'string',
	required: true,
	default: '',
	displayOptions: showStableOperation(operation),
});

const createDocumentIdProperty = (name: string, operation: StableOp): n8nWorkflow.INodeProperties => ({
	displayName: 'Document ID',
	name,
	type: 'string',
	required: true,
	default: '',
	displayOptions: showStableOperation(operation),
});

export class DvelopActions implements n8nWorkflow.INodeType {
	description: n8nWorkflow.INodeTypeDescription = {
		displayName: 'd.velop Actions',
		name: 'dvelopActions',
		icon: { light: 'file:../../icons/dvelop_light.svg', dark: 'file:../../icons/dvelop_dark.svg' },
		group: ['input'],
		version: 1,
		description: 'Execute d.velop Actions.',
		defaults: { name: 'd.velop Actions' },
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [{ name: 'dvelopApi', required: true }],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: { Accept: 'application/json' },
		},
		properties: [
			{
				displayName: 'Action Mode',
				name: 'actionMode',
				type: 'options',
				options: [
					{ name: 'Stable Action', value: ACTION_MODE_STABLE },
					{ name: 'Volatile Action', value: ACTION_MODE_VOLATILE },
				],
				default: ACTION_MODE_STABLE,
				description: 'Choose between a stable or a volatile action',
			},
			{
				displayName: 'Operation (Stable Action)',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: showStableActionMode,
				options: [
					{
						name: 'Download Document',
						value: STABLE_OPERATION.GET_DOCUMENT,
						description: 'Downloads the specific document',
						action: 'Downloads the document to the specified document ID',
					},
					{
						name: 'Get Document Info',
						value: STABLE_OPERATION.GET_DOCUMENT_INFO,
						description: 'Gets information of a document for the specified document ID',
						action: 'Gets information of a document for the specified document ID',
					},
					{
						name: 'Get User Info',
						value: STABLE_OPERATION.GET_USER_INFO,
						description: 'Gets information about the specified user ID',
						action: 'Gets information about the specified user ID',
					},
					{
						name: 'Import Document (d.velop Inbound)',
						value: STABLE_OPERATION.CREATE_INBOUND_BATCH,
						description: 'Imports a document via d.velop inbound',
						action: 'Imports a document via d velop inbound',
					},
				],
				default: 'integrationplatform_integrationplatform_GET_DOCUMENT',
				placeholder: 'Choose an Action',
			},
			{
				displayName: 'Volatile Action Name or ID',
				name: 'volatileActionId',
				type: 'options',
				displayOptions: showVolatileActionMode,
				typeOptions: { loadOptionsMethod: 'getVolatileActions' },
				default: '',
				placeholder: 'Loading volatile Actions...',
				description:
					'Dynamic loaded volatile Actions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Payload (JSON)',
				name: 'volatilePayLoad',
				type: 'json',
				displayOptions: showVolatileActionMode,
				default: '{}',
				description: 'JSON Payload for volatile Actions',
			},

			// Stable Actions
			createRepositoryProperty('getDocument_repoId', STABLE_OPERATION.GET_DOCUMENT),
			createDocumentIdProperty('getDocument_documentId', STABLE_OPERATION.GET_DOCUMENT),
			{
				displayName: 'Format',
				name: 'getDocument_documentType',
				type: 'options',
				required: true,
				default: 'original',
				options: [
					{ name: 'Original', value: 'original' },
					{ name: 'PDF', value: 'pdf' },
				],
				displayOptions: showStableOperation(STABLE_OPERATION.GET_DOCUMENT),
			},

			// GET_DOCUMENT_INFO
			createRepositoryProperty('getDocumentInfo_repoId', STABLE_OPERATION.GET_DOCUMENT_INFO),
			createDocumentIdProperty('getDocumentInfo_documentId', STABLE_OPERATION.GET_DOCUMENT_INFO),

			// GET_USER_INFO
			{
				displayName: 'User ID',
				name: 'getUserInfo_userId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: showStableOperation(STABLE_OPERATION.GET_USER_INFO),
			},

			// INBOUND CreateInboundBatch
			{
				displayName: 'File Name',
				name: 'inbound_filename',
				type: 'string',
				required: true,
				default: '',
				displayOptions: showStableOperation(STABLE_OPERATION.CREATE_INBOUND_BATCH),
			},
			{
				displayName: 'File Source',
				name: 'inbound_fileSource',
				type: 'options',
				default: 'binary',
				options: [
					{ name: 'From N8n Binary', value: 'binary' },
					{ name: 'From Base64/String', value: 'string' },
				],
				displayOptions: showStableOperation(STABLE_OPERATION.CREATE_INBOUND_BATCH),
			},
			{
				displayName: 'Input Binary Property',
				name: 'inbound_inputBinaryProperty',
				type: 'string',
				default: 'data',
				displayOptions: showInboundSource('binary'),
			},
			{
				displayName: 'File (Base64/String)',
				name: 'inbound_fileBinaryString',
				type: 'string',
				required: true,
				default: '',
				displayOptions: showInboundSource('string'),
			},
			{
				displayName: 'Import Profile',
				name: 'inbound_batchProfile',
				type: 'string',
				required: true,
				default: '',
				displayOptions: showStableOperation(STABLE_OPERATION.CREATE_INBOUND_BATCH),
			},
		],
	};

	methods = {
	loadOptions: {
		async getVolatileActions(this: n8nWorkflow.ILoadOptionsFunctions) {
			try {
				const credentials = await this.getCredentials('dvelopApi') as {
					baseUrl: string;
				};

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'dvelopApi',
					{
						method: 'GET',
						url: `${credentials.baseUrl}/actions/api/v1/actions`,
						json: true,
					}
				);

				interface Action {
					volatile?: boolean;
					display_name?: string;
					name?: string;
					id: string;
				}

				const list = Array.isArray(response)
					? response
					: (response?.actions || response?.data || []);

				return list
					.filter((a: Action) => a?.volatile)
					.map((a: Action) => ({
						name: a.display_name || a.name || a.id,
						value: a.id,
					}));
			} catch (error) {
				throw new NodeApiError(this.getNode(), error as JsonObject);
			}
		},
	},
};

	async execute(this: n8nWorkflow.IExecuteFunctions): Promise<n8nWorkflow.INodeExecutionData[][]> {
		const items = this.getInputData();
		const results: n8nWorkflow.INodeExecutionData[] = [];

		const creds = (await this.getCredentials('dvelopApi')) as { baseUrl: string };
		const baseUrl = creds.baseUrl;

		for (let i = 0; i < items.length; i++) {
			const actionMode = this.getNodeParameter('actionMode', i) as
				| typeof ACTION_MODE_STABLE
				| typeof ACTION_MODE_VOLATILE;

			// Dynamic actionId for BOTH modes
			const actionId =
				actionMode === ACTION_MODE_STABLE
					? (this.getNodeParameter('operation', i) as StableOp)
					: (this.getNodeParameter('volatileActionId', i) as string);

			// Dynamic URL for BOTH modes
			const url = `${baseUrl}/actions/api/execute/${actionId}`;

			// Payload (built depending on mode)
			const payload: Record<string, unknown> = {};

			if (actionMode === ACTION_MODE_VOLATILE) {
				// Volatile payload is already an object (type: 'json') -> no JSON.parse needed
				const volatilePayload = this.getNodeParameter('volatilePayLoad', i) as Record<string, unknown>;
				Object.assign(payload, volatilePayload);

				const response = await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
					method: 'POST',
					url,
					body: payload,
					json: true,
				});

				results.push({ json: { actionMode, actionId, response } });
				continue;
			}
			// Stable payload building
			const operation = actionId as StableOp;

			switch (operation) {
				case STABLE_OPERATION.GET_DOCUMENT: {
					payload.repo_id = this.getNodeParameter('getDocument_repoId', i);
					payload.document_id = this.getNodeParameter('getDocument_documentId', i);
					payload.document_type = this.getNodeParameter('getDocument_documentType', i);

					const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
						method: 'POST',
						url,
						body: payload,
						json: true,
					})) as unknown as { document?: string; filename?: string };

					const docBase64 = response.document;
					const fileName = response.filename ?? 'document.pdf';

					if (!docBase64 || typeof docBase64 !== 'string') {
						results.push({ json: { actionMode, operation, error: 'No "document" field in response', response } });
						break;
					}

					// Base64 -> Buffer
					const buffer = Buffer.from(docBase64, 'base64');

					// Optional safety check for PDF
					if (payload.document_type === 'pdf' && buffer.slice(0, 5).toString('utf8') !== '%PDF-') {
						results.push({
							json: {
								actionMode,
								operation,
								error: 'Decoded content is not a PDF (missing %PDF- header)',
								fileName,
								firstBytes: buffer.slice(0, 16).toString('hex'),
							},
						});
						break;
					}
					const outputBinaryProperty = 'data';

					const mimeType = payload.document_type === 'pdf' ? 'application/pdf' : 'application/octet-stream';
					const binaryData = await this.helpers.prepareBinaryData(buffer, fileName, mimeType);

					results.push({
						json: {
							actionMode,
							operation,
							fileName,
							mimeType,
							statusCode: 200,
						},
						binary: {
							[outputBinaryProperty]: binaryData,
						},
					});

					break;
				}

				case STABLE_OPERATION.GET_DOCUMENT_INFO: {
					payload.repo_id = this.getNodeParameter('getDocumentInfo_repoId', i);
					payload.document_id = this.getNodeParameter('getDocumentInfo_documentId', i);
					break;
				}

				case STABLE_OPERATION.GET_USER_INFO: {
					payload.user_id = this.getNodeParameter('getUserInfo_userId', i);
					break;
				}

				case STABLE_OPERATION.CREATE_INBOUND_BATCH: {
					payload.filename = this.getNodeParameter('inbound_filename', i);

					const fileSource = this.getNodeParameter('inbound_fileSource', i) as 'binary' | 'string';

					if (fileSource === 'binary') {
						const binProp = this.getNodeParameter('inbound_inputBinaryProperty', i) as string;

						let buf: Buffer;
						try {
							buf = await this.helpers.getBinaryDataBuffer(i, binProp);
						} catch (error) {
							throw new NodeApiError(this.getNode(), error as JsonObject);
						}

						payload.file_binary = buf.toString('base64');
					} else {
						let base64 = this.getNodeParameter('inbound_fileBinaryString', i) as string;
						base64 = base64.replace(/^data:.*;base64,/, '').replace(/\s+/g, '');
						payload.file_binary = base64;
					}

					payload.batch_profile = this.getNodeParameter('inbound_batchProfile', i);
					break;
				}

				default:
					// eslint-disable-next-line n8n-nodes-base/node-execute-block-wrong-error-thrown
					throw new Error(`Operation not implemented: ${operation}`);
			}
			if (operation === STABLE_OPERATION.GET_DOCUMENT) continue;
			const response = await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
				method: 'POST',
				url,
				body: payload,
				json: true,
			});

			results.push({ json: { actionMode, actionId, response } });
		}

		return [results];
	}
}
