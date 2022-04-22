module.exports = {
  typesOrder: ['feat', 'improve', 'fix', 'refactor', 'test', 'docs', 'style', 'revert', 'chore', 'ci'].reverse(),
  types: {
    chore: {
      title: 'Other',
      description: 'Other changes that don\'t modify src or test files',
      changelog: true,
      release: false,
      emoji: '☂️'
    },
    ci: {
      title: 'Other',
      description: 'Everything else',
      changelog: true,
      release: false,
      emoji: '☂️'
    },
    docs: {
      title: 'Documentation',
      description: 'Documentation only changes',
      changelog: true,
      release: 'patch',
      emoji: '📚'
    },
    feat: {
      title: 'Features',
      description: 'A new feature',
      changelog: true,
      release: 'minor',
      emoji: '🎉'
    },
    fix: {
      title: 'Fixes',
      description: 'A fix',
      changelog: true,
      release: 'patch',
      emoji: '🛠'
    },
    improve: {
      title: 'Feature Improvements',
      description: 'An improvement to an existing feature',
      changelog: true,
      release: 'minor',
      emoji: '✨'
    },
    refactor: {
      title: 'Code Refactoring',
      description: 'A code change that neither fixes a bug nor adds a feature',
      changelog: true,
      release: false,
      emoji: '📦'
    },
    revert: {
      title: 'Reverts',
      description: 'Reverts a previous commit',
      changelog: true,
      release: false,
      emoji: '🗑',
    },
    style: {
      title: 'Styles',
      description: 'Changes that do not affect the meaning of the code(white- space, formatting, missing semi- colons, etc)',
      changelog: true,
      release: false,
      emoji: '💎'
    },
    test: {
      title: 'Testing',
      description: 'Adding missing tests or correcting existing tests',
      changelog: true,
      release: false,
      emoji: '🚨'
    }
  }
}
