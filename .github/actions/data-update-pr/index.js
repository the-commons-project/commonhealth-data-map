const core = require('@actions/core');
const github = require('@actions/github');

async function run() {

  try {
    const token = core.getInput('token'),
          owner = core.getInput('owner') || github.context.repo.owner,
          repo = core.getInput('repo') || github.context.repo.repo,
          title = core.getInput('title') || `Automatic data update for ${new Date().toISOString().substring(0,10)}`,
          base = core.getInput('base') || 'master',
          makeComment = core.getInput('makeComment') || 'true',
          comment = core.getInput('comment') || 'New data pushed!',
          dataUpdateBranch = core.getInput('dataUpdateBranch') || owner + ':data/update';

    const client = new github.GitHub(token);

    console.log(`CHECKING PRs: ${owner}/${repo} ${dataUpdateBranch}`);

    const PRs = await client.pulls.list({
      owner: owner,
      repo: repo,
      head: dataUpdateBranch,
      state: 'open'});

    if(PRs.data.length > 0 && PRs.data[0].head.label == dataUpdateBranch) {
      const issue_number = PRs.data[0].number;

      core.setOutput('pull_number', issue_number);

      if(makeComment == 'true') {
        console.log('COMMENTING ON PR...');
        await client.issues.createComment({
          owner: owner,
          repo: repo,
          issue_number: issue_number,
          body: comment,
        });

        console.log(`COMMENTED ON PR #${issue_number}`);
        core.setOutput('status', 'COMMENT');
      } else {
        console.log(`SKIP COMMENTING ON PR #${issue_number}`);
        core.setOutput('status', 'NO_ACTION');
      }
    } else {
      console.log(`CREATING PR: ${owner}/${repo} HEAD ${dataUpdateBranch} BASE ${base}...`);

      const pr_create_result = await client.pulls.create({
        owner: owner,
        repo: repo,
        title: title,
        head: dataUpdateBranch,
        base: base,
        maintainer_can_modify: true,
      });

      core.setOutput('pull_number', pr_create_result.data.number);
      core.setOutput('status', 'CREATED');

      console.log('PR CREATED.');
    }

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
