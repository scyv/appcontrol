# Deployr

A litte app for managing app deployments on a server.

### Get started

-   Clone the project repository
-   Create a file: manifest.json

```json
[
    {
        "id": "myapp1",
        "name": "My App 1",
        "startScript": "/apps/myapp1/start.sh",
        "stopScript": "/apps/myapp1/stop.sh",
        "statusScript": "/apps/myapp1/status.sh",
        "updateScript": "/apps/myapp1/update.sh",
        "accessToken": "a VERY long string should be > 1024 characters long. This is the token, you identify the app later on"
    },
    {
        "id": "myapp2",
        "name": "My App 2",
        "startScript": "/apps/myapp2/start.sh",
        "stopScript": "/apps/myapp2/stop.sh",
        "statusScript": "/apps/myapp2/status.sh",
        "updateScript": "/apps/myapp2/update.sh",
        "accessToken": "a VERY long string should be > 1024 characters long. This is the token, you identify the app later on"
    }
]
```

-   Run `npm install`
-   run `node index.js`
-   Open the browser on `http://localhost:10101`
-   Enter a token from one app above into the Textfield and click "Load"
