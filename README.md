# mes-microservice-common

Common code used by the various serverless microservices within the Mobile Examiner Services (MES) system, published as an npm package.

Each consuming microservice must only ever depend upon **specific** versions of this code (instead of simply the latest version), to achieve Don't Repeat Yourself (DRY) but not creating an automatic interdependency and tight coupling (which is why using shared libraries in microservice is often considered an antipattern).
