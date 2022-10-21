# mes-microservice-common

Common code used by the various serverless microservices within the Mobile Examiner Services (MES) system, published as an npm package.

Each consuming microservice must only ever depend upon **specific** versions of this code (instead of simply the latest version), to achieve Don't Repeat Yourself (DRY) but not creating an automatic interdependency and tight coupling (which is why using shared libraries in microservices is often considered an anti-pattern).

## Dependencies

DVSA dependencies have been moved from npm to github so in order to install/update any private @DVSA packages
you are required to have an entry in your global `~/.npmrc` file as follows:

```shell
//npm.pkg.github.com/:_authToken=<your auth token here>
```

## Quality
Since this is re-used code, it's important to ensure it is thoroughly unit tested, and all public APIs are clearly documented.

## To prepare to publish
Update the version number in ```package.json``` (please follow SEMVER conventions) then run:

```
npm run package
```

This will perform a clean build, test, lint, and output the ```npm publish``` command to run at the command line.
You will need to be logged into npm as a user within the **dvsa** organisation.

To test what the ```npm publish``` command would do, append the ```--dry-run``` flag.

Note: published package cannot be updated, only unpublished and builds with different version numbers published.
