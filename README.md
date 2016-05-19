## Gulp boilerplate

A front-end workflow using Gulp and HTML5 boilerplate.

### Setup

Clone the repo:
```
git clone https://github.com/danielyewright/gulp-boilerplate.git
```

Install dependencies:
```
npm install
```

Run the tasks:
```
gulp
```

### Usage

The gulpfile has the following tasks:
- `default`
- `build:dev`
- `build:prod`
- `clean`
- `clean:prod`
- `zip`

Use `gulp` to run the default task and navigation to `http://localhost:3000` to view the project. As you modify files, the browser will automatically refrest to reflect the changes.

To build the project and see what it would look like pre-production, run `gulp build:dev`. This will create a directory named `dist/dev` where you can test the project.

If all the files are present in the `dev` folder and the project is ready for production, you can run `gulp build:prod`. This will use all the files in the `dev` folder, delete any hidden/unwanted files, and create a zip file ready for distribution.

**NOTE: If you've already run the `build:dev` task, when running `gulp` it will delete the entire `dist` directory. You'll have to run the `build:dev` task again to generate the files.**
