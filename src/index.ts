import { AWSAppSyncClient, AUTH_TYPE } from 'aws-appsync';
import { AWS_CONFIG } from './aws-exports';

const AWS = require('aws-sdk');

const gql = require('graphql-tag');
const list_images = gql(`
query getImages_default_pagination {
	listImages {
    items {
      name
      repo
    }
    nextToken
  }
}
`);

const createImage_go = gql(`
mutation createImage_go {
    createImage(input: {
      name: "library/golang", 
      repo: "docker.io"
    }) {
        id
        name
        repo
    }
}
`);

const main = async () => {
    const credentials = AWS.config.credentials;

    global.fetch = require("isomorphic-fetch");
      
    const client = new AWSAppSyncClient({
        url: AWS_CONFIG.aws_appsync_graphqlEndpoint,
        region: AWS_CONFIG.aws_appsync_region,
        auth: { type: AUTH_TYPE.AWS_IAM, credentials: credentials },
        disableOffline: true,
    });

    client.hydrated().then(function (client) {
        
        // client.mutate({mutation: createImage_go})
        // .then(function logData(data) {
        //     console.log('results of mutation: ', JSON.stringify(data.data));
        // })
        // .catch(console.error);

        //Now run a query
        client.query({ query: list_images, fetchPolicy: 'network-only' })
        //client.query({ query: query, fetchPolicy: 'network-only' })   //Uncomment for AWS Lambda
            .then(function logData(data) {
                console.log('results of query: ', JSON.stringify(data.data));
            })
            .catch(console.error);
        
    });
}

main()