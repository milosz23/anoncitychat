|-client--------|-public--------|-allApp.js //gulp compiled
|               |               |-allStyle.css //gulp compiled
|               |               |-index.html
|               |               |-views---------|...
|               |               |-vendor--------|-js--------|...
|               |                               |-css-------|...
|               |-app.js //main
|               |-controllers---|...
|               |-services------|...
|               |-directives----|...
|               |-assets--------|-sass--------|...
|               |               |-markups-----|...
|               |
|               |-gulpfile.js
|               |-package.json
|               |-node_modules
|               |-bower.json
|               |-bower_components
|
|-server--------|-server.js //main
|               |-routes.js
|               |-config.js
|               |-services-----|
|               |
|               |-package.json
|               |-node_modules
|
|-mongoDB-------|...
|
|-.gitignore