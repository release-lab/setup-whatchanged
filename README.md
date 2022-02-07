# setup-whatchanged

[![GitHub Actions status](https://github.com/release-lab/setup-whatchanged/workflows/ci/badge.svg?branch=master)](https://github.com/release-lab/setup-whatchanged/actions)

setup [whatchanged](https://github.com/release-lab/whatchanged) command line in
Github Action

# Usage

See [action.yml](action.yml)

Basic:

```yaml
steps:
  - uses: actions/checkout@v2
    with:
      # **this is important**
      fetch-depth: 0
  - uses: release-lab/setup-whatchanged@v1
    with:
      version: v0.5.6
  - run: |
      whatchanged
```

# License

The scripts and documentation in this project are released under the
[MIT License](LICENSE)
