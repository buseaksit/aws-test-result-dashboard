import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as path from 'path';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ---------- DynamoDB table for test runs ----------
    const testRunsTable = new Table(this, 'TestRunsTable', {
      partitionKey: { name: 'test_run_id', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST,
      tableName: 'TestRuns',
    });

    // ---------- Lambda: POST /test-runs ----------
    const createTestRunFn = new lambda.Function(this, 'CreateTestRunFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', '..', 'backend', 'create-test-run')
      ),
      environment: {
        TEST_RUNS_TABLE_NAME: testRunsTable.tableName,
      },
    });

    // Allow Lambda to write items into DynamoDB
    testRunsTable.grantWriteData(createTestRunFn);

    // ---------- Lambda: GET /test-runs ----------
    const getTestRunsFn = new lambda.Function(this, 'GetTestRunsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '..', '..', 'backend', 'get-test-runs')
      ),
      environment: {
        TEST_RUNS_TABLE_NAME: testRunsTable.tableName,
      },
    });

    // Allow Lambda to read items from DynamoDB
    testRunsTable.grantReadData(getTestRunsFn);

    // ---------- API Gateway REST API ----------
  const api = new apigw.RestApi(this, 'TestResultsApi', {
  restApiName: 'Test Results Service',
  deployOptions: {
    stageName: 'dev',
  },
  defaultCorsPreflightOptions: {
    allowOrigins: apigw.Cors.ALL_ORIGINS,
    allowMethods: apigw.Cors.ALL_METHODS,
  },
});


    // /test-runs resource
    const testRunsResource = api.root.addResource('test-runs');

    // POST /test-runs -> createTestRunFn
    testRunsResource.addMethod(
      'POST',
      new apigw.LambdaIntegration(createTestRunFn)
    );

    // GET /test-runs -> getTestRunsFn
    testRunsResource.addMethod(
      'GET',
      new apigw.LambdaIntegration(getTestRunsFn)
    );
  }
}
