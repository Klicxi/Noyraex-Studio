const STORAGE_KEY = 'noyraex_projects';
const DEFAULT_AUTHOR = 'Guest Creator';
const FOLLOW_KEY = 'noyraex_followed_projects';

const stageStatusMap = {
    idea: { className: 'status-idea', label: 'Idea', progress: 20, version: 'v0.1.0' },
    prototype: { className: 'status-prototype', label: 'Prototype', progress: 45, version: 'v0.2.0' },
    development: { className: 'status-development', label: 'Development', progress: 60, version: 'v0.4.0' },
};

const lifecycleStatusMap = {
    creating: { className: 'status-development', label: 'Creating' },
    paused: { className: 'status-prototype', label: 'Paused' },
    completed: { className: 'status-released', label: 'Completed' },
    archived: { className: 'status-idea', label: 'Archived' },
};

const DEMO_PROJECT = {
    id: 'demo-noyraex-studio-hub',
    name: 'Noyraex Studio Hub',
    category: 'Website',
    author: 'Noyraex',
    description: 'A sleek creator ecosystem for project journeys, progress updates, and development journeys.',
    stage: 'development',
    status: 'creating',
    goal: 'Create a unified space for creators to tell their project stories.',
    createdAt: '2026-07-01T00:00:00.000Z',
};

