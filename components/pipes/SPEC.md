# Pipeline Text Format

## Overview

The pipeline text is a newline-separated DSL that defines a sequence of transformations applied to input data. It lives in the middle column of the string transformers page — always a textarea, no visual toggle.

Pipes are always string-in, string-out. Each pipe parses its input, processes it, and serializes the output internally.

## Lines

Each line is one of:

| Type | Pattern | Example |
|------|---------|---------|
| Empty | whitespace only | |
| Comment | `# ...` | `# this is a comment` |
| Pipe | `\|> pipeName` or `\|> pipeName({ ... })` | `\|> yamlToJson({ indent: 2 })` |

Lines are processed in order. Empty lines and comments are skipped.

## Pipe Lines

Each pipe line begins with `|>` followed by the pipe name and optional options:

```
|> pipeName
|> pipeName({ ... })
```

### Pipe Name

A valid identifier: starts with a letter (`a-zA-Z`), followed by zero or more alphanumeric characters (`a-zA-Z0-9`).

### Options (JSON5 object)

Optional. If present, the text between `(` and `)` is parsed as a JSON5 object (object braces may omit outer `{}` for single-key convenience). Options become `Record<string, unknown>` passed to the pipe handler's `handle()` method.

### Inline comments

Trailing `#` comments are supported on any pipe line:

```
|> jsonGet({ path: 'foo.bar' })  # extract nested value
```

## Full Example

```
# Convert YAML input to formatted JSON
|> yamlToJson({ indent: 2 })
|> formatJson({ indent: 2 })
```

## Parsing Result

```ts
interface ParseResult {
  pipes: ParsedPipe[];
  errors: ParseError[];
}
```

## Errors

| Error | Example input |
|-------|---------------|
| Unexpected statement (doesn't match any rule) | `hello world` |
| Unknown pipe name | `\|> nonexistent` (when pipeHandlers provided) |
| Non-parseable options JSON5 | `\|> pipe({ bad })` |
