#To Start Working

1. Fork the repo.

1. Clone to local computer.

1. Add upstream remote

   `$ git remote add upstream https://github.com/StrangeLightning/strangeLightning.git`

1. Checkout the dev branch, if not there already

   These commands will help you do this:

   ``` bash

   # Creates your branch and brings you there
   git checkout -b `dev`
   ```

1. Add and commit to your feature branch. (don't push)

   Prefix each commit with the issue number
    - (#2) Added a new feature

   `$git add .`
   
   `$git commit -m '(#2) short description of changes made'`

   #### Commit Message Guidelines

   - Commit messages should be written in the present tense; e.g. "(#2) Fix continuous
    integration script".
   - The first line of your commit message should be a brief summary of what the
    commit changes. Aim for about 70 characters max. Remember: This is a summary,
    not a detailed description of everything that changed.
   - If you want to explain the commit in more depth, following the first line should
    be a blank line and then a more detailed description of the commit. This can be
    as detailed as you want, so dig into details here and keep the first line short.

1. Add upstream commits to feature branch (make sure you are on feature branch).

   `$ git pull --rebase upstream master`

   _If there is a merge conflict, resolve the conflicts and proceed. Squash all outstanding commits into one using --rebase -i._

   `$git rebase --continue`
   
   `$git add .`

   _After merge conflicts resolves/no conflicts originally._

   `$git push origin dev`

1. Github Submission

      Go to GitHub and send pull request to the fire-devil organization branch.

      Please reference in the pull request comment the corresponding issue using the [supported keywords](https://help.github.com/articles/closing-issues-via-commit-messages/).

      For example: 'This closes #27 and closes #5.'

      At least two other person MUST give your changes a code review, and once
      they are satisfied they will merge your changes into upstream. Alternatively,
      they may have some requested changes. You should make more commits to your
      branch to fix these, then follow this process again from merging onwards.

      Once you get back here, make a comment requesting further review and
      someone will look at your code again. If they like it, it will get merged,
      else, just repeat again.

      Thanks for contributing!

1. Update your local master.

      `$ git pull upstream master`

      _if pull requests have been accepted to development while yours
      was pending, please repeat step 5 to sync your fork with fire-devil developent branch_

      To start working on next feature

1. Go to step 4.

      #References

      http://www.thumbtack.com/engineering/linear-git-history/

### Additional Guidelines

1. Uphold the current code standard:
    - Keep your code [DRY][].
    - Apply the [boy scout rule][].
    - Follow [STYLE-GUIDE.md](STYLE-GUIDE.md)
1. Run the [tests][] before submitting a pull request.
1. Tests are very, very important. Submit tests if your pull request contains
   new, testable behavior.
1. Your pull request is comprised of a single ([squashed][]) commit.

## Checklist:

This is just to help you organize your process

- [ ] Did I cut my work branch off of dev (don't cut new branches from existing feature brances)?
- [ ] Did I follow the correct naming convention for my branch?
- [ ] Is my branch focused on a single main change?
 - [ ] Do all of my changes directly relate to this change?
- [ ] Did I merge the upstream dev branch after I finished all my
  work?
- [ ] Did I write a clear pull request message detailing what changes I made?
- [ ] Did I get a code review?
 - [ ] Did I make any requested changes from that code review?

If you follow all of these guidelines and make good changes, you should have
no problem getting your changes merged in.
