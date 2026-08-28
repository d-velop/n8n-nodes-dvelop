"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DvelopActions = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const ACTION_MODE_STABLE = 'stable';
const ACTION_MODE_VOLATILE = 'volatile';
const STABLE_OPERATION = {
    GET_DOCUMENT: 'integrationplatform_integrationplatform_GET_DOCUMENT',
    GET_DOCUMENT_INFO: 'integrationplatform_integrationplatform_GET_DOCUMENT_INFO',
    GET_USER_INFO: 'integrationplatform_integrationplatform_GET_USER_INFO',
    CREATE_INBOUND_BATCH: 'integrationplatform_inbound_CreateInboundBatch',
};
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
const showStableOperation = (operation) => ({
    show: {
        actionMode: [ACTION_MODE_STABLE],
        operation: [operation],
    },
});
const showStableOperations = (operations) => ({
    show: {
        actionMode: [ACTION_MODE_STABLE],
        operation: operations,
    },
});
const showInboundSource = (source) => ({
    show: {
        actionMode: [ACTION_MODE_STABLE],
        operation: [STABLE_OPERATION.CREATE_INBOUND_BATCH],
        inbound_fileSource: [source],
    },
});
class DvelopActions {
    constructor() {
        this.description = {
            displayName: 'd.velop AG',
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
                    description: 'Dynamic loaded volatile Actions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                },
                {
                    displayName: 'Payload (JSON)',
                    name: 'volatilePayload',
                    type: 'json',
                    displayOptions: showVolatileActionMode,
                    default: '{}',
                    description: 'JSON Payload for volatile Actions',
                },
                {
                    displayName: 'Repository',
                    name: 'repo_id',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: showStableOperations([
                        STABLE_OPERATION.GET_DOCUMENT,
                        STABLE_OPERATION.GET_DOCUMENT_INFO,
                    ]),
                },
                {
                    displayName: 'Document ID',
                    name: 'document_id',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: showStableOperations([
                        STABLE_OPERATION.GET_DOCUMENT,
                        STABLE_OPERATION.GET_DOCUMENT_INFO,
                    ]),
                },
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
                {
                    displayName: 'User ID',
                    name: 'getUserInfo_userId',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: showStableOperation(STABLE_OPERATION.GET_USER_INFO),
                },
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
                    name: 'inbound_batch_profile',
                    type: 'string',
                    required: true,
                    default: '',
                    displayOptions: showStableOperation(STABLE_OPERATION.CREATE_INBOUND_BATCH),
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getVolatileActions() {
                    try {
                        const credentials = await this.getCredentials('dvelopApi');
                        const response = await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
                            method: 'GET',
                            url: `${credentials.baseUrl}/actions/api/v1/actions`,
                            json: true,
                        });
                        const list = Array.isArray(response)
                            ? response
                            : ((response === null || response === void 0 ? void 0 : response.actions) || (response === null || response === void 0 ? void 0 : response.data) || []);
                        return list
                            .filter((a) => a === null || a === void 0 ? void 0 : a.volatile)
                            .map((a) => ({
                            name: a.display_name || a.name || a.id,
                            value: a.id,
                        }));
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                },
            },
        };
    }
    async execute() {
        var _a;
        const items = this.getInputData();
        const results = [];
        const creds = (await this.getCredentials('dvelopApi'));
        const baseUrl = creds.baseUrl;
        for (let i = 0; i < items.length; i++) {
            const actionMode = this.getNodeParameter('actionMode', i);
            const actionId = actionMode === ACTION_MODE_STABLE
                ? this.getNodeParameter('operation', i)
                : this.getNodeParameter('volatileActionId', i);
            const url = `${baseUrl}/actions/api/execute/${actionId}`;
            const payload = {};
            if (actionMode === ACTION_MODE_VOLATILE) {
                const volatilePayload = this.getNodeParameter('volatilePayload', i);
                Object.assign(payload, volatilePayload);
                let response;
                try {
                    response = await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
                        method: 'POST',
                        url,
                        body: payload,
                        json: true,
                    });
                }
                catch (error) {
                    throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                }
                results.push({ json: { actionMode, actionId, response } });
                continue;
            }
            const operation = actionId;
            switch (operation) {
                case STABLE_OPERATION.GET_DOCUMENT: {
                    payload.repo_id = this.getNodeParameter('repo_id', i);
                    payload.document_id = this.getNodeParameter('document_id', i);
                    payload.document_type = this.getNodeParameter('getDocument_documentType', i);
                    let response;
                    try {
                        response = (await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
                            method: 'POST',
                            url,
                            body: payload,
                            json: true,
                        }));
                    }
                    catch (error) {
                        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                    }
                    const docBase64 = response.document;
                    const fileName = (_a = response.filename) !== null && _a !== void 0 ? _a : 'document.pdf';
                    if (!docBase64 || typeof docBase64 !== 'string') {
                        results.push({ json: { actionMode, operation, error: 'No "document" field in response', response } });
                        break;
                    }
                    const buffer = Buffer.from(docBase64, 'base64');
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
                    payload.repo_id = this.getNodeParameter('repo_id', i);
                    payload.document_id = this.getNodeParameter('document_id', i);
                    break;
                }
                case STABLE_OPERATION.GET_USER_INFO: {
                    payload.user_id = this.getNodeParameter('getUserInfo_userId', i);
                    break;
                }
                case STABLE_OPERATION.CREATE_INBOUND_BATCH: {
                    payload.filename = this.getNodeParameter('inbound_filename', i);
                    const fileSource = this.getNodeParameter('inbound_fileSource', i);
                    if (fileSource === 'binary') {
                        const binProp = this.getNodeParameter('inbound_inputBinaryProperty', i);
                        let buf;
                        try {
                            buf = await this.helpers.getBinaryDataBuffer(i, binProp);
                        }
                        catch (error) {
                            throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
                        }
                        payload.file_binary = buf.toString('base64');
                    }
                    else {
                        let base64 = this.getNodeParameter('inbound_fileBinaryString', i);
                        base64 = base64.replace(/^data:.*;base64,/, '').replace(/\s+/g, '');
                        payload.file_binary = base64;
                    }
                    payload.batch_profile = this.getNodeParameter('inbound_batch_profile', i);
                    break;
                }
                default:
                    throw new n8n_workflow_1.NodeOperationError(this.getNode(), `Operation not implemented: ${operation}`);
            }
            if (operation === STABLE_OPERATION.GET_DOCUMENT)
                continue;
            let stableResponse;
            try {
                stableResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'dvelopApi', {
                    method: 'POST',
                    url,
                    body: payload,
                    json: true,
                });
            }
            catch (error) {
                throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
            }
            results.push({ json: { actionMode, actionId, response: stableResponse } });
        }
        return [results];
    }
}
exports.DvelopActions = DvelopActions;
//# sourceMappingURL=DvelopActions.node.js.map