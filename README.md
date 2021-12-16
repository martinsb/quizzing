# Greetings!

To run the app, clone this repo and run `npm install` and then `npm start`. The app should be served on [localhost:3000](https://localhost:3000).

## Some general notes

* First of all, I'm sorry I did this in React. I know that you folks are more on the Vue side, but unfortunately I know nothing about Vue except reading through some introductions
* This project is created with [CRA](https://github.com/facebook/create-react-app) with some unneeded stuff (like tests :) deleted.
* I'm not very artistic person, thus mostly my "styling" relied on merely adding [purecss](https://purecss.io/) framework. The only noteworthy thing I did was making answer grid responsive (per task description), anything else is just adding some margins
* I intentionally did not use [styled-components](https://styled-components.com/) because, since you prefer Vue, I thought more React-ish frameworks added would be too much.
* I used provided API endpoints from the link in the task description
* I love HTML and tried to keep it as simple as possible, also because of the lack of time to style things more properly.

## Hooks

* I love hooks. I encapsulated all the quiz, questions, and answer loading logic into them. Thanks to hooks, I don't need to use [Redux](https://redux.js.org/) anymore :)
* The most complicated hook turned out to be `useCurrentQuestion`. I figured it would be a good idea to not expose all questions to the view, only the current one with all the answers which required additional loading from the API when `questionIndex` state field (`useReducer`) changes.
* There is an internal module called, well, `internal.ts` that contains two utilities for fetching data. Their usage depends on the context - as you can see in `useQuizList` (for example) it was quite easy to just forward the call to `useApiEndpoint` internal hook but in more complicated cases I used the more "low-level" `retrieveData`

## Contexts

* I created context, `SettingsContext` so that I don't have to drill most common values (user's  name, chosen quiz id) through the components

## Error handling

* Hooks return errors but UI does not really handle them.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
