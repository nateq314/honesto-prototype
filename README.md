# Theorem "Honesto" prototype exercise.

Project specification can be found [here](https://github.com/nateq314/honesto-prototype/blob/master/Citrusbyte%20Frontend%20Prototyping%20Exercise.pdf), at the project root.

As mentioned in the Slack channel, I went a bit overtime on this exercise. What’s there works really well, but the “My Feedback” screen (see spec) is entirely not implemented. It was the easiest, so I was saving it until last, but somehow even with the notified scope cuts I still ended up trying to implement too much. Other details noted below.

## Features that are __additional to__ the project spec

### User goodies
* Persistent sessions using cookie-based authentication. Authorization and all data-fetching happen server-side, so your stuff (data) is all there from the first http response.
* Share-able "give me feedback" URLs. For example https://theorem-prototype.now.sh/give-feedback?uid=JS1jmpShwjffWv8rEfNZhRIuFyv1 takes you straight to the page for giving me feedback, as long as you're logged in.
* User account [registration](https://theorem-prototype.now.sh/register)
* Various styling extras
* In-progress (`Continue`) status on the Share Feedback screen for in-progress feedbacks. (`Fill Out` for new feedbacks, `Continue` for in-progress, `View Submission` for fully completed ones)

### Developer goodies
* SSR-based serverless deployment via [Next.js](https://nextjs.org/). Each page (`/`, `/register`, `/give-feedback`) is served from its own lambda.
* Significant groundwork (on both frontend and backend) for **realtime** features (subscriptions) so the app could be collaborative
* A fairly robust and well-defined GraphQL API, implemented using [Apollo Server](https://www.apollographql.com/docs/apollo-server/).
* Queries and Mutations using [Apollo Client](https://www.apollographql.com/docs/react/)'s awesome render prop-based API.
* Component styling using [Styled Components](https://www.styled-components.com/)

## Features cut at project outset
* Teams
* Feedback periods / cycles
* Question ratings
* Question feedback
* Loading screens - I notified that they would be present but may vary significantly from the mockups.

## Features I failed to deliver on time (est. max ~4 hrs extra work)
* My Feedback page
* Loading screens
* Login page styling
* 404 page styling (not even sure there is a 404 page at all)