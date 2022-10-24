#!/bin/sh -e

dist_dir="dist"
mkdir -p ${dist_dir}
cp -r build/src/* ${dist_dir}
cp LICENSE README.md package.json ${dist_dir}
jq 'del(.scripts.prepare)' dist/package.json > dist/_temp-package.json && mv dist/_temp-package.json dist/package.json
pushd ${dist_dir}
find . -type f -name "*.spec.*" -exec rm -f {} \;
find . -name "__*__" -type d -empty -delete
popd
echo "To publish, run: npm publish --access public ${dist_dir}"
