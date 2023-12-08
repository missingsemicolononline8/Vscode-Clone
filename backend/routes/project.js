const express = require('express');
const router = express(); // Create an Express router.
const fetchUser = require('../middleware/fetchUser'); // Import middleware for fetching user.
const Projects = require('../models/Project'); // Import the Project model.
const { body, validationResult } = require('express-validator'); // Import validation-related functions.
const fs = require('fs').promises; // Use promisified fs for better asynchronous code handling.

// Middleware to handle common error responses.
const handleResponseError = (res, status, error) => {
    console.error(error);
    return res.status(status).json({ error: error.message });
};

// Define a route to handle GET requests to retrieve user-specific projects.
router.get('/', fetchUser, async (req, res) => {
    try {
        const projects = await Projects.find({ users: req.user.id });
        return res.status(200).json(projects);
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
});

// Define a route to handle POST requests to create a new project.
router.post('/create', [
    body('project_name', 'Project Name must be at least 6 characters long').isLength({ min: 6 }),
    body('project_root', 'Project root can not be empty').notEmpty(),
], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { project_name, project_root } = req.body;
        const path = `./projects/${project_root}`;

        await fs.mkdir(path);
        
        const newProject = new Projects({
            project_name,
            project_root,
            users: [req.user.id],
        });

        await newProject.save();
        return res.status(200).json({ newProject });
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
});

// Define a route to handle POST requests to create a file or folder within a project.
router.post('/:projectId/:fileType/create', [
    body('name', 'Name should not be empty').notEmpty(),
], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const projectId = req.params.projectId;
    const fileType = req.params.fileType;

    try {
        const project = await Projects.findById(projectId);

        if (!project) {
            return res.status(404).json({ error: "Project Does Not Exist" });
        }

        if (!project.users.includes(req.user.id)) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        const project_root = `./projects/${project.project_root}`;
        let file_path = req.body.destination_path !== undefined ? `${project_root}${req.body.destination_path}` : project_root;

        if (fileType === "folder") {
            await fs.mkdir(file_path + '/' + req.body.name);
        } else if (fileType === "file") {
            await fs.writeFile(file_path + '/' + req.body.name, '');
        } else {
            return res.status(400).json({ error: "Invalid File Type" });
        }

        return res.status(200).json(`${fileType} created successfully`);
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
});

// Route to get file content
router.post('/:projectId/files/',fetchUser, async (req, res) => {

    const projectId = req.params.projectId;
    const filePath = req.body.filePath;
  
    try {

    const project = await Projects.findById(projectId);
    if (!project) {
        return res.status(404).json({ error: "Project Does Not Exist" });
    }
    if (!project.users.includes(req.user.id)) {
        return res.status(401).json({ error: "Unauthorized request" });
    }

      const content = await fs.readFile(filePath, 'utf-8');
      return res.json({ content });
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
  });

// Define a route to handle PUT requests to update a file or folder.
router.put('/:projectId/update', [
    body('operation', 'Operation must not be empty').notEmpty(),
    body('path', 'Operation must not be empty').notEmpty()
], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const project = await Projects.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: "Project Does Not Exist" });
        }

        if (!project.users.includes(req.user.id)) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        if (req.body.operation === 'content') {
            await fs.writeFile(req.body.path, req.body.content);
        } else {
            const new_path = req.body.operation === 'rename' ? req.body.path.replace(req.body.path.split('/').pop(), req.body.newName) : req.body.newPath;
            await fs.rename(req.body.path, new_path);
        }

        return res.status(200).send("Success");
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
});

// Define a route to handle DELETE requests to delete a file or folder.
router.delete('/:projectId/:fileType/delete', [body('path', "Path must not be empty")], fetchUser, async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const project = await Projects.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: "Project Does Not Exist" });
        }

        if (!project.users.includes(req.user.id)) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        const deleteFunction = req.params.fileType === 'file' ? fs.unlink : fs.rmdir;

        await deleteFunction(req.body.path);
        return res.status(200).send("Success");
    } catch (error) {
        return handleResponseError(res, 500, error);
    }
});

router.get('/:projectId',fetchUser,async (req,res) => {

    try {
    const project = await Projects.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ error: "Project Does Not Exist" });
        }

        if (!project.users.includes(req.user.id)) {
            return res.status(401).json({ error: "Unauthorized request" });
        }

        const fileTree = async (path) => {
            let stats = await fs.stat(path);

            if(stats.isFile()) {
                return {
                    type : "file",
                    name:path.split('/').pop(),
                    //content: await fs.readFile(path,'utf8'),
                    path
                } 
            }
            else if(stats.isDirectory()) {
                return {
                    type : "directory",
                    name:path.split('/').pop(),
                    children: await Promise.all((await fs.readdir(path)).map( file => {
                        let tree = fileTree(path+'/'+file) 
                        return tree
                    })),
                    path                    
                }
            }
        } 

        res.status(200).json(await fileTree(`../client`))


    }
    catch(error) {
        return handleResponseError(res, 500, error);
    }

})



module.exports = router; // Export the router for use in the application.
