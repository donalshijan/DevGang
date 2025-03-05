# Collaboration Tool Application

Let me start by appologizing for an absoute disaster and unoriginal name been chosen for this application, DevGang. This is a novice yet somewhat extensive project done using angular because I wanted to test out angular and build something with it, obviously started of with a lot in mind, did about 40% of it. The project was build after taking inspirtation from jira and tries to implement similar functionalities. Backend is done in Nodejs + Express, uses typescript all the way from frontend to backend.
I don't even remember any of the code and most of the stuff I implemented in this ,cause it has been almost a year since I last looked at it. But here is how to run it.


Obviously you gotta `npm install` in the both the directories, and then use a split terminal and cd into one of those sub directories from each of those terminals, for frontend run 
`ng serve` and for backend run `npm start`

But before you do that you are going to need to have a mongodb atlas cluster setup and expose it's connection string through a .env file in the Backend directory. Maybe you need to do more than that, honestly I don't even remember what all was done back then, hope it works, if not you are gonna have to go through the code and figure out for yourself.