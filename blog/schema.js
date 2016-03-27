const
  Remarkable = require('remarkable'),
  remarkable = new Remarkable(),
  toSlug = require('to-slug-case'),
  Schema = require('graph.ql'),

  postList = {}

module.exports = Schema(`

scalar Date
scalar Markdown

type Post {
  title: String!
  date: Date!
  body: Markdown!
  slug: String!
}

input PostInput {
  title: String!
  date: Date!
  body: Markdown!
}

type Mutation {
  create_post(post: PostInput): Post
}

type Query {
  posts(): [Post]
  post(slug: String): Post
}

`, {
  Date: {
    serialize: v => new Date(v),
    parse: v => (new Date(v)).toISOString()
  },

  Markdown: {
    serialize: v => v,
    parse: v => remarkable.render(v)
  },

  Mutation: {
    create_post: (mutation, args) => {
      const slug = toSlug(args.post.title)

      postList[slug] = Object.assign(args.post, { 'slug': slug })

      return postList[slug]
    }
  },

  Query: {
    posts: (query, args) => Object.keys(postList).map(slug => postList[slug]),
    post: (query, args) => postList[args.slug]
  }
})
