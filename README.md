# setup-whatchanged

[![GitHub Actions status](https://github.com/axetroy/setup-whatchanged/workflows/ci/badge.svg?branch=master)](https://github.com/axetroy/setup-whatchanged/actions)

setup [whatchanged](https://github.com/axetroy/whatchanged) command line in
Github Action

# Usage

See [action.yml](action.yml)

Basic:

```yaml
steps:
  - uses: actions/checkout@v2
    with:
      fetch-depth: 0 # this is important
  - uses: axetroy/setup-whatchanged@v1
    with:
      version: v0.3.6
  - run: |
      whatchanged
```

# License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
