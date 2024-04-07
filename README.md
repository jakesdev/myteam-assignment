# Instructions

Source data: [https://github.com/huyenph/myteam-test](https://github.com/huyenph/myteam-test)

The file `data/input-data.json` contains a list of records representing stock transformations of pieces of timber in the distribution centre.

The data set only represents a single transformation type; timber docking.

Timber docking is the process of taking one or more source pieces of timber of a certain length, and cutting them down into smaller child pieces.

For example, a piece of timber 12 metres long could be cut in half to make two pieces that are 6 metres each. Another example could be cutting two 9 metre lengths into thirds to make six pieces at 3 metres.

The first example would be represented in the data set as per below

```json
{
  "transaction": "[transaction number]",
  "transformations": [
    {
      "partNum": "SL1524042H2S",
      "qty": -1,
      "size": 12
    },
    {
      "partNum": "SL1524042H2S",
      "qty": 2,
      "size": 6
    }
  ]
}
```

which yields a balance of 0, since (-1 _ 12 = -12) + (2 _ 6 = 12) = 0

and the second example would be presented in the data set as per below

```json
{
  "transaction": "[transaction number]",
  "transformations": [
    {
      "partNum": "SL1524042H2S",
      "qty": -2,
      "size": 9
    },
    {
      "partNum": "SL1524042H2S",
      "qty": 6,
      "size": 3
    }
  ]
}
```

which also yields a balance of 0

Observe that the source parts are represented by a negative quantity (as they are being consumed) and the child parts are represented as a positive quantity (as they are being produced).

Valid timber docking transactions will never have:

- A source `partNum` that does not match the child `partNum`s
- Child parts shorter than 3 metres or longer than 12 metres
- Child parts that are not in increments of 0.3 metres within this range (i.e. 3, 3.3, 3.6, ... 11.7, 12)

## Your part

Forking this repository to your own GitHub account, write a TypeScript/Javascript program that performs the following

1. Reads the data from `data/input-data.json`

2. Calculates the balance for each transaction in the data

3. Determines whether or not the transaction is valid based upon the constraints outlined previously (or any other physical scenarios you can think of)

4. Writes a modified data set to `data/output-data.json` which contains a `balance`, `isValid`, and `reason` field (along side the original data).

For example, the modified entry from the first example set might look like

```json
{
  "transaction": "[transaction number]",
  "transformations": [
    {
      "partNum": "SL1524042H2S",
      "qty": -1,
      "size": 12
    },
    {
      "partNum": "SL1524042H2S",
      "qty": 2,
      "size": 6
    }
  ],
  "balance": 0,
  "isValid": true,
  "errorReason": null
}
```

Create a small web application

- Users can paste the text contents of `input-data.json` into a text box and press a "process" button
- Pressing the process button sends the contents provided by the user to an API server
- The API server utilises your previous program to compute the balance, validity and error reasons for each transaction
- The API server returns the result (equivelent of `output-data.json`) which is presented to the user in the web browser.

You should use React for the front-end and Node/Express for the server. You can use third party libraries if you wish.

## Conventional Commits

The commit message should be structured as follows:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

The commit contains the following structural elements, to communicate intent to the consumers of your library:

- fix: a commit of the type fix patches a bug in your codebase (this correlates with PATCH in Semantic Versioning).
- feat: a commit of the type feat introduces a new feature to the codebase (this correlates with MINOR in Semantic Versioning).
- BREAKING CHANGE: a commit that has a footer BREAKING CHANGE:, or appends a ! after the type/scope, introduces a breaking API change (correlating with MAJOR in Semantic Versioning). A BREAKING CHANGE can be part of commits of any type.
- types other than fix: and feat: are allowed, for example @commitlint/config-conventional (based on the Angular convention) recommends build:, chore:, ci:, docs:, style:, refactor:, perf:, test:, and others.
- footers other than BREAKING CHANGE: <description> may be provided and follow a convention similar to git trailer format.
  Additional types are not mandated by the Conventional Commits specification, and have no implicit effect in Semantic Versioning (unless they include a BREAKING CHANGE). A scope may be provided to a commit’s type, to provide additional contextual information and is contained within parenthesis, e.g., feat(parser): add ability to parse arrays.

### Examples

#### Commit message with no body

```
docs: correct spelling of CHANGELOG
```

#### Commit message with scope

```
feat(lang): add Polish language
```

#### Commit message with description and breaking change footer

```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```

#### Commit message with ! to draw attention to breaking change

```
feat!: send an email to the customer when a product is shipped
```

#### Commit message with scope and ! to draw attention to breaking change

```
feat(api)!: send an email to the customer when a product is shipped
```

#### Commit message with both ! and BREAKING CHANGE footer

```
chore!: drop support for Node 6

BREAKING CHANGE: use JavaScript features not available in Node 6.
```

## Submitting your solution

After testing your code, commit your changes as well as your `data/output-data.json` file and push it back into your repository. Be sure to email through a link to your GitHub repository so it can be checked.
