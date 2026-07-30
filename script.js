<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Projects</h1>
        <button id="new-project-button">New Project</button>
    </header>

    <main>
        <section id="projects-list">
            <!-- Projects will be rendered here -->
    </section>
    </main>

    <div id="new-project-form" style="display: none;">
        <h2>Create New Project</h2>
        <form>
            <label for="title">Title:</label>
            <input type="text" id="projectTitle" required>

            <label for="description">Description:</label>
            <textarea id="projectDescription" required></textarea>

            <label for="image">Image URL:</label>
            <input type="url" id="projectImage">

            <label for="video">Video URL:</label>
            <input type="url" id="projectVideo">

            <button type="submit">Create Project</button>
        </form>
            </div>

    <script src="script.js"></script>
    <script>
        function generateUniqueId() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
        }

        // ... existing code ...
        function createNewProject() {
            const title = document.getElementById('projectTitle').value;
            const description = document.getElementById('projectDescription').value;
            const image = document.getElementById('projectImage').value;
            const video = document.getElementById('projectVideo').value;

            const newProject = {
-                id: generateUniqueId(),
+                id: generateUniqueId(), // ... existing code ...
                title,
                description,
                image,
@@ -26,7 +28,13 @@ function createNewProject() {
                video,
                galleryImages: [],
+                timeline: [], // ... existing code ...
+                devlog: [], // ... existing code ...
+                experiments: [], // ... existing code ...
+                failures: [], // ... existing code ...
+                decisions: [], // ... existing code ...
+                versions: [] // ... existing code ...
            };

            saveProject(newProject);
@@ -45,6 +53,7 @@ function saveProject(project) {
            projects.push(project);
            localStorage.setItem('projects', JSON.stringify(projects));
        }

+        // ... existing code ...
        function loadProjects() {
            const projects = JSON.parse(localStorage.getItem('projects')) || [];
@@ -52,6 +61,18 @@ function loadProjects() {
                return project;
            });

+            // Add default empty arrays for new fields if they don't exist
+            updatedProjects.forEach(project => {
+                if (!project.timeline) project.timeline = [];
+                if (!project.devlog) project.devlog = [];
+                if (!project.experiments) project.experiments = [];
+                if (!project.failures) project.failures = [];
+                if (!project.decisions) project.decisions = [];
+                if (!project.versions) project.versions = [];
+            });
+
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
        }

@@ -70,6 +91,7 @@ function displayProjects() {
            // ... existing code ...
        }

+        // ... existing code ...

        window.onload = () => {
            loadAndInitializeProjects();
            displayProjects();
        };
    </script>
</body>
</html>

