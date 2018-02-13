import awsServerlessExpress from 'aws-serverless-express';
import app from './src/app'

const server = awsServerlessExpress.createServer(app, null);

export default (event, context) => awsServerlessExpress.proxy(server, event, context)