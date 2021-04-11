# Report

### Meta

* Who was on your team?
Andrew Huang
* What’s the URL of your deployed app?
http://my-movie-network.normalwebsite.art/
* What’s the URL of your github repository with the code for your deployed app?
https://github.com/andrewhuangwp/my-movie-network
* Is your app deployed and working?
Yes
* For each team member, what work did that person do on the project?
Andrew Huang - Everything

### App

* What does your project app do?

My app is essentially a social network centered around the topic of movies. Users can create posts, interact with posts, create movie lists, and create chat rooms.
* How has your app concept changed since the proposal?

The core ideas of the concept stayed the same. The changes were mostly removing or adding features that I originally thought of (e.g. got rid of  polls but added chat rooms instead). 
* How do users interact with your application? What can they accomplish by doing so?

Users who have not created an account can register using the register button in the nav header. After logging in, users can interact with the links on the nav header to go to pages where they can create stuff (posts, lists, chat rooms), view stuff (user profile, all chat rooms, statistics), or use the search page to look up movies. On each post page, logged in users can comment or like posts. In chat rooms, users can broadcast messages. On list pages that the user created, they can add or remove movies to the list (note that users can only input name of list when creating lists). 
* For each project requirement above, how does your app meet that requirement?

The application is significantly more complex than previous projects (a lot more tables, use of external api, using channels which was not required in events app). The application is separated into two separate components: Elixir/Phoenix JSON API backend and Create React App SPA front end. All of app except for use of external libraries is deployed to VPS. User accounts with authentication (using Argon) was implemented. Users and other persistent states are stored in Postgres. App uses Phoenix Channels to push realtime updates in chat rooms. "Neat" requirement was data visualization of data collected. App was tested with multiple concurrent users and functioned as intended.
* What interesting stuff does your app include beyond the project requirements?

There were some interesting details that were interesting to implement. For instance, the API I was using would only return the first page of the result I was looking for, so I had to paginate the component that used this external API.
* What’s the complex part of your app? How did you design that component and why?

The most complex part of my app was not one component but the flow of data in general. Since I had so many resources/tables I had to design components and the API to ensure I had all the data that the component depended on.
* What was the most significant challenge you encountered and how did you solve it?

The most significant challenge was organizing the backend. There were so many times I came across the Association Not Loaded error because I had to make sure for each view of the resource that I had preloaded the dependencies in another file. Creating chat rooms was also difficult as I didn't use channels in a SPA for homework before so it was a little tricky getting the chat room to work properly.

### Attribution
The external API I used was The Movie Database API (https://www.themoviedb.org/documentation/api).
I referenced a lot of code from Prof. Tuck's scratch repo, particularly about SPA, Redux-router, and API's.