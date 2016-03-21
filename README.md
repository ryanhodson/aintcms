
# LocalCMS

This repository is a proof of concept for a Git-based content management system
that lets non-technical users edit website content just like developers do.

Instead of running a server and letting users edit content in a database,
LocalCMS runs (you guessed it) on the user's local computer as a desktop
application.

To publish content, LocalCMS creates a new Git branch, commits the desired
changes, pushes it up to a GitHub repository, and creates a pull request asking
to merge the new branch into `master`. Notice that this is exactly how
developers publish changes to a website.


# Disclaimer

This project is currently a **PROOF OF CONCEPT**. It's not designed to be used
in production, and is not exactly secure (more about that below). It's also
missing some core features like error handling for invalid credentials,
changing the remote Git repo URL, etc.


# Dependencies

This project assumes that you have the following installed and available on
your `PATH`:

- `node` and `npm`
- `git`
- `ssh`

This proof of concept is also designed to work with `localcms-sample-site`, so
you'll need to clone that, too (the path is hardcoded as the default value in
the `welcome.html` page.


# Installation

Clone this repository, then run the following:

    npm install
    npm start

The second command will open LocalCMS inside of an Electron wrapper.


## Cross-Platform Support

This project has only been developed and tested on OS X. Electron is built for
cross-platform desktop applications, so, theoretically, it should work on
Windows and Linux systems with few changes. The `ssh` dependency may be a
problem for Windows users.


# Git Branching Model

There's all sorts of ways that LocalCMS's branching model could be configured.
Right now, it works like this:

- Editing a page:
  - `git checkout -- . ` to get rid of any local changes
  - Make sure `master` is checked out
  - Pull in upstream changes from `origin/master`
  - Create a new branch called `localcms-<random>`
  - Edit file and preview in this branch
- Publishing a page:
  - Create a commit with just the file being edited
    - Use `"LocalCMS edits to <filename>"` as the commit message
  - Merge the `localcms-<random>` branch into `master`
  - Push the branch to the origin repo
  - Create a pull request for `localcms-<random>` into `master`

Using pull requests has pros and cons. On the plus side, it lets developers
review changes before they are integrated into the main codebase. On the other
hand, changes won't show up in user's local repositories immediately, which can
be counterintuitive.


# Security

LocalCMS uses native Git commands to move content contributions from the local
machine to remote Git repositories. Currently, LocalCMS uses HTTP basic
authentication for:

- `git clone` for the initial clone
- `git pull` to 
- `git push` for the 

I didn't want to deal with calling out to interactive shells for password
input, so all credentials are passed *in the URL*. This has serious security
implications.

An effort was made to avoid storing passwords on disk (e.g., the `origin`
remote is deleted immediately after the initial `git clone`), but that doesn't
mean it's not possible to leak your credentials.


# To Do

- Security concerns
- SSH support
- Creating new pages
- Editing only *content* pages (e.g., not `package.json`)
- Configurable build commands/web frameworks (these are currently hardcoded)
- WYSIWYG editor (if supporting multiple web frameworks, this is tricky)
- In-app previews (handling links may be difficult)
- Credential error handling
- Unit tests
- NodeGit for native Git integration (requires building from source)
- Synchronous calls in `editor.js`

