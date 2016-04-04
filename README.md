
# Ain't CMS

This repository is a proof of concept for a Git-based content management system
that lets non-developer authors edit static website content just like
developers do. Learn more at [aint.io](https://aint.io).

Instead of running a server and letting users edit content in a database, Ain't
CMS runs on the user's local computer as a desktop application.

To publish content, Ain't CMS creates a new Git branch, commits the desired
changes, pushes it up to a GitHub repository, and creates a pull request asking
to merge the new branch into `master`. Notice that this is exactly how
developers publish changes to a website. 

# Disclaimer

This project is currently a **PROOF OF CONCEPT**. It's not designed to be used
in production (yet). It's also missing some core features like error handling
for invalid credentials, changing the remote Git repo URL, etc.


# Dependencies

This project assumes that you have the following installed and available on
your `PATH`:

- `node` and `npm`
- `git`
- `ssh`

This proof of concept is also designed to work with `localcms-sample-site`, so
you'll need to clone that, too. This is currently a private GitHub repo
designed specifically to test Ain't CMS. A formal (and publically accessible)
example project will be released shortly.


# Installation and Usage

Clone this repository, then run the following:

    npm install
    npm start

The second command will open Ain't CMS inside of an Electron wrapper.


## Cross-Platform Support

This project has only been developed and tested on OS X. Electron is built for
cross-platform desktop applications, so, theoretically, it should work on
Windows and Linux systems with few changes. The `ssh` dependency may be a
problem for Windows users.


# Git Branching Model

There's all sorts of ways that Ain't CMS's branching model could be configured.
Right now, it works like this:

- Editing a page:
  - `git checkout -- . ` to get rid of any local changes
  - Make sure `master` is checked out
  - Pull in upstream changes from `origin/master`
  - Create a new branch called `localcms-<random>`
  	- TODO: Dedicated branch per page, check this branch out each time, don't
	  make a pull request unless it's a new branch?
	- TODO: `localcms-<username>-<file>` for branch names
  - Edit file and preview in this branch
- Publishing a page:
  - Create a commit with just the file being edited
    - Use `"Ain't CMS edits to <filename>"` as the commit message
  - Merge the `localcms-<random>` branch into `master`
  - Push the branch to the origin repo
  - Create a pull request for `localcms-<random>` into `master`

Using pull requests has pros and cons. On the plus side, it lets developers
review changes before they are integrated into the main codebase. On the other
hand, changes won't show up in user's local repositories immediately, which can
be counterintuitive.


# Security

Ain't CMS uses native Git commands to move content contributions from the local
machine to remote Git repositories. Currently, Ain't CMS uses HTTP basic
authentication for:

- `git clone` for the initial clone
- `git pull` to 
- `git push` for the 

I didn't want to deal with calling out to interactive shells for password
input, so all credentials are passed *in the URL*. This isn't necessarily
insecure if the app is sandboxed, but it does mean there's a chance that
passwords will be stored in plaintext somewhere on the user's local machine.

An effort was made to avoid storing passwords on disk (e.g., the `origin`
remote is deleted immediately after the initial `git clone`).


# To Do

- Security considerations and SSH support
- Creating, renaming, and deleting pages
- Editing only *content* pages (e.g., not `package.json`)
- Configurable build commands/web frameworks (these are currently hardcoded)
- WYSIWYG editor (if supporting multiple web frameworks, this is tricky)
- In-app previews (handling links may be difficult)
- Credential error handling
- Unit tests
- NodeGit for native Git integration (requires building from source)
- Synchronous calls in `editor.js`
- Syntax highlighting
- HTML linting on user-save
- Code snippets
	- Snippet for templates
	- Or load from dev config file


