# @dvelop/n8n-nodes-dvelop

This is an n8n community node. It lets you use _app/service name_ in your n8n workflows.
This is a community node and not affiliated with n8n GmbH. Use at your own risk.

This project provides a gateway for hyperautomation by enabling seamless integration between the d.velop platform (https://www.d-velop.de) and external applications using n8n. The d.velop actions Node allows users to execute d.velop actions directly within n8n workflows, making it possible to automate document management, user operations, and custom process integrations. This enables powerful, flexible, and scalable automation across the entire d.velop ecosystem.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

- Download documents automatically
- Import documents automatically to the DMS
- Retrieve the metadata from documents
- Retrieve user information

## Credentials

For every Action Node you want to execute, you need to have your credentials set up. Without them, the API would not have the required information to execute calls.

<img width="1312" height="746" alt="image" src="https://github.com/user-attachments/assets/fe0a35f7-6bc2-4837-a995-02426ab822e5" />

**3.1 Base URL**

- This is just the Base URL of your instance, marked in blue (don't copy the last /)

<img width="600" height="41" alt="image" src="https://github.com/user-attachments/assets/2e89a2b6-0387-4ab9-8891-3c4090b817f0" />

**3.2 Authentication Method**

- The Bearer Token is nothing else except the API key you can find in the d.velop instance configuration, under Login -> API key
- There you have to create an API key. Keep in mind that the key only shows once, therefore you should save the key somewhere safe. Also keep this key for yourself and do **NOT** hand it out.

**3.3 Allowed HTTP Request**

- For the node to work you need to allow the HTTP requests.

## Compatibility

Tested with n8n@2.12.1.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [d.velop Homepage](https://www.d-velop.de)
* [d.velop Support](support@d-velop.de)
