const betterThanBefore = require('better-than-before')()
const expect = require('chai').expect
const conventionalChangelogCore = require('conventional-changelog-core')
const gitDummyCommit = require('git-dummy-commit')
const mocha = require('mocha')
// const path = require('path')
const shell = require('shelljs')
const through = require('through2')
const preset = require('../')

const describe = mocha.describe
const preparing = betterThanBefore.preparing
const it = mocha.it

betterThanBefore.setups([
  () => {
    shell.config.reset()
    shell.cd(__dirname)
    shell.rm('-rf', 'tmp')
    shell.mkdir('tmp')
    shell.cd('tmp')
    shell.mkdir('git-templates')
    shell.exec('git init --template=./git-templates', { silent: true })

    gitDummyCommit('Merged PR 101: improve: first enhancement')
    gitDummyCommit(['Merged PR 102: ci(travis): add TravisCI pipeline', 'BREAKING CHANGE: Continuously integrated.'])
    gitDummyCommit(['Merged PR 103: feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    gitDummyCommit(['Merged PR 104: fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    gitDummyCommit(['Merged PR 105: docs: please read this', 'closes #824, #825'])
    gitDummyCommit('Merged PR 106: revert(ngOptions): bad commit')
    gitDummyCommit('Merged PR 107: fix(*): oops')
    gitDummyCommit('Merged PR 108: style: remove whitespace')
    gitDummyCommit('Merged PR 109: test: no bugs?')
    gitDummyCommit('Merged PR 110: refactor(module): change it')
  }
])

describe('lukavalabs preset', () => {
  it('should work if there is no semver tag', (done) => {
    preparing(1)
    conventionalChangelogCore({
      config: preset
    })
      .on('error', (err) => done(err))
      .pipe(through((chunk) => {
        chunk = chunk.toString()

        expect(chunk).to.include('**travis:** add TravisCI pipeline')
        expect(chunk).to.include('**travis:** Continuously integrated.')
        expect(chunk).to.include('amazing new module')
        expect(chunk).to.include('**compile:** avoid a bug')
        expect(chunk).to.include(', closes [#824](https://github.com/conventional-commits-lukavalabs/_workitems/edit/824) [#825](https://github.com/conventional-commits-lukavalabs/_workitems/edit/825)')
        expect(chunk).to.include('Not backward compatible.')
        expect(chunk).to.include('**compile:** The Change is huge.')
        expect(chunk).to.include('([#101](https://github.com/lukavalabs/conventional-commits-lukavalabs/pullrequest/101))')
        expect(chunk).to.include('📦 Code Refactoring')
        expect(chunk).to.include('📚 Documentation')
        expect(chunk).to.include('✨ Feature Improvements')
        expect(chunk).to.include('🎉 Features')
        expect(chunk).to.include('🛠 Fixes')
        expect(chunk).to.include('☂️ Other')
        expect(chunk).to.include('💎 Styles')
        expect(chunk).to.include('🚨 Testing')
        expect(chunk).to.include('bad commit')
        expect(chunk).to.include('⚠ Breaking changes')

        expect(chunk).to.not.include('ci')
        expect(chunk).to.not.include('feat')
        expect(chunk).to.not.include('fix')
        expect(chunk).to.not.include('improve')
        expect(chunk).to.not.include('docs')
        expect(chunk).to.not.include('test')
        expect(chunk).to.not.include('style')
        expect(chunk).to.not.include('revert')
        expect(chunk).to.not.include('***:**')
        expect(chunk).to.not.include(': Not backward compatible.')

        done()
      }))
  })
})
