'use strict'

const compareFunc = require('compare-func')
const Q = require('q')
const readFile = Q.denodeify(require('fs').readFile)
const resolve = require('path').resolve
const customTransform = require('./custom-transform')
const types = require('./types');

/**
 * Handlebar partials for various property substitutions based on commit context.
 */
const owner = '{{#if this.owner}}{{~this.owner}}{{else}}{{~@root.owner}}{{/if}}'
const host = '{{~@root.host}}'
const repository = '{{#if this.repository}}{{~this.repository}}{{else}}{{~@root.repository}}{{/if}}'

module.exports = function (config) {
  config = defaultConfig(config)
  const commitUrlFormat = expandTemplate(config.commitUrlFormat, {
    host,
    owner,
    repository
  })
  const compareUrlFormat = expandTemplate(config.compareUrlFormat, {
    host,
    owner,
    repository
  })
  const issueUrlFormat = expandTemplate(config.issueUrlFormat, {
    host,
    owner,
    repository,
    id: '{{this.issue}}',
    prefix: '{{this.prefix}}'
  })

  return Q.all([
    readFile(resolve(__dirname, './templates/template.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/header.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/commit.hbs'), 'utf-8'),
    readFile(resolve(__dirname, './templates/footer.hbs'), 'utf-8')
  ])
    .spread((template, header, commit, footer) => {
      const writerOpts = getWriterOpts(config)

      writerOpts.mainTemplate = template
      writerOpts.headerPartial = header
        .replace(/{{compareUrlFormat}}/g, compareUrlFormat)
      writerOpts.commitPartial = commit
        .replace(/{{commitUrlFormat}}/g, commitUrlFormat)
        .replace(/{{issueUrlFormat}}/g, issueUrlFormat)
      writerOpts.footerPartial = footer

      return writerOpts
    })
}

function getWriterOpts(config) {
  config = defaultConfig(config)

  return {
    transform: customTransform,
    groupBy: 'type',
    commitGroupsSort: (a, b) => {
      const commitGroupOrder = types.typesOrder.map((type) => `${types.types[type].emoji ? `${types.types[type].emoji} ` : ''}${types.types[type].title}`)
      const gRankA = commitGroupOrder.indexOf(a.title)
      const gRankB = commitGroupOrder.indexOf(b.title)
      if (gRankA >= gRankB) {
        return -1
      } else {
        return 1
      }
    },
    commitsSort: ['scope', 'subject'],
    noteGroupsSort: 'title',
    notesSort: compareFunc
  }
}

// merge user set configuration with default configuration.
function defaultConfig(config) {
  config = config || {}

  config.issueUrlFormat = config.issueUrlFormat ||
    '{{host}}/{{repository}}/_workitems/edit/{{id}}'
  config.commitUrlFormat = config.commitUrlFormat ||
    '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}'
  config.compareUrlFormat = config.compareUrlFormat ||
    '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}'
  config.userUrlFormat = config.userUrlFormat ||
    '{{host}}/{{user}}'
  config.issuePrefixes = config.issuePrefixes || ['#']

  return config
}

// expand on the simple mustache-style templates supported in
// configuration (we may eventually want to use handlebars for this).
function expandTemplate(template, context) {
  let expanded = template
  Object.keys(context).forEach(key => {
    expanded = expanded.replace(new RegExp(`{{${key}}}`, 'g'), context[key])
  })
  return expanded
}
