## How to launch

Download and open the archive, type in the main directory :

```bash
$ docker-compose up
```

You can now access to your application on <a href="http://localhost:80/"> your localhost </a>.
Postman tests are accessible in the json "requets.postman_collection.json" found in the main directory.

## Known bugs 

- PUT requests have a hard time going through the proxy (FIXED IN LAST COMMIT)
- When launching the docker-compose for the first time, a bug may occur where despite using the depends_on argument, the other containers start before the postgres container is fully started. To fix this issue, simply retype the launch command and it should work.