function getSavedProjects() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveProjects(projects) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function generateId() {
    return `proj-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function createProjectCard(project) {
    const lifecycleInfo = lifecycleStatusMap[project.status] || lifecycleStatusMap.creating;
    const stageInfo = stageStatusMap[project.stage] || stageStatusMap.idea;
    const card = document.createElement('article');
    card.className = 'card project-card';

    const detailUrl = `project-detail.html?id=${encodeURIComponent(project.id)}`;
    card.innerHTML = `
        <a class="project-card-link" href="${detailUrl}">
            <div class="project-top">
                <div class="project-labels">
                    <span class="project-type">${project.category}</span>
                    <span class="project-status ${lifecycleInfo.className}">${lifecycleInfo.label}</span>
                </div>
                <span class="project-version">${stageInfo.version}</span>
            </div>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
            <div class="project-progress-meta">
                <span>Author: ${project.author}</span>
                <span>Status: ${lifecycleInfo.label}</span>
            </div>
            <div class="progress" data-progress="${stageInfo.progress}">
                <div class="progress-bar"></div>
            </div>
            <div class="project-progress-meta">
                <span>Created: ${new Date(project.createdAt).toLocaleDateString('ru-RU')}</span>
                <span>Goal: ${project.goal}</span>
            </div>
        </a>
        <div class="project-links">
            <a href="${detailUrl}">View details</a>
        </div>
    `;

    return card;
}

function renderSavedProjects() {
    const projectSections = document.querySelectorAll('section.projects > .cards');
    if (projectSections.length < 2) {
        return;
    }

    const showcaseContainer = projectSections[1];
    const savedProjects = getSavedProjects();
    if (!savedProjects.length) {
        return;
    }

    const sortedProjects = savedProjects.slice().sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const fragment = document.createDocumentFragment();
    sortedProjects.forEach((project) => {
        const projectCard = createProjectCard(project);
        fragment.appendChild(projectCard);
    });

    showcaseContainer.insertBefore(fragment, showcaseContainer.firstChild);
}

function handleCreateProjectForm() {
    const form = document.querySelector('project-form')
    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = form.querySelector('#project-name').value.trim();
        const category = form.querySelector('#project-category').value;
        const description = form.querySelector('#project-description').value.trim();
        const stage = form.querySelector('#project-stage').value;
        const status = form.querySelector('#project-status').value;
        const goal = form.querySelector('#project-goal').value.trim();

        if (!name || !description || !goal) {
            alert('Please fill in the project name, description, and goal.');
            return;
        }

        const projects = getSavedProjects();
        const newProject = {
            id: generateId(),
            name,
            category,
            description,
            stage,
            status,
            goal,
            author: DEFAULT_AUTHOR,
            createdAt: new Date().toISOString(),
        };

        projects.push(newProject);
        saveProjects(projects);

        alert('Project saved. You can now find it in the catalog.');
        window.location.href = 'projects.html';
    });
}

function updateProjectById(id, updates) {
    if (!id) {
        return;
    }
    const projects = getSavedProjects();
    const updated = projects.map((project) => {
        if (project.id !== id) {
            return project;
        }
        return {
            ...project,
            ...updates,
        };
    });
    saveProjects(updated);
}

function populateEditForm(project) {
    const form = document.querySelector('#edit-project-form');
    if (!form || !project) {
        return;
    }

    form.querySelector('#project-name').value = project.name || '';
    form.querySelector('#project-category').value = project.category || 'Game';
    form.querySelector('#project-description').value = project.description || '';
    form.querySelector('#project-stage').value = project.stage || 'idea';
    form.querySelector('#project-status').value = project.status || 'creating';
    form.querySelector('#project-goal').value = project.goal || '';
}

function handleEditProjectForm() {
    const form = document.querySelector('#edit-project-form');
    if (!form) {
        return;
    }

    const projectId = getQueryParam('id');
    const project = projectId ? findProjectById(projectId) : null;
    if (!project) {
        alert('Project not found.');
        window.location.href = 'projects.html';
        return;
    }

    populateEditForm(project);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = form.querySelector('#project-name').value.trim();
        const category = form.querySelector('#project-category').value;
        const description = form.querySelector('#project-description').value.trim();
        const stage = form.querySelector('#project-stage').value;
        const status = form.querySelector('#project-status').value;
        const goal = form.querySelector('#project-goal').value.trim();

        if (!name || !description || !goal) {
            alert('Please fill in the project name, description, and goal.');
            return;
        }

        updateProjectById(projectId, {
            name,
            category,
            description,
            stage,
            status,
            goal,
        });

        window.location.href = `project-detail.html?id=${encodeURIComponent(projectId)}`;
    });
};

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function getFollowedProjectIds() {
    try {
        return JSON.parse(localStorage.getItem(FOLLOW_KEY)) || [];
    } catch (error) {
        return [];
    }
}

function saveFollowedProjectIds(ids) {
    localStorage.setItem(FOLLOW_KEY, JSON.stringify(ids));
}

function isFollowingProject(id) {
    return getFollowedProjectIds().includes(id);
}

function followProject(id) {
    if (!id) {
        return;
    }
    const ids = getFollowedProjectIds();
    if (!ids.includes(id)) {
        ids.push(id);
        saveFollowedProjectIds(ids);
    }
}

// Temporary development utility: replace with Archive Project once accounts exist.
function deleteProjectById(id) {
    if (!id) {
        return;
    }
    const projects = getSavedProjects();
    const filtered = projects.filter((project) => project.id !== id);
    saveProjects(filtered);
}

function isLocalProject(id) {
    return Boolean(findProjectById(id));
}

function findProjectById(id) {
    const projects = getSavedProjects();
    return projects.find((project) => project.id === id) || null;
}

function populateProjectDetail(project) {
    const titleEl = document.querySelector('.project-overview-card h2');
    const descriptionEl = document.querySelector('.project-overview-card p');
    const typeEl = document.querySelector('.project-overview-labels .project-type');
    const statusEl = document.querySelector('.project-overview-labels .project-status');
    const versionEl = document.querySelector('.project-version');
    const metaEls = document.querySelectorAll('.project-about-features > div');

    if (titleEl) titleEl.textContent = project.name;
    if (descriptionEl) descriptionEl.textContent = project.description;
    if (typeEl) typeEl.textContent = project.category;
    let stageInfo = stageStatusMap.idea;
    if (statusEl) {
        const lifecycleInfo = lifecycleStatusMap[project.status] || lifecycleStatusMap.creating;
        statusEl.textContent = lifecycleInfo.label;
        statusEl.className = `project-status ${lifecycleInfo.className}`;
    }
    if (versionEl) {
        stageInfo = stageStatusMap[project.stage] || stageStatusMap.idea;
        versionEl.textContent = stageInfo.version;
    }

    if (metaEls.length >= 4) {
        metaEls[0].querySelector('p').textContent = project.author;
        metaEls[1].querySelector('p').textContent = project.category;
        metaEls[2].querySelector('p').textContent = (lifecycleStatusMap[project.status] || lifecycleStatusMap.creating).label;
        metaEls[3].querySelector('p').textContent = stageInfo.version;
    }

    const storyParagraph = document.querySelector('.project-about-card > p');
    if (storyParagraph) {
        storyParagraph.textContent = `Project ${project.name} guides the creation path from first idea to the current version that evolves with its creator.`;
    }

    const whyEls = document.querySelectorAll('.project-about-card .project-about-features > div p');
    if (whyEls.length >= 3) {
        whyEls[0].textContent = project.goal ? `The creator started this project to build ${project.goal.toLowerCase()}.` : 'The creator started the project to express an idea in a living form.';
        whyEls[1].textContent = 'The project idea emerged as a response to the desire to create an experience that reveals the creative path.';
        whyEls[2].textContent = 'This project matters because it reflects the process of growth and development of an idea.';
    }

    const devlogEntries = document.querySelectorAll('.devlog-entry');
    if (devlogEntries.length >= 3) {
        devlogEntries[0].querySelector('time').textContent = new Date(project.createdAt).toLocaleDateString('en-US');
        devlogEntries[0].querySelector('h3').textContent = 'Project launched';
        devlogEntries[0].querySelector('p').textContent = project.description;

        devlogEntries[1].querySelector('time').textContent = new Date(project.createdAt).toLocaleDateString('en-US');
        devlogEntries[1].querySelector('h3').textContent = 'Project goal defined';
        devlogEntries[1].querySelector('p').textContent = project.goal;

        devlogEntries[2].querySelector('time').textContent = new Date(project.createdAt).toLocaleDateString('en-US');
        devlogEntries[2].querySelector('h3').textContent = 'Development path';
        devlogEntries[2].querySelector('p').textContent = `The project is currently at the ${project.stage.toLowerCase()} stage.`;
    }
}

function populateProjectDetailFallback() {
    populateProjectDetail(DEMO_PROJECT);
}

function handleFollowButton(projectId) {
    const button = document.getElementById('follow-project-button');
    const stateText = document.getElementById('follow-project-state');
    if (!button || !projectId) {
        return;
    }

    const updateButton = () => {
        if (isFollowingProject(projectId)) {
            button.textContent = 'Following';
            button.disabled = true;
            if (stateText) {
                stateText.textContent = 'Following the development path';
            }
        } else {
            button.textContent = 'Follow Project';
            button.disabled = false;
            if (stateText) {
                stateText.textContent = 'Observe the development path';
            }
        }
    };

    updateButton();

    button.addEventListener('click', () => {
        followProject(projectId);
        updateButton();
    });
}

function handleDeleteButton(projectId) {
    const button = document.getElementById('delete-project-button');
    if (!button || !projectId) {
        return;
    }

    const shouldShowDelete = isLocalProject(projectId);
    button.style.display = shouldShowDelete ? 'inline-flex' : 'none';

    if (!shouldShowDelete) {
        return;
    }

    button.addEventListener('click', () => {
        deleteProjectById(projectId);
        window.location.href = 'projects.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleCreateProjectForm();
    renderSavedProjects();

    if (window.location.pathname.endsWith('project-detail.html')) {
        const projectId = getQueryParam('id');
        const project = projectId ? findProjectById(projectId) : null;
        if (project) {
            populateProjectDetail(project);
        } else {
            populateProjectDetailFallback();
        }
        handleFollowButton(projectId);
        handleDeleteButton(projectId);
    }
});
