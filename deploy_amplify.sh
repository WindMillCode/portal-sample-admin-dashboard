#!/bin/bash
set -e
IFS='|'


ANGULARCONFIG="{\
  \"SourceDir\":\"src\",\
  \"DistributionDir\":\"dist/amplify\",\
  \"BuildCommand\":\"echo 'OK'\",\
  \"StartCommand\":\"echo 'OK'\"\
}"

AWSCLOUDFORMATIONCONFIG="{\
\"configLevel\":\"project\",\
\"useProfile\":false,\
\"accessKeyId\":$AWS_ACCESS_KEY_ID\",\
\"secretAccessKey\":$AWS_SECRET_ACCESS_KEY\",\
\"region\":$AWS_REGION\
}"
AMPLIFY="{\
\"projectName\":\"WindMillCodeSite\",\
\"appId\":\"$AWS_AMPLIFY_APP_ID\",\
\"envName\":\"prod\"\
}"
FRONTEND="{\
\"frontend\":\"javascript\",\
\"framework\":\"angular\",\
\"config\":$ANGULARCONFIG\
}"
PROVIDERS="{\
\"awscloudformation\":$AWSCLOUDFORMATIONCONFIG\
}"

amplify pull --amplify $AMPLIFY  --frontend $FRONTEND  --providers $PROVIDERS --yes;
amplify publish --yes;
