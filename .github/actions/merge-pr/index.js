const core = require('@actions/core');
const github = require('@actions/github');

async function run() {

  try {
    const token = core.getInput('token'),
          pull_number = core.getInput('pull_number'),
          owner = core.getInput('owner') || github.context.repo.owner,
          repo = core.getInput('repo') || github.context.repo.repo;

    const client = new github.GitHub(token);

    console.log(`MERGING PR: ${owner}/${repo} #${pull_number}`);

    const result = await client.pulls.merge({
      owner: owner,
      repo: repo,
      pull_number: pull_number});

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
