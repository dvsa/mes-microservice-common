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
```* This must be done on npm version 6.x.x *```

This will perform a clean build, test, lint, and output the ```npm publish``` command to run at the command line.
You will need to be logged into npm as a user within the **dvsa** organisation.

To test what the ```npm publish``` command would do, append the ```--dry-run``` flag. ```e.g. (npm publish --access public --dry-run)```

This should output a similar format to the below
```
npm notice === Tarball Details === 
npm notice name:          @dvsa/mes-microservice-common           
npm notice version:       0.8.4                                   
npm notice package size:  7.0 kB                                  
npm notice unpacked size: 23.9 kB                                 
npm notice shasum:        5417a2dc6048152a90281831973193345a6295e8
npm notice integrity:     sha512-Odvxj1fnbNJFA[...]wj17BxWbCtE9Q==
npm notice total files:   18    
npm notice 
+ @dvsa/mes-microservice-common@0.8.4
```

Note: published package cannot be updated, only unpublished and builds with different version numbers published.
