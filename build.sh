SPROCKET_OPTS="-I build -I /Development/gitrepos/"

# sprocketize the source
sprocketize $SPROCKET_OPTS src/*.js > dist/geoserver.js

