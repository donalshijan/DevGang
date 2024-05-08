import express, { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import session from 'express-session';
import initializePassport,{UserType} from './config/passport-config';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import User, { IUser } from './models/User';
import { ProjectType } from './types/project.types';
import { createIssue } from './models/Issue';
import Issue from './models/Issue';
import Project from './models/Project';
import { IssueType } from './types/issue.types';
dotenv.config();

mongoose.connect(process.env.MONGO_URI as string)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((error) => console.error('Could not connect to MongoDB Atlas:', error));

const app = express();
app.use(express.json())
// Configure CORS
app.use(cors({
  origin: 'http://localhost:4200', // Replace with the URL of your Angular app
  credentials: true, // This allows the server to send cookies to the client
}));

app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: 'longrandomstring',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Increases security by preventing client-side script from accessing the cookie
    secure: false, // Set to true if you're serving your site over HTTPS
  },
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: 'http://localhost:4200', // Adjust according to your front-end URL
  credentials: true
}));

// Initialize Passport configuration
initializePassport(passport);

//signup
app.post('/signup', function(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local-signup', function(err: Error, user: IUser | false, info: { message: string }) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      // Optionally, use `info.message` to send back the reason for signup failure
      return res.status(401).json({ message: info.message || 'Signup failed' });
    }
    // Optionally, log the user in after signup
    
    req.login(user, function(err: Error) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      // Send back a success response or the newly created user information
      // Ensure the user object is correctly typed or has the username property
      return res.json({ message: 'Signup successful', user: { username: user.username } });
    });
  })(req, res, next);
});

// Login route
app.post('/login', function(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('local-login', async function(err: Error, user: IUser | false, info: { message: string }) {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    if (!user) {
      // Use `info.message` to send back the reason for login failure
      return res.status(401).json({ message: info.message || 'Login failed' });
    }
    // Log the user in
    req.login(user, function(err: Error) {
      if (err) {
        return res.status(500).json({ message: err.message });
      }
      // Send back a success response with user information
      // Ensure the user object is correctly typed or has the username property
      return res.json({ message: 'Login successful', user: { username: user.username } });
    });
  })(req, res, next);
});

// Dashboard route (protected)
app.get('/dashboard', isLoggedIn, (req: Request, res: Response) => {
  res.send('Welcome to the Your Work!');
});
app.get('/api/auth/check', (req, res) => {
  res.json({ isLoggedIn: req.isAuthenticated() });
});
app.get('/api/auth/currentUser', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    // Assuming the user object is stored in req.user after successful authentication
    // You might want to limit the data being sent back to the client for security reasons
    const user: UserType = req.user as UserType;
    const { username } = user; // Customize this based on your user model
    res.json({ username });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

const createProjectHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Extract project data from request body
    const projectData: ProjectType = req.body.projectData;
    // Get the user ID from request or session (assuming the user is authenticated)

    // Find the user by ID
    const user: IUser | null =  await User.findOne({ username: req.body.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Call the createProject method of the user model
    const projectId :String = await user.createProject(projectData);

    // Send success response
    res.status(201).json({ message: 'Project created successfully' , projectId:projectId });
  } catch (error) {
    // Handle errors
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Failed to create project' });
  }
};

app.post('/create-project', createProjectHandler);

app.get('/projects',async (req: Request, res: Response) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const username = req.query.username;
    if (typeof username !== 'string' || !username) {
      return res.status(400).json({ message: 'Invalid or missing username' });
    }
    const user: IUser | null =  await User.findOne({ username: username });
    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }
    const projects = await user.getProjects();

    // Return the projects as a response
    res.json({ projects });
  } catch (error) {
    // Handle errors
    const err = error as Error;
    res.status(500).json({ message: 'Failed to get projects', error: err.message });
  }
});

app.post('/create-issue',async (req: Request, res: Response)=>{
  try{
    if(!req.user){
      return res.status(401).json({message: 'User not authenticated'})
    }
    const newIssue = createIssue(req.body.issueData,req.body.username)
    if(!newIssue){
     throw new Error('Issue creation Failed') 
    }
    res.status(201).json({ message: 'Issue created successfully' });
  }
  catch(error){
    const err = error as Error;
    res.status(500).json({message: 'Failed to create issue',error: err.message});
  }
})

