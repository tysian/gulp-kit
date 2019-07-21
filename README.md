# Gulp kit

## Instalation and first run
Install all dependencies using npm or yarn.
Simply run `npm install` or `yarn`.

To run server, type:
```
gulp
```
It starts in localhost at port 3000. You can reconfigure it to work with virtual hosts.
It creates a dist folder with all files minifed, uglified etc.

## !! BEFORE WE START !! 
BrowserSync is sometimes very sensitive. I highly **RECOMMEND** you to use Version Source Control like *git*. If you have your browsersync server running and you will try to replace/move/delete any file which is tracked, it will be deleted as soon as you stop the server. Be careful and remember to stop server before you pull from git. 
I've lost few files this way, so feel warned :)

## Whats in the box?
+ It has Bootstrap 4 framework and jQuery.
+ For HTML - we are minifying all files with sorting attributes and classes
+ For CSS - we are using SCSS pre-processor with minifying, auto-prefixer and its already a pre-biult tree with files, there are also bootstrap framework friendly set of media query mixins. Just use:
    ```scss
    @include mobile {
        //code
    }
    ```
+ For JS - we are concatenating all script-dependencies into one (same for your scripts). Your scripts are compiled and minified by babel
+ It's all managed by BrowserSync - everything is refreshing after you save
+ Here is a basic configuration for eslint and prettier
+ Images are minified by `imagemin`
+ Fonts are automatically copied to the dist.

## Adding dependencies
Basically it takes all your scss and js files from its own folders, **BUT** if you want to use a dependencies I highly recommend to add them to the tasks in `gulpfile.js`

There is a one task `styles-dependencies` for stylings and `scripts-dependencies` for scripts. 
Simply just add a path to the js/css file: 
```javascript
dirs.nodeModules + '/path/to/the/style.min.css',
```
**DONT FORGET TO ADD `dirs.nodeModules` AT THE BEGINNING!**


## TODO:
- [ ] Add manifest.json to support PWA
- [ ] Maybe some html framework/preprocessor


---
Previous commits had a php server functionality.
I've decided to get rid of it, just to make it simplier it's just.
And remember, its just simple gulp starter, so it wont work as good as for example gatsby builder.