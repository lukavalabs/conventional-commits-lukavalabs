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

    gitDummyCommit(['Merged PR 101: build: first build setup', 'BREAKING CHANGE: New build system.'])
    gitDummyCommit(['Merged PR 102: ci(travis): add TravisCI pipeline', 'BREAKING CHANGE: Continuously integrated.'])
    gitDummyCommit(['Merged PR 103: feat: amazing new module', 'BREAKING CHANGE: Not backward compatible.'])
    gitDummyCommit(['Merged PR 104: fix(compile): avoid a bug', 'BREAKING CHANGE: The Change is huge.'])
    gitDummyCommit(['Merged PR 105: perf(ngOptions): make it faster', 'closes #824, #825'])
    gitDummyCommit('Merged PR 106: revert(ngOptions): bad commit')
    gitDummyCommit('Merged PR 107: fix(*): oops')
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

        expect(chunk).to.include('first build setup')
        expect(chunk).to.include('**travis:** add TravisCI pipeline')
        expect(chunk).to.include('**travis:** Continuously integrated.')
        expect(chunk).to.include('amazing new module')
        expect(chunk).to.include('**compile:** avoid a bug')
        expect(chunk).to.include('make it faster')
        expect(chunk).to.include(', closes [#824](https://github.com/conventional-commits-lukavalabs/_workitems/edit/824) [#825](https://github.com/conventional-commits-lukavalabs/_workitems/edit/825)')
        expect(chunk).to.include('New build system.')
        expect(chunk).to.include('Not backward compatible.')
        expect(chunk).to.include('**compile:** The Change is huge.')
        expect(chunk).to.include('([#101](https://github.com/lukavalabs/conventional-commits-lukavalabs/pullrequest/101))')
        expect(chunk).to.include('Build System')
        expect(chunk).to.include('Continuous Integration')
        expect(chunk).to.include('Features')
        expect(chunk).to.include('Bug Fixes')
        expect(chunk).to.include('Performance Improvements')
        expect(chunk).to.include('Reverts')
        expect(chunk).to.include('bad commit')
        expect(chunk).to.include('BREAKING CHANGE')

        expect(chunk).to.not.include('ci')
        expect(chunk).to.not.include('feat')
        expect(chunk).to.not.include('fix')
        expect(chunk).to.not.include('perf')
        expect(chunk).to.not.include('revert')
        expect(chunk).to.not.include('***:**')
        expect(chunk).to.not.include(': Not backward compatible.')

        done()
      }))
  })
})
