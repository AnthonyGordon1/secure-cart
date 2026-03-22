#!/bin/bash

echo "Initializing LocalStack resources..."

# Create S3 bucket for order receipts
awslocal s3 mb s3://securecart-receipts

# Store fake database password in SSM Parameter Store
awslocal ssm put-parameter \
  --name "/securecart/db-password" \
  --value "fake-db-password-123" \
  --type SecureString

# Create overly permissive IAM role (intentionally vulnerable for Story 15)
awslocal iam create-role \
  --role-name securecart-backend-role \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

awslocal iam put-role-policy \
  --role-name securecart-backend-role \
  --policy-name overly-permissive \
  --policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":"*","Resource":"*"}]}'

echo "LocalStack resources initialized."