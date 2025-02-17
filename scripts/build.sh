#!/bin/bash

# Build script is to be run from the root directory of the aws-northstar package

set -ev

yarn install
yarn test:ci
yarn styleguide:build
yarn storybook:build

echo 'Remove build folder to make sure the npm package only includes clean built components'
if [ -d "./build" ]; then rm -rf ./build; fi 
yarn build
yarn build:esm
yarn generate:attribution

echo 'Copy license files'
cp ./LICENSE ./build/
cp ./NOTICE ./build/
cp ./LICENSE-THIRD-PARTY ./build/

echo 'Copy the examples to published examples folder'
if [ ! -d "./styleguide.out/examples" ]; then mkdir -p styleguide.out/examples ; fi
pushd examples
tar -czvf ../styleguide.out/examples/create-react-app.tar.gz ./create-react-app 
popd

# Test the example app
./scripts/runDemoTest.sh