app.get('/issues', async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Retrieve projectId from query parameters instead of the request body
    const projectId = req.query.projectId;

    if (!projectId) {
      return res.status(400).json({ message: 'Project ID is required as query parameter' });
    }

    const project : ProjectType | null = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (typeof projectId !== 'string' || !projectId) {
            return res.status(400).json({ message: 'Project ID must be a single, valid string' });
        }

    const objectId = new mongoose.Types.ObjectId(projectId);

    const issues = await Issue.find({ projectId: projectId }).exec();
    if (!issues || issues.length === 0) {
      return res.status(204).json({ message: 'No Issues Found' }); // Use 204 No Content when no data is found
    }

    res.json({ issues });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: 'Failed to get issues', error: err.message });
  }
});
app.get('/getAllIssuesOfProjects', async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      // Extract projectIds from query parameters and ensure it is an array
      let projectIds = req.query.projectIds;

      // Handle both single and multiple projectId inputs
      if (typeof projectIds === 'string') {
          projectIds = [projectIds];
      }

      if (!Array.isArray(projectIds) || projectIds.length === 0) {
          return res.status(400).json({ message: 'Please provide at least one projectId' });
      }

      // Convert all entries to ObjectId
      const objectIdArray = projectIds.filter((id) : id is string => typeof id === 'string').map(id => new mongoose.Types.ObjectId(id));

      // Find all projects to validate existence (optional, based on your needs)
      const projects = await Project.find({ _id: { $in: objectIdArray } });
      if (projects.length !== objectIdArray.length) {
          return res.status(404).json({ message: 'One or more projects not found' });
      }

      // Find all issues that belong to any of the projectIds
      const issues = await Issue.find({ projectId: { $in: objectIdArray } });
      interface IssueMap {
        [key: string]: any[]; // Assuming `Issue` is your type for issues
    }
      // Organize issues by projectId
      const issuesByProject : IssueMap = issues.reduce((acc: IssueMap, issue) => {
          const projectIdStr = issue.projectId.toString();
          if (!acc[projectIdStr]) {
              acc[projectIdStr] = [];
          }
          acc[projectIdStr].push(issue);
          return acc;
      }, {});

      res.json({ issuesByProject });
  } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Failed to retrieve issues', error: err.message });
  }
});
app.get('/getAllIssues', async (req, res) => {
  try {
      if (!req.user) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      const projects = await Project.find();
      if (projects.length ==0) {
          return res.status(404).json({ message: 'No projects found' });
      }
      // Find all issues 
      const issues = await Issue.find();
      interface IssueMap {
        [key: string]: any[]; // Assuming `Issue` is your type for issues
    }
      // Organize issues by projectId
      const issuesByProject : IssueMap = issues.reduce((acc: IssueMap, issue) => {
          const projectIdStr = issue.projectId.toString();
          if (!acc[projectIdStr]) {
              acc[projectIdStr] = [];
          }
          acc[projectIdStr].push(issue);
          return acc;
      }, {});
      res.json({ issuesByProject:issuesByProject , issues: issues, projects:projects});
  } catch (error) {
      const err = error as Error;
      res.status(500).json({ message: 'Failed to retrieve issues', error: err.message });
  }
});
app.put('/issues/:id/update', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
  }
  const issueId = req.params.id;  // Get the ID of the issue from the URL
  const updateData = req.body;    // This should contain the new status and potentially other data to update

  Issue.findByIdAndUpdate(issueId, updateData, { new: true })
.then(updatedIssue => {
  res.json(updatedIssue);
})
.catch(error => {
  res.status(500).json({ error: 'Internal server error'||error });
});
});

app.get('/api/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send({ message: 'Failed to logout, please try again.' });
    }

    res.clearCookie('connect.sid'); // Clear the session cookie, 'connect.sid' is the default name
    return res.status(200).send({ message: 'Logged out successfully' });
  });
});
// Middleware to check if the user is logged in
function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}
app.listen(3000, () => console.log('Server running on port 3000'));
