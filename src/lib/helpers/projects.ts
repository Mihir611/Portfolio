export interface GithubProject {
    name: string;
    description: string;
    url: string;
    stars: number;
}

// Fetch GitHub projects with caching
export async function fetchGithubProjects(username: string): Promise<GithubProject[]> {
    const cacheKey = `github_projects_${username}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
    const data = await res.json();
    const projects: GithubProject[] = data.map((repo: any) => ({
        name: repo.name,
        description: repo.description || 'No description',
        url: repo.html_url,
        stars: repo.stargazers_count
    }));
    localStorage.setItem(cacheKey, JSON.stringify(projects));
    return projects;
}

// Filter by keyword
export function filterProjects(projects: GithubProject[], keyword: string) {
    return projects.filter(p => p.name.toLowerCase().includes(keyword.toLowerCase()));
}

// Find project by name
export function findProject(projects: GithubProject[], name: string) {
    return projects.find(p => p.name.toLowerCase() === name.toLowerCase());
}
