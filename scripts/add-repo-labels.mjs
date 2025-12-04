import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
	auth: "github_pat_......"
});

const ORG = "twinfoundation";
const labels = [{
	name: "needs-triage",
	color: "f0650b",
	description: "Issues that need triage",
},
{
	name: "information-needed",
	color: "7ecd6e",
	description: "More information is needed from the issue reporter",
}];

async function addLabelToAllRepos() {
	try {
		const repos = await octokit.paginate(octokit.repos.listForOrg, {
			org: ORG,
			type: "all",
			per_page: 100,
		});

		// To avoid hitting rate limits
		await new Promise(resolve => setTimeout(resolve, 1000));
		for (const repo of repos) {
			for (const label of labels) {
				try {
					await octokit.issues.createLabel({
						owner: ORG,
						repo: repo.name,
						...label,
					});
					console.log(`✅ Label added to ${repo.name}`);
				} catch (err) {
					if (err.status === 422) {
						console.log(`⚠️ Label already exists in ${repo.name}`);
					} else {
						console.error(`❌ Error in ${repo.name}:`, err.message);
					}
				}
			}

			// To avoid hitting rate limits
			await new Promise(resolve => setTimeout(resolve, 1000));
		}
	} catch (err) {
		console.error("Failed to fetch repositories:", err.message);
	}
}

addLabelToAllRepos();